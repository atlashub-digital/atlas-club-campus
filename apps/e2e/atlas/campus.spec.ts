import { writeFileSync } from 'node:fs'
import { test, expect } from '../core/fixtures'
import { login, req, getOrg, createStudent } from '../core/client'
import { uiLogin } from '../core/auth'
import { ADMIN_EMAIL, ADMIN_PASSWORD, API_URL } from '../core/instance'

test.describe.serial('Atlas Campus — real OSS engine, not SSO acceptance', () => {
  let admin: string, learner: string, other: string, learnerId: number
  let org: any, course: any, restricted: any, activity: any, community: any, mediaPath: string, mediaBytes: string
  const password = 'OnlyDisposableTest!234'
  const emailA = 'learner-a@atlas-campus.example.com'
  const emailB = 'learner-b@atlas-campus.example.com'
  async function createCourse(name: string, isPublic: boolean) {
    const body = new FormData()
    for (const [key,value] of Object.entries({ name, description: 'Dados de teste do Campus Atlas', public: String(isPublic), about: 'Ambiente de desenvolvimento', learnings: '[]', tags: '' })) body.set(key,value)
    const response = await fetch(API_URL + '/courses/?org_id=' + org.id, { method:'POST', headers:{Authorization:'Bearer '+admin}, body })
    expect(response.ok, 'create course status ' + response.status).toBeTruthy()
    const created = await response.json()
    return await req('PUT', '/courses/' + created.course_uuid, admin, { published:true, public:isPublic })
  }
  test.beforeAll(async () => {
    admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD)
    org = await getOrg()
    learnerId = await createStudent(admin, org.id, {email:emailA,username:'atlas_learner_a',password})
    await createStudent(admin, org.id, {email:emailB,username:'atlas_learner_b',password})
    learner = await login(emailA,password)
    other = await login(emailB,password)
    course = await createCourse('Comece por aqui — pessoas e IA',true)
    restricted = await createCourse('Laboratório reservado — instrutores',false)
    const group = await req<any>('POST','/usergroups/',admin,{name:'Instrutores',description:'Acesso reservado',org_id:org.id})
    await req('POST','/usergroups/'+group.id+'/add_resources?resource_uuids='+restricted.course_uuid,admin)
    const chapter = await req<any>('POST','/chapters/',admin,{name:'Primeiros passos',description:'',org_id:org.id,course_id:course.id})
    activity = await req<any>('POST','/activities/',admin,{
      name:'Uma ideia, um primeiro passo', chapter_id:chapter.id, published:true,
      activity_type:'TYPE_DYNAMIC',activity_sub_type:'SUBTYPE_DYNAMIC_PAGE',
      content:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Aprender e construir com pessoas no centro.'}]}]},
    })
    community = await req<any>('POST','/communities/?org_id='+org.id,admin,{name:'Ponto de encontro Atlas',public:true})
  })
  test('real learner reads published lesson; private course denied', async () => {
    const lesson = await req<any>('GET','/activities/'+activity.activity_uuid,learner)
    expect(lesson.content).toEqual(activity.content)
    const denied = await fetch(API_URL+'/courses/'+restricted.course_uuid,{headers:{Authorization:'Bearer '+learner}})
    expect([403,404]).toContain(denied.status)
    const anonymous = await fetch(API_URL+'/trail/org/'+org.id+'/trail')
    expect([401,403]).toContain(anonymous.status)
  })
  test('progress persists and repeated completion does not duplicate or cross users',async () => {
    await req('POST','/trail/add_activity/'+activity.activity_uuid,learner)
    await req('POST','/trail/add_activity/'+activity.activity_uuid,learner)
    const trail = await req<any>('GET','/trail/org/'+org.id+'/trail',learner)
    const run = trail.runs.find((item:any)=>item.course_id===course.id)
    expect(run.steps.filter((item:any)=>item.activity_id===activity.id)).toHaveLength(1)
    expect(run.steps[0].complete).toBe(true)
    const otherTrail = await req<any>('GET','/trail/org/'+org.id+'/trail',other)
    expect(otherTrail.runs.flatMap((item:any)=>item.steps).some((item:any)=>item.activity_id===activity.id)).toBe(false)
  })
  test('separate course editions keep the same learner progress independent', async () => {
    const editions = []
    for (const name of ['Genesis — Turma A', 'Atlas Laboratório — Turma B']) {
      const edition = await createCourse(name,false)
      const group = await req<any>('POST','/usergroups/',admin,{name,description:'Turma piloto isolada',org_id:org.id})
      await req('POST','/usergroups/'+group.id+'/add_resources?resource_uuids='+edition.course_uuid,admin)
      await req('POST','/usergroups/'+group.id+'/add_users?user_ids='+learnerId,admin)
      const chapter = await req<any>('POST','/chapters/',admin,{name:'Atelier',description:'',org_id:org.id,course_id:edition.id})
      const lesson = await req<any>('POST','/activities/',admin,{name:'Desafio da turma',chapter_id:chapter.id,published:true,activity_type:'TYPE_DYNAMIC',activity_sub_type:'SUBTYPE_DYNAMIC_PAGE',content:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:name}]}]}})
      editions.push({edition,lesson})
      const denied = await fetch(API_URL+'/activities/'+lesson.activity_uuid,{headers:{Authorization:'Bearer '+other}})
      expect([403,404]).toContain(denied.status)
      await req('POST','/trail/add_course/'+edition.course_uuid,learner)
    }
    await req('POST','/trail/add_activity/'+editions[0].lesson.activity_uuid,learner)
    const trail = await req<any>('GET','/trail/org/'+org.id+'/trail',learner)
    const a = trail.runs.find((run:any)=>run.course_id===editions[0].edition.id)
    const b = trail.runs.find((run:any)=>run.course_id===editions[1].edition.id)
    expect(a.steps.some((step:any)=>step.activity_id===editions[0].lesson.id && step.complete)).toBe(true)
    expect(b.steps.some((step:any)=>step.complete)).toBe(false)
  })
  test('discussion persists and another learner cannot edit the author post',async () => {
    const post = await req<any>('POST','/communities/'+community.community_uuid+'/discussions',learner,{title:'Meu primeiro projeto',content:'Quero transformar uma ideia em um projeto real.'})
    const readback = await req<any>('GET','/discussions/'+post.discussion_uuid,learner)
    expect(readback.title).toBe('Meu primeiro projeto')
    const denied = await fetch(API_URL+'/discussions/'+post.discussion_uuid,{method:'PUT',headers:{Authorization:'Bearer '+other,'Content-Type':'application/json'},body:JSON.stringify({title:'Não autorizado'})})
    expect([403,404]).toContain(denied.status)
  })
  test('admin opens actual editor, changes content, and saves to PostgreSQL',async ({page}) => {
    await page.setViewportSize({width:1440,height:960})
    await uiLogin(page,ADMIN_EMAIL,ADMIN_PASSWORD)
    await page.goto('/course/'+course.course_uuid.replace('course_','')+'/activity/'+activity.activity_uuid.replace('activity_','')+'/edit')
    const editor = page.locator('.tiptap[contenteditable="true"]').first()
    await expect(editor).toBeVisible()
    await editor.fill('Evidência Atlas: conteúdo editado e persistido pela interface.')
    await editor.press('ControlOrMeta+s')
    await expect.poll(async () => JSON.stringify((await req<any>('GET','/activities/'+activity.activity_uuid,admin)).content),{timeout:30000}).toContain('Evidência Atlas')
    await page.screenshot({path:'atlas-results/editor-1440.png',fullPage:true})
  })
  test('Atlas home renders actual catalog at desktop and mobile',async ({page}) => {
    await uiLogin(page,emailA,password)
    for (const width of [1440,390]) {
      await page.setViewportSize({width,height:960})
      await page.goto('/')
      await expect(page.getByRole('heading',{name:'Seu próximo passo começa aqui.'})).toBeVisible()
      await expect(page.getByText(course.name,{exact:true}).first()).toBeVisible()
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)
      await page.screenshot({path:'atlas-results/campus-'+width+'.png',fullPage:true})
    }
  })
  test('two authenticated members synchronize a real board note',async ({page,browser}) => {
    const board = await req<any>('POST','/boards/?org_id='+org.id,admin,{name:'Atelier colaborativo Atlas',public:false})
    await req('POST','/boards/'+board.board_uuid+'/members',admin,{user_id:learnerId,role:'editor'})
    const denied = await fetch(API_URL+'/boards/'+board.board_uuid,{headers:{Authorization:'Bearer '+other}})
    expect([403,404]).toContain(denied.status)
    await page.setViewportSize({width:1440,height:960})
    await uiLogin(page,ADMIN_EMAIL,ADMIN_PASSWORD)
    const peerContext = await browser.newContext({baseURL:API_URL.replace('/api/v1',''),viewport:{width:1440,height:960}})
    const peer = await peerContext.newPage()
    try {
      await uiLogin(peer,emailA,password)
      const route = '/board/'+board.board_uuid
      await Promise.all([page.goto(route),peer.goto(route)])
      await expect(page.locator('.board-enter-toolbar')).toBeVisible({timeout:30000})
      await expect(peer.locator('.board-enter-toolbar')).toBeVisible({timeout:30000})
      // Native toolbar order: select, pan, draw, card, frame, note.
      await page.locator('.board-enter-toolbar .editor-tool-btn').nth(5).click()
      await page.mouse.click(500,350)
      await expect(page.getByText('New note',{exact:true})).toBeVisible()
      await expect(peer.getByText('New note',{exact:true})).toBeVisible({timeout:15000})
      await page.getByText('New note',{exact:true}).click()
      await page.keyboard.press('End')
      await page.keyboard.type(' - Atlas colaboração real')
      await expect(peer.getByText('New note - Atlas colaboração real',{exact:true})).toBeVisible({timeout:15000})
      await peer.screenshot({path:'atlas-results/collaboration-1440.png',fullPage:true})
    } finally { await peerContext.close() }
  })
  test('native media upload is readable with identical bytes',async () => {
    mediaBytes='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1cAAAAASUVORK5CYII='
    const body=new FormData()
    body.set('activity_uuid',activity.activity_uuid)
    body.set('file_object',new Blob([Buffer.from(mediaBytes,'base64')],{type:'image/png'}),'atlas-persistence.png')
    const response=await fetch(API_URL+'/blocks/image',{method:'POST',headers:{Authorization:'Bearer '+admin},body})
    expect(response.ok,'media upload '+response.status).toBeTruthy()
    const block=await response.json()
    mediaPath='/content/orgs/'+org.org_uuid+'/courses/'+course.course_uuid+'/activities/'+activity.activity_uuid+'/dynamic/blocks/imageBlock/'+block.block_uuid+'/'+block.content.file_id+'.'+block.content.file_format
    const stored=await fetch(API_URL.replace('/api/v1','')+mediaPath)
    expect(stored.ok).toBeTruthy()
    expect(Buffer.from(await stored.arrayBuffer()).toString('base64')).toBe(mediaBytes)
  })
  test('Atlas member interfaces at 390 and 1440 pixels',async ({page}) => {
    await uiLogin(page,emailA,password)
    const screens = [
      ['catalog','/courses','Academia Atlas'],
      ['course','/course/'+course.course_uuid.replace('course_',''),'Sua formação'],
      ['classroom','/course/'+course.course_uuid.replace('course_','')+'/activity/'+activity.activity_uuid.replace('activity_',''),'Sala de aprendizagem'],
      ['communities','/communities','Comunidade Atlas'],
      ['profile','/user/atlas_learner_a','Perfil na comunidade'],
    ]
    for(const width of [390,1440]) {
      await page.setViewportSize({width,height:960})
      for(const [name,route,title] of screens) {
        await page.goto(route)
        await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible()
        if(name==='catalog') await expect(page.getByText(course.name,{exact:true}).first()).toBeVisible()
        if(name==='classroom') await expect(page.getByText('Evidência Atlas: conteúdo editado e persistido pela interface.',{exact:true}).first()).toBeVisible()
        if(name==='communities') await expect(page.getByText(community.name,{exact:true}).first()).toBeVisible()
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)
        await page.screenshot({path:'atlas-results/'+name+'-'+width+'.png',fullPage:true})
      }
    }
    writeFileSync('atlas-results/persistence.json',JSON.stringify({courseUuid:course.course_uuid,activityUuid:activity.activity_uuid,activityId:activity.id,orgId:org.id,email:emailA,mediaPath,mediaBytes}))
  })
  test('Atlas administration dashboard at 390 and 1440 pixels',async ({page}) => {
    await uiLogin(page,ADMIN_EMAIL,ADMIN_PASSWORD)
    for(const width of [390,1440]) {
      await page.setViewportSize({width,height:960})
      await page.goto('/dash')
      await expect(page.getByRole('heading',{name:'Gestão do Campus'})).toBeVisible()
      await expect(page.getByRole('link',{name:'Criar formação',exact:true})).toBeVisible()
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true)
      await page.screenshot({path:'atlas-results/dashboard-'+width+'.png',fullPage:true})
    }
  })
})

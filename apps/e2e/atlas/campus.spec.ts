import { test, expect } from '../core/fixtures'
import { login, req, getOrg, createStudent } from '../core/client'
import { uiLogin } from '../core/auth'
import { ADMIN_EMAIL, ADMIN_PASSWORD, API_URL } from '../core/instance'

test.describe.serial('Atlas Campus — real OSS engine, not SSO acceptance', () => {
  let admin: string, learner: string, other: string
  let org: any, course: any, restricted: any, activity: any, community: any
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
    await createStudent(admin, org.id, {email:emailA,username:'atlas_learner_a',password})
    await createStudent(admin, org.id, {email:emailB,username:'atlas_learner_b',password})
    learner = await login(emailA,password)
    other = await login(emailB,password)
    course = await createCourse('Comece por aqui — pessoas e IA',true)
    restricted = await createCourse('Laboratório reservado — instrutores',false)
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
  test('discussion persists and another learner cannot edit the author post',async () => {
    const post = await req<any>('POST','/communities/'+community.community_uuid+'/discussions',learner,{title:'Meu primeiro projeto',content:'Quero transformar uma ideia em um projeto real.'})
    const readback = await req<any>('GET','/discussions/'+post.discussion_uuid,learner)
    expect(readback.title).toBe('Meu primeiro projeto')
    const denied = await fetch(API_URL+'/discussions/'+post.discussion_uuid,{method:'PUT',headers:{Authorization:'Bearer '+other,'Content-Type':'application/json'},body:JSON.stringify({title:'Não autorizado'})})
    expect([403,404]).toContain(denied.status)
  })
  test('admin opens actual editor, changes content, and saves to PostgreSQL',async ({page}) => {
    await uiLogin(page,ADMIN_EMAIL,ADMIN_PASSWORD)
    await page.goto('/course/'+course.course_uuid.replace('course_','')+'/activity/'+activity.activity_uuid.replace('activity_','')+'/edit')
    const editor = page.locator('.tiptap[contenteditable="true"]').first()
    await expect(editor).toBeVisible()
    await editor.fill('Evidência Atlas: conteúdo editado e persistido pela interface.')
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
})

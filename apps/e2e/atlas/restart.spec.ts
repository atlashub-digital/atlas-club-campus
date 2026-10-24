import { readFileSync } from 'node:fs'
import {test,expect} from '../core/fixtures'
import {login,req} from '../core/client'
import {uiLogin} from '../core/auth'
import {API_URL} from '../core/instance'
test('course, edited content and learner progress survive full stack restart',async ({page})=>{
 const state=JSON.parse(readFileSync('atlas-results/persistence.json','utf8'))
 const media=await fetch(API_URL.replace('/api/v1','')+state.mediaPath)
 expect(media.ok).toBeTruthy()
 expect(Buffer.from(await media.arrayBuffer()).toString('base64')).toBe(state.mediaBytes)
 const token=await login(state.email,'OnlyDisposableTest!234')
 const activity=await req<any>('GET','/activities/'+state.activityUuid,token)
 expect(JSON.stringify(activity.content)).toContain('Evidência Atlas')
 const trail=await req<any>('GET','/trail/org/'+state.orgId+'/trail',token)
 expect(trail.runs.flatMap((run:any)=>run.steps).filter((step:any)=>step.activity_id===state.activityId&&step.complete)).toHaveLength(1)
 await uiLogin(page,state.email,'OnlyDisposableTest!234')
 await page.goto('/course/'+state.courseUuid.replace('course_','')+'/activity/'+state.activityUuid.replace('activity_',''))
 await expect(page.getByText('Evidência Atlas: conteúdo editado e persistido pela interface.',{exact:true}).first()).toBeVisible()
 await page.screenshot({path:'atlas-restart-results/persisted-classroom.png',fullPage:true})
})

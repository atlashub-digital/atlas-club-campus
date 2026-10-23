'use client'
import Link from 'next/link'
import { ArrowUpRight, BookOpen, Compass } from 'lucide-react'
import { getUriWithOrg } from '@services/config/config'
import AuthenticatedClientElement from '@components/Security/AuthenticatedClientElement'
import styles from './AtlasCampusHome.module.css'

type Course = { course_uuid: string; name: string; description?: string }
export default function AtlasCampusHome({ courses, orgslug, org_id }: { courses: Course[]; orgslug: string; org_id: string | number }) {
  return <section className={styles.campus} lang="pt-BR">
    <div className={styles.inner}>
      <div className={styles.brand}><span aria-hidden="true">△</span> ATLAS <strong>CLUBOS</strong><span className={styles.tag}>CAMPUS</span></div>
      <div className={styles.hero}>
        <div><p className={styles.eyebrow}>PESSOAS · IDEIAS · CONHECIMENTO</p><h1>Seu próximo passo começa aqui.</h1><p className={styles.intro}>Aprenda, experimente e transforme conhecimento em resultados reais. Um espaço para construir o futuro, juntos.</p><a href="#atlas-courses" className={styles.primary}>Explorar formações <ArrowUpRight size={20}/></a></div>
        <div className={styles.art} aria-hidden="true"><div className={styles.orbit}/><div className={styles.triangle}>△</div><span>CONHECIMENTO<br/>EM MOVIMENTO</span></div>
      </div>
      <div className={styles.sectionTitle}><div><p className={styles.eyebrow}>SUA JORNADA NO ATLAS</p><h2 id="atlas-courses">Formações disponíveis</h2></div><AuthenticatedClientElement ressourceType="courses" action="create" checkMethod="roles" orgId={org_id}><Link className={styles.secondary} href={getUriWithOrg(orgslug, '/courses?new=true')}>Criar formação <ArrowUpRight size={16}/></Link></AuthenticatedClientElement></div>
      <div className={styles.grid}>{courses.slice(0,12).map((course, index)=><Link className={styles.card} key={course.course_uuid} href={getUriWithOrg(orgslug, '/course/'+course.course_uuid.replace('course_', ''))}><div className={styles.cover}><BookOpen size={36} strokeWidth={1}/><span>ATLAS / {String(index+1).padStart(2,'0')}</span></div><div className={styles.cardBody}><h3>{course.name}</h3>{course.description && <p>{course.description}</p>}<span className={styles.cardAction}>Explorar formação <ArrowUpRight size={18}/></span></div></Link>)}</div>
      {courses.length===0 && <div className={styles.empty}><Compass size={28}/><h3>Nenhuma formação disponível neste momento</h3><p>As formações aparecem aqui conforme a publicação e as permissões da sua conta.</p></div>}
      {courses.length>12 && <Link className={styles.secondary} href={getUriWithOrg(orgslug,'/courses')}>Ver todas as formações <ArrowUpRight size={18}/></Link>}
      <footer className={styles.footer}><span>AtlasHub · Pessoas no centro. Tecnologia a serviço.</span><a href="https://github.com/atlashub-digital/atlas-club-campus">Código-fonte · LearnHouse / AGPL</a></footer>
    </div>
  </section>
}

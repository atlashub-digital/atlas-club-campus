'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { useTrail } from '@/hooks/queries/useTrail'
import CourseThumbnail from '@components/Objects/Thumbnails/CourseThumbnail'
import { getUriWithOrg } from '@services/config/config'
import styles from './Surfaces.module.css'

export default function CampusHome({ org, orgslug, courses }: { org: any; orgslug: string; courses: any[] }) {
  const session = useLHSession() as any
  const authenticated = session?.status === 'authenticated'
  const features = org.config?.config?.resolved_features
  const coursesEnabled = features?.courses?.enabled === true
  const { data: trail } = useTrail(authenticated && coursesEnabled ? org.id : undefined)
  const [greeting, setGreeting] = useState('Olá')
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hour = new Date().getHours()
      setGreeting(hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite')
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])
  const ongoing = (trail?.runs || []).filter((run: any) => run.course && run.course_total_steps > 0 && run.steps.length < run.course_total_steps)
  const first = ongoing[0]
  const name = session?.data?.user?.first_name || session?.data?.user?.username
  const uri = (path: string) => getUriWithOrg(orgslug, path)
  const courseUri = (course: any) => uri(`/course/${course.course_uuid.replace('course_', '')}`)

  return <main className={styles.campus}>
    <section className={styles.hero} aria-labelledby="campus-title">
      <p className={styles.eyebrow}>Atlas ClubOS / Campus</p>
      <h1 id="campus-title">{authenticated ? `${greeting}${name ? `, ${name}` : ''}.` : 'Conhecimento que abre caminhos.'}</h1>
      <p>{first ? `Retome ${first.course.name} e continue no seu ritmo.` : 'Um espaço para aprender, consultar materiais e trocar experiências.'}</p>
      <div className={styles.actions}>
        {first ? <Link className={styles.primary} href={courseUri(first.course)}>Continuar aprendizagem</Link> : coursesEnabled ? <Link className={styles.primary} href={uri('/courses')}>Explorar cursos</Link> : null}
        {authenticated && coursesEnabled && <Link href={uri('/trail')}>Minha aprendizagem →</Link>}
      </div>
    </section>
    {ongoing.length > 0 && <section aria-labelledby="continue-title" className={styles.section}>
      <h2 id="continue-title">Continuar a aprender</h2>
      <div className={styles.grid}>{ongoing.slice(0, 3).map((run: any) => {
        const progress = Math.min(100, Math.round(run.steps.length / run.course_total_steps * 100))
        return <Link key={run.course.course_uuid} href={courseUri(run.course)} className={styles.resume}>
          <h3>{run.course.name}</h3><p>{run.steps.length} de {run.course_total_steps} atividades concluídas</p>
          <progress aria-label={`Progresso em ${run.course.name}`} max={100} value={progress} /><span>{progress}% concluído · Continuar →</span>
        </Link>
      })}</div>
    </section>}
    {coursesEnabled && <section aria-labelledby="courses-title" className={styles.section}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Aprendizagem</p><h2 id="courses-title">Cursos e percursos</h2></div><Link href={uri('/courses')}>Ver catálogo →</Link></div>
      {courses.length ? <div className={styles.grid}>{courses.slice(0, 6).map(course => <CourseThumbnail key={course.course_uuid} course={course} orgslug={orgslug} />)}</div> : <div className={styles.empty}><h3>Nenhum curso disponível por aqui</h3><p>{authenticated ? 'Quando novos cursos estiverem disponíveis para você, eles aparecerão aqui.' : 'Entre na sua conta para consultar os cursos disponíveis para você.'}</p><Link href={uri(authenticated ? '/courses' : '/login')} className={styles.primary}>{authenticated ? 'Consultar catálogo' : 'Entrar na conta'}</Link></div>}
    </section>}
    <div className={styles.grid}>{[
      ['folders', '/library', 'Biblioteca', 'Materiais de referência para consultar no seu ritmo.', 'Consultar materiais'],
      ['communities', '/communities', 'Comunidades', 'Encontre os espaços de conversa disponíveis no Campus.', 'Explorar comunidades'],
      ['playgrounds', '/playgrounds', 'Playgrounds', 'Consulte os espaços de prática disponíveis para você.', 'Explorar playgrounds'],
    ].filter(([feature]) => features?.[feature]?.enabled === true).map(([, path, title, description, action]) => <section key={path} className={styles.directory}><p className={styles.eyebrow}>Explore o Campus</p><h2>{title}</h2><p>{description}</p><Link href={uri(path)}>{action} →</Link></section>)}</div>
  </main>
}

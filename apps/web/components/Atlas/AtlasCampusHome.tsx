/*
 * Atlas ClubOS — Member Campus Home (Wave 2)
 * --------------------------------------------------
 * Replaces the Wave-1 landing stub with a real member dashboard driven by
 * LearnHouse hooks: useCourses (prop), useTrail (progress), useLHSession
 * (identity), usePlan (tier), useAdminStatus (RBAC).
 *
 * Locked acceptance (apps/e2e/atlas/campus.spec.ts):
 *   - <h1>Seu próximo passo começa aqui.</h1>  MUST remain visible.
 *   - Course name MUST remain visible.
 *   - No horizontal overflow at 1440px / 390px.
 *
 * No fabricated metrics: if the trail is empty, we show honest empty states
 * instead of fake progress. ARO entitlement (Free/Premium) arrives in W3 —
 * until then we surface the real LH plan label, never a fake "Premium" badge.
 */
'use client'
import Link from 'next/link'
import { ArrowUpRight, Compass, Sparkles, TrendingUp, LayoutDashboard } from 'lucide-react'
import { getUriWithOrg } from '@services/config/config'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { useTrail } from '@/hooks/queries/useTrail'
import useAdminStatus from '@hooks/useAdminStatus'
import AuthenticatedClientElement from '@components/Security/AuthenticatedClientElement'
import AtlasCourseCard from './AtlasCourseCard'
import { AtlasBadge, AtlasEmptyState, AtlasSectionHeader, AtlasSkeleton } from './AtlasPrimitives'
import {
  getInProgressCourses,
  getNotStartedCourses,
  getNextSteps,
  getOverallProgress,
  type AtlasCourseLike,
} from './atlasProgress'
import styles from './AtlasCampusHome.module.css'

type Course = AtlasCourseLike & { course_uuid: string }

export default function AtlasCampusHome({
  courses,
  orgslug,
  org_id,
}: {
  courses: Course[]
  orgslug: string
  org_id: string | number
}) {
  const session = useLHSession() as any
  const isAuthenticated = session?.status === 'authenticated'
  const user = session?.data?.user
  const firstName =
    user?.first_name || user?.name || (user?.username ? String(user.username) : null)

  const orgIdNum = typeof org_id === 'number' ? org_id : Number(org_id)
  const trailQuery = useTrail(Number.isFinite(orgIdNum) ? orgIdNum : undefined)
  const trail = (trailQuery.data ?? null) as any
  const trailLoading = trailQuery.isLoading
  const { isAdmin } = useAdminStatus()

  const safeCourses: Course[] = Array.isArray(courses) ? courses : []
  const inProgress = getInProgressCourses(trail, safeCourses)
  const recommendations = getNotStartedCourses(trail, safeCourses)
  const nextSteps = getNextSteps(trail, safeCourses, 3)
  const overall = getOverallProgress(trail)

  return (
    <section className={`atlas-surface ${styles.campus}`} lang="pt-BR">
      <div className={styles.inner}>
        {/* Brand bar */}
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">△</span>
          <span className={styles.brandName}>ATLAS <strong>CLUBOS</strong></span>
          <span className={styles.brandTag}>CAMPUS</span>
          {isAuthenticated && (
            <span className={styles.brandMember}>
              <AtlasBadge tone="muted">{firstName ? `Olá, ${firstName}` : 'Membro Atlas'}</AtlasBadge>
            </span>
          )}
          {isAdmin && (
            <Link
              className={styles.brandAdmin}
              href={getUriWithOrg(orgslug, '/dash')}
            >
              <LayoutDashboard size={14} /> Gestão
            </Link>
          )}
        </div>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>PESSOAS · IDEIAS · CONHECIMENTO</p>
            <h1>Seu próximo passo começa aqui.</h1>
            <p className={styles.intro}>
              Aprenda, experimente e transforme conhecimento em resultados reais.
              Um espaço para construir o futuro, juntos.
            </p>
            <div className={styles.heroActions}>
              <a href="#atlas-courses" className={styles.primary}>
                Explorar formações <ArrowUpRight size={18} />
              </a>
              <AuthenticatedClientElement
                ressourceType="courses"
                action="create"
                checkMethod="roles"
                orgId={org_id}
              >
                <Link className={styles.secondary} href={getUriWithOrg(orgslug, '/courses?new=true')}>
                  Criar formação <ArrowUpRight size={14} />
                </Link>
              </AuthenticatedClientElement>
            </div>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.triangle}>△</div>
            <span className={styles.heroArtLabel}>CONHECIMENTO<br />EM MOVIMENTO</span>
          </div>
        </div>

        {/* Progress summary — only when the user has real trail data */}
        {!trailLoading && overall.started > 0 && (
          <div className={styles.progressStrip}>
            <div className={styles.progressItem}>
              <span className={styles.progressIcon}><TrendingUp size={16} /></span>
              <div>
                <span className={styles.progressValue}>{overall.started}</span>
                <span className={styles.progressKey}>formação{overall.started > 1 ? 's' : ''} em curso</span>
              </div>
            </div>
            <div className={styles.progressDivider} />
            <div className={styles.progressItem}>
              <span className={styles.progressIcon}><Sparkles size={16} /></span>
              <div>
                <span className={styles.progressValue}>{overall.completed}/{overall.totalSteps}</span>
                <span className={styles.progressKey}>atividades concluídas</span>
              </div>
            </div>
            <div className={styles.progressDivider} />
            <div className={styles.progressItem}>
              <div className={styles.progressMeter}>
                <div className={styles.progressMeterFill} style={{ width: `${overall.percent}%` }} />
              </div>
              <div>
                <span className={styles.progressValue}>{overall.percent}%</span>
                <span className={styles.progressKey}>progresso global</span>
              </div>
            </div>
          </div>
        )}

        {/* Próximos passos — in-progress courses with next activity */}
        {trailLoading ? (
          <section className={styles.section}>
            <AtlasSectionHeader eyebrow="RETOMAR" title="Próximos passos" />
            <div className={styles.grid3}>
              {Array.from({ length: 3 }).map((_, i) => (
                <AtlasSkeleton key={i} className={styles.cardSkeleton} style={{ height: 220 }} />
              ))}
            </div>
          </section>
        ) : (
          nextSteps.length > 0 && (
            <section className={styles.section}>
              <AtlasSectionHeader
                eyebrow="RETOMAR"
                title="Próximos passos"
                description="Continue de onde parou nas suas formações ativas."
                action={
                  <Link className={styles.linkMuted} href={getUriWithOrg(orgslug, '/courses')}>
                    Ver todas <ArrowUpRight size={14} />
                  </Link>
                }
              />
              <div className={styles.grid3}>
                {nextSteps.map(({ course, progress }, i) => (
                  <AtlasCourseCard
                    key={course.course_uuid ?? i}
                    course={course}
                    orgslug={orgslug}
                    variant="dark"
                    progress={progress}
                    index={i}
                  />
                ))}
              </div>
            </section>
          )
        )}

        {/* Formações disponíveis — full catalog */}
        <section className={styles.section}>
          <AtlasSectionHeader
            eyebrow="SUA JORNADA NO ATLAS"
            title="Formações disponíveis"
            description="Explore programas, edições e percursos do Campus Atlas ClubOS."
            id="atlas-courses"
          />
          {safeCourses.length > 0 ? (
            <>
              <div className={styles.grid3}>
                {safeCourses.slice(0, 12).map((course, i) => (
                  <AtlasCourseCard
                    key={course.course_uuid ?? i}
                    course={course}
                    orgslug={orgslug}
                    variant="dark"
                    index={i}
                  />
                ))}
              </div>
              {safeCourses.length > 12 && (
                <div className={styles.sectionFooter}>
                  <Link className={styles.secondary} href={getUriWithOrg(orgslug, '/courses')}>
                    Ver todas as {safeCourses.length} formações <ArrowUpRight size={16} />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <AtlasEmptyState
              icon={<Compass size={24} />}
              title="Nenhuma formação disponível neste momento"
              description="As formações aparecem aqui conforme a publicação e as permissões da sua conta. Volte em breve ou contacte a equipa Atlas."
              action={
                isAuthenticated ? (
                  <AuthenticatedClientElement
                    ressourceType="courses"
                    action="create"
                    checkMethod="roles"
                    orgId={org_id}
                  >
                    <Link className={styles.primary} href={getUriWithOrg(orgslug, '/courses?new=true')}>
                      Criar a primeira formação <ArrowUpRight size={16} />
                    </Link>
                  </AuthenticatedClientElement>
                ) : null
              }
            />
          )}
        </section>

        {/* Recomendações — not-started courses (only when user has started others) */}
        {!trailLoading && recommendations.length > 0 && inProgress.length > 0 && (
          <section className={styles.section}>
            <AtlasSectionHeader
              eyebrow="CONTINUAR A EXPLORAR"
              title="Recomendações para si"
              description="Formações que ainda não iniciou no seu percurso Atlas."
            />
            <div className={styles.grid3}>
              {recommendations.slice(0, 6).map((course, i) => (
                <AtlasCourseCard
                  key={course.course_uuid ?? i}
                  course={course}
                  orgslug={orgslug}
                  variant="dark"
                  index={i}
                />
              ))}
            </div>
          </section>
        )}

        <footer className={styles.footer}>
          <span>AtlasHub · Pessoas no centro. Tecnologia a serviço.</span>
          <a href="https://github.com/atlashub-digital/atlas-club-campus">Código-fonte · LearnHouse / AGPL</a>
        </footer>
      </div>
    </section>
  )
}

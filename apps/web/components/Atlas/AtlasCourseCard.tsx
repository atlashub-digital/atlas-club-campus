/*
 * Atlas ClubOS — Course Card (Wave 2)
 * --------------------------------------------------
 * Premium course card used by the member dashboard (dark) and the
 * Academia catalog (light). Renders real Course data from useCourses +
 * optional progress from the trail. No fabricated metrics.
 *
 * Locked behavior: links to getUriWithOrg(orgslug, '/course/<uuid>').
 */
'use client'
import Link from 'next/link'
import { ArrowUpRight, BookOpen, CheckCircle2, PlayCircle } from 'lucide-react'
import { getUriWithOrg } from '@services/config/config'
import { AtlasBadge, AtlasProgressBar } from './AtlasPrimitives'
import type { AtlasCourseLike, AtlasCourseProgress } from './atlasProgress'
import styles from './AtlasCourseCard.module.css'

export interface AtlasCourseCardProps {
  course: AtlasCourseLike
  orgslug: string
  variant?: 'dark' | 'light'
  progress?: AtlasCourseProgress
  index?: number
  priority?: boolean
}

function courseLink(orgslug: string, course: AtlasCourseLike): string {
  const raw = course.course_uuid ?? ''
  return getUriWithOrg(orgslug, '/course/' + String(raw).replace('course_', ''))
}

function activityLink(orgslug: string, course: AtlasCourseLike, activityId: number | null): string | null {
  if (!activityId) return null
  const courseRaw = String(course.course_uuid ?? '').replace('course_', '')
  return getUriWithOrg(orgslug, `/course/${courseRaw}/activity/activity_${activityId}`)
}

export default function AtlasCourseCard({
  course,
  orgslug,
  variant = 'dark',
  progress,
  index,
}: AtlasCourseCardProps) {
  const name = String(course.name ?? 'Formação sem título')
  const description = course.description ? String(course.description) : ''
  const cover = course.thumbnail_image ? String(course.thumbnail_image) : ''
  const idx = typeof index === 'number' ? String(index + 1).padStart(2, '0') : 'ATLAS'
  const isLight = variant === 'light'

  const started = !!progress?.started
  const completed = started && progress?.completed === progress?.total && (progress?.total ?? 0) > 0
  const nextHref = activityLink(orgslug, course, progress?.nextActivityId ?? null)

  return (
    <Link
      href={courseLink(orgslug, course)}
      className={[
        styles.card,
        isLight ? styles.cardLight : styles.cardDark,
        started ? styles.cardStarted : '',
      ]
        .filter(Boolean)
        .join(' ')}
      lang="pt-BR"
      prefetch={false}
    >
      <div
        className={styles.cover}
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        aria-hidden="true"
      >
        {!cover && (
          <div className={styles.coverFallback}>
            <BookOpen size={36} strokeWidth={1} />
          </div>
        )}
        <div className={styles.coverGradient} />
        <span className={styles.coverIndex}>ATLAS / {idx}</span>
        {completed && (
          <span className={styles.coverBadge}>
            <AtlasBadge tone="success" variant={variant}>
              <CheckCircle2 size={11} /> Concluída
            </AtlasBadge>
          </span>
        )}
        {started && !completed && (
          <span className={styles.coverBadge}>
            <AtlasBadge tone="gold" variant={variant}>
              <PlayCircle size={11} /> {progress?.percent ?? 0}%
            </AtlasBadge>
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}

        {started && !completed && (
          <div className={styles.progressWrap}>
            <AtlasProgressBar value={progress?.percent ?? 0} variant={variant} />
            <span className={styles.progressLabel}>
              {progress?.completed ?? 0}/{progress?.total ?? 0} atividades
            </span>
          </div>
        )}

        <div className={styles.action}>
          <span className={styles.actionLabel}>
            {completed ? 'Rever formação' : started ? 'Continuar formação' : 'Explorar formação'}
          </span>
          {started && !completed && nextHref ? (
            <ArrowUpRight size={16} className={styles.actionIcon} />
          ) : (
            <ArrowUpRight size={16} className={styles.actionIcon} />
          )}
        </div>
      </div>
    </Link>
  )
}

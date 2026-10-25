/*
 * Atlas ClubOS — Primitives (Wave 2)
 * --------------------------------------------------
 * Reusable building blocks for the Atlas visual system.
 *   - AtlasCard        premium card (dark/light variants)
 *   - AtlasBadge       pill badge (gold/blue/neutral/success/danger)
 *   - AtlasProgressBar progress bar with gold fill
 *   - AtlasEmptyState  empty/loading/error state with icon + copy
 *   - AtlasSkeleton    loading skeleton block
 *   - AtlasSectionHeader  eyebrow + title + optional action
 *
 * Styling lives in AtlasPrimitives.module.css and uses --atlas-* tokens.
 */
import type { CSSProperties, ReactNode } from 'react'
import styles from './AtlasPrimitives.module.css'

type AtlasVariant = 'dark' | 'light'

/* ----------------------------- Card ----------------------------- */
export function AtlasCard({
  children,
  variant = 'dark',
  interactive = false,
  className,
  style,
}: {
  children: ReactNode
  variant?: AtlasVariant
  interactive?: boolean
  className?: string
  style?: CSSProperties
}) {
  const cls = [
    styles.card,
    variant === 'light' ? styles.cardLight : styles.cardDark,
    interactive ? styles.cardInteractive : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} style={style} data-atlas-card="">
      {children}
    </div>
  )
}

/* ----------------------------- Badge ---------------------------- */
type BadgeTone = 'gold' | 'blue' | 'neutral' | 'success' | 'danger' | 'muted'
export function AtlasBadge({
  children,
  tone = 'neutral',
  variant = 'dark',
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  variant?: AtlasVariant
  className?: string
}) {
  const toneCls =
    {
      gold: styles.badgeGold,
      blue: styles.badgeBlue,
      neutral: variant === 'light' ? styles.badgeNeutralLight : styles.badgeNeutral,
      success: styles.badgeSuccess,
      danger: styles.badgeDanger,
      muted: styles.badgeMuted,
    }[tone] ?? styles.badgeNeutral
  return (
    <span className={[styles.badge, toneCls, className ?? ''].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}

/* -------------------------- ProgressBar ------------------------- */
export function AtlasProgressBar({
  value,
  variant = 'dark',
  className,
}: {
  value: number // 0..100
  variant?: AtlasVariant
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      className={[styles.progress, variant === 'light' ? styles.progressLight : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.progressFill} style={{ width: `${clamped}%` }} />
    </div>
  )
}

/* --------------------------- EmptyState ------------------------- */
export function AtlasEmptyState({
  icon,
  title,
  description,
  action,
  variant = 'dark',
  className,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  variant?: AtlasVariant
  className?: string
}) {
  const cls = [
    styles.empty,
    variant === 'light' ? styles.emptyLight : styles.emptyDark,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} role="status">
      {icon && <div className={styles.emptyIcon} aria-hidden="true">{icon}</div>}
      <h3 className={styles.emptyTitle}>{title}</h3>
      {description && <p className={styles.emptyDescription}>{description}</p>}
      {action && <div className={styles.emptyAction}>{action}</div>}
    </div>
  )
}

/* ---------------------------- Skeleton -------------------------- */
export function AtlasSkeleton({
  variant = 'dark',
  className,
  style,
}: {
  variant?: AtlasVariant
  className?: string
  style?: CSSProperties
}) {
  const cls = [
    styles.skeleton,
    variant === 'light' ? styles.skeletonLight : styles.skeletonDark,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
  return <div className={cls} style={style} aria-hidden="true" />
}

/* ------------------------ SectionHeader ------------------------- */
export function AtlasSectionHeader({
  eyebrow,
  title,
  description,
  action,
  variant = 'dark',
  id,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  variant?: AtlasVariant
  id?: string
  className?: string
}) {
  const cls = [
    styles.sectionHeader,
    variant === 'light' ? styles.sectionHeaderLight : styles.sectionHeaderDark,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls}>
      <div className={styles.sectionHeaderText}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h2 id={id} className={styles.sectionTitle}>{title}</h2>
        {description && <p className={styles.sectionDescription}>{description}</p>}
      </div>
      {action && <div className={styles.sectionAction}>{action}</div>}
    </div>
  )
}

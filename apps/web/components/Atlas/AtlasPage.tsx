/*
 * Atlas ClubOS — Page Shell (Wave 2)
 * --------------------------------------------------
 * Shared header for catalog, course, classroom, community, profile, admin.
 * Backward-compatible with Wave 1: title/description/eyebrow/compact still work.
 *
 * New optional props:
 *   - actions: ReactNode rendered top-end of the header (CTAs, filters)
 *   - breadcrumbs: [{label, href?}] rendered above the title
 *
 * Locked acceptance (apps/e2e/atlas/campus.spec.ts):
 *   title remains an <h1> and stays visible on every surface.
 */
import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './AtlasPage.module.css'

export interface AtlasBreadcrumb {
  label: string
  href?: string
}

export default function AtlasPage({
  title,
  description,
  eyebrow = 'ATLAS CLUBOS',
  compact = false,
  actions,
  breadcrumbs,
  children,
}: {
  title: string
  description: string
  eyebrow?: string
  compact?: boolean
  actions?: ReactNode
  breadcrumbs?: AtlasBreadcrumb[]
  children: ReactNode
}) {
  return (
    <section className={`atlas-surface-light ${styles.page}`} data-atlas-page={title} lang="pt-BR">
      <header className={compact ? styles.compact : styles.header}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className={styles.breadcrumbs} aria-label="Trilha de navegação">
              <ol className={styles.breadcrumbList}>
                {breadcrumbs.map((b, i) => (
                  <li key={i} className={styles.breadcrumbItem}>
                    {b.href ? (
                      <Link href={b.href} className={styles.breadcrumbLink}>{b.label}</Link>
                    ) : (
                      <span className={styles.breadcrumbCurrent} aria-current="page">{b.label}</span>
                    )}
                    {i < breadcrumbs.length - 1 && <span className={styles.breadcrumbSep} aria-hidden="true">/</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className={styles.titleRow}>
            <div className={styles.titleCol}>
              <h1>{title}</h1>
              <p className={styles.description}>{description}</p>
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
          <nav className={styles.nav} aria-label="Navegação Atlas">
            <Link href="/">Meu Campus</Link>
            <Link href="/courses">Formações</Link>
            <Link href="/communities">Comunidade</Link>
          </nav>
        </div>
      </header>
      <div className={styles.content}>{children}</div>
    </section>
  )
}

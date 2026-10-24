import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './AtlasPage.module.css'
export default function AtlasPage({ title, description, eyebrow='ATLAS CLUBOS', compact=false, children }: {title:string;description:string;eyebrow?:string;compact?:boolean;children:ReactNode}) {
 return <section className={styles.page} data-atlas-page={title} lang="pt-BR">
  <header className={compact?styles.compact:styles.header}><div className={styles.inner}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.description}>{description}</p><nav className={styles.nav} aria-label="Navegação Atlas"><Link href="/">Meu Campus</Link><Link href="/courses">Formações</Link><Link href="/communities">Comunidade</Link></nav></div></header>
  <div className={styles.content}>{children}</div>
 </section>
}

import styles from './Surfaces.module.css'

type Props = {
  title: string
  image?: string
  variant?: 'card' | 'hero' | 'mini'
  priority?: boolean
}

/** Decorative cover: its containing link/heading provides the course name. */
export default function CourseCover({ title, image, variant = 'card', priority = false }: Props) {
  return <div className={`${styles.cover} ${styles[`cover${variant[0].toUpperCase()}${variant.slice(1)}`]}`} aria-hidden="true">
    {image ? <img src={image} alt="" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} /> : <>
      <span className={styles.coverKicker}>Campus / Formação</span>
      <span className={styles.coverTitle}>{title}</span>
      <span className={styles.coverFooter}>Atlas ClubOS <span>↗</span></span>
    </>}
  </div>
}

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import learnhouseIcon from 'public/black_logo.png'
import styles from '@components/Clubos/Surfaces.module.css'

// Rendered per request, not prerendered. Next 16 answers an unknown Server
// Action posted to a missing path from the static 404 entry, finds a text/plain
// error where it expects an RSC payload and throws a 500 instead of a 404.
export const dynamic = 'force-dynamic'

export default function NotFound() {
  if (process.env.NEXT_PUBLIC_ATLAS_CLUBOS_BRAND === 'true') return (
    <main className={styles.errorPage}>
      <div className={styles.errorPanel}>
        <Image src="/atlas/atlas-clubos-mark.svg" alt="" width={48} height={48} />
        <p className={styles.eyebrow}>Atlas ClubOS / Campus · 404</p>
        <h1>Página não encontrada</h1>
        <p>Este endereço pode ter mudado ou a página não está mais disponível.</p>
        <Link className={styles.primary} href="/">Voltar ao Campus <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>
    </main>
  )
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center 
   bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-200 to-slate-300">
    {/* The nx-* classes here were left over from a Nextra template and never
        existed in this project's Tailwind build, so they rendered nothing.
        Only pb-20 was ever doing anything. */}
    <div className="pb-20">
        <Image quality={100}
          width={270}
          height={100}
          src={learnhouseIcon}
          alt="logo"
        />
        </div>
      <div className="space-y-6 text-center">
        <h1 className="text-8xl leading-7 font-bold text-black drop-shadow-md">
          404!
        </h1>
        <p className='text-lg pt-8 text-black tracking-tight font-medium leading-normal'>
          We are very sorry for the inconvenience. It looks like you're trying to
          <span className="block">access a page that has been deleted or never existed before</span>
        </p>
      </div>
      <div className='pt-8 flex flex-col items-center'>
      <Link
        href="/"
        className="flex w-fit h-[50px] text-xl space-x-2 bg-black px-6 py-2 text-md rounded-lg font-bold text-white items-center shadow-md gap-2"
      >
        Go back to homepage
        <ArrowRight className="tracking-tight transition-transform duration-150 ease-in-out ms-1" />
      </Link>
    </div>
    </div>
  )
}


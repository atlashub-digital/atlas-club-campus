'use client'
// Shared legal/footer bits, ported from the platform's look.
//
// AuthFooter:    the "By continuing, you agree to … Terms of Service and
//                Privacy Policy." line shown under the auth forms.
// CopyrightFooter: the "© {year} Atlas Club" line for app surfaces
//                (the apex /home hub, the onboarding page, …).
//
// Legal pages live on the marketing/platform site, so links resolve via
// getPlatformUrl() with a sensible public fallback.
import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { getPlatformUrl } from '@services/config/config'

const TERMS_URL = getPlatformUrl('/terms') || 'https://www.learnhouse.io/terms'
const PRIVACY_URL = getPlatformUrl('/privacy') || 'https://www.learnhouse.io/privacy'
const ATLAS_PRIVACY_DRAFT_URL = 'https://club.atlashub.si/privacidade'

export function AuthFooter({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const atlasBrand = process.env.NEXT_PUBLIC_ATLAS_CLUBOS_BRAND === 'true'
  if (atlasBrand) {
    // The Club privacy document is a DRAFT. Do not present it as approved legal
    // terms or silently bind users to the original software vendor's contracts.
    return (
      <div className={`pb-7 pt-5 text-center px-6 ${className}`}>
        <p className="mx-auto max-w-lg text-[12px] leading-relaxed font-medium text-[#536986]">
          Atlas Club em beta por convite. O aviso de privacidade ainda está em revisão.{' '}
          <Link href={ATLAS_PRIVACY_DRAFT_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[#075bb2] hover:text-[#003e89]">
            Consultar minuta informativa
          </Link>
        </p>
      </div>
    )
  }
  return (
    <div className={`pb-8 pt-6 text-center px-6 ${className}`}>
      <p className="text-[13px] text-black/30 font-medium">
        {t('auth.terms_text', { defaultValue: "By continuing, you agree to Atlas Club's" })}{' '}
        <Link
          href={TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/50 hover:text-black/70 transition-colors"
        >
          {t('auth.terms_of_service', { defaultValue: 'Terms of Service' })}
        </Link>{' '}
        {t('auth.and', { defaultValue: 'and' })}{' '}
        <Link
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black/50 hover:text-black/70 transition-colors"
        >
          {t('auth.privacy_policy', { defaultValue: 'Privacy Policy' })}
        </Link>
        .
      </p>
    </div>
  )
}

export function CopyrightFooter({
  year,
  className = '',
  tone = 'light',
}: {
  year: number
  className?: string
  // `light` → dark text on light bg; `dark` → light text on dark bg.
  tone?: 'light' | 'dark'
}) {
  const { t } = useTranslation()
  const atlasBrand = process.env.NEXT_PUBLIC_ATLAS_CLUBOS_BRAND === 'true'
  if (atlasBrand) {
    return (
      <footer className={`w-full py-6 px-6 ${className}`}>
        <div className="flex flex-col items-center gap-2 text-center text-[12px] text-[#a8bdd8]">
          <p>© {year} Atlas Club · AtlasHub</p>
          <nav aria-label="Informação legal" className="flex flex-wrap items-center justify-center gap-4">
            <Link href={ATLAS_PRIVACY_DRAFT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2">Privacidade (minuta)</Link>
          </nav>
        </div>
      </footer>
    )
  }
  const base = tone === 'dark' ? 'text-white/40' : 'text-black/35'
  const link = tone === 'dark' ? 'text-white/60 hover:text-white/80' : 'text-black/55 hover:text-black/75'
  return (
    <footer className={`w-full py-6 px-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium">
        <p className={base}>
          {t('common.copyright', { defaultValue: '© {{year}} Atlas Club', year })}
        </p>
        <nav className="flex items-center gap-x-5">
          <Link
            href={TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link} transition-colors`}
          >
            {t('auth.terms_of_service', { defaultValue: 'Terms of Service' })}
          </Link>
          <Link
            href={PRIVACY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link} transition-colors`}
          >
            {t('auth.privacy_policy', { defaultValue: 'Privacy Policy' })}
          </Link>
        </nav>
      </div>
    </footer>
  )
}

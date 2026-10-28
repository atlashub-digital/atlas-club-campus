'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import learnhouseIcon from 'public/learnhouse_bigicon_1.png'
import { getOrgAuthBackgroundMediaDirectory } from '@services/media/media'
import OrgSquareLogo from '@components/Objects/Org/OrgSquareLogo'
import { getUriWithOrg } from '@services/config/config'
import { cn } from '@/lib/utils'
import { usePlan } from '@components/Hooks/usePlan'

interface AuthBrandingPanelProps {
  org: any
  welcomeText?: string
  // No-org (apex) panel copy: platform-style title + subtitle shown at the top
  // of the illustration. Falls back to the login wording when omitted.
  title?: string
  subtitle?: string
}

export default function AuthBrandingPanel({ org, welcomeText, title, subtitle }: AuthBrandingPanelProps) {
  const authBranding = org?.config?.config?.customization?.auth_branding || org?.config?.config?.general?.auth_branding || {}
  const {
    welcome_message = '',
    background_type = 'gradient',
    background_image = '',
    text_color = 'light',
    unsplash_photographer_name = '',
    unsplash_photographer_url = '',
    unsplash_photo_url = '',
  } = authBranding
  const UNSPLASH_UTM = '?utm_source=LearnHouse&utm_medium=referral'
  const withUtm = (url: string) => (url ? `${url}${UNSPLASH_UTM}` : '')

  // Check if org has enterprise plan - hide LearnHouse branding for enterprise users
  // In OSS mode, always show branding regardless of plan
  const plan = usePlan()
  const isEnterprise = plan === 'enterprise'

  // No org context (the generic apex login) → use the platform's auth
  // illustration instead of the flat gradient.
  const noOrg = !org
  // Atlas presentation is opt-in per build; other LearnHouse tenants remain unchanged.
  const atlasBrand = process.env.NEXT_PUBLIC_ATLAS_CLUBOS_BRAND === 'true'

  const getBackgroundStyle = (): React.CSSProperties => {
    if (noOrg) {
      if (atlasBrand) {
        return {
          background:
            'radial-gradient(ellipse at 75% 22%, rgba(0,212,255,.33), transparent 54%), radial-gradient(ellipse at 18% 78%, rgba(0,123,255,.38), transparent 60%), linear-gradient(135deg, #102c54, #050b17)',
        }
      }
      return {
        backgroundImage: 'url(/auth-default.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    if (background_type === 'gradient' || !background_image) {
      return {
        background: atlasBrand
          ? 'radial-gradient(circle at 75% 25%, rgba(0,212,255,.32), transparent 52%), linear-gradient(135deg, #173a65, #071429 85%)'
          : 'linear-gradient(041.61deg, #202020 7.15%, #000000 90.96%)',
      }
    }
    if (background_type === 'custom' && background_image) {
      return {
        backgroundImage: `url(${getOrgAuthBackgroundMediaDirectory(org?.org_uuid, background_image)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    if (background_type === 'unsplash' && background_image) {
      return {
        backgroundImage: `url(${background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    return {
      background: 'linear-gradient(041.61deg, #202020 7.15%, #000000 90.96%)',
    }
  }

  const displayMessage = welcome_message || welcomeText || ''
  // No-org platform copy (defaults mirror the platform login illustration).
  const noOrgTitle = atlasBrand ? 'Bem-vindo ao Atlas ClubOS.' : (title || 'Welcome back to LearnHouse.')
  const noOrgSubtitle =
    subtitle || (atlasBrand ? 'Aprende, cria e partilha na comunidade Atlas.' : 'Pick up where you left off. Your courses, students, and tools are waiting.')
  // Treat the no-org illustration like a photo background: dark scrim, no
  // blueprint-grid overlay.
  const hasCustomBackground = noOrg || (background_type !== 'gradient' && background_image)

  if (atlasBrand) return (
    <aside className="h-full bg-[#f5f6f8] border-s border-[#e3e7ec] flex flex-col justify-between p-16 text-[#172335]">
      <Image src="/atlas/brand/01-portico/horizontal-light.svg" width={290} height={48} alt="Atlas ClubOS" unoptimized />
      <div className="max-w-md">
        <p className="text-sm font-semibold text-[#526174] mb-4">CAMPUS ATLAS</p>
        <h2 className="text-4xl font-bold tracking-tight leading-tight">Seu espaço para aprender e compartilhar.</h2>
        <p className="mt-6 text-lg leading-relaxed text-[#526174]">Acesse seus cursos, acompanhe sua aprendizagem e participe da comunidade.</p>
      </div>
      <p className="text-sm text-[#526174]">AtlasHub · Formação e comunidade</p>
    </aside>
  )

  return (
    <div className="relative h-full w-full">
      {/* Inset rounded card (platform-style) */}
      <div className="absolute inset-16 rounded-2xl overflow-hidden">
        {/* Base layer: org's chosen background (gradient | custom | unsplash) */}
        <div className="absolute inset-0" style={getBackgroundStyle()} />

        {/* Blueprint + dot overlays, ONLY for gradient fallback (no photo) */}
        {!hasCustomBackground && (
          <>
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage: `linear-gradient(rgba(120,165,255,0.6) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(120,165,255,0.6) 1px, transparent 1px),
                  linear-gradient(rgba(120,165,255,0.3) 0.5px, transparent 0.5px),
                  linear-gradient(90deg, rgba(120,165,255,0.3) 0.5px, transparent 0.5px)`,
                backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(120,165,255,0.9) 1.5px, transparent 1.5px)',
                backgroundSize: '120px 120px',
              }}
            />
          </>
        )}

        {/* Dark scrim for org photo backgrounds (centered text needs it).
            The no-org illustration stays vivid; it's darkened only at the top. */}
        {hasCustomBackground && !noOrg && (
          <div className="absolute inset-0 bg-black/30" />
        )}

        {/* No-org: top blur + darken so the platform-style heading reads over
            the illustration (mirrors the platform login panel). */}
        {noOrg && (
          <>
            <div
              className="absolute top-0 start-0 end-0 h-[38%] z-[5] backdrop-blur-sm"
              style={{
                maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)',
              }}
            />
            <div
              className="absolute top-0 start-0 end-0 h-[38%] z-[5] bg-black/35"
              style={{
                maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)',
              }}
            />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Top bar with LearnHouse lrn.svg logo - hidden for enterprise users
              and for the no-org apex panel (platform shows no logo on the image). */}
          {!isEnterprise && !noOrg && (
            <div className="login-topbar">
              <Link prefetch href={atlasBrand ? getUriWithOrg(org?.slug, '/') : "https://learnhouse.app"} target={atlasBrand ? "_self" : "_blank"}>
                <img
                  src={atlasBrand ? "/atlas/atlas-clubos-mark.svg" : "/lrn.svg"}
                  alt={atlasBrand ? "Atlas ClubOS" : "LearnHouse"}
                  width={30}
                  height={30}
                  className={cn(
                    "transition-opacity hover:opacity-100",
                    text_color === 'light' ? "opacity-60 invert" : "opacity-40"
                  )}
                />
              </Link>
            </div>
          )}

          {noOrg ? (
            /* No-org apex panel, platform layout: heading at the TOP, no logo
               box, platform copy. */
            <div className="max-w-md text-white">
              {atlasBrand && (
                <div className="mb-7 flex items-center gap-3">
                  <Image src="/atlas/atlas-clubos-mark.svg" width={52} height={52} alt="Símbolo Atlas ClubOS" unoptimized />
                  <span className="text-white text-lg font-semibold tracking-wide">ATLAS CLUBOS</span>
                  <Image src="/atlas/atlas-avatar.webp" width={64} height={64} alt="Atlas, mascote do Club Atlas" unoptimized className="ms-auto" />
                </div>
              )}
              <h1 className="font-black text-[28px] leading-tight tracking-tight">
                {noOrgTitle}
              </h1>
              <p className="mt-3 text-white/85 text-base font-medium leading-relaxed">
                {noOrgSubtitle}
              </p>
            </div>
          ) : (
            /* Org panel: centered logo + name (unchanged). */
            <>
              <div className="flex-1 flex items-center justify-center">
                <div className={cn(
                  "flex flex-col items-center text-center gap-6",
                  text_color === 'light' ? "text-white" : "text-gray-900"
                )}>
                  {/* Organization logo */}
                  <Link prefetch href={getUriWithOrg(org?.slug, '/')}>
                    <div className="w-24 h-24 rounded-2xl ring-1 ring-inset ring-white/10 bg-white flex items-center justify-center overflow-hidden">
                      {atlasBrand ? (
                        <Image
                          src="/atlas/atlas-clubos-mark.svg"
                          alt="Atlas ClubOS"
                          width={96}
                          height={96}
                          className="object-contain p-3"
                          unoptimized
                        />
                      ) : (
                        <OrgSquareLogo
                          org={org}
                          wideInsetClassName="p-3"
                          fallback={<Image quality={100} width={96} height={96} src={learnhouseIcon} alt="LearnHouse" className="object-contain" />}
                        />
                      )}
                    </div>
                  </Link>

                  {/* Text content */}
                  <div className="space-y-1">
                    <h1 className="font-black text-3xl tracking-tight">{atlasBrand ? 'Atlas ClubOS' : (org?.name || 'LearnHouse')}</h1>
                    {displayMessage && (
                      <p className={cn(
                        "text-lg max-w-sm leading-relaxed",
                        text_color === 'light' ? "text-white/70" : "text-gray-600"
                      )}>
                        {displayMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom spacer for visual balance */}
              {atlasBrand && (
                <div className="absolute end-6 bottom-5 pointer-events-none">
                  <Image src="/atlas/atlas-avatar.webp" alt="Atlas, mascote do Club Atlas" width={104} height={104} unoptimized />
                </div>
              )}
              <div className="h-10" />
            </>
          )}

          {/* Unsplash attribution (required by Unsplash API guidelines) */}
          {background_type === 'unsplash' && background_image && unsplash_photographer_name && (
            <div className={cn(
              "absolute bottom-3 start-4 end-4 z-10 text-[11px] leading-tight",
              text_color === 'light' ? "text-white/70" : "text-gray-700"
            )}>
              Photo by{' '}
              <a
                href={withUtm(unsplash_photographer_url) || withUtm(unsplash_photo_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100 opacity-90"
              >
                {unsplash_photographer_name}
              </a>
              {' '}on{' '}
              <a
                href={`https://unsplash.com/${UNSPLASH_UTM}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-100 opacity-90"
              >
                Unsplash
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

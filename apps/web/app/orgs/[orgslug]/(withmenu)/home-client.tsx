'use client'
import React from 'react'
import Link from 'next/link'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import { useOrg } from '@components/Contexts/OrgContext'
import { useCourses } from '@/hooks/queries/useCourses'
import LandingClassic from '@components/Landings/LandingClassic'
import LandingCustom from '@components/Landings/LandingCustom'
import { JsonLd } from '@components/SEO/JsonLd'
import { getUriWithOrg } from '@services/config/config'
import { getOrgLogoMediaDirectory } from '@services/media/media'
import GeneralWrapperStyled from '@components/Objects/StyledElements/Wrappers/GeneralWrapper'

export default function HomeClient({ orgslug }: { orgslug: string }) {
  const session = useLHSession()
  const atlasBrand = process.env.NEXT_PUBLIC_ATLAS_CLUBOS_BRAND === 'true'
  const org = useOrg() as any
  const { data: courses, isLoading: coursesLoading } = useCourses(orgslug)

  const landingConfig = org?.config?.config?.customization?.landing || org?.config?.config?.landing
  const hasCustomLanding = landingConfig?.enabled

  const orgJsonLd = org
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: org.name,
        description: org.description,
        url: getUriWithOrg(orgslug, '/'),
        ...(org.logo_image && {
          logo: getOrgLogoMediaDirectory(org.org_uuid, org.logo_image),
        }),
      }
    : null

  if (!org || (!hasCustomLanding && coursesLoading)) {
    return (
      <GeneralWrapperStyled>
        <div className="animate-pulse space-y-6 pt-6">
          <div className="h-6 bg-gray-200 rounded w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-[131px] bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GeneralWrapperStyled>
    )
  }

  return (
    <div className="w-full">
      {orgJsonLd && <JsonLd data={orgJsonLd} />}
      {atlasBrand ? (
        <>
          <section className="atlas-campus" aria-labelledby="campus-title">
            <div className="atlas-campus-heading">
              <p className="text-sm font-semibold mb-4">ATLAS CLUBOS / CAMPUS</p>
              <h1 id="campus-title">Conhecimento que abre caminhos.</h1>
              <p className="mt-6 text-lg">Explore os cursos e encontre seu próximo passo de aprendizagem.</p>
              <div className="atlas-campus-actions">
                <Link href={getUriWithOrg(orgslug, '/courses')}>Explorar cursos</Link>
                {session?.status === 'authenticated' && <Link href={getUriWithOrg(orgslug, '/trail')}>Continuar minha aprendizagem</Link>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[['folders', '/library', 'Biblioteca', 'Consulte os materiais disponíveis.'], ['communities', '/communities', 'Comunidades', 'Participe das conversas da comunidade.'], ['playgrounds', '/playgrounds', 'Playgrounds', 'Explore os espaços de prática.']].filter(([feature]) => org.config?.config?.resolved_features?.[feature]?.enabled).map(([, path, title, description]) => (
                <Link key={path} href={getUriWithOrg(orgslug, path)} className="rounded-xl border border-[#e3e7ec] bg-white p-6 hover:border-[#3268d6]">
                  <h2 className="font-semibold text-lg mb-2">{title} <span aria-hidden="true">↗</span></h2><p>{description}</p>
                </Link>
              ))}
            </div>
          </section>
          <LandingClassic courses={courses || []} orgslug={orgslug} org_id={org.id} />
        </>
      ) : hasCustomLanding ? (
        <LandingCustom landing={landingConfig} orgslug={orgslug} />
      ) : (
        <LandingClassic
          courses={courses || []}
          orgslug={orgslug}
          org_id={org.id}
        />
      )}
    </div>
  )
}

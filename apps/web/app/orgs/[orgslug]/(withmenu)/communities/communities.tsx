'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import AuthenticatedClientElement from '@components/Security/AuthenticatedClientElement'
import TypeOfContentTitle from '@components/Objects/StyledElements/Titles/TypeOfContentTitle'
import GeneralWrapperStyled from '@components/Objects/StyledElements/Wrappers/GeneralWrapper'
import CommunityCard from '@components/Objects/Communities/CommunityCard'
import { CreateCommunityModal } from '@components/Objects/Modals/Communities/CreateCommunityModal'
import { EditCommunityModal } from '@components/Objects/Modals/Communities/EditCommunityModal'
import ContentPlaceHolderIfUserIsNotAdmin from '@components/Objects/ContentPlaceHolder'
import { Users, Plus } from 'lucide-react'
import { Community } from '@services/communities/communities'
import FeatureGate from '@components/Dashboard/Shared/FeatureGate/FeatureGate'
import { useTrackView, AnalyticsEvent } from '@services/analytics'

interface CommunitiesClientProps {
  communities: Community[]
  orgslug: string
  org_id: number
}

const CommunitiesClient = ({ communities, orgslug, org_id }: CommunitiesClientProps) => {
  const { t } = useTranslation()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null)
  // Only promote a real, accessible Genesis community returned by the API.
  // No fictitious join button is shown before the community exists.
  const genesisCommunity = communities.find((community) => {
    // Accept the approved community name and the previous brand styling,
    // without accidentally matching unrelated Genesis-named communities.
    const normalized = community.name
      .trim()
      .toLocaleLowerCase('pt-BR')
      .replace(/\s*\|\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return normalized === 'atlasclub genesis'
  })

  useTrackView(AnalyticsEvent.CommunitiesListViewed, {
    communities_count: communities.length,
  })

  return (
    <FeatureGate feature="communities" orgslug={orgslug} context="public">
    <GeneralWrapperStyled>
      {genesisCommunity && (
        <section
          aria-labelledby="genesis-community-heading"
          className="relative mb-8 overflow-hidden rounded-2xl bg-slate-950 px-6 py-8 text-white shadow-lg sm:px-10"
        >
          <div className="pointer-events-none absolute -right-14 -top-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" aria-hidden="true" />
          <div className="relative z-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              AtlasClub Genesis
            </p>
            <h1 id="genesis-community-heading" className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
              A comunidade de quem constrói o futuro com IA.
            </h1>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
              Aprenda. Construa. Colabore. Transforme ideias em projetos AI-First e AI-Native.
              Apresente-se, participe na Missão 001 e partilhe o seu primeiro projeto.
            </p>
            <Link
              href={`/orgs/${orgslug}/community/${genesisCommunity.community_uuid}`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              Entrar na comunidade Genesis
            </Link>
          </div>
        </section>
      )}
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <TypeOfContentTitle title={t('communities.title')} type="col" />
          <AuthenticatedClientElement
            ressourceType="communities"
            action="create"
            checkMethod="roles"
            orgId={org_id}
          >
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              {t('communities.new_community')}
            </button>
          </AuthenticatedClientElement>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {communities.map((community: Community) => (
            <div key={community.community_uuid}>
              <CommunityCard
                community={community}
                orgslug={orgslug}
                org_id={org_id}
                variant="public"
              />
            </div>
          ))}
          {communities.length === 0 && (
            <div className="col-span-full flex flex-col justify-center items-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
              <div className="p-4 bg-white rounded-full nice-shadow mb-4">
                <Users className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
              </div>
              <h1 className="text-xl font-bold text-gray-600 mb-2">
                {t('communities.no_communities')}
              </h1>
              <p className="text-md text-gray-400 mb-6 text-center max-w-xs">
                <ContentPlaceHolderIfUserIsNotAdmin
                  text={t('communities.no_communities_description')}
                />
              </p>
              <div className="flex justify-center">
                <AuthenticatedClientElement
                  checkMethod="roles"
                  ressourceType="communities"
                  action="create"
                  orgId={org_id}
                >
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus size={16} />
                    {t('communities.new_community')}
                  </button>
                </AuthenticatedClientElement>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        orgId={org_id}
        orgSlug={orgslug}
      />

      {editingCommunity && (
        <EditCommunityModal
          isOpen={!!editingCommunity}
          onClose={() => setEditingCommunity(null)}
          community={editingCommunity}
          orgSlug={orgslug}
        />
      )}
    </GeneralWrapperStyled>
    </FeatureGate>
  )
}

export default CommunitiesClient

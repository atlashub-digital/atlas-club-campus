'use client'
import Link from 'next/link'
import { useLHSession } from '@components/Contexts/LHSessionContext'
import AdminAuthorization from '@components/Security/AdminAuthorization'
import AtlasPage from '@components/Atlas/AtlasPage'
import ContentOverview from './ContentOverview'
import RecentCourses from './RecentCourses'
import RecentMembers from './RecentMembers'
import UsageOverview from './UsageOverview'
import QuickStats from './QuickStats'
export default function DashboardHome() {
 const session = useLHSession() as any
 const username = session?.data?.user?.username
 return <AtlasPage title="Gestão do Campus" eyebrow="ATLAS CLUBOS · ADMINISTRAÇÃO" description={username ? 'Bem-vindo, '+username+'. Organize conteúdos, acompanhe membros e prepare os próximos percursos.' : 'Organize conteúdos, acompanhe membros e prepare os próximos percursos.'}>
  <AdminAuthorization authorizationMode="component"><div className="px-4 sm:px-10 max-w-[1440px] mx-auto space-y-6">
   <nav aria-label="Gestão Atlas" className="flex flex-wrap gap-3">{[['/dash/courses?new=true','Criar formação'],['/dash/courses','Conteúdos e edições'],['/dash/users/settings/users','Membros'],['/dash/org/settings/general','Configurações']].map(([href,label])=><Link key={href} href={href} className="rounded-lg bg-[#111c30] text-[#e0ba73] px-5 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600">{label}</Link>)}</nav>
   <ContentOverview/><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 space-y-6"><RecentCourses/><RecentMembers/></div><div className="space-y-6"><UsageOverview/><QuickStats/></div></div>
  </div></AdminAuthorization>
 </AtlasPage>
}

import Link from 'next/link'
import { getUriWithOrg } from '@services/config/config'

export default async function ThirdPartyLicenses({ params }: { params: Promise<{ orgslug: string }> }) {
  const { orgslug } = await params
  return <article className="max-w-3xl mx-auto px-6 py-12 text-[#172335]">
    <Link href={getUriWithOrg(orgslug, '/')} className="text-[#2856b4] underline">Voltar ao Campus</Link>
    <h1 className="text-3xl font-bold mt-8 mb-6">Licenças de terceiros</h1>
    <p className="leading-7">Atlas ClubOS é uma versão modificada do LearnHouse. Copyright e avisos dos autores originais estão preservados no código-fonte. O software é distribuído sob a licença GNU Affero General Public License v3.0 (AGPL-3.0), sem garantia, conforme seus termos.</p>
    <ul className="mt-6 space-y-4 text-[#2856b4] underline">
      <li><a href="https://github.com/atlashub-digital/atlas-club-campus">Código-fonte desta versão e histórico das modificações</a></li>
      <li><a href="https://github.com/atlashub-digital/atlas-club-campus/blob/main/LICENSE">Licença e avisos de copyright</a></li>
      <li><a href="https://github.com/learnhouse/learnhouse">Projeto de origem e seus autores</a></li>
    </ul>
  </article>
}

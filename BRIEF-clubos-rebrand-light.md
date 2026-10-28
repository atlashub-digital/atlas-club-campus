# BRIEF — Atlas ClubOS Light (rebranding de produto)

Missão P0. Leia tudo antes de tocar em código. Este ficheiro é o registo do que estás autorizado a fazer.

## Contexto

- Repositório: `/tmp/acc` (checkout de `atlashub-digital/atlas-club-campus`), branch de trabalho: **`feat/clubos-rebrand-light-v1`** (já criada a partir de `main` = `4db504e7`).
- Produto: fork do LearnHouse (LMS, Next.js + FastAPI + PostgreSQL) que serve o **Atlas ClubOS**.
- Produção: `https://app.club.atlashub.si` (NÃO tocar). Preview isolada: `https://uiv-preview.atlashub.si` (é onde o resultado será avaliado).
- A Direção **rejeitou** a direção visual dark/azul anterior. O PR #11 (CSS dark) fica como referência técnica apenas — **não continuar a via de CSS dark nem promover esse PR**.
- Referência de marca institucional: `club.atlashub.si`, mas a paleta escura do portal **não** é obrigatória para o Campus.

## Objetivo

Redesenho de produto real: Campus **claro, neutro e premium**, com identidade própria, navegação excelente e remoção do branding comercial do fornecedor. **Não é recolorir o LearnHouse.**

## 1. Direção de arte (obrigatória)

Base: `#FFFFFF` principal, `#F5F6F8` canvas, `#E3E7EC` linhas, `#172335` texto, `#667589` secundário. Azul `#3268D6` **cometido**: CTAs, foco, estado ativo — não em fundos nem painéis inteiros. Pode afinar tokens por contraste (mínimo 4.5:1 em texto normal).
Tipografia Inter ou Manrope (já disponível); hierarquia forte, grid 8px, espaçamento generoso, raios 10–16px, sombras discretas.
Sensação: plataforma de formação/comunidade moderna, editorial, leve, confiável — **não** landing dark SaaS.
Eliminar: wallpapers, gradientes decorativos, pseudo-overlays, regras globais `!important` que forçam `bg-white`/títulos, e o padrão `[class*="…"]` a varrer a app.

## 2. Logótipo (execução criativa, não genérica)

Prepara **3 rotas autorais** coerentes com AtlasHub (símbolo geométrico premium e distintivo; nada de imitar LearnHouse, robôs/globos genéricos ou texto pequeno junto de um símbolo existente).
Entregar por rota: logótipo horizontal, vertical, símbolo isolado, favicon, ícone de app (24/32/48), versões para fundo claro e escuro, **SVG vetorial** e um design rationale curto.
**Não bloqueies os primeiros ecrãs à espera de escolha**: implementa a rota mais promissora e deixa as outras duas documentadas e exportadas para a Direção escolher.
Caminho sugerido: `apps/web/public/atlas/brand/` + um `BRAND.md` com o racional.

## 3. UX / Navegação

Auditar e redesenhar as jornadas: Anónimo → Catálogo → Curso → Login/Convite → Aula → PDF/Vídeo/Quiz → Progresso; e Admin → Dashboard → Criar/editar curso → Publicar → Gerir membros.
- Header limpo com marca, navegação útil e **pesquisa funcional**; breadcrumbs, menu mobile completo, estados ativo/foco, back navigation, sidebar de curso, ações contextualizadas.
- Priorizar: `Início`, `Cursos`, `Biblioteca`, `Comunidades`, `Playgrounds`, `Minha aprendizagem`.
- **Sem botões mortos**, inglês aleatório, placeholders, avatares vazios ou opções Google/SSO não configuradas.
- Homepage como **Campus** (continuar aprendizagem, novidades/coleções, explorar por categorias, cards editoriais com thumbnails reais, estados livre/restrito sem fingir inscrições comerciais).
- Curso e VideoReader: **preservar** o iframe do YouTube e o fallback «Abrir no YouTube». PDF em painel claro. Quiz e progresso com estados de conclusão claros.
- Comunidades e Playgrounds: cards honestos, empty states de qualidade, onboarding funcional.
- Admin: tabelas e formulários legíveis e claros, **sem alterar RBAC**.

## 4. Branding: LearnHouse comercial → Atlas ClubOS

Remover **marca comercial/promocional** LearnHouse: logótipos visuais, assinaturas, marcas de água, links promocionais, nomes de produto, metadados visíveis, textos de interface, alt text, favicon e templates de e-mail operacionais.
**Manter obrigatoriamente** (e é crítico): copyright, licença **AGPL-3.0**, avisos jurídicos e acesso ao código-fonte, numa área discreta de **«Licenças de terceiros»** no app, sem apresentação promocional. Não prometer que adiar atribuição garante compliance. Não alterar o upstream original.

## 5. Restrições técnicas (duras)

- **Não** alterar a API, o motor LearnHouse, o esquema/BD, RBAC, permissões, endpoints, autenticação, media, quiz ou progresso. Nada de migrações.
- **Não** tocar em: `club.atlashub.si`, Master, ARO, GWD, `learnhouse-pilot.atlashub.si`, `clubos-p1.atlashub.si`.
- **Não** correr `docker build`, não mexer em `/srv/**`, não publicar em produção.
- **Não** fundir nem promover PRs. Podes abrir **um PR em DRAFT** contra `main`; não o marques como ready e não faças merge.
- Manter o padrão opt-in da marca (flag de build) para que outras instâncias LearnHouse não sejam afetadas — continua a existir um `NEXT_PUBLIC_ATLAS_CLUBOS_BRAND`.
- Textos de interface em **pt-BR**; preservar o que já está traduzido.
- Preferir componentes e tokens reutilizáveis a regras globais frágeis.

## 6. Verificação que tens de correr e reportar

- `npx tsc --noEmit` (ou `bun run typecheck`) e o lint web; unit tests se existirem e forem rápidos.
- Screenshots **reais** em **390 / 768 / 1440** por superfície redesenhada, antes e depois (antes = produção atual).
- Relatório de **acessibilidade e contraste** (WCAG 2.2 AA): navegação por teclado, foco visível, rácios.
- Confirmação dos critérios funcionais: Admin e Convidado; convidado **sem** acesso a gestão; PDF 200 autorizado / 403 anónimo; vídeo YouTube original com fallback; quiz 75% e Trail 4/4 preservados; invite-only; logout.

## 7. Entregável

Commits na branch `feat/clubos-rebrand-light-v1`, PR em DRAFT contra `main`, `BRAND.md` com as 3 rotas e racional, screenshots em `docs/clubos-rebrand-light/`, e uma secção explícita de **limitações/stubs** no corpo do PR (para a revisão distinguir o que é real do que está pendente).

## 8. Fallbacks pré-autorizados

- Se um ecrã não puder ser redesenhado sem tocar no motor: faz o mínimo necessário **na camada de apresentação** e di-lo nas limitações.
- Se a flag de marca impedir a coerência total: aplica o novo design sob a flag e nota o que fica fora.
- Se uma string pt-BR não existir na locale: adiciona-a em `apps/web/locales/pt.json` (não inventes textos de produto nem promessas comerciais).
- Se encontrares bloqueio real de contrato (ex.: interface contraditória), **pára e escreve a pergunta** no relatório final — não inventes.

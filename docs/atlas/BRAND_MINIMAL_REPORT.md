# Atlas Club — marca mínima

Base: `origin/main` em `4db504e7`. Branch: `feat/atlas-brand-minimal`.

## Auditoria e alterações

- Marca encontrada em assets PNG/SVG, favicon, menus desktop/mobile, editor, player, home, onboarding, erros, metadados de autenticação/administração/cursos, textos traduzidos e e-mails operacionais.
- 12 PNGs e os SVGs `lrn.svg`, `lrn-text.svg`, `lrn-dash.svg` agora usam o símbolo oficial `atlas/atlas-clubos-mark.svg`, com dimensões originais preservadas. Favicon ICO regenerado a partir desse símbolo. Removidos filtros de inversão que descaracterizavam as cores do logo.
- Nome comercial e alt texts passaram a Atlas Club. Metadados globais incluem nome da aplicação, título e favicon; autenticação tem títulos em pt-BR. As chaves de tradução, imports, tipos, formatos de exportação e identificadores internos foram mantidos.
- Autenticação mantém organização visual e fundos padrão. Removidos fundos especiais Atlas, classes do tema e mascotes adicionados na apresentação anterior. A imagem original `auth-default.png` não contém wordmark e foi preservada.
- `NEXT_PUBLIC_ATLAS_CLUBOS_BRAND=true` continua controlando os elementos de marca. O CSS escuro legado só carrega com **`NEXT_PUBLIC_ATLAS_CLUBOS_THEME=true`**, flag independente e desligada por padrão. Na preview, deixar essa segunda flag ausente ou `false`.
- E-mails: nome exibido do remetente padrão, textos traduzidos, logo embutido no backend e logo do template React usam Atlas Club. O template React usa o endereço de plataforma configurado para o PNG, com fallback para `app.club.atlashub.si`.

## Preservado

Copyright, atribuições LearnHouse e AGPL nas áreas jurídicas e LICENSE. Cursos, usuários, RBAC, APIs, progresso, quizzes, PDFs e vídeos não tiveram alteração de lógica. Homepage, organização dos componentes e navegação do main foram preservadas. Nenhuma alteração no PR #14, produção, DNS ou promoção de PR.

## Validação

- `tsc --noEmit`: passou.
- `bun test --isolate ./tests`: 476 passaram, zero falhas.
- ESLint completo: 24 erros e 887 avisos; os 24 erros já existem em `origin/main`, sem erros novos (comparação normalizando o caminho do checkout). Verificação adicional nos arquivos alterados.
- Testes de traduções dos e-mails: 20 passaram, incluindo placeholders e ausência de marca da plataforma em textos específicos de organizações. Executados isoladamente com pytest temporário, pois o ambiente não tem pytest instalado; a suíte completa do backend não foi executada.
- Dimensões dos 12 PNGs conferidas contra main; JSONs das traduções válidos; `git diff --check` passou.
- Sem browser, Playwright, Docker ou servidor Next.

## Limitações operacionais

Não foi feita inspeção visual em browser nem envio real de e-mails. URLs técnicas de serviços LearnHouse, integrações, identificadores de sessão e domínios de remetente/destinatário existentes foram mantidos para não mudar roteamento ou inventar credenciais. Configurar `RESEND_FROM_EMAIL` e os equivalentes do backend com domínio Atlas verificado no ambiente de envio. Conteúdo personalizado salvo no banco (nome/logo da organização ou textos próprios) permanece sob configuração da organização. A publicação dos assets e a disponibilidade do domínio configurado nos e-mails dependem do deploy; caches antigos podem precisar de atualização.

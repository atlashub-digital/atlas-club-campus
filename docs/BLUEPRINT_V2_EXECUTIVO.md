# ATLAS CLUBOS | BLUEPRINT EXECUTIVO V2.0
**Decisão:** 23/10/2026 · **Estado:** GO de desenvolvimento e full visual redesign; produção condicionada a gates.

## 1. Visão e fronteiras de produto
**Atlas ClubOS** é o campus digital e plataforma de gestão educativa/comunitária da AtlasHub. Marca e experiência próprias. O LearnHouse é fundação de LMS (cursos, editor, media, tarefas, progresso, certificados, discussões); a AtlasHub acrescenta identidade, direito de acesso, programas/edições, gamificação, eventos, comunidade expandida, projetos e Mentor Atlas.

**Fluxo:** canais sociais/WA/Discord → `club.atlashub.si` (portal público + landing/programas/events/campanhas/leads/free signup/ARO) → `app.club.atlashub.si` (Campus privado ClubOS).

**Plataforma institucional, não Genesis-only:** uma instituição inicial LearnHouse `atlas-club`; academias lógicas (AI, Business, Creators...), programas, edições/turmas, trilhas, cursos, aulas, projetos e espaços sociais. Conteúdo pode ser partilhado por referência/edição conforme regras, sem misturar avaliações e progresso entre turmas. Provar invariantes na instalação real.

**Identidade central** via Supabase AtlasHub Master UUID; **LMS data** em Postgres LearnHouse isolada; **cobrança** via ARO. O usuário pode possuir acessos Free, Genesis e futuros programas em paralelo. Não depender de logins LH separados. Preferir bridge server-side e SSO licenciado/suportado. Reconciliação de identidades baseada em UUID, não email.

## 2. Repos e ownership
- `atlashub-digital/atlashub-club` (existente): marketing, landing, comercial, acesso gratuito e checkout ARO no portal; preservar visual.
- `atlashub-digital/atlas-club-campus` (**novo, criar como privado sob a org**): derivado fiel do upstream `https://github.com/learnhouse/learnhouse`, manter história/upstream identificado. Conter `apps/web`, `apps/api`, `apps/collab`, `apps/cli` e implementações Atlas isoladas. Nenhum segundo LMS.
- `atlashub-digital/atlashub-finance` (existente): ARO, gestão de ofertas, checkout, pagamentos, entitlements.
- Repos extras: NÃO nesta wave. Identity Bridge e Club extensions pertencem inicialmente ao campus ou ao portal conforme limites de segurança. Se forem extraídos, justificar com ADR.
- Responsáveis: **Codex Cloud** único writer do campus por branch; Helena VPS, segredos, DNS, proteção shared; Work coordenação; GWD mantém equipa própria.

## 3. Arquitetura física
Internet Caddy VPS `app.club.atlashub.si` → proxy interno Atlas Campus Web / LearnHouse API / Collab, sem API/database/Redis expostos publicamente desnecessariamente. Rede Docker e volumes persistentes dedicados ao Campus, com health checks e limites reais após medição do host.
Staging segregado (hostname a aprovar por Helena), DNS/TLS validados e cookies separados da produção. Usar **instalador oficial LearnHouse/CLI e compose gerado**, sem substituir às cegas Caddy existente. Verificar quais serviços/portas upstream exige antes de alterar proxy.
DB LearnHouse: PostgreSQL dedicado (preferência container/volume próprio sob backups), Redis dedicado ou database lógico isolado com ACL; upload/media com volume/S3 compatível. Master Supabase só para Auth/Club Atlas; migrações LH jamais na Master produtiva. Guardar envs/secrets em gestor seguro/VPS, NUNCA GitHub.

## 4. Plano de produto (componentes)
- Home do membro: perfil, próximas ações, cursos recentes, progressão, agenda, notificações.
- Escolas/Academias: catálogo, percurso e filtros por áreas; programa pertence a academia lógica.
- Programas/edições: separação conteúdo vs edição; turma própria com instrutores, calendário, inscrição, entregas e atividades.
- LMS reutilizado: cursos, capítulos, atividades/blocos, assignments, discussões, colaborações e certificado quando previsto.
- Comunidade ampliada: espaços, moderação, posts, comentários, conteúdos partilhados, mentores; WA/Discord secundários.
- Eventos: ateliers online/presencial, RSVP, check-in, presenças validadas, replay e materiais.
- Gamificação Atlas: ledger imutável/idempotente de XP, badges/níveis por atividades verificadas; sem XP por simples pagamento e sem rankings involuntários de menores.
- Projetos: proposta, etapas, colaboração, evidência, mentorias, portfólio/showcase mediante consentimento.
- Atlas Companion: sugestão pedagógica/FAQ somente em conteúdo autorizado, sem exposição entre membros.
- Backoffice: administração de cursos, programas/turmas, espaços, eventos, moderação, acesso, suporte e métricas.

## 5. UX — personalização TOTAL do frontend
**Não apenas logo e paleta.** Redesenhar a experiência de descoberta, dashboard, barra lateral, pesquisa, cards, editor, player, assignments, discussões, calendários, perfis, permissões, áreas admin e estados vazios/erros, preservando acessibilidade. Idioma principal PT-BR.
Tokens Atlas: fundo azul-marinho profundo, superfícies luminosas contidas, acentos dourado/azul elétrico, marca triangular Atlas, grafismos premium; NÃO depender de fundos pesados, vídeo autoplay ou efeitos que comprometam desempenho. Responsivo 360→1920; prioridade ao mobile e leitura de aulas.
Design herdado das referências Atlas Club e assets canónicos, não inventar pessoas/depoimentos. Definir biblioteca de componentes e rotas; evitar copiar toda árvore de componentes upstream quando puder sobrepor theming/design; patches por arquivo rastreados para upstream merges. G4 exige 100% das telas **em escopo V1** com visual Atlas consistente; funcionalidades futuras não são falsamente anunciadas como prontas.

## 6. Identidade e autorização: contrato obrigatório
Master UUID ↔ LH user ID via tabela `club.identity_links` (na Master, migration controlada), com UNIQUE em ambas as pontas e mecanismos idempotentes, estado e timestamps. E-mail apenas atributo.
SSO opções: (A) Enterprise OIDC licenciado, (B) headless/API com tokens habilitados em self-host OSS/Pro licenciado, (C) adaptador específico tecnicamente/legalmente validado. **Não assumir que Supabase Auth é OIDC IdP plug-and-play**. Sem duplo login; sem desativar licenças/flags e sem expor tokens LH no browser.
Resolver acesso em backend, usando claims atualizados e ARO entitlement ACTIVE. Projeção de matrícula LH eventual consistente por reconciliação segura; repetição de webhook não duplica matrícula. Para revogações: invalidar caching/sessões de acesso a conteúdo pago no prazo contratual testado. Logout e suspensão propagados.
Testes: 2 usuários com Free/Genesis e academias diferentes, 1 com dois programas, 1 usuário menor com restrições; tentativas cross-user e cross-course negadas; alteração email não cria outra conta; matrícula repetida mantém um resultado; suspensão fecha acesso.

## 7. ARO e oferta Genesis
Portal atual deve corrigir divergências de copy/status antes de anunciar pagamento. No estado auditado, `/genesis/inscricao` 404 e CTA aponta a registo Free; tratar como backlog P0, não como prova de venda.
R$190 estudante mediante autodeclaração armazenada em backend, sem comprovativo; R$490 Standard; oferta, moeda e valor determinados pelo ARO, sem confiança no browser. ARO Hosted Checkout PIX → approved → entitlement `atlas-club:genesis-01` → cohort Genesis 01; pendente/falha/expirado não libera conteúdo. Webhook assinado + idempotência + polling server-side; retoma de checkout sem duplicação.
Refund: atendimento recebe pedidos; procedimento financeiro de refund é MANUAL e fora desta wave. Quando o ARO emite um estado REFUNDED/CHARGEBACK por evento externo/manual, ClubOS atualiza matrícula/direitos; o botão de executar refund não existe nesta fase.
Free: registo independente de ARO e com conteúdo/espaços de acesso limitado.
Dois ateliers extras em dezembro 2026 (um híbrido Anápolis+online e um online), NÃO contam nas 24 sessões Genesis de 9/01/2027; datas e local exato apenas após confirmação. Programa principal 8 semanas, 24 ateliers; não inventar horários/capacidade.

## 8. Programa piloto (não preso a Genesis)
Criar instituição Atlas Club, Academy IA → Genesis 01 / Genesis 02, Academy Creators → Programa Criadores Turma A. Conteúdo gratuito comum + recurso pago; um membro nos dois programas; segundo membro Free sem acesso indevido; edições distintas sem fuga de avaliações/progresso. Administrador cria curso novo via UI sem editar código. Testar media, aula, assignment, discussão, editor, certificação quando suportada, backup/restauro e multi-session.

## 9. Licença e sustentabilidade
LearnHouse upstream AGPL-3.0. Preservar atribuições e texto da licença. Publicar fonte correspondente quando exigido pelo uso de uma versão modificada sob AGPL; conduzir revisão legal para fronteiras de derivados/extensões e branding. Enterprise/Pro têm capacidades adicionais: não contornar verificação de features com engenharia reversa/patches ilícitos. Avaliar preço e SLA se SSO ou API forem essenciais. Não declarar fork proprietário fechado compatível por suposição.

## 10. Execução (waves em paralelo)
**W0 Engineering Foundation:** repo novo, upstream fixado, contêineres staging, Postgres/Redis separados, health, dump/restore, organização e dados seed do piloto. Ownership Codex, Helena provisiona infra.
**W1 Atlas Skin 100%:** UI Atlas full-scope sobre LearnHouse (dashboard, catálogo, editor, aula, feed/discussão, admin, perfil, mobile), progressive PRs; pode desenhar em paralelo a W0, merge técnico após provas funcionais.
**W2 Identity & Access:** bridge, SSO compatível/licenciado, autorização Free/Genesis, multi-programa, rotas portal→campus e logout.
**W3 ARO Enrolment:** integração financeira e matrícula via identidade, webhook/reconciliação, e-mail. O portal comercial mantém gate independente mais cedo possível.
**W4 Club Extensions:** eventos, gamificação, projetos, Atlas Companion, moderação e relatórios.
**W5 Release:** backups, restore, observabilidade, cargas, acessibilidade e release staging→produção homologado.

**Gates de release**: G0 motor educativo real; G1 identidade única; G2 multi-programa e progressos isolados; G3 ARO E2E; G4 full visual Atlas; G5 backup/restauro e operação; G6 produção com smoke real e rollback. Cada gate precisa SHA, screenshots, testes e critérios negativos.

## 11. Estratégia de branch e controlo
- Campus: `main` protegida, upstream `learnhouse/learnhouse` remoto, branch `feat/clubos-bootstrap`, depois `feat/clubos-design-system`, `feat/clubos-identity-bridge`, `feat/clubos-programs`, `feat/clubos-community` — um writer por branch.
- Portal: branches pequenas do repo original para checkout/landing quando autorizado, sem tocar código LearnHouse.
- Proibir force-push, push direto em main ou secrets commitados. CI: lints, typecheck, backend tests, smoke/E2E Playwright e upgrade regression. PR com screenshots 390/1440 px, status de licença e migrações.

## 12. Contabilidade de conclusões
**GO de desenvolvimento** não é **GO de pagamento público** nem **GO de Campus produtivo**. Não fingir deployment, SSO/checkout ou media ativo. Codex entrega evidência reproduzível; Helena comunica o que efetivamente foi provisionado e aprovado; Direção valida UI e liberação.

## 13. Infra e custos
Helena mede CPU, memória, disco livre, IOPS, redes Docker, portas, backups e dependências VPS antes de escolher host. Reservar recursos para Web+API+Collab+Postgres+Redis; definir S3/media e política de retenção. Sem métricas observadas, não publicar orçamento ou prazo como certeza. Proposta de monitoramento: uptime, erros 5xx, latency de aulas, jobs, DB, storage, signup→enrollment, DAU/WAU, finalização de atividades.

## 14. ADRs obrigatórias
ADR-01 Fork vs upstream mirror; ADR-02 modelo Postgres isolado; ADR-03 estratégia SSO/Auth; ADR-04 modelagem multi-programa/cohort; ADR-05 fronteira AGPL/Enterprise; ADR-06 mapeamento ARO→entitlement→matrícula; ADR-07 media gateway; ADR-08 estratégia de atualização upstream; ADR-09 segurança de conteúdo pago e revogação.

**Fonte técnica:** https://github.com/learnhouse/learnhouse · https://docs.learnhouse.app/self-hosting · https://docs.learnhouse.app/reference

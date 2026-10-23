# ATLAS CLUBOS
## Blueprint de Produto, Arquitetura e Implementação — V1.0

**AtlasHub.SI · Atlas Club · 22 de outubro de 2026**  
**Estado:** arquitetura de produto validada; implementação e integrações por homologar.  
**Direção:** uma plataforma educativa e comunitária própria, construída sobre o LearnHouse, com identidade e controlo de acesso AtlasHub.

> **Visão:** «Aprender juntos. Construir juntos. Fazer parte.» O Atlas ClubOS não será apenas a plataforma do Genesis. Será uma instituição digital extensível, que reúne academias, programas, turmas, comunidades, eventos e projetos, com diferentes públicos e direitos de acesso.

---

# 1. Decisões executivas fechadas

| Decisão | Contrato aprovado |
|---|---|
| Entrada pública | `https://club.atlashub.si` continua como portal institucional, editorial e comercial: landing pages, eventos, leads, Club Free e vendas Genesis via ARO. |
| Ambiente privado | `https://app.club.atlashub.si` passa a ser a aplicação de membros: **Atlas ClubOS**, com frontend LearnHouse personalizado. |
| Base de aprendizagem | Reutilizar LearnHouse (Next.js/React + FastAPI + PostgreSQL + Redis + colaboração Yjs); manter backend upstream sempre que possível. |
| Design | Refatorar layout, UX, componentes visuais, navegação, cores, marca e personalização por programa, preservando o motor de formação. |
| Identidade | **Supabase Auth da AtlasHub Master é a autoridade canónica de identidade**. Uma pessoa, uma identidade, vários programas e direitos. |
| Autorização | AtlasHub/ARO define direitos comerciais; ClubOS e LearnHouse aplicam matrículas e permissões; sem acesso por mero boolean do browser. |
| Comércio | ARO Hosted Checkout para PIX; estudante Genesis R$ 190 autodeclarado e Standard R$ 490. Sem motor de refund automático agora. |
| Entrada gratuita | Todos podem ingressar no Club Free com conteúdo e espaços limitados, sem pagamento nem obrigatoriedade de Genesis. |
| Organização educativa | **Uma organização LearnHouse inicial** (`atlas-club`), com múltiplos programas/cursos/trilhas/turmas. Genesis 01 é uma turma/programa entre outros. |
| Comunidade externa | Instagram/Facebook/TikTok/WhatsApp/Discord apoiam aquisição e conversação; o registo, progresso, conteúdos e direitos vivem no ClubOS. |
| Infraestrutura | VPS AtlasHub com Docker/Caddy e storage dimensionados, repos GitHub separados para portal e Campus, integração com Supabase Master e ARO existentes. |
| Desenvolvimento | Claude Code Opus 5.5 como executor de engenharia, Helena como responsável pela operação, gates e deploy. |

**Não decidido automaticamente:** licença Enterprise LearnHouse; viabilidade de API e SSO na edição OSS; localização física do banco LearnHouse; tamanho real da VPS; readiness de DNS/TLS; release exata a fixar. São gates técnicos antes de produção, não motivos para reconstruir todo o sistema.

# 2. Princípios de produto

1. **Instituição, não curso:** Genesis não pode ser o centro rígido da base de dados, da navegação nem do modelo de permissões.
2. **Um membro, várias pertenças:** o mesmo utilizador pode frequentar Genesis, uma Academy empresarial, uma turma de automação ou uma comunidade de projetos, gratuitamente ou mediante aquisição.
3. **Conteúdo reutilizável:** a mesma aula, recurso, template ou mentor pode alimentar cursos diferentes quando os responsáveis autorizarem. Uma turma conserva calendário, tarefas, progresso, instrutores e inscrições próprios.
4. **Separação de responsabilidade:** o portal converte; o ClubOS forma e envolve; a Master identifica e governa; o ARO cobra e resolve direitos; o LearnHouse gere conteúdo académico e progresso.
5. **Experiência integrada:** login único, navegação coerente, permissões verificáveis, linguagem PT-BR e identidade visual Atlas premium.
6. **Construir sobre o produto original, não lutar contra ele:** patches pequenos, separação de extensões, sincronização upstream e cobertura regressiva.
7. **Não prometer o que ainda é demonstração:** a interface só anuncia serviços ativos após evidências E2E.

# 3. Arquitetura de referência

```text
REDES SOCIAIS / WHATSAPP / DISCORD / PARCEIROS
                    |
                    v
+---------------------------------------------------+
| club.atlashub.si    PORTAL PÚBLICO / COMERCIAL     |
| Landing • Programas • Agenda • Leads • Club Free  |
| Seleção de oferta • ARO Hosted Checkout • CRM     |
+----------------------+----------------------------+
                       | Supabase Auth / entrada única
                       v
+---------------------------------------------------+
| app.club.atlashub.si     ATLAS CLUBOS             |
| Dashboard • Comunidade • Academia • Turmas         |
| Eventos • Projetos • Gamificação • Mentor Atlas   |
| UI LearnHouse refatorada + módulos Atlas           |
+--------------+----------------+-------------------+
               |                |
               v                v
      +----------------+  +-----------------------+
      | LEARNHOUSE     |  | ATLAS CLUB DOMAIN     |
      | FastAPI        |  | BFF/Bridge/API        |
      | cursos/aulas    |  | programas, grupos,    |
      | atividades      |  | eventos, XP, permiss. |
      | progresso       |  | e reconciliação       |
      +--------+-------+  +---------+-------------+
               |                    |
               v                    v
      +----------------+  +-----------------------+
      | LH POSTGRES    |  | SUPABASE MASTER        |
      | DB isolada     |  | Auth • club • CRM      |
      | ou schema      |  | identity_links • RBAC  |
      | validado       |  | access grants          |
      +----------------+  +-----------+-----------+
                                       |
                                       v
                               +-------------------+
                               | ARO               |
                               | Checkout PIX      |
                               | Entitlements      |
                               | Orders/Webhooks   |
                               +-------------------+
```

## 3.1 Domínios e serviços

| Domínio | Finalidade | Implantação |
|---|---|---|
| `club.atlashub.si` | Entrada, conversão e conta pública | Preservar repo `atlashub-digital/atlashub-club` e deploy Vercel atual. |
| `app.club.atlashub.si` | Campus / ClubOS membros | Novo repo `atlashub-digital/atlas-club-campus` (nome proposto), Docker na VPS. |
| `api.club.atlashub.si` | Opcional, só se uma API pública separada for necessária | Preferir proxy/BFF no mesmo origin de `app.club` em V1; não expor API interna desnecessariamente. |
| `aro.atlashub.si` | Hosted Checkout e autoridade financeira | Mantido sem alteração estrutural. |
| Endereço de staging | Preview do Campus/SSO, não público | Definir subdomínio de testes segregado e certificado; nunca partilhar cookies de produção. |

**DNS/TLS:** verificar registos e certificados reais; «pré-configurado» não equivale a ter um serviço respondendo corretamente. O Caddy já existente deve permanecer como único ponto de entrada 80/443 da VPS; o LearnHouse não deve subir um segundo proxy em conflito.

# 4. Modelo de universidade/ecossistema

## 4.1 Taxonomia funcional

```text
ATLAS CLUB (instituição / organização inicial)
 ├─ Academias / Escolas lógicas (camada de navegação Atlas)
 │   ├─ Atlas AI Academy
 │   ├─ Atlas Business & Operations
 │   ├─ Atlas Creators & Media
 │   └─ Academias futuras aprovadas
 ├─ Programas (ex.: Genesis, Automações, Criadores)
 │   ├─ Trilhas / Cursos
 │   │   ├─ Módulos
 │   │   │   └─ Aulas / Atividades / Exercícios / Recursos
 │   └─ Edições / Turmas (cohorts com calendário e matrículas)
 ├─ Comunidades e espaços temáticos
 ├─ Eventos e ateliers avulsos ou ligados a uma turma
 ├─ Projetos / Laboratórios / Portfólios
 └─ Conquistas e perfil transversal do membro
```

**Importante sobre licenças:** a edição comunitária LearnHouse opera inicialmente numa única organização. O **multi-org verdadeiro** de LearnHouse — várias organizações independentes com branding e isolamento próprios — é Enterprise. No ClubOS V1, «Academias» são divisões lógicas dentro de uma única organização; não dependem de multi-org Enterprise. Se no futuro vendermos infraestrutura para universidades terceiras isoladas, reavaliar licenciamento e tenancy.

## 4.2 Separar conteúdo, oferta, edição e acesso

- **Curso** = conteúdo curricular reutilizável; não representa uma compra.
- **Programa** = composição de cursos/trilhas, objetivos e condições de participação.
- **Edição/Turma** = grupo concreto com datas, facilitadores, lotação, agenda, tarefas e acompanhamento.
- **Oferta comercial** = código/preço/moeda/metodologia de cobrança no catálogo ARO.
- **Matrícula** = associação do utilizador à edição/turma, criada quando a regra de acesso é satisfeita.
- **Permissão/entitlement** = autorização para uma área, curso, turma, evento, recurso ou serviço.
- **Grupo/comunidade** = espaço de socialização, não equivalente a curso ou turma.

Exemplo: uma pessoa compra Genesis Turma 01 em outubro, frequenta dois ateliers adicionais em dezembro, inicia aulas em janeiro e também participa gratuitamente no espaço Atlas Creators. Os dois ateliers de dezembro não contam para as 24 sessões da edição Genesis e a compra não altera os direitos de outros programas.

## 4.3 Conteúdos partilhados

Identificar conteúdos por ID estável, proprietário, licença, versão, tags e visibilidade. Referências do mesmo recurso podem aparecer em programas diferentes, sem duplicar arbitrariamente media. Para grupos que necessitem de avaliações e progresso independentes, criar instâncias pedagógicas por turma, mas preservar ligação ao recurso canónico. A granularidade exata será validada contra os modelos nativos de LearnHouse antes de adicionar tabelas customizadas.

# 5. Identidade global, SSO e sincronização entre DBs — GATE CRÍTICO

**Identificador-mestre:** `auth.users.id` (UUID) do Supabase AtlasHub. O e-mail é atributo mutável, nunca chave de ligação primária entre sistemas. Supabase Auth autentica; a autorização decorre de roles/membership e entitlements de servidor.

## 5.1 Fluxo desejado

1. Pessoa regista-se ou entra no portal atual via Supabase Auth (OTP/PKCE/Turnstile/consentimentos).
2. Ao abrir `app.club.atlashub.si`, um **Atlas Identity Bridge** valida a sessão AtlasHub no servidor.
3. Resolve/atualiza ligação `master_user_id -> learnhouse_user_id`, criando utilizador LearnHouse apenas quando necessário (JIT provisioning), de forma idempotente.
4. Obtém um mecanismo de sessão de LearnHouse suportado e autorizado pelo produto; nunca reutiliza JWT Supabase como se fosse JWT LearnHouse sem verificação adequada, nem partilha secrets indiscriminadamente.
5. Consulta direitos globais e matrículas atribuídas; projeta no Campus cursos/áreas visíveis.
6. Logout, suspensão, remoção de conta e mudança de email são reconciliados. A sessão LearnHouse não pode continuar a conceder conteúdo pago após revogação relevante.

## 5.2 Rotas possíveis para integração

| Via | Benefício | Condição / risco |
|---|---|---|
| **A. Enterprise Custom OIDC** | Integração formal de SSO e provisionamento | Exige licença Enterprise e um IdP OIDC suportado. Supabase Auth, por si só, não deve ser presumido um provedor OIDC pronto; validar broker/IdP. |
| **B. APIs headless com tokens `lh_`** | Provisionamento, matrículas e token delegado no backend | A documentação classifica emissão de API tokens como Pro; testar legalmente o que existe no OSS self-hosted. Não presumir disponível. |
| **C. Adaptador de autenticação mantido por nós** | Controlo total sobre o login único | Patch limitado no LearnHouse, revisão técnica e jurídica AGPL, testes de upgrade, revogação e CSRF. Nunca contornar restrições da edição Enterprise por flags falsas. |

**Critério obrigatório:** login sem segundo cadastro/senha, provisionamento idempotente, logout e revogação demonstrados com contas diferentes em navegador real. Se nenhuma via estiver aprovada, Campus permanece staging; não lançar experiência com duas identidades independentes.

## 5.3 Contrato da identidade (proposta Atlas)

`club.identity_links(master_user_id UUID UNIQUE, learnhouse_user_id TEXT UNIQUE, created_at, last_synced_at, status, source)`.

`club.memberships(master_user_id, scope_type, scope_id, role, status)` para papéis em academia, programa, turma, comunidade e projeto. Nem todos os membros são alunos pagos, e a mesma pessoa pode ter vários papéis.

Regra: identidade canónica no Auth, roles e consentimentos na Master, registos pedagógicos no LearnHouse. Sem duplicar passwords nem copiar todas as PII entre bases.

# 6. Permissões e catálogo de acesso

## 6.1 Níveis independentes de funções

| Tipo | Exemplo | Regra |
|---|---|---|
| Acesso base | Club Free | Acesso a dashboard, comunidade Free, recursos abertos e Missão 001. |
| Direito adquirido | Genesis 01 | ARO retorna entitlement `atlas-club:genesis-01` ACTIVE e autoriza a matrícula na turma correspondente. |
| Direito atribuído | Bolsa, convite, staff | Grant criado no backoffice com autor, justificação, âmbito e expiração. |
| Papel | Aluno, Mentor, Moderador, Admin, Suporte | Permite ações dentro de um âmbito; não implica acesso a compras alheias. |
| Visibilidade | Público, Club Free, grupo, turma, restrito | Avaliada no servidor sobre recurso + identidade + contexto. |

Modelar acesso como interseção de **identidade verificada, recurso, scope, tipo de permissão e estado**, não por um campo booleano `is_genesis_student`. Os claims cacheados têm expiração curta; mudança de direito deve invalidar acesso à API/recursos sensíveis.

## 6.2 Múltiplas compras

Uma pessoa pode ter entitlements para Genesis 01, Formação Criadores e um atelier avulso. O mecanismo não deve introduzir dependência artificial entre estas ofertas. Benefícios Free continuam mesmo que um produto pago expire; refunds manuais ou chargebacks revogam só o direito aplicável, segundo política publicada.

# 7. Bases de dados — decisão condicionada por prova

## 7.1 AtlasHub Master (obrigatória)

Projeto Supabase canónico `aakdyumavlzgyklbrsrw`: Auth, perfil transversal, consentimentos, CRM, identidades ligadas, papéis/autorizações Atlas, propostas/programas institucionais, eventos e regras de acesso. O schema `club` existente é preservado e evoluído por migrações pequenas com RLS e provas de isolamento. Não mexer em `auth.users` global para limpeza de dados do Club.

## 7.2 Base LearnHouse (isolada logicamente)

LearnHouse utiliza PostgreSQL 16, pgvector, SQLModel e Alembic, e mantém contas técnicas, cursos, capítulos, atividades, progresso e colaboração. **Não presumir** que as migrações padrão podem ser instaladas diretamente na `public` da Master sem risco.

- **Opção 1, a testar:** mesmo projeto Supabase Master, schema dedicado `learnhouse` com role restrita e `search_path` específico, migrações Alembic auditadas, extensão pgvector, grants mínimos e nenhum conflito com schemas existentes. Usar primeiro clone/staging da Master; nunca executar Alembic não revisado na produção.
- **Opção 2, fallback operacional preferencial se houver qualquer risco de acoplamento:** Postgres 16 `learnhouse` em container/volume próprio na VPS (ou projeto Supabase dedicado), mantendo Master como autoridade de identidade e direitos. Sincronização apenas por APIs/eventos e IDs estáveis.

**Critério de escolha:** upgrade suportado, isolamento de migrações, backup/restore, segurança, desempenho e facilidade de suporte. Partilhar a mesma infraestrutura física não obriga a partilhar o mesmo esquema lógico.

## 7.3 Consistência intersistemas

Não haverá transações SQL atómicas entre Supabase Master, ARO e LearnHouse. Usar **outbox/inbox de eventos, identificadores de operação, idempotência e reconciliação periódica**. Guardar na Master uma projeção mínima do estado de matrícula com link para os IDs LearnHouse/ARO, e não uma réplica integral da base pedagógica. As falhas de sincronização entram numa fila reprocessável, com alertas e logs sem PII.

# 8. VPS e topologia Docker

## 8.1 Serviços propostos

- `clubos-web` — Next.js frontend LearnHouse com branding Atlas.
- `clubos-api` — FastAPI LearnHouse upstream.
- `clubos-collab` — Yjs/Hocuspocus, apenas se quadros/edição colaborativa entrarem na wave.
- `clubos-redis` — cache/sessões/pubsub; namespace e credenciais próprios.
- `clubos-postgres` — apenas na Opção 2 de base de dados.
- `clubos-bridge` — Atlas Identity/Enrollment Bridge: BFF, IAM, ARO e integrações.
- `clubos-worker` — outbox/inbox/reconciliação/notificações quando necessárias.
- `clubos-monitoring` — healthchecks, métricas e alertas por stack partilhada.
- `Caddy` já existente — único reverse proxy público, rede Docker interna dedicada, TLS e proteção de headers.

A documentação LearnHouse indica mínimo de **2 GB RAM, 1 vCPU, 10 GB**, recomendando **4 GB RAM, 2+ vCPU, 20 GB+**, para a própria aplicação. Como a VPS já aloja outros serviços, não usar os mínimos como prova de capacidade. Inventariar memória livre, CPU, disco, IOPS, backups, tráfego e contentores atuais; reservar headroom para build e picos. Conteúdos vídeo devem usar object storage/media gateway, não acumular os originais no disco do container.

## 8.2 Regras de deploy

1. Nada de container privilegiado, root Docker exposto ou banco público em 5432.
2. Versionar Compose, imagens fixadas por tag/digest, variáveis por secrets da infraestrutura, volumes persistentes e políticas de restart.
3. Caddy faz reverse proxy de `app.club.atlashub.si`; API/collab sob paths/ou origens explicitamente permitidas conforme documentação da versão instalada.
4. Staging e produção com dados/secrets separados; migrações testadas e backup validado antes de deploy.
5. Health checks separados para Web/API/DB/Redis/Collab/Bridge; scripts de smoke após deploy.
6. Comunicação entre `club.atlashub.si` (Vercel), Supabase e Campus (VPS) sobre HTTPS, com cookies `Secure`, escopo restrito e CORS mínimo.
7. Logs, métricas, retenção, alarmes e controlo de custos ativados antes da abertura pública.

# 9. Organização do GitHub e do trabalho com Claude Code Opus 5.5

## 9.1 Repositórios

| Repositório | Proprietário funcional | Política |
|---|---|---|
| `atlashub-digital/atlashub-club` | Portal público, cadastro, checkout, SEO, campanhas, CRM | Manter código e deploy atuais, sem migrar o portal para dentro do LearnHouse. |
| `atlashub-digital/atlas-club-campus` **(proposto)** | Fork rastreável do LearnHouse, UI Atlas, API e collab | Preservar remotos `origin` Atlas e `upstream` LearnHouse; base pinada em versão/tag homologada. |
| `atlashub-digital/atlashub-finance` | ARO / checkout/entitlements | Não duplicar motor de pagamentos no Campus. |
| `atlas-ops` ou docs canónicas aprovadas | Decisões, gates, deploys, incidentes | Helena mantém registo operativo e inventário de sistemas. |

O `clubos-bridge` poderá ser pacote dentro do campus na primeira fase; separá-lo num repo próprio apenas se ciclo de release, isolamento ou reutilização justificarem.

## 9.2 Estratégia de branch

- `main`: releases aprovadas; branch protegida.
- `upstream/<release>`: referência intacta de LearnHouse para atualização.
- `feat/clubos-brand-v1`: personalização de UI.
- `feat/clubos-identity-bridge`: sessão única/provisionamento.
- `feat/clubos-aro-entitlements`: projeção de direitos/matrículas.
- `feat/clubos-program-model`: programas/turmas/reutilização de conteúdos.
- `feat/clubos-community-extensions`: elementos Atlas fora do core LearnHouse.

Uma branch, um writer principal, PRs pequenos, CI verde, evidências visuais e migrações rastreáveis. O Claude Code pode codificar, testar e preparar PRs; **Helena controla infraestrutura, segredos, revisão de migração, release e rollback**. Não usar `git push --force`, merges cegos, alteração em massa de licenças ou patch direto em produção.

## 9.3 Artefactos canónicos a criar no repo

`docs/00_BLUEPRINT.md`, `docs/01_UPSTREAM_LICENSE_AUDIT.md`, `docs/02_ARCHITECTURE_ADRs.md`, `docs/03_IDENTITY_AND_ACCESS_CONTRACT.md`, `docs/04_ARO_ENROLLMENT_CONTRACT.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/06_DESIGN_SYSTEM_HANDOFF.md`, `docs/07_DB_AND_MIGRATION_PLAN.md`, `docs/08_VPS_DEPLOY_RUNBOOK.md`, `docs/09_E2E_QA_MATRIX.md`, `docs/10_RELEASE_ROLLBACK.md`, `docs/11_PROGRAMS_GENESIS_SAMPLE.md`.

# 10. Design System e experiência ClubOS

**Prioridade de execução:** personalização visual com baixo impacto no backend LearnHouse.

1. **Tokens Atlas:** fundo grafite/azul profundo, dourado pontual, tipografia e escala coerentes com o portal, superfícies premium, acessibilidade WCAG AA.
2. **Navegação:** Início · Comunidades · Aprender · Programas · Turmas · Eventos · Projetos · Conquistas · Perfil; Administração visível só a funções autorizadas.
3. **Shell membro:** sidebar desktop, bottom/tab navigation mobile, pesquisa, breadcrumbs, notificações, seleção de contexto e ação «Continuar a aprender».
4. **Home personalizada:** próximos ateliers, aulas em curso, missões pendentes, propostas de comunidade, novos conteúdos e progressos reais.
5. **Curso:** player, módulos, atividades, tarefas, comentários, progresso e recursos com identidade Atlas; reutilizar componentes da plataforma, evitando alterar regras internas.
6. **Turma:** espaço próprio com calendário, mentores, materiais e mural de discussão; um mesmo utilizador muda de turma sem novo login.
7. **Estado Free:** dashboard real, conteúdos livres, comunidade de entrada e amostras; bloqueios pagos explicados com CTA para oferta, nunca páginas vazias.
8. **Backoffice:** ambiente de operação visualmente coerente mas orientado à eficiência: cursos, professores, turmas, acesso, suporte, eventos, campanhas.
9. **Conteúdos e marketing:** os visuais validados do Club constituem a fonte de inspiração; não usar imagens geradas aleatoriamente como substitutos de artes homologadas.
10. **Experiência transversal:** PT-BR inicialmente, preparado para PT-PT/EN; teclado, leitores de ecrã, responsivo 360–1920 px, loading/erro/empty states; nunca permitir falso progresso.

A dimensão «universidade» pode existir na arquitetura de informação sem exigir um novo motor multi-instituição no primeiro release. Cada Academy é um agrupamento editorial e de acesso dentro do Club Atlas.

# 11. Funcionalidades do ClubOS por domínio

| Domínio | Utilizar LearnHouse quando possível | Extensão Atlas complementar |
|---|---|---|
| Academia | Cursos, capítulos, atividades, editor, submissões, certificados, progresso | Taxonomia academias/programas/edições e roteamento por identidade Atlas. |
| Comunidade | Discussões, comentários, reações e grupos | Feed geral de membros, espaços por projeto, moderação transversal e diretório opt-in. |
| Eventos | Atividades/sessões educativas existentes | RSVP, lotação real, presenças, híbrido Anápolis+online, QR check-in, calendário. |
| Gamificação | Progresso e tarefas verificados | `xp_events` idempotentes, níveis, badges, missões e rankings opcionais. |
| Projetos | Boards colaborativos e tarefas | Workspace de projeto, portfólio, equipa e apresentação pública consentida. |
| Mentoria | Recursos pedagógicos/IA do LearnHouse | Mentor Atlas como experiência separada, com contexto permitido e handoff humano. |
| Comunicação | Notificações educativas | Clara/Atendimento.Center, WhatsApp, Discord, e-mail consentido, notificações de comunidade. |
| Analytics | Progresso e conclusão do curso | Ativação, retenção, funil Genesis, inscrições, contribuição comunitária. |

## 11.1 Gamificação governada

XP apenas por ação verificável (aula+atividade, presença, evidência de missão, contribuição útil aprovada). Eventos têm ID idempotente, autor, recurso, regra e reversão auditável. Não premiar pagamento, spam ou login diário automático. Menores sem ranking público; ranking geral opt-in. Progressão proposta: Explorador → Aprendiz → Construtor → Colaborador → Mentor; o rótulo de nível não concede automaticamente permissões de moderador ou mentor.

# 12. Fluxo financeiro Genesis e novos produtos

**Contrato de lançamento:** Genesis R$ 190 estudante autodeclarado / R$ 490 standard, PIX via ARO. A aplicação LearnHouse não cobra; as ofertas e valores vêm do ARO canónico. Menores de idade exigem autorização do responsável para comprar, sem prova documental de estudante.

```text
LANDING GENESIS → CLUB AUTH → ESCOLHA DE OFERTA
→ declaração estudante (apenas opção de R$190) + termos de compra
→ Atlas BFF assina pedido/claim para ARO Hosted Checkout
→ checkout PIX hospedado → ARO PENDING / APPROVED / FAILED
→ webhook ARO assinado + reconciliação por API
→ matrícula Club → provisionamento em curso/turma LearnHouse
→ access active → email transacional → «Continuar no Campus»
```

## 12.1 Máquina de estados proposta

`INTERESTED -> ENROLLMENT_INITIATED -> PAYMENT_PENDING -> PAID -> PROVISIONING -> ACTIVE`.

Ramos: `PAYMENT_FAILED`, `EXPIRED`, `PROVISIONING_RETRY`, `ACCESS_SUSPENDED`, `CANCELED`. Apenas ARO pode confirmar `PAID`; matrícula pode permanecer `PROVISIONING_RETRY` sem perder transação. A declaração de estudante é armazenada no servidor com versão do aceite e timestamp, sem documento nem aprovação humana.

## 12.2 Identificadores e consistência

Chaves: `master_user_id`, `offer_code`, `order_id`, `checkout_link_id`, `ARO_event_id`, `entitlement_key`, `learnhouse_user_id`, `learnhouse_course_id`, `cohort_id`. Repetição de webhook ou refresh não duplica compra, concessão de acesso ou matrícula. URL e cookies nunca devem transportar secretos ARO em claro.

## 12.3 Reembolsos manuais — fora do motor V1

O serviço ao cliente recebe o pedido, confirma política aplicável e efetua o procedimento manual no sistema financeiro autorizado; não criar botão/endpoint de refund no ClubOS agora. Contudo, quando o ARO comunicar `REFUNDED`/`CHARGEBACK` de operação efetiva, a projeção de acesso tem de ser reconciliada e o entitlement revogado ou ajustado conforme contrato. O histórico permanece auditável.

**Alerta da auditoria anterior:** o portal público anunciou «Inscrições abertas» sem prova de matrícula final; o PR #30 da lógica paga estava por integrar, a rota `/genesis/inscricao` tinha 404 e o catálogo da Clara continuava antigo. Tratar isto como P0 paralelo, não ocultar com a migração ClubOS.

# 13. Modelo de acesso Free e políticas editoriais

| Segmento | Entrada | Acessos sugeridos |
|---|---|---|
| Visitante | Público | Landings, eventos públicos, programa e conteúdos de amostra. |
| Membro Free | Supabase Auth | Campus básico, apresentação, comunidade aberta, Missão 001, recursos livres e eventos marcados Free. |
| Estudante Genesis | ARO R$190 + autodeclaração + regras de idade | Direitos da turma Genesis contratada, recursos pagos e ateliers elegíveis. |
| Standard Genesis | ARO R$490 | Mesmos direitos da edição Genesis, sem diferenciação pedagógica arbitrária. |
| Participante de outro programa | Oferta/grant aplicável | Só programas, conteúdos e turmas adquiridos ou atribuídos. |
| Mentor | Convite por administrador | Turmas/projetos atribuídos, feedback e avaliação dentro do âmbito. |
| Moderador/Suporte | Autorização administrativa | Moderação, suporte e casos consentidos; não acesso irrestrito às compras ou dados globais. |
| Admin Atlas | Acesso privilegiado auditado | Gestão de programas, áreas, papéis e configuração operacional. |

As opções de comunicação de WhatsApp/Discord são voluntárias, com consentimento e regras de privacidade; nunca serem a única forma de aceder ao curso adquirido.

# 14. Gestão académica e backoffice

O painel editorial deve permitir: criar Academias lógicas, programas, cursos e edições; associar conteúdos partilhados; atribuir mentores; publicar aulas; definir condições Free/Paid; controlar turmas/lotação; organizar encontros presenciais e remotos; conferir presenças; moderar fóruns; emitir certificados sujeitos a conclusão real; receber alertas de integrações; visualizar funil de conversão e solicitações ao suporte.

**Necessidade transversal:** datas, língua, capacidade, preços e estado de publicação não devem ficar hardcoded num único componente `genesis`. Genesis é um registo de programa/edição e pode ser replicado como nova turma sem copiar o projeto inteiro.

# 15. Regras de licença, propriedade intelectual e manutenção upstream

O repositório LearnHouse Community usa **AGPL-3.0**. A utilização comercial e personalização são possíveis, mas um serviço de rede baseado em versão modificada normalmente exige disponibilizar o código-fonte correspondente dessa versão aos utilizadores, nos termos da licença. Preservar avisos, atribuições e histórico de alterações; não «remover o open source» renomeando o projeto. Componentes e serviços Atlas separados exigem análise de interação/derivação — não presumir que uma separação de repositórios elimina obrigações.

**Enterprise:** multi-org, SSO nativo e determinadas funções comerciais/auditoria estão condicionados por licença. Não usar flags de modo SaaS ou patches para contornar controlos comerciais. Se precisarmos de SSO nativo licenciado, orçamentar licença ou uma solução juridicamente aceite. Solicitar revisão jurídica antes do go-live de fork modificado.

**Upstream:** pin da release auditada, matriz de patches Atlas, PRs pequenos e merge periódico de correções. Testes de regressão em autenticação, editor, progresso, API, collab, cache, upload e migrações; patches privados internos não substituem obrigações AGPL aplicáveis.

# 16. Sequência de implementação e gates

## Gate G0 — levantamento / prova de conceito / licença (antes do fork produtivo)

- Confirmar VPS alvo, acesso SSH seguro via Helena, espaço livre, CPU/RAM, Caddy, rede, backups, DNS/TLS e domínio `app.club`.
- Pin LearnHouse em release estável testada, gerar SBOM, inventariar dependências e licenças; comparar estabilidade com upstream `dev` sem implementar na `dev` por defeito.
- Subir OSS em Docker isolado, criar um curso simples e duas contas de teste sem dados reais.
- Testar métodos de integração `lh_` e/ou OIDC/adapter na **edição efetivamente licenciada**, sessão única, JIT, logout e remoção/revogação.
- Testar DB em schema dedicado em clone da Master, Alembic/pgvector/upgrade/rollback; decidir formalmente opção DB.
- Decisão registrada: **GO fork+bridge**, **GO Enterprise/SSO**, ou **NO-GO** para esta base e revisão de alternativa.

## Gate G1 — pagamentos Genesis E2E em paralelo, sem esperar pelo Campus

- No repo portal atual, acabar fluxo Genesis/ARO da issue #29 e corrigir os textos desalinhados.
- Catálogo ARO Student + Standard com preço canónico; PIX real controlado; webhook idempotente; matrícula/reconciliação sem duplas cobranças.
- Se o Campus ainda não estiver aberto, associar entitlement à identidade Atlas e guardar intenção de provisionamento; não prometer acesso imediato ao curso antes de existir onboarding básico.
- Refund manual via atendimento, com leitura de estado/reflexo no acesso.

## Gate G2 — campus visual Atlas (primeira entrega experiencial)

- Fork pinado, pipeline Docker/CI, marca, tokens, tipografia, menus, dashboard, catálogo e páginas de aula adaptados à identidade do portal.
- Layout institucional com Academias/Programas/Turmas; primeira edição Genesis e pelo menos uma edição fictícia distinta para provar que não é sistema hardcoded.
- QA desktop/mobile e acessibilidade; preservar engine de cursos e editor.

## Gate G3 — identidade central e acesso

- Implementar bridge autenticada; mapping UUID↔ID LearnHouse, reconciliação idempotente; Free e Genesis, dois browsers, logout, bloqueio de acesso, mudança de e-mail.
- Verificar fontes de autoridade e roles: o LearnHouse nunca concede acesso pago porque o utilizador alterou UI, cookie ou endpoint.
- Auditoria entre contas; carga leve/erros; recuperação sem perda de progresso.

## Gate G4 — academia mult programa, comunidade e eventos

- Conteúdos, edição de turmas, grupos, discussões, partilha controlada de materiais, calendário, RSVP/presenças, dois ateliers extras de dezembro e programa principal de janeiro separados.
- Membro Free e alunos de dois programas coexistem sem cruzamento de conteúdos restritos.

## Gate G5 — gamificação / projetos / agentes

- Missão 001 real, XP ledger, badges, projetos, portefólio, Mentor Atlas com contexto restrito e suporte humano. Integrações Discord/WhatsApp permanecem complementares.

## Gate G6 — homologação e cutover público

- Regressão integral, backup/restore, teste de falhas, healthcheck, revogação, performance, segurança, licença, documentação, onboarding e comunicação.
- Ativar campus com tráfego limitado e membros de teste; observar; escalar após aprovação. Não redirecionar todos os membros de uma só vez sem rollback.

# 17. Matriz E2E mínima de aceitação

| Percurso | Esperado |
|---|---|
| Novo Free | Regista-se uma vez, entra no ClubOS e vê recursos gratuitos reais. |
| Free tenta Genesis | Conteúdo pago inacessível, CTA comercial correto. |
| Student autodeclarado | Paga R$190 sem documento, recebe apenas entitlement e matrícula da edição correta. |
| Standard | Paga R$490 e recebe exatamente o mesmo percurso Genesis. |
| PIX pendente/expirado | Sem desbloqueio antecipado; retoma correta, sem duplicação. |
| Webhook duplicado/fora de ordem | Uma matrícula e um grant coerentes, eventos auditáveis. |
| Clube e Campus | Uma sessão federada, sem segunda senha; logout coerente. |
| Membro em dois programas | Vê dois percursos, progressos independentes e conteúdo partilhado apenas quando autorizado. |
| Mudança de email | Mapping mantém UUID, não cria utilizador duplicado. |
| Reembolso manual/chargeback efetivo | ARO regista alteração e entitlement/curso sincronizam no estado aplicável. |
| Menor | Condição estudante declarativa não substitui autorização de responsável. |
| Missão/XP | Progresso e pontos reais; replay não duplica conquista. |
| Backoffice | Admin publica conteúdo e atribui mentores; moderador não acede a finanças. |
| Resiliência | Falha ARO/LH/API gera retry sem cobranças duplicadas ou fuga de dados. |
| Responsivo e acessível | Desktop + 390px, teclado, WCAG AA, estados vazios e erros legíveis. |

# 18. Observabilidade, qualidade e métricas

- **Funil:** origem → visita Genesis → signup started/completed → checkout link created → PIX created → approved → entitlement active → campus activated → primeira aula/atividade.
- **Engagement:** MAU/WAU, membros que completam onboarding, participam na comunidade, completam Missão 001, presenças, retenção 7/30 dias, progressos por programa.
- **Plataforma:** uptime, tempo de resposta, saturação CPU/RAM, Redis, latência DB, falhas de sincronização, jobs pendentes, erros de vídeos/storage, exceções de login e rate limits.
- **Governança:** consentimentos, pedidos de privacidade, taxa de moderação, acesso de menores, evidência de cancelamento e suporte.
- **Privacidade:** logs e eventos anonimizados ou minimizados; não enviar conteúdos pessoais ou dados de pagamento para analytics externos sem base legal.

# 19. Riscos e mitigação

| Risco | Impacto | Resposta |
|---|---|---|
| SSO/API tokens não disponíveis no OSS | Alto | Gate G0 real; avaliar Enterprise Custom OIDC ou adapter licenciado e testado. |
| Fork longo divergente do upstream | Alto | Branding maioritariamente frontend, patch ledger, sincronização periódica e regressão. |
| Alembic danificar Master | Crítico | Clone DB, diff de migrations, schema/role isolados; fallback DB própria. |
| Mistura de programas e turmas | Alto | Objetos separados, policies por scope, testes entre alunos. |
| Vendas ativadas antes da matrícula | Crítico | G1 transacional sem dependência do Campus; comunicação alinhada e fail-closed. |
| VPS insuficiente ou storage local saturado | Médio/Alto | Inventário e margem, media em object storage, backups e alarmes. |
| Reembolso manual não refletido em acesso | Alto | Ingestão de estados ARO + reconciliação e operação de suporte. |
| Conteúdo licenciado AGPL sem conformidade | Alto | Revisão jurídica, avisos, correspondente source, opção EE comercial. |
| WhatsApp/Discord usados como base de verdade | Médio | Persistência canónica no ClubOS; integrações externas opcionais. |
| Claude altera produção sem revisão | Alto | PRs, branch protections, segredos geridos pela Helena, gates e rollback. |

# 20. Responsabilidades

**Direção AtlasHub (fundador):** decisões de produto, identidade visual, preço, programa, orçamento/licença, critérios de aceitação e autorização de abertura.

**Helena — Operations Lead:** inventário da VPS, DNS/TLS, Docker/Caddy, secrets, backups, testes de ambiente, validação de acesso Master/ARO, coordenação de deploy, observabilidade, rollback e parecer final GO/NO-GO.

**Claude Code Opus 5.5 — Engineering Lead de execução:** leitura do upstream, relatório de licença/compatibilidade, plano ADR, fork e branches, refactor visual, BFF/bridge, integração LearnHouse/API, testes e PRs. Não alterar o core LearnHouse onde uma extensão ou configuração já resolva.

**AMF / Design:** maquetes aprovadas, tokens, copy e componentes visuais; conteúdo educativo e multimédia Genesis/novos programas.

**Clara / Suporte:** informação comercial sincronizada, orientação do membro e processo manual de pedidos de reembolso; nunca autorizar acesso só por mensagem ou comprovativo.

# 21. Pacote de instruções para Claude Code Opus 5.5

**MISSÃO 0 — DISCOVERY, SEM ALTERAÇÕES DE PRODUÇÃO**

1. Clonar e fixar LearnHouse num release tag verificável, sem usar `dev` como release automática. Fazer análise da licença e dos componentes Community/Pro/Enterprise efetivamente presentes.
2. Auditar a estrutura de `apps/web`, `apps/api`, `apps/collab`, CLI, migrations Alembic, auth, organizations, courses, groups, media, sessions e API headless.
3. Auditar o repo portal Atlas Club, sem o alterar, e produzir mapa de endpoints Supabase Auth/ARO relevantes.
4. Elaborar **Architecture Decision Record** para SSO (A/B/C), dados (Supabase schema vs Postgres isolado), domínio, media/storage e deploy em Caddy.
5. Criar prova local/staging isolada com conteúdo demonstrativo: Club Free + Genesis 01 + Programa Exemplo B, duas turmas, um recurso partilhado, um recurso restrito e três papéis.
6. Demonstrar autenticação Atlas única real sem segunda senha, ou declarar blocker detalhado com prova.
7. Produzir screenshots desktop/mobile comparando UI original e direção Atlas, sem fingir homologação visual.
8. Entregar relatório com versões, SHA, incompatibilidades, requisitos da VPS, licenciamento, custo de operação estimado por rubricas, CI, blockers e recomendação GO/NO-GO.

**MISSÃO 1 — DESIGN/IMPLEMENTAÇÃO após G0 GO**

Implementar `atlas-club-campus` e componentes próprios com identidade Atlas, mantendo LearnHouse backend upstream salvo patches justificados; ligar identidade Master, access bridge e ARO, e criar experiência de formação multi-programa sem acoplamento Genesis-only. PRs pequenos, CI verde, QA e screenshots. O Claude Code executa engineering; Helena aprova migrações, secrets, integração com VPS e cutover.

# 22. Definition of Done — Atlas ClubOS V1

Um membro consegue entrar pelo Club, criar a sua conta uma única vez, abrir o Campus sem segundo registo, ter um dashboard real, inscrever-se em comunidade Free, explorar cursos autorizados, retomar progresso e participar numa atividade. O administrador consegue criar novo programa e nova turma **sem copiar código Genesis**. Um estudante com R$190 ou um Standard com R$490 consegue comprar via ARO e entrar na turma correta; repetição de webhook não duplica direitos; pessoa sem entitlement não entra no conteúdo pago. O visual reflete a marca Atlas. Toda a stack é monitorizada, documentada, licenciada e recuperável a partir de backup testado.

**Este blueprint aprova a arquitetura-alvo, não declara que o Campus já está desenvolvido nem que os pagamentos estão homologados.**

# 23. Fontes técnicas para auditoria

- LearnHouse upstream: https://github.com/learnhouse/learnhouse
- Stack e serviços: https://docs.learnhouse.app/developers/architecture/services
- Backend e base de dados: https://docs.learnhouse.app/developers/architecture/backend
- Variáveis e tenancy: https://docs.learnhouse.app/self-hosting/configuration/environment-variables
- Requisitos de VPS: https://docs.learnhouse.app/self-hosting/installation/requirements
- API headless: https://docs.learnhouse.app/reference/headless
- API tokens: https://docs.learnhouse.app/reference
- Multi-tenancy e licença: https://docs.learnhouse.app/platform/organizations/multi-tenancy
- SSO Enterprise: https://docs.learnhouse.app/enterprise/sso
- Licença AGPL: https://github.com/learnhouse/learnhouse/blob/dev/LICENSE
- Supabase schemas: https://supabase.com/docs/guides/database/tables
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Repo Atlas Club: https://github.com/atlashub-digital/atlashub-club
- Issues de produto existentes: https://github.com/atlashub-digital/atlashub-club/issues/33 ; https://github.com/atlashub-digital/atlashub-club/issues/29

---

**ATLAS CLUBOS — Blueprint V1.0 | Documento de decisão e execução inicial | 22/10/2026**

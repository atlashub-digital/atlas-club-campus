# GENESIS — Comunidade, feed, laboratório e workspaces (MVP / roadmap)

**Decisão de produto proposta — 09/11/2026.**
**Destino canónico dos membros:** `app.club.atlashub.si`, após validação de login, inscrições e permissões. 
**Identidade:** ATLASCLUB | GENESIS — A comunidade de quem constrói o futuro com IA.
**Mensagem:** Aprenda. Construa. Colabore. Transforme ideias em projetos AI-First e AI-Native.

## 1. O que o código atual suporta (main, leitura auditada em 09/11)
- Comunidades por organização, opcionais por grupo e associáveis a cursos.
- Threads/publicações com etiquetas nativas: `general`, `question`, `idea`, `announcement`, `showcase`.
- Comentários, votos, reações, ordenação por recente/popular, pesquisa na interface, posts fixados e bloqueados, moderação.
- Embeds YouTube por opt-in `moderation_settings.allow_rich_content` e validação no servidor. Não presumir Instagram-style media feed com upload de fotos/vídeos por post.
- Quadro colaborativo (`Board`) com members OWNER/EDITOR/VIEWER e documento Yjs; quadro por defeito privado.
- Formação: courses, activities, assignments, quizzes, submissões e progresso (gates por matrícula).
- RBAC: publicação exige membro da organização e direito `discussions.action_create`; leitura pública depende do nível de acesso de comunidade e grupo.
- Atualmente o home da organização usa `LandingClassic`/ `LandingCustom` focadas no catálogo. Não é ainda uma homepage social agregada.
- O PR #17 destaca a comunidade Genesis **somente** quando a comunidade real aparece na listagem da API. Não concede acesso por si mesmo.

## 2. Produto proposto: única casa, vários contextos
**Home depois do login:**
- Topo: novidades e anúncios; cartão "Comece aqui"; chamadas para Missão 001 e próximo encontro.
- Feed Genesis: anúncios AtlasClub, diário público do Genesis e GWD, demos, perguntas, desafios e posts de membros.
- Sidebar / navegação: **Início | Comunidade | Academia | Laboratório | Projetos | Meu Trabalho | Eventos | Perfil.**
- Trocar home de catálogo por um "Genesis Member Home" apenas após QA; catálogo continua acessível em Academia.
- Para primeira release sem refatoração: usar comunidade nativa `ATLASCLUB | GENESIS`, com 4 tópicos fixados, e etiquetar anúncios como `announcement`, ideias `idea`, demos `showcase`, perguntas `question`.
- Subfeed `[GENESIS LAB]` e `[GWD · PÚBLICO]` por convenção de títulos até existirem tags editoriais verdadeiras. Não falsificar informação como vinda automaticamente da GWD.

## 3. Níveis de acesso
| Perfil | Visibilidade | Capacidade |
| --- | --- | --- |
| Visitante | Página pública de apresentação; anúncios explicitamente públicos | Ler; CTA registo |
| Free verificado | Feed, Missão 001, biblioteca Free, conversas abertas | Publicar/comentar com moderação |
| Aluno F01/F02 | Free + cursos e turmas associados a entitlement comprovado | Atividades/submissões e recursos pagos |
| Construtor | Free + grupos/projetos a que foi convidado | Colaboração em quadros autorizados |
| Operador | Ambientes de trabalho restritos ao seu projeto | Tarefas com owner, datas, evidência e aprovação (NOVO módulo) |
| Moderador/Admin | Gestão e conteúdos autorizados; auditoria | Moderação e gestão de recursos |
| Parceiro | Informação pública + materiais aprovados em área restrita | Nunca recebe dados operacionais GWD por adesão ao Club |

## 4. Publicações Genesis e GWD
O feed deve poder receber **notas editoriais públicas aprovadas**, não dados diretos da operação:
`rascunho` → `revisão de confidencialidade/PII` → `aprovação humana autorizada` → `publicar` → `link de evidência/referência`.
Formato de nota: título, projeto, tipo (comunicado/progresso/demo/convite), data, estado (conceito / protótipo / piloto / em produção confirmado), conteúdo, mídia pública, autor e aprovador.
**GWD mantém isolamento:** não ligar Discord operacional, Master, credenciais, dados de clientes, planos comerciais internos ou logs brutos ao feed. Não ativar ingestão automática sem revisão.

## 5. Trabalhos e missões — distinção funcional
- **Já temos:** discussions para propostas/comentários; boards colaborativos para planeamento visual; assignments para aprendizagem.
- **Não verificado como pronto:** gestão de trabalho operacional com owner/assignee, aceitação, prioridade, prazo, estado, checklist, bloqueios, anexos, audit log e approval; não reutilizar notas de cursos como se fossem ordens de trabalho.
- MVP de tarefas futuro: `workspaces`, `work_items`, `work_item_assignees`, `work_item_events` com RLS por projeto. Estados: PROPOSTA → ACEITE → EM_PROGRESSO → EM_REVISAO → APROVADO/DEVOLVIDO → CONCLUÍDO. Preferir camada separada ligada a projetos; não alterar Master sem revisão arquitetural.
- Publicar para os membros apenas resultados/demos sanitizados de tarefas; não os detalhes privados de execução.

## 6. Três entregas para acelerar
### P0 — Comunidade viva (sem novas tabelas)
- Inventário admin e backup; criar ou reutilizar comunidade Genesis real.
- 4 posts fixados e Missão 001; configurar moderação; abrir Free com permissões validadas.
- Publicar 2 comunicados e 1 demo autorizada (marcados como exemplos se sintéticos).
- Testes: guest/free/paid/admin; 390px e desktop; URLs e links reais.
- Não divulgar convites de Discord do escritório interno de agentes.

### P1 — Home social (PR separado após P0)
- Homepage autenticada em modo Genesis, composta de **discussões reais** e recursos existentes; no vazio mostrar onboarding verdadeiro.
- Fazer CTA "Escrever publicação" apenas para autorizados; filtro de anúncio/demo/ideia/pergunta.
- Biblioteca/curso em abas próprios. Nenhum número de membros, posts ou projetos inventado.
- Eventos iniciais como anúncios vinculados a calendário validado; agenda transacional posterior.
- QA, testes e feature flag, sem alterar tema mínimo LearnHouse.

### P2 — Operadores e workspaces
- Reutilizar Boards como sala de desenho do projeto, por membros autorizados.
- Só depois desenvolver workflow de tarefas delegado com verificação, aprovação humana e auditoria.
- Permissões segregadas de turmas e de organizações GWD.

## 7. Regra de canais
**Campus é o sistema principal para membros, publicações, aprendizagem e histórico.** Hotmart gere formação/transações e preserva direitos atuais; Discord público (separado do servidor de operações) complementa conversa síncrona. SSO e integração financeira apenas com implementação segura e prova de acesso.

## 8. Definition of Done do primeiro lançamento
Novo membro Free consegue registar-se, aceitar termos, aceder ao Feed, ler comunicado Genesis, apresentar-se, comentar e iniciar Missão 001; sem visualizar recurso pago nem dados internos. Aluno pago mantém cursos e recursos. Administrador consegue publicar um comunicado público GWD aprovado e moderar respostas. Operador não vê workspaces de outros projetos.

**Estado:** especificação. Não se afirma deployment, migração, alteração da GWD nem configuração da Hotmart.

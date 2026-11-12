# ATLASCLUB — RELEASE DE CONTEÚDOS V1 PARA PROD (APLICAR PRIMEIRO EM STAGING)
**Preparado:** 2026-11-10. **Estado:** especificação editorial pronta para seed via API/painel; não é prova de publicação em nenhum runtime.
**Owner de runtime:** Helena. **Fonte de verdade:** [ATLASCLUB V1](./00_FONTE_DE_VERDADE_ATLASCLUB_2026-11-09.md).
**Ambiente informado pela Helena:** \`clubos-staging.atlashub.si\`, org \`atlas-club\`, org_id 1, módulos ativos, sem comunidades/cursos/pastas/podcasts/boards/playgrounds.
**Importante:** **NÃO** presumir que staging = \`app.club.atlashub.si\`; promover pacote sanitizado e versionado só após smoke/backup/GO. Não promover utilizadores de teste, passwords, JWTs, dumps ou chaves.

## Gate obrigatório de segurança antes de seeding
1. Confirmar que \`admin@atlas-campus.example.com\` é conta de exemplo/temporária ou identidade deliberada; provisionar um **administrador real com e-mail verificado e controlo do titular**, sem expor credenciais, depois remover/desativar a conta placeholder apenas após prova de substituição. Revogar sessões e validar RBAC.
2. Signup informado como **aberto em staging**: confirmar se staging está isolado do público, exigir verificação de e-mail e rate limits e restringir spam antes de convites externos. Não anunciar inscrição no domínio PROD antes de testes reais.
3. Confirmar \`org_id=1\` e \`org_slug=atlas-club\` no runtime alvo — não hardcode no código geral da plataforma. Confirmação por API e autorização do token.
4. Idempotência: fazer GET de comunidades/cursos/pastas antes de POST; reutilizar entidades iguais, não criar duplicados. Não inserir SQL manual para criar conteúdo; usar API oficial LearnHouse.
5. Habilitar permissões backend: \`public\` de comunidade não equivale a \`todos podem publicar\`; validar guest/Free/Admin. Quaisquer paywalls ficam desativadas até testes de direitos.
6. Fazer snapshot de DB + media e ensaio de restore isolado antes de promover staging à produção.

# 1. Comunidades — nomenclatura e descrições exatas

### Comunidade 1: AtlasClub Genesis
**Nome exato:** \`AtlasClub Genesis\`
**Idioma editorial:** Português. **Acesso:** núcleo Free com moderação; não vincular por defeito a curso pago.
**Descrição:**
> A comunidade de quem constrói o futuro com IA. Acompanhe a evolução pública da GWD AI-Native como piloto do Projeto Genesis, conheça arquiteturas de IA agêntica, ferramentas, repositórios GitHub, tutoriais e demonstrações. Partilhe ideias, faça perguntas, aprenda e colabore com outros membros. A participação comunitária é gratuita; formações e recursos especiais poderão ter condições próprias.

**Posts fixados iniciais** (títulos exatos; etiquetas LearnHouse em parênteses):
1. \`BEM-VINDO | Comece aqui no AtlasClub Genesis\` (announcement)
2. \`GWD AI-NATIVE | Diário público de construção\` (announcement)
3. \`APRESENTE-SE | Que problema gostaria de resolver com IA?\` (question)
4. \`GITHUB RADAR | Partilhe um repositório interessante\` (general)

**Texto de publicação 1:**
> **Bem-vindo ao AtlasClub Genesis.** Esta é a comunidade de quem constrói o futuro com IA. Aqui vamos acompanhar a evolução pública do piloto GWD AI-Native, experimentar ferramentas, estudar arquiteturas e aprender com projetos reais. Comece por apresentar-se: qual é a sua área, o que pretende aprender e que problema gostaria de resolver? Não partilhe senhas, dados pessoais ou informação de clientes. Os conteúdos classificados como demonstração não representam funcionalidades já homologadas em produção.

**Texto de publicação 2:**
> **Acompanhe o piloto GWD AI-Native.** Vamos partilhar aqui marcos, decisões arquiteturais, demonstrações e lições da construção de uma organização AI-Native. Cada atualização deve indicar a sua natureza: ideia, protótipo, piloto ou operação validada. Publicamos apenas informação aprovada e destinada ao público; dados de clientes, credenciais, sistemas internos e estratégias confidenciais ficam fora do feed. **Primeira pergunta:** que área de uma empresa gostaria de ver funcionar com agentes supervisionados?

**Texto de publicação 3:**
> **Vamos conhecer os construtores da comunidade.** Em que área trabalha ou estuda? Que ferramentas de IA já experimentou? Qual tarefa repetitiva ou problema de negócio gostaria de resolver? Diga também se pretende explorar, aprender, construir ou colaborar. Responda no comentário, sem dados pessoais sensíveis.

**Texto de publicação 4:**
> **GitHub Radar.** Encontrou um projeto open source útil para criar agentes, memória, orquestração, RAG, automações ou experiências 3D? Partilhe o endereço oficial, explique o que faz, diga se já o testou e, se souber, qual é a licença. Não publique chaves, forks de origem desconhecida como oficiais nem alegações de segurança sem evidência.

### Comunidade 2: AtlasClub France
**Nome exato:** \`AtlasClub France\`
**Idioma editorial:** Francês (\`fr\`). **Acesso:** núcleo Free.
**Description:**
> La communauté de celles et ceux qui construisent l’avenir avec l’IA. Découvrez l’IA agentique, suivez les avancées publiques du projet pilote GWD AI-Native, échangez autour des architectures, des outils, des ressources GitHub et des démonstrations, et développez vos idées avec d’autres membres francophones. L’accès à la communauté est gratuit ; certaines formations ou ressources complémentaires pourront être proposées séparément.

**Posts fixados iniciais**:
1. \`BIENVENUE | Commencez ici sur AtlasClub France\` (announcement)
2. \`GWD AI-NATIVE | Journal public du projet pilote\` (announcement)
3. \`PRÉSENTEZ-VOUS | Que souhaitez-vous créer avec l’IA ?\` (question)

**Texto de publicação 1:**
> **Bienvenue sur AtlasClub France !** Notre objectif est d’apprendre, de construire et de collaborer autour de l’intelligence artificielle agentique. Nous partageons des connaissances, des ressources, des expériences pratiques et des avancées publiques du pilote GWD AI-Native. Présentez votre domaine d’activité et un problème concret que vous aimeriez résoudre grâce à l’IA. Ne publiez pas de secrets, de données personnelles ni de documents clients.

**Texto de publicação 2:**
> **Suivre la construction d’une organisation AI-Native.** Cette rubrique présente des informations publiques et validées sur le projet pilote GWD : idées, prototypes, expérimentations et démonstrations. Chaque publication distinguera clairement ce qui est conçu, testé ou réellement opérationnel. Quels cas d’usage professionnels souhaiteriez-vous explorer en priorité ?

**Texto de publicação 3:**
> **Faisons connaissance.** Travaillez-vous dans la création de contenu, le commerce, le développement, les opérations, la formation ou un autre domaine ? Vous souhaitez surtout apprendre, expérimenter, créer un projet ou collaborer ? Partagez votre réponse ici.

## 2. Academia — ofertas reais sem produto fictício

### CURSO A — Construir com IA: do primeiro prompt ao primeiro agente
- **Tipo:** Free. **Prioridade:** criar e publicar conteúdo próprio V1.
- **Público:** iniciantes e profissionais.
- **Descrição:** Aprenda a identificar um problema útil, desenhar o comportamento de um agente e avaliar resultados com segurança. A primeira versão funciona com exemplos supervisionados e não exige programação.
- **Módulos V1:**
  - 00 | Bem-vindo e como usar a comunidade (aula texto: manifesto + regras + link Genesis)
  - 01 | Ferramenta, automação e agente: qual a diferença? (aula texto)
  - 02 | A anatomia de um agente: objetivo, contexto, permissões, ferramentas, memória e revisão (aula texto)
  - 03 | Missão 001 — Uma ideia, um agente (tarefa aplicada)
  - 04 | Quiz e próximos passos (4 perguntas de compreensão)
- **Entrega da Missão:** descrição do problema, primeira tarefa, limites do agente, primeira saída, revisão e reflexão.
- **Estado:** publicar apenas após produzir e testar realmente as aulas de texto e a avaliação. Não colocar vídeos fictícios.

**Texto-base da aula 01:**
> Uma ferramenta de IA responde a um pedido. Uma automação executa passos pré-definidos. Um agente combina um objetivo, um contexto, ferramentas permitidas e regras para executar tarefas e reportar resultados. O termo “agente” não elimina a responsabilidade humana: é preciso definir limites, critérios de qualidade, supervisão e o que fazer quando algo corre mal. Experimente identificar uma tarefa concreta e escrever como verificaria se ela foi concluída corretamente.

**Texto-base da aula 02:**
> Para conceber um agente útil, comece por seis elementos: **objetivo** (resultado esperado), **contexto** (informação autorizada), **ferramentas** (capacidades disponíveis), **permissões** (o que pode ou não fazer), **memória/estado** (o que regista de modo seguro) e **supervisão** (como valida erros e aprova ações). Por exemplo, um agente de triagem de pedidos pode classificar mensagens e preparar respostas, mas não deve assumir pagamentos, enviar contratos ou divulgar dados confidenciais sem autorização explícita.

**Quiz de quatro perguntas, respostas no painel admin — não expor chaves em payload do aluno:**
1. Qual dos itens distingue um agente de uma simples resposta pontual? → objetivo e sequência de tarefas sob regras.
2. O agente deve publicar automaticamente dados privados? → não.
3. Por que guardar evidências de teste? → para medir resultados e corrigir falhas.
4. Quando uma operação deve exigir aprovação humana? → em ações sensíveis/irreversíveis e conforme o mandato.

### CURSO B — A Arquitetura da Superinteligência Agêntica
- **Tipo:** curso estruturado, com **Módulo 00 Free**; módulos profissionais futuros por matrícula/entitlement.
- **Módulo 00:** O que é uma Empresa Aumentada?; Por que ferramentas isoladas não criam uma arquitetura?; Os cinco níveis de uma organização AI-Native; O papel humano e as permissões.
- **Material Free próprio:** livro \`Empresa Aumentada\`, EA–001 da AtlasHub Editions, por referência ao leitor canónico.
- **Estado:** publicar somente o módulo gratuito com material concreto; conteúdo profissional e checkout ficam RASCUNHO até direitos/contrato confirmados. Não vincular a pagamento Hotmart/ARO por suposição.

### CURSO C — Harness: do Zero ao Avançado
- **Tipo:** percurso autoral em desenvolvimento; **Free apenas a introdução original pronta**, restantes módulos em RASCUNHO.
- **Estrutura:**
  - 00 | O que é um agent harness? Arquitetura, ambiente e limites.
  - 01 | Ferramentas e execução supervisionada
  - 02 | Contexto, memória e avaliação de código
  - 03 | REA e fluxos de desenvolvimento 3D
  - 04 | Integração com ferramentas, segurança e testes
  - 05 | Projeto final e revisão humana
- Vídeos externos são **material recomendado com atribuição**, não aulas produzidas pelo AtlasClub nem parte de curso pago sem direitos próprios.

### France — conteúdos de formação
Criar primeiro **uma rota de leitura Free em francês** no feed/Biblioteca; criar curso formal apenas quando aulas, avaliação e revisão linguística estiverem prontas. Evitar curso público vazio.

## 3. Biblioteca — pastas e recursos para publicar já

Usar pastas nativas do LearnHouse para reunir conteúdo, sem criar microsites. A biblioteca referencia recursos existentes; permissões continuam no objeto original.

| Pasta (nome exato) | Material inicial |
| --- | --- |
| \`01 — Arquitetura de IA Agêntica\` | Aulas originais do Curso A e ligação ao Módulo 00 do Curso B quando publicados |
| \`02 — Soluções Agênticas · Harness\` | Fichas de dois vídeos externos listados abaixo; depois recursos originais Harness |
| \`03 — GitHub Radar\` | Ligação ao post fixado GitHub Radar na comunidade Genesis; fichas de projetos após validar licença e origem |
| \`04 — Social Media & Creators\` | Publicação original “Como identificar tarefas de criação de conteúdo que podem ser supervisionadas por agentes” |
| \`05 — Profissões e Departamentos\` | Publicação original “Cinco áreas para começar: operações, comercial, atendimento, logística e RH” |
| \`06 — GWD · Laboratório Público\` | Post fixado “GWD AI-Native | Diário público de construção”, com fontes aprovadas |
| \`07 — AtlasHub Editions\` | Recurso externo canónico: **Empresa Aumentada** — \`https://editions.atlashub.si/livros/empresa-aumentada\` |
| \`08 — AtlasClub France · Ressources\` | Posts iniciais FR; mais conteúdos com curadoria/validade local |
| \`09 — Podcasts e entrevistas\` | Criar só quando existir pelo menos um episódio áudio original validado |

**Referência editorial própria confirmada em GitHub:** \`atlashub-digital/Editions.AtlasHub.Si\`, \`lib/catalog.ts\` lista EA–001 como publicado; \`content/LAUNCH.md\` regista autorização do autor para leitura e downloads gratuitos. \`Agent Operating Models\` e \`AI for Retail\` estão \`coming-soon\`. Preferir **link para o reader canónico**, evitando cópias de PDF fora de controle de versão e direitos. Confirmar disponibilidade em produção antes de publicar link.

**Vídeos externos propostos — *títulos fornecidos pelo fundador, metadados ainda não verificados na fonte*:**
- \`Tutorial de SuperAgent no DeepSeek Harness: ele consegue corrigir meu código?\` — \`https://youtu.be/TbgIT-eYRDo\`.
- \`Tutorial DeepSeek Harness + REA: Clone um site 3D com IA\` — \`https://youtu.be/QdX763JHMLk\`.
Ação obrigatória: verificar canal/autor, título real, link ativo, possibilidade de embed/player oficial, atribuição e licença. Se embed estiver bloqueado, mostrar link externo do YouTube. Não descarregar, rehostear, remover branding ou sugerir parceria sem autorização. **Não publicar até verificação**.

**Temas seguintes, não publicar fichas vazias:**
\`Hermes-Agent\`, \`OpenClaw\`, \`Agent Frameworks\`, \`Automação de Negócios\`, \`Imobiliário\`, \`E-commerce\`, \`Marketing\`, \`Logística\`, \`Financeiro\`, \`Profissões & Departamentos\`. Para cada repo: URL oficial, licença, última atualização, âmbito e riscos.

## 4. Playground e Podcasts: usar funções reais
**Playground 01:** \`Mapa de uma Organização AI-Native\` — uma experiência HTML original, acessível, com cinco camadas: Governação, Direção Executiva, Serviços Partilhados, Unidades de Negócio, Laboratórios. Interação apenas educativa, **sem dados GWD**, sem prometer orquestração real, sem credenciais, sem APIs externas. Só publicar após QA HTML sandbox, CSP, ACL e mobile. Se o módulo não estiver seguro, não bloquear o lançamento das comunidades.
**Podcasts:** série proposta \`Genesis — Diário AI-Native\`, rascunho até existir episódio áudio real. Não publicar uma série vazia nem registar um RSS sem média pública válida. Série francesa separada quando existir conteúdo FR.

## 5. Conteúdo social permanente
Tipos:
- \`announcement\`: aviso institucional real AtlasClub, marco GWD público autorizado.
- \`general\`: informação agêntica, dicas, repertório YouTube/EDitions e GitHub.
- \`question\`: dúvidas de aprendizagem, debates sobre arquitetura.
- \`idea\`: propostas práticas e soluções empresariais.
- \`showcase\`: demonstração real com estado e autor.
Ritmo inicial viável: 2 publicações originais sobre IA + 1 atualização GWD autorizada + 1 vídeo/repo validado + 1 pergunta semanal. A comunidade France recebe adaptação FR, não tradução cega.

## 6. Publicação de produção (não confundir staging com PROD)
1. Configurar e testar este lote em \`clubos-staging.atlashub.si\`, usando POST via API idempotente com contas de teste autorizadas. Registar UUIDs em inventário operacional privado, não em logs públicos.
2. Rever conteúdos e direitos, excluir dados de teste, garantir que um membro Free entra/publica/comenta; convidado só lê o autorizado; paid indisponível sem entitlement; Admin modera.
3. Preferir seed idempotente versionado e reproduzível contra produção em vez de dump completo staging→prod; validar o \`org_id\` e as chaves localmente em cada runtime.
4. Backup/restauro/rollback antes de qualquer alteração produtiva; GO humano para publicação e abertura de inscrição. Não tratar a conta placeholder \`admin@atlas-campus.example.com\` como admin humano confirmado.
5. Publicar as duas comunidades + conteúdos aprovados, um curso Free realmente utilizável, as primeiras referências da Biblioteca e, se homologados, Playground e Podcasts.
6. Criar/ativar links \`club.atlashub.si\` → \`app.club.atlashub.si\` apenas depois de testar registo real e permissões; zero alegações de acesso pago sem contrato Hotmart/ARO funcional.

## 7. Testes de aceitação PROD
- [ ] Comunidade Genesis PT e France FR existem e apresentam UUIDs distintos.
- [ ] Membro Free faz signup/email/login, comenta em PT ou FR, faz logout e volta.
- [ ] Curso Free contém aulas completas, permite atividade/quiz e guarda progresso.
- [ ] Biblioteca tem pelo menos 4 recursos reais acessíveis, sem 404 nem 403 indevidos.
- [ ] Links Editions e YouTube estão ativos (ou não são exibidos).
- [ ] Admin real está verificado e a conta placeholder está desativada ou justificada.
- [ ] Um utilizador Free não consegue ver conteúdos/recursos pagos nem privados.
- [ ] Feed GWD não expõe dados privados nem declara marcos falsos.
- [ ] Playground e Podcast só aparecem públicos após smoke test próprio.
- [ ] Capturas 390px + 1440px, IDs e SHA de release, backup/rollback confirmados.

## 8. Não incluir nesta vaga
Sem pagamentos ARO/Hotmart ativos, sem SSO automático, sem API GWD privada, sem bots de publicação, sem redesign premium, sem subscrições recorrentes, sem comunidades extras vazias, sem importação de membros a partir de e-mails não verificados, sem serviços de terceiros de que não tenhamos direitos.

> **GATE DE SEGURANÇA — 09/11/2026:** O Discord AtlasHub existente funciona também como escritório OPERACIONAL de agentes. Os relatórios `atlas-ops/decisions/ATL-D23` e `ATL-D24` documentam isolamento parcial e permissões legadas. O inventário de 09/10 indica visibilidade @everyone em certas áreas e bots/cargos administrativos. **NÃO distribuir convite público do servidor interno.** Preferir um servidor público "AtlasClub | Genesis" separado, criado por humano, ou apenas reutilizar o atual após reauditoria completa de TODOS os canais, cargos e permissões com conta convidada. Nunca criar bots com ADMINISTRATOR. A presente documentação é proposta, não prova de comunidade pública criada.

# Discord — Servidor AtlasClub | Genesis (configuração inicial)

## Nome
**ATLASCLUB | GENESIS**
Descrição: A comunidade de quem constrói o futuro com IA. Aprenda. Construa. Colabore.

## Estrutura mínima
Categoria **01 · COMECE AQUI**
- #boas-vindas — post fixado e orientação.
- #regras-e-anuncios — apenas staff escreve; membros leem.
- #apresente-se — apresentação dos membros.

Categoria **02 · APRENDA & CONSTRUA**
- #perguntas-sobre-ia — perguntas de entrada, apoio entre pares.
- #uma-ideia-um-agente — Missão 001; cada ideia numa thread.
- #mostre-seu-projeto — demonstrações, portfólios e feedback.

Categoria **03 · GENESIS LAB**
- #projetos-e-colaboracoes — pedidos e propostas moderadas, sem prometer remuneração.
- #eventos-e-lives — calendário e avisos.
- [criar canais PRIVADOS por turma/projeto apenas quando houver membros e moderadores]

Categoria **99 · OPERACAO** (privada; nunca visível a visitantes)
- #moderacao-e-incidentes

## Roles e acesso
- @everyone: ver apenas mensagens públicas iniciais; sem administrar canais, mencionar @everyone ou criar convites.
- Membro: participar nos canais abertos, após aceitar regras.
- Construtor: papel social, NÃO acesso GWD por defeito.
- Aluno Genesis: acesso a canais da turma somente após verificação individual do direito; não sincronizar pagamentos por texto.
- Moderador: gestão de mensagens/incidentes, sem administrar integrações/segredos.
- Admin Humano: administração e auditoria.
- Diana [AGENTE DIGITAL]: perfil/bot identificado, sem permissões de admin, sem DMs automáticas, desativado até testes.
- Parceiro: papel eventual de networking, nunca concede acesso ao data room.

## Primeira mensagem #boas-vindas
🚀 **Bem-vindo(a) ao ATLASCLUB | GENESIS!**
Aqui, o futuro com IA é construído em comunidade.
**Aprenda. Construa. Colabore.**
Comece por #regras-e-anuncios, apresente-se em #apresente-se e depois publique uma única ideia em #uma-ideia-um-agente.
Uma boa pergunta para começar: **se pudesse criar um agente para resolver um problema real, qual seria?**
A Architect Diana é uma interlocutora digital de IA; as decisões e moderação são supervisionadas por pessoas.

## Mensagem inicial #uma-ideia-um-agente
**MISSÃO 001 — UMA IDEIA, UM AGENTE**
Não é necessário programar.
Publique: (1) problema, (2) quem tem esse problema, (3) primeira tarefa desejada, (4) como verificar se funcionou.
Não partilhe documentos de clientes, credenciais nem dados pessoais. A equipa selecionará ideias para discussão e demonstração.

## Moderação e segurança
Exigir aceitação de regras antes de escrever. Configurar filtros anti-spam, slow mode onde necessário e moderação humana com rota de incidentes. Desativar permissões perigosas dos bots. Não publicar convite permanente antes de teste de conta de convidado, responsável de moderação, canal de denúncia e consentimento.
Ao migrar servidor já existente: preservar mensagens, cargos/roles, convites e canais com histórico; renomear apenas após levantamento; não remover canais sem export e autorização.

## Integração
O endereço do Discord aparece como convite opcional no Campus e Hotmart, nunca como condição única para acesso ao produto pago. Manter os IDs reais de servidor e canais em inventário restrito. Bot Diana, quando permitido, lê só os canais explicitamente autorizados.

# AtlasClub | Genesis — execução P0 pelos agentes Hermes

## Objetivo operacional
Ativar a comunidade **ATLASCLUB | GENESIS** nas três superfícies existentes sem redesenhar LearnHouse, sem alterações a pagamentos e sem remover membros ou conteúdo.

## Gate 0 — inventário e acessos (Helena + operador humano)
- Confirmar no painel do Campus a organização e a(s) comunidade(s) existentes, IDs, responsáveis, cursos associados e membros; backup/snapshot antes de qualquer alteração.
- Confirmar domínio/API do Campus, origem de autenticação e plano que permite Comunidades (no código a funcionalidade é gated como standard).
- Confirmar se a comunidade Construir com IA na Hotmart já tem membros/produtos: nunca renomear ou desvincular antes de validar direitos.
- Confirmar Discord existente, proprietário humano, convites ativos, canais/roles e histórico; preservar tudo.
- Recolher IDs reais no inventário **privado**, nunca no repositório público; credenciais apenas em cofre operacional.

## Gate 1 — Campus (Hermes/Helena supervisionados)
O LearnHouse nativo expõe: comunidades (listagem, criação, edição), discussões por comunidade, etiquetas e fixação de discussões.
Recomendação para começar: **1 comunidade Genesis + 4 tópicos fixados** (COMECE AQUI, APRENDA, CONSTRUA, COLABORE). Isso é mais simples do que criar quatro comunidades dispersas.

Script versionado: scripts/seed_genesis_community.py. Em modo padrão, não faz pedidos HTTP e apenas mostra o plano:

    python3 scripts/seed_genesis_community.py

Depois do inventário e da aprovação, em máquina operacional segura, com token de curta duração colocado no ambiente pela equipa:

    python3 scripts/seed_genesis_community.py --api-base URL_REAL_DA_API --org-id ID_REAL --community-uuid UUID_EXISTENTE --apply

Se não existir comunidade adequada: criar a Genesis depois de confirmação, omitindo --community-uuid e usando --create-if-missing. O script não renomeia, não elimina e não mexe em cursos.

## Gate 2 — Discord (Hermes operador humano)
Aplicar a estrutura e mensagens de operations/atlasclub-genesis/02_DISCORD_SEED.md, sem apagar canais ativos.
Roles: Admin humano, Moderador, Membro, Construtor e Aluno (somente com direito comprovado). Diana como agente digital, **desativada por defeito**, sem poderes de administração.
Testar com conta de membro e convidado; conferir privacidade e denúncias.

## Gate 3 — Hotmart (operador autenticado)
Seguir operations/atlasclub-genesis/03_HOTMART_MIGRACAO_E_COMUNICACAO.md.
Inventariar comunidade Construir com IA e produtos. Preservar direitos e mensagens; renomear apenas se os links e benefícios não forem afetados.
Publicar mensagem de transição, novo manifesto e Missão 001 na comunidade existente (quando autorizado).

## Gate 4 — comprovação antes de divulgar
- Campus: captura da lista de tópicos e posts fixados, acesso como membro gratuito e conta restrita.
- Discord: captura dos canais e permissões de conta normal.
- Hotmart: captura da comunidade, produtos vinculados e membro antigo com acesso.
- Sem fusão de contas/SSO fictícia; integração apenas por links funcionais e comunicação clara.
- Conferir notificações, regras de privacidade, denúncia e responsáveis humanos.
- Reportar IDs internos apenas por canal seguro; colocar no PR apenas evidências sanitizadas e status.

## Responsabilidade
Direção: GO comercial e institucional. Helena: execução técnica, credenciais, rollback e QA. Hermes: executor sob mandato e logs. Diana: comunicação digital e acolhimento revisados, sem autonomia de produção. Não alterar GWD, ARO, Master, billing ou identidade sem gate separado.

## Estado desta entrega
O repositório contém documentos e script seguro, mas **não prova que Campus/Discord/Hotmart já foram configurados**. Produção inalterada.
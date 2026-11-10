# MISSÃO ATLASCLUB — WAVE 0 / 1: VPS + PRODUCT/DESIGN EM PARALELO

**Data:** 2026-11-10  
**Estado:** plano EXECUTÁVEL para agentes autorizados, não executado na VPS.  
**Fonte de verdade:** [ATLASCLUB V1](./00_FONTE_DE_VERDADE_ATLASCLUB_2026-11-09.md).  
**Código:** [atlas-club-campus PR #17](https://github.com/atlashub-digital/atlas-club-campus/pull/17) (draft).  
**Primeiro objetivo de produto:** Comunidades AtlasClub Genesis e AtlasClub France, conteúdo Free, feed, Biblioteca, Playground e Podcasts; cursos e áreas pagas em fase separada.

## Divisão de frentes

### TRAJECTO OPS — Hermes / operador autorizado (read-only até gate)

**W0: Inventário real, sem interromper produção.**
- Identificar **qual host serve de facto** `app.club.atlashub.si`; verificar Caddy/proxy, containers/services, imagens e commits, volumes e redes, backups e job de backup. Não assumir que coincide com o host Hermes nem com o staging antigo.
- Identificar o LearnHouse produtivo vs instâncias antigas (`clubos-p1.atlashub.si` documentada como staging em 28/10; estado atual a confirmar); não remover nada nesta missão.
- Verificar capacidade CPU/RAM/disco, portas e TLS; anotar serviços protegidos (Helena, Hermes, GBrain, Redis, Caddy, ARO, Master, GWD, outros) e dependências.
- Identificar DB/Redis/volume de media do Campus e políticas de persistência SEM revelar credenciais, `.env`, dados pessoais ou dumps.
- Verificar estado da organização AtlasClub, plano/feature flags de Comunidades, Playground, Biblioteca, Podcasts, registo/login de novos membros e moderação.
- Produzir um inventário sanitizado `ATLASCLUB-W0-INVENTORY.md`, diagrama dos serviços, riscos, backup-verification e rollback descrito; nenhum comando destrutivo.

**W1: configuração com pré-condições.**
- Usar o Campus já instalado, preservando imagem e dados atuais; confirmar backup de DB/media + restauro em instância isolada antes de qualquer migração.
- Só depois do GO técnico: criar/reutilizar **AtlasClub Genesis**, criar **AtlasClub France** como segunda comunidade e conteúdos PT/FR pré-aprovados, sem duplicar comunidades anteriores e sem migrar membros em massa.
- Aplicar menus/pastas com recursos reais e permissões; não abrir público antes de testar guest/Free/aluno.
- Não instalar Antigravity com GUI, Node toolchains pesados ou novos gateways Hermes no host produtivo sem medição e autorização.
- Staging isolado, única revisão no PR, promoção à produção apenas com evidência e aprovação explícita da Direção.

**Âmbito permitido:** observação, backup verificado, configuração editorial após GO e verificação.  
**Proibido sem novo gate:** alterar DNS/Caddy de produção, migrar DB, recriar containers, mover volumes, reiniciar Hermes/Redis/GBrain, alterar ARO, Master, GWD, Checkout, tokens, produção, apagar serviços/repositórios, usar `docker system prune`, `rm -rf`, `git reset --hard` ou `--yolo`.

### TRAJECTO PRODUCT / DESIGN — Antigravity/Claude Code/Codex (isolado da VPS)

- Clonar **somente** `atlashub-digital/atlas-club-campus`; partir de `main` atual; ler fonte de verdade, PR #17 e documentação do LearnHouse antes de mudar ficheiros.
- Criar worktree/branch independente `feat/atlasclub-member-home-v1`; não desenvolver em `main` nem diretamente num checkout de produção.
- **Redesign incremental, mantendo LearnHouse:** marca mãe ATLASCLUB, seletor Genesis / France, homepage de membro social com publicações reais, anúncios destacados, biblioteca, cursos, Playground, Podcasts e perfil. Empty states honestos.
- Reutilizar API e RBAC originais; mostrar os dois cartões de comunidades apenas quando as comunidades existirem. Ao navegar, respeitar ACL e idioma; não expor conteúdo restrito numa home agregada.
- Responsividade: 390px/768px/1440px; sem imagens quebradas; estética Atlas premium navy, cyan e dourado discreto; consistência do logótipo homologado; sem remover licença/atribuições legalmente necessárias.
- Entregar mockups e screenshots reais antes/depois, percurso Free/PT e Free/FR, diff, PR e CI (lint, typecheck, testes).
- **Não** editar ARO/Hotmart, Stripe billing LearnHouse, GWD, auth ou scheme de banco nesta primeira vaga.

### TRAJECTO COMMERCE — análise separada, read-only
- Inspect ARO projeto atlas-club: catálogo runtime, status das ofertas, webhook, allowed origins, checkout e entitlement; nunca imprimir keys.
- Inspect Hotmart, caso exista operador autorizado: produtos atuais, eventos/webhooks, membros, direitos existentes.
- Propor BFF para autenticação e `membership_entitlement` unificado, fonte `ARO|HOTMART` e grant/revoke idempotente. Sem pagamento real ou migração agora.
- Tratar login `club.atlashub.si` (Supabase) e `app.club.atlashub.si` (LearnHouse) como separados até SSO comprovado.
- **Riscos históricos a validar:** Genesis catalog DRAFT em 20/10; divergências `genesis-01-br` vs `genesis-01-standard` e `atlas-club:genesis-01` vs `atlas-club:course:genesis-01`; PR comercial #30 ainda não integrado. F01 atual Hotmart (PR #40), benefícios pós-compra no Campus não comprovados.
- ARO compra direta BRL antes de qualquer EUR; Stripe internacional e recorrência somente com homologação específica.

## Ferramentas e localização
- **Hermes** na VPS: apenas perfis/identidades autorizados, comandos read-only allowlisted, sem novas permissões de root. O inventário Hermes de 13/10 tinha 4 vCPU/7,8 GB; **medir de novo**.
- **Antigravity Remote Agents:** correm em infraestrutura Google, não são processos dentro da VPS. Ligar repo e abrir PR. 
- **Antigravity CLI/Remote Control:** podem funcionar em host próprio com CLI instalado e configurado, após verificar binário, autenticação e política; não pressupor presença na VPS. Preferir workstation ou ambiente isolado, não o host produtivo.
- **CI GitHub:** unidade de integração; o deploy deve sair de tag/commit homologado, não do resultado não revisto de um agente.

## Definition of Done

**OPS (read-only):**
- [ ] Relatório sanitizado host/serviços/ports/versões/DB e feature gates
- [ ] Snapshot/backup + plano de restauro com comprovativo isolado
- [ ] Mapeamento de instância produtiva e de staging
- [ ] Lista de bloqueios/autorização sem exigir Helena por defeito

**DESIGN:**
- [ ] PR novo com homepage social a partir de dados reais do Campus
- [ ] Seletor de comunidades com Genesis + France e fallback sem comunidades
- [ ] Menu existente personalizado; acesso a cursos/biblioteca/podcast/playground
- [ ] CI + screenshots reais 390px/1440px + revisão de acessibilidade

**GO COMMUNITY:**
- [ ] Genesis e France com IDs reais, posts, edição/moderação, login Free
- [ ] Sem vazamento entre organizações/grupos nem entre Free e paid
- [ ] GWD apenas atualizações autorizadas, com estado verdadeiro
- [ ] Discord operacional fechado; canais comunitários isolados

**GO COMMERCE (fase distinta):**
- [ ] ARO/Hotmart auditados
- [ ] Um cliente/identidade corretamente vinculado, um direito correspondente
- [ ] Refund/chargeback revoga o benefício correspondente sem afetar Free
- [ ] E2E financeiro e aprovação da Direção antes de receber cobranças.

## Ritual de execução
1. **Agente Ops** publica inventário e blockers. Não chama ações de mudança.
2. **Agente Design** cria PR isolado e previews.
3. Revisão cruzada de compatibilidade e recursos.
4. Integração em **staging** após backup e aprovação técnica.
5. Browser QA com conta guest/Free/paid/admin.
6. GO da Direção → deploy reversível por commit/imagem conhecida.
7. Evidência de produção sanitizada e follow-up.

**Nota:** esta missão não é um gatilho automático Hermes/Antigravity. Para iniciar, enviar a ligação do ficheiro no canal/agente autorizado ou abrir no Antigravity com o repo anexo.

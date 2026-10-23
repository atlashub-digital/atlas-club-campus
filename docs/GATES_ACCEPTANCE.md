# Gates e Definition of Done — Atlas ClubOS

**Aprovação deve usar evidência real, sem testes falsamente equivalentes.**

| Gate | Evidência exigida | Bloqueador de GO |
|---|---|---|
| G0 Upstream | tag/SHA fixo, OSS boot, Web/API/Collab/DB/Redis, editor, upload, seed e persistência; screenshots + logs e restore demonstrado | frontend 200 sem trabalho educativo real |
| G1 Identity | Supabase Master login real, bridge/licença validada, provisionamento único, logout/suspensão e 2 contas isoladas | segundo login independente ou tokens LH expostos |
| G2 Multi-academia | 2 programas, 2+ turmas, conteúdo comum e privado, progresso separado, admin publica via UI | qualquer hardcode `genesis` nas tabelas core |
| G3 ARO | Free sem pagamento; Standard 490 / Student 190 via declaração; PIX real autorizado, webhook/dedupe, ACTIVE→matrícula, pending/failure/expired não desbloqueiam | checkout 404, catálogo divergente ou acesso indevido |
| G4 UI total | rotas/estados V1 personalizados, screenshots desktop 1440 e mobile 390, responsividade, contraste, a11y, loading/empty/error; sem marcas LH exceto atribuição legal | telas estratégicas ainda upstream/simuladas |
| G5 Ops | VPS staging health, DNS/TLS, backups+restore de DB/media, rollback, migrações auditadas, observabilidade, erros controlados | persistência, infra ou updates sem recuperação |
| G6 Product release | jornada membro Free completa, Genesis pago, E2E de academia, posts, tarefas, progresso e admin; monitorização e autorização de Direção/Helena | flags e comunicação comercial fora de sincronia |

## E2E mínimo
1. Admin cria Academia, Programa, duas Turmas, curso, aula, assignment e espaço.
2. User A Free faz login único, vê conteúdo livre, participa em discussão e conclui missão gratuita.
3. User B compra Genesis Student R$190 (conta não menor), ARO autoriza, é matriculado sem login extra.
4. User C compra Standard R$490 e entra no mesmo programa sem compartilhar contas.
5. User B pode estar noutra turma/programa, com progresso separado; A não lê materiais B.
6. Webhook repetido não gera matrícula/pontos duplicados; PIX pendente não abre curso; refund manual externo fecha direito.
7. Backup/restauração mantém perfis LH, cursos/progresso e mapeamentos; atualização upstream simulada é testada.

## Formato relatório
`Gate | PASS/FAIL | SHA | Ambiente/URL | Checks/testes | Screenshots/logs sanitizados | Migrações | Blocker | Rollback | Owner`.

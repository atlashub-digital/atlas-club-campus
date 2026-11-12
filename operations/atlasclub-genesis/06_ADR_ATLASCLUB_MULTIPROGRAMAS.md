> **NOTA DE SUPERAÇÃO (09/11/2026):** este ADR é histórico, anterior à ratificação de **AtlasClub Genesis** e **AtlasClub France** como comunidades distintas da plataforma **ATLASCLUB**. Em caso de divergência de nomes, escopo, estratégia e direitos, seguir **[`00_FONTE_DE_VERDADE_ATLASCLUB_2026-11-09.md`](./00_FONTE_DE_VERDADE_ATLASCLUB_2026-11-09.md)**. Os direitos já contratados dos compradores continuam preservados.

# ADR proposto — AtlasClub como plataforma multi-programa/multi-país

**Data:** 2026-11-09  
**Estado:** design/GO de produto P0; não aplicar migrações sem homologação de auth e RBAC.  
**Decisão:** AtlasClub é a organização canónica para comunidade, academia e projetos. Genesis é o programa inaugural. Portugal e França são futuros programas/geografias, NÃO empresas/tenants técnicos por omissão.

## Hierarquia de produto (reutilizar modelo LearnHouse)

- **Instalação:** `app.club.atlashub.si` (Campus LearnHouse preservado e licença AGPL).
- **Organização LearnHouse:** `AtlasClub` (um conjunto de identidade e administração).
- **Comunidades:** `Genesis`, `Projetos Portugal`, `Projetos França`, `Comunidade Geral`, etc., criadas conforme projeto real e usando API nativa.
- **UserGroups:** subgrupos por edição, país/região, modalidade e projeto. NÃO conceder permissões apenas por rótulo geográfico.
- **Cursos/atividades:** ligados aos programas/edições, acesso por matrícula+entitlement.
- **Boards:** workspaces colaborativos privados por projeto e membros autorizados; NÃO confundir Board com gestão operacional completa de tarefas.
- **Work Items:** futuro módulo de atribuição/aceite/status/revisão/evidências, com ACL por projeto e log de auditoria.
- **GWD:** organização externa/piloto. Só conteúdos públicos aprovados podem entrar no feed do AtlasClub. Nada de sincronizar operação ou dados internos com a comunidade.

## V1 real (sem alterações de schema)
**Organização:** AtlasClub única; validar orgslug real em admin antes de configurar links.
**Primeira comunidade:** `ATLASCLUB | GENESIS` para feed/boas-vindas e Missão 001.
**Participantes:** Free, Aluno F01, Aluno Genesis, Construtor, Operador, Parceiro, Moderador/Admin.
**Política:** separar `role` (o que pode fazer) de `entitlement` (a que produto tem direito), `group membership` (em que equipa está) e `country` (localização/mercado).
**Anúncios:** labels nativas `announcement`, `idea`, `showcase`, `question`.
**Portugal/França:** começar com comunidades/subgrupos e localização de conteúdos somente quando houver responsáveis e programa reais; não duplicar contas nem exigir nova organização LearnHouse.

## Quando CRIAR outra organização LearnHouse?
Somente se houver exigência de isolamento administrativo/contratual real (outra entidade jurídica, política de dados independente, orçamento, domínios e suporte próprios). Mesmo nesse caso manter portal AtlasClub e camada de identidade federada planejada; nunca presumir SSO nativo.

## Identidade e login
O website `club.atlashub.si` usa auth do Club via Supabase/schema `club`; o Campus LearnHouse usa uma sessão própria. **Não estão comprovados SSO, user_id único nem sincronização automática.**
P0: o CTA deve encaminhar para login real do Campus; não oferecer duas contas incompatíveis como se fossem uma.
P1: estudo de bridge de identidade com `member_global_id` interno, `campus_user_id`, `club_profile_id` e `aro_customer/contact_id`, linkados após autenticação e verificação criptográfica. Identidade nunca garantida só por igualdade de e-mail.
P2: SSO/OIDC ou troca de tokens com nonce e expiração, somente após avaliação de segurança e testes.

## Homepage inicial
Novidades/Feed Genesis → apresentação → Missão 001 → cursos disponíveis → projetos/boards autorizados → áreas privadas.
A homepage deve ser alimentada por posts reais e objetos existentes, não métricas fictícias. Design no PR independente, atrás de feature flag, respeitando a UI original homologada.

## Matriz de visibilidade e acesso
| Categoria | Guest | Free | F01 | Genesis pago | Operador atribuído |
|---|---|---|---|---|---|
| Página institucional pública | sim | sim | sim | sim | sim |
| Feed e anúncios abertos | leitura publicada | ler/comentar | ler/comentar | ler/comentar | ler/comentar |
| Missão 001 gratuita | não escrever | sim | sim | sim | sim |
| Curso F01 | não | não | sim, comprovado | só se incluído na compra | por matrícula |
| Curso Genesis pago | não | não | não por F01 | sim, comprovado | só se matriculado |
| Board/projeto privado | não | só por convite | só por convite | só por convite | só atribuição explícita |
| Dados/operadores GWD | não | não | não | não | não, salvo acordo GWD fora do Club |

## Regra de lançamento
Não bloquear Free pela ativação do ARO. Não ativar automação financeira, webhooks, acesso pago nem campanhas "matrículas abertas" sem prova real ponta-a-ponta. Acesso Free deve ser viável com os serviços existentes primeiro.

## P0/P1/P2
1. P0 Community: inventário real AtlasClub LearnHouse, auth, org+RBAC, posts fixados e QA guest/free; não mesclar PR #17 sem CI/QA.
2. P1 Social home: feed real + navegação por programa, localidade e permissões; continuar cursos/boards nativos.
3. P2 Workspaces: tarefas com assignee, aceitação, estado, prova de conclusão e aprovação humana, projeto-padrão fechado. Não misturar no feed público.

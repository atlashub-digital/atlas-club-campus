# Contratos — Identity, ARO e Campus (alvo; verificar endpoints em runtime)

## Identity mapping
- Authority: Supabase Master `auth.users.id` (UUID estável), `club.identity_links` Master (migração Helena-reviewed). Nenhuma password replicada.
- Projeção: `master_user_uuid` ↔ `learnhouse_user_id`, estado `active/suspended`, created/updated; idempotência e não sincronizar PII desnecessária.
- **Não presumir compatibilidade de JWT** nem expor `service_role`/tokens LH no browser. BFF validates master session → LH session via método suportado/licenciado, preferindo broker OIDC ou API headless autorizado.
- Multi-programa: membership de uma turma não implica membership de outra; entitlements específicos e acessos baseados em curso/programa/edição.

## Purchase → enrollment
- POST servidor a ARO Hosted Checkout usando oferta canónica; escolha Student exige autodeclaração no servidor, sem revisão documental.
- Após evento autoritativo ARO confirmado: resolver entitlement ACTIVE; persistir a matrícula no Club; provisionar grupo/curso em LH de forma idempotente, auditar ID da ordem sem secrets.
- Enquanto pendente/falhou/refunded: nunca permitir conteúdo pago.
- Não construir interface de refund; serviço ao cliente executa manualmente fora da plataforma. Processar notificações externas de reembolso/revogação ao atualizar direitos.

## Ordem de verdade
- Identity: Supabase Auth.
- Identity link: Club Atlas Master.
- Authoritative payment and economic entitlement: ARO.
- Course authoring/completion: LearnHouse.
- Program edition/roster/events/gamification: Club Atlas extensions com IDs estáveis e sincronização segura.
- Channels: WhatsApp/Discord não têm autoridade sobre acesso ou pagamentos.

## Casos negativos obrigatórios
Sem OTP confirmado; Free a abrir turma paga; estudante sem declaração; menor sem permissão aplicável; replay webhook; atraso webhook; reembolso manual externo; logout; mudança de email; duas sessões/navegadores; entrada no segundo programa sem direito; API LH indisponível; reintrodução de compra; concorrência simultânea.

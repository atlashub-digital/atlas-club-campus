# Gate de homologação — ARO → pagamento → entitlement → matrícula AtlasClub/Campus

**Auditoria de GitHub:** 2026-11-09. **Sem prova de execução em produção hoje.** Verificação pública de `aro.atlashub.si/health` e `app.club.atlashub.si` indisponível nesta sessão. Relatórios operacionais de 17–20/10 são evidência histórica, não leitura atual do runtime.

## Fontes do estado
- `atlashub-finance`: ARO V1 e Hosted Checkout funcional; homologação E7 com PIX real em EspelhoMeu/atlashub.si documentada em `atlas-ops/projects/atlashub-club/GO-LIVE-COMERCIAL-2026-10-17.md`.
- `atlas-ops/projects/atlashub-club/RECONCILIACAO-ESTADO-2026-10-20.md`: **Genesis payments NO**; `genesis-01-br` DRAFT em runtime; `allowedOrigins: []`, `webhookUrl: null`, POST checkout-links devolvia 422 INVALID_OFFER.
- `atlashub-club` PR #30 (**OPEN, NÃO MERGED**, head `claude/genesis-checkout-aro` em branch base PR #23): inscrição e checkout PIX implementados em branch, com testes declarados, mas **não integrados no main**.
- `atlashub-club` PR #40 (**MERGED**, 02/11): F01 usa checkout oficial **Hotmart**, não ARO. 12 meses de benefícios/área Hotmart pós-compra **não comprovados em produção**.
- `atlas-club-campus` main: `apps/web/app/api/billing/*` é **Stripe para SaaS/assinatura da organização LearnHouse**, gated por SaaS billing; **NÃO é a matrícula de alunos Genesis nem o ARO**.

## Divergências bloqueantes de produto

| Chave | Fonte 1 | Fonte 2 | Ação |
|---|---|---|---|
| Standard | `atlashub-club/aro.project.yaml`: `genesis-01-br` R$490 DRAFT | `atlashub-finance/infra/projects/atlas-club/aro.project.yaml`: `genesis-01-standard` R$490 ACTIVE no ficheiro | Escolher código único; ler catálogo atual do runtime ANTES de sincronizar |
| Student | `genesis-01-student-br` R$190 DRAFT no Club | ausência da oferta Student no manifesto finance | Normalizar manifesto, regras e testes antes de ativar |
| Entitlement | manifests: `atlas-club:genesis-01` | PR #30: `atlas-club:course:genesis-01` | Definir uma única chave no contrato. Recomendada `atlas-club:genesis-01` para compatibilidade com manifests atuais, desde que runtime confirme |
| Estudante | decisão comercial posterior: autodeclaração, SEM comprovação documental | PR #30 exige revisão/APPROVED manual | Atualizar contrato/SQL/testes segundo decisão vigente; prever auditoria contra abuso sem documentos por defeito |
| Identidade | `club.atlashub.si` auth Supabase Club | `app.club.atlashub.si` login LearnHouse | Bridge verificada obrigatória; não conceder acesso só por e-mail, return URL ou webhooks |
| Webhooks | ARO emite estado/entitlement | `atlashub-club/src/app/api/aro/webhook/route.ts` main só valida e loga evento | Adicionar consumer idempotente, resolução server-to-server e provisionamento seguro no Campus |

**Não resolver inconsistências alterando listas de preços apenas no frontend**; ARO deve confirmar offer/currency/amount. Também não associar `invoice paid` ao SaaS LearnHouse.

## Contrato alvo — uma única fonte financeira
```
LearnHouse Campus user (authenticated)
  → membership/order intent com global_member_id e offer autorizado
  → BFF AtlasClub (server) verifica elegibilidade e cria checkout link ARO
  → ARO PIX BRL (ou método EUR futuro após onboarding/contrato local)
  → provider paid → ARO order APPROVED → entitlement ACTIVE
  → webhook ASSINADO para integração; idempotência, outbox e reconciliação
  → Campus consulta ARO server-side, valida identidade mapeada e ACTIVE
  → matrícula/acesso (course + group) gravados uma vez, com source_order_id
  → REFUNDED/CHARGEBACK/EXPIRED → revogar acesso correspondente e auditar
```
`PENDING` nunca concede acesso. `payment proof` por WhatsApp não confirma direitos. Webhook sozinho não é autoridade: revalidar ARO.

## Hotmart como segundo fornecedor já utilizado
A F01 foi implementada com checkout Hotmart; preservar plataforma e condições dos compradores.
Só conceder curso F01 no Campus mediante pagamento confirmado por evento/consulta autorizados da Hotmart (quando connector/API suportar), ou reconciliação manual auditada. Uma compra Hotmart NÃO equivale automaticamente a entitlement ARO, e não deve haver cobrança duplicada.
Acesso a "AtlasClub por 12 meses" necessita de contrato preciso: a que comunidades/cursos, início/fim, como revogar/caducar. Nunca conceder acesso ao Genesis pago sem direito específico.

## Multimercado (França/Portugal)
Um membro global e programas por país. Ofertas comerciais com `market=BR|PT|FR`, `currency=BRL|EUR`, `tax_rules`, `entity_seller`, `payment_methods`, `fulfillment` explícitos.
O ARO é gateway comercial; **NÃO** tratar EUR, SEPA/cartão/MB WAY/Multibanco como homologados para o Club só porque existem integrações noutros projetos. Confirmar KYC/merchant, contratos dos providers, VAT/IVA/faturação, reembolsos, proteção GDPR/LGPD, informações pré-contratuais antes de vender.
Cuidado com mensalidades: `cadence: month/year` em schema não prova ciclo de cobrança recorrente; V1 abrir somente purchase-once comprovado; recorrência fase separada.

## Sequência de execução — Gates
**G0 READ-ONLY (sem dinheiro):** inventariar ARO production `atlas-club`, 2 ofertas, estados, keys presentes/sem as imprimir, allowedOrigins, webhook URL, provider route; Campus auth/organizacao; Club auth independente; F01 Hotmart; registar divergências. Owner: operador ARO + operador Campus, sem dependência de Helena.
**G1 CONTRACT:** decidir IDs e student self-declared, entitlement key, oferta por mercado, seller, política de acesso e EULA. Código + migração compatível com estado existente; reconciliar PR #30 por port seletivo, **NÃO merge direto sobre PR #23 antigo**.
**G2 STAGING/DRY-RUN:** test user, checkout sintético ou ambiente isolado, event signature/replay/duplicate, idempotency, sem PII, matriz Free/F01/Genesis/Operador. Validar refunds e suspensão.
**G3 DINHEIRO REAL CONTROLADO:** validar BRL PIX sob autorização específica e valor conhecido, confirmar ARO APPROVED→ACTIVE→Campus access. Testar cancelamento/revogação por procedimento controlado apropriado. Não abrir vendas antes de resolver divergência de oferta e link de utilizador.
**G4 OPEN:** ativar flags comerciais sob GO, alertas ARO, suporte e diário de operações; acompanhar exceções. Não bloquear Free.
**G5 CROSS-BORDER:** PT/FR EUR e eventual recorrência como projetos específicos após contract/compliance.

## Critérios de aceite P0 financeiro
- [ ] `GET /health` ARO real com DB UP e leitura catálogo (sem print de segredos).
- [ ] `atlas-club` runtime offers/códigos/valores e status combinam com manifests.
- [ ] Origem e webhook aprovados/configurados; keys já existentes, não expostas.
- [ ] Pagador/identidade mapeada no Campus sem simples lookup por e-mail.
- [ ] Standard R$490 e Student R$190 segundo regra vigente validados server-side.
- [ ] Teste transação única cria entitlement ACTIVE e acesso apenas à turma paga.
- [ ] Testes PENDING, replay, refund/chargeback, acesso cruzado, duplicado, expiração.
- [ ] F01 Hotmart preservada, sem dupla cobrança ou acesso implícito Genesis.
- [ ] QA de interface e rollback/flag comercial.
- [ ] Evidências sanitizadas: PR SHA, data, request IDs, estado, acesso antes/depois. Sem dados pessoais, segredos ou comprovativos.

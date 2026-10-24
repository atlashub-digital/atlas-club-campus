# ARO → matrícula Campus — plano de integração V1

Status: contrato proposto, não integração implementada. Data: 24/10/2026.
Dependência: ADR-003 em IDENTITY_IMPLEMENTATION.md e contrato canónico em ../../contracts/IDENTITY_ACCESS_AND_ARO.md.

## Autoridades
ARO decide pagamento e entitlement económico. Supabase Auth identifica o principal. Club mantém programa, edição e matrícula; LearnHouse armazena curso, atividades e progresso. Campus não usa chaves de Stripe/PixGo/MisticPay nem cria decisões financeiras. WhatsApp/Discord não concedem direitos.

## Mapeamento V1 de edição
Registro proposto (não tabela criada): program_id, edition_id, template_course_uuid, template_version, learnhouse_course_uuid, usergroup_id, entitlement_ref, status. Uma edição aponta para curso próprio e atividades com UUIDs próprios. Um grupo restrito por edição controla acesso; o mesmo aluno pode estar em vários grupos sem compartilhar progresso.

Reutilização: criar curso-modelo privado; congelar versão editorial; clonar/exportar-importar pelo mecanismo nativo autorizado; conferir novos UUIDs e conteúdo/media; associar edição e grupo; publicar após revisão. Não sobrescrever em massa cursos em andamento. Correção editorial exige diff por edição; manter versão e log de aplicação. O isolamento V1 já foi exercitado no CI 40038938210 usando cursos distintos. Não foi criada ainda uma entidade nativa de programa/turma nem provado isolamento ao reutilizar o mesmo course_id.

## Entrada autoritativa e processamento
1. Portal cria checkout via interface ARO autorizada para oferta canónica; Student exige autodeclaração server-side conforme contrato. Free não cria pagamento. Nenhuma chamada é feita nesta wave.
2. Receber evento por canal autenticado. Congelar com Helena os endpoints, algoritmo/cabeçalhos de assinatura, bytes assinados, timestamp/tolerância, event_id e contrato de versionamento antes de implementar. Não inventar compatibilidade HMAC ou formato de outro projeto.
3. Persistir inbox idempotente antes de confirmar receção. Evento válido enfileira reconciliação; não conceder pelo redirect do browser ou apenas por payload de webhook.
4. Consultar estado autoritativo atual do entitlement no ARO. Resolver principal e edição via IDs canónicos. Evento atrasado não pode reativar direito já revogado. Quando houver versionamento monotónico, armazenar a versão; caso contrário, serializar reconciliação por principal+entitlement e reler estado.
5. Projetar matrícula no Club e membership no grupo LearnHouse através da interface permitida pela edição/licença. Guardar desired_state e applied_state; marcar ACTIVE apenas após confirmação efetiva. Falha parcial não produz mensagem de acesso concluído.
6. Retry com backoff limitado e dead-letter auditável. Reconciliador periódico compara ARO, matrícula e grupo; reprocessamento preserva idempotência.

## Estados propostos
| Estado observado | Ação Campus |
| --- | --- |
| Pagamento pendente ou falhado | Não conceder matrícula paga |
| Entitlement ACTIVE e identidade resolvida | Provisionar matrícula e grupo da edição |
| Identidade não resolvida | PENDING_IDENTITY, sem vinculação automática por email |
| ARO indisponível | Não criar novos direitos; aplicar política aprovada de validade/revalidação aos existentes |
| Direito expirado, suspenso ou revogado | Remover projeção de acesso correspondente; manter progresso histórico |
| Refund externo | Reconciliar revogação no ARO; sem interface de refund no Campus |
| Compra reintroduzida | Reconciliar estado atual; evitar duplicar usuário, matrícula ou progresso |

A remoção de um direito não elimina outro válido: recomputar a união de concessões por principal+edição antes de remover membership. Revogar acesso não elimina a conta global nem progresso de outras edições. O SLA de revogação e comportamento de cache devem ser aprovados; não alegar revogação imediata por mera receção de evento.

## Esquema lógico mínimo, não migrations
Inbox(event_id único, digest, received_at, status, attempts); Enrollment(principal_id, edition_id, desired_state, applied_state, version); Grant(source_entitlement_ref, principal_id, edition_id, state, expires_at); Outbox(operation_id único, enrollment_id, action, result). Segredos fora das tabelas de auditoria. Unicidade da matrícula por principal+edição e da concessão por entitlement+edição. Localização exata dos dados Club depende de revisão Helena; PostgreSQL educacional dedicado continua separado da Master.

## Ordem de entrega e aceitação
A. Congelar contrato ARO real e método LH licenciado; definir owners e SLA. B. Adapter isolado e inbox/outbox, testados com fixtures explicitamente de contrato. C. Sandbox ARO + identidades teste + Campus staging real. D. Homologação conjunta, depois canário autorizado; nenhuma ativação produtiva implícita.

Casos obrigatórios: assinatura inválida, replay, duplicado concorrente, evento fora de ordem, timeout após escrita, retry, erro de provisioning, duas compras válidas na mesma edição, revogar uma mantendo a outra, Free abrindo conteúdo pago, membro de A tentando B, mesmo aluno em duas edições com progressos distintos, suspensão global, refund externo, reativação, reconciliação após indisponibilidade. Evidência deve distinguir teste de contrato de execução contra ARO real.

Rollback: desligar worker de novas concessões preservando inbox e auditoria, manter processamento de revogação por procedimento acordado, reverter versão de adapter compatível com dados; nunca truncar matrículas nem restaurar snapshot financeiro para desfazer deploy. Helena executa operações privilegiadas. Valores de oferta e endpoints só serão usados após verificação canónica, sem nova configuração de providers no Campus.

# ADR-003 — Ponte de identidade Atlas ClubOS

Status: proposta de implementação; NÃO implementada nem homologada. Data: 24/10/2026.
Base: LearnHouse 1.4.2, commit be390299e9f3b60b76f9f691cf0e226788f5b150.

## Decisão e fronteiras
Supabase Auth Master continua como identidade única. LearnHouse mantém usuários projetados e RBAC próprios no PostgreSQL dedicado. O contrato canónico de vínculo continua club.identity_links, sujeito a migração revista pela Helena; esta wave não aplica migração à Master. ARO determina direitos económicos e não autentica o utilizador.

Escolher primeiro um método suportado/licenciado pelo upstream. O SSO nativo está classificado como Enterprise na base auditada. Não ativar flags EE, reaproveitar código EE sem licença, compartilhar chaves JWT ou presumir que API tokens/headless são disponíveis na Community. Uma extensão própria AGPL só avança depois de revisão explícita da fronteira de licença e das superfícies suportadas, mantendo a emissão e rotação de sessão nativas. Essa revisão é dependência da implementação, não do design ou staging isolado.

## Investigação que desbloqueia o adaptador
1. Obter confirmação upstream sobre protocolo suportado, edição necessária, provisionamento e logout/revogação. Não presumir que aceitar OIDC como cliente torna Supabase um emissor compatível com LearnHouse.
2. Inventariar na Master de teste issuer, algoritmos/chaves, sessão e OTP; validar configuração sem exportar segredos.
3. Fazer spike isolado com duas contas fictícias e provar login único, sessão local e autorização server-side. Comparar esforço de opção licenciada com adaptador AGPL antes de escolher.

## Fluxo alvo (endpoints ainda não definidos)
1. Campus inicia handoff para o ponto canónico de autenticação, com state e destino relativo permitido. Sessão Master existente evita novo login; caso contrário, usa OTP/Magic Link. Alvos de produto: OTP 5 minutos e sessão até 7 dias, sujeitos à configuração e revogação; não significam JWT válido durante sete dias.
2. BFF valida a sessão no servidor: assinatura, algoritmo permitido, issuer e audience exatos, expiração, subject e estado de sessão. JWKS aplica-se a chaves assimétricas; não assumir que o projeto já foi migrado para elas. Claims editáveis pelo utilizador não atribuem funções ou matrículas.
3. Emitir código opaco de uso único, prazo curto (proposta: 60 segundos), ligado ao state, sessão e destino. Consumir atomicamente no servidor Campus. Nenhum token Master/LH, refresh token ou secret em URL, logs ou armazenamento local do browser.
4. Resolver vínculo por issuer + subject imutáveis. Criar projeção local com identidade mínima usando interface autorizada. Chave única para impedir duplo provisionamento concorrente. Email serve para comunicação, nunca como chave automática de associação. Conta local preexistente exige reconciliação explícita.
5. Criar sessão nativa LearnHouse apenas pelo caminho aprovado. Preservar RBAC nativo; possuir identidade não concede curso pago. Cookies host-only, HttpOnly, Secure em staging HTTPS; não distribuir cookie de produção a subdomínios de teste.
6. Logout encerra sessão local e revoga a associação da sessão no broker; logout global segue contrato Master. Suspensão bloqueia novos handoffs e sessões existentes. JWT assinado ainda válido não prova ausência de revogação: definir revalidação server-side e SLA de bloqueio antes do gate.

## Dados e interfaces propostos
IdentityLink: master_user_uuid, issuer, learnhouse_user_id, status, version, timestamps. BridgeSession: identificador opaco, master_session_id, local_session_ref, expires_at, revoked_at. Consumir estado via interface mínima; não ler/escrever auth.users diretamente nem usar Master como base educacional. Se algum esquema for exposto pela Data API, RLS e grants mínimos são requisitos, não um service_role no frontend.

Implementação isolada em adaptador com operações verifyPrincipal, resolveIdentity, provisionUser, establishSession e revokeSession; nomes internos propostos, não endpoints existentes. Telemetria contém correlation_id e decisão, sem credenciais. Feature flag desativada por padrão; contas locais de teste permanecem apenas no staging segregado.

## Gate de identidade
Provar: sessão Master existente entra sem outro login; replay/estado trocado/redirect externo negados; JWT expirado, issuer/audience errados e assinatura desconhecida negados; rotação de chaves; concorrência gera um único vínculo; alteração de email preserva subject; tentativa de ligar conta alheia negada; logout/suspensão interrompem acesso dentro do SLA; indisponibilidade não concede acesso; duas sessões/navegadores; dados mínimos e nenhuma credencial em screenshots/logs.

## Fontes e limites
Código fixado: src/core/deployment_mode.py; src/security/auth.py; contratos/IDENTITY_ACCESS_AND_ARO.md (caminho real: contracts/IDENTITY_ACCESS_AND_ARO.md).
Documentação oficial consultada: https://supabase.com/docs/guides/auth/jwts e https://supabase.com/docs/guides/auth/sessions . JWTs são de curta duração e sessões usam refresh; session_id permite correlacionar a sessão. Revalidar SDK e configuração na implementação. O índice https://supabase.com/changelog.md não pôde ser lido pelo leitor web (content-type text/markdown); nenhuma afirmação de compatibilidade de versão decorre dessa tentativa. Nenhuma configuração real da Master foi inspecionada ou alterada.

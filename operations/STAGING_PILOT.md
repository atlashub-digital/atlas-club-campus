# Helena — staging persistente Atlas ClubOS

PR: https://github.com/atlashub-digital/atlas-club-campus/pull/1
Branch: feat/clubos-bootstrap. Não promover enquanto CI e aceitação funcional estiverem pendentes.

## Instalação reproduzível em ambiente isolado
1. Selecionar VPS com Docker/Compose e inventariar recursos; reservar projeto e volumes exclusivos atlas-clubos-staging.
2. Checkout do SHA revisado; Bun 1.4.3; executar bun scripts/atlas/dev-config.ts. O gerador recusa sobrescrever .env existente, gera segredos e fixa PostgreSQL/Redis.
3. Build: docker build --build-arg LEARNHOUSE_PUBLIC=true -t atlas-club-campus:<sha> .
4. Adaptar cópia do Compose gerado para imagem exata/digest, hostname validado e projeto staging. O padrão localhost:8080 é só desenvolvimento: ajustar URLs públicas, SSR e colaboração em conjunto antes de usar DNS. Não publicar banco/Redis.
5. Manter Caddy como entrada HTTPS, encaminhar Web/API/WebSocket ao nginx dedicado; não disputar 80/443. Validar cabeçalhos e upgrade WebSocket.
6. Guardar segredos fora do Git, criar admin restrito, persistir DB e media, backup externo e política de retenção. Não executar down -v em staging.
7. Executar aceitação com contas descartáveis segregadas; testar colaboração em dois navegadores, upload, reinício preservando conteúdo/progresso, restore DB+media e rollback de imagem compatível com schema. O teste CI de restore cobre só dados DB e não certifica media.

## Retorno necessário de Helena
Host/capacidade aprovados, hostname e DNS/TLS, porta loopback livre, projeto/rede/volumes, store de segredos, backup/monitorização e responsável por rollback. Não enviar segredos em comentários. SSO é frente separada: não alterar Supabase Master, ARO, Club produtivo ou GWD.

## Reinício coordenado e forwarding SSR

No desenvolvimento HTTP em porta diferente de 80, o sidecar ssr-fwd partilha o namespace de rede de learnhouse-app. A CI Wave 2 40112087491 encontrou API/progresso intactos após restart simultâneo, mas /login passou a apresentar not-found. A hipótese operacional é o sidecar arrancar no namespace anterior da aplicação. O procedimento de validação passa a parar a stack sem remover volumes e usar up -d --wait, respeitando dependências. A correção precisa de CI verde; não interpretar health HTTP da API como prova do SSR. Em staging HTTPS seguir a topologia prevista e validar login, curso e media depois de cada reinício. Nunca usar down -v no staging persistente.

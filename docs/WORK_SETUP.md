# Setup recomendado — Codex Cloud + ChatGPT Work

## Codex Cloud: ambiente publicado Atlas ClubOS
1. Conectar organização GitHub AtlasHub; seleccionar o repo `atlas-club-campus` quando criado.
2. Criar ambiente reutilizável dedicado `ATLAS-CLUBOS-STAGING`, não reutilizar GWD nem produção.
3. Dependências de build conforme LearnHouse pinned: Node/Bun ou package-manager presente em lockfile, Python/uv, Docker/Compose quando runner permitir. O script de setup deve instalar e validar sem migrar DB pública; comandos finais dependem do commit fixado.
4. Internet/rede: configurar acesso mínimo a npm/pypi/GitHub/imagens na fase de setup se necessário; staging apenas por vias autorizadas. Nunca ligar root VPS/SSH produtivo ao Codex Cloud.
5. Secrets: sem SUPABASE_SERVICE_ROLE_KEY, ARO_SERVER_KEY ou passwords de prod no ambiente cloud. Para E2E usar fixtures/sandbox/staging. Helena instala e gere segredos de staging e prod.
6. Uma tarefa por PR e por branch; habilitar CI, E2E, artifacts e screenshots. `AGENTS.md` deve estar no root da branch Campus; instruções curtas e estáveis. Guardar documentação e decisões no repo, não apenas no chat.
7. Verificar que setup publicado aplica a novas tarefas; tarefas existentes conservam estado. Commitar e enviar alterações antes de iniciar nova tarefa.

## Work: função de coordenação
- Usar projeto Work `Atlas ClubOS` para auditorias, GitHub/Drive, revisão de PRs, rastrear dependências e emitir relatório executivo G0–G6.
- Work não deve ter segunda pessoa a alterar a branch do Codex simultaneamente; pode revisar arquivos e produzir documentação/QA.
- Usar Drive para media e design aprovado; GitHub para contratos, issue, ADR, testes e verdade técnica; Notion opcional para decisões de direção.

## Setup de acesso mínimo GitHub
Codex repo `atlas-club-campus` com leitura+branches+PR e, se permitido, push não protegido; portal `atlashub-club` leitura por defeito, escrita só se designada; `atlashub-finance` leitura em missão de integração, mudanças financeiras só por Helena/owner.

## Fontes
https://help.openai.com/pt-br/articles/20001545-using-codex-cloud
https://help.openai.com/pt-br/articles/20001275-chatgpt-work-and-codex
https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex

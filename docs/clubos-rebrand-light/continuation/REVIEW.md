# Continuação — revisão estática (2026-10-28)

Os commits anteriores foram preservados. Nenhum browser, harness visual, servidor de desenvolvimento, build Docker ou deploy foi executado nesta continuação. As capturas e accessibility.json no diretório pai são artefatos históricos das tentativas anteriores: não comprovam o HEAD atual. A Helena captura as evidências atuais em 390/768/1440 fora deste ambiente, conforme seção 9 do brief.

## Apresentação implementada

- Cards de cursos, comunidades e Playgrounds com corpo, título, descrição e rodapé explícitos no componente; grade responsiva já existente preservada. Thumbnails reais permanecem; a capa vetorial de curso e os símbolos de comunidades/Playgrounds são fallbacks identificáveis, sem inventar conteúdo.
- Curso com capítulos operáveis por Enter/Espaço, estado aria-expanded e foco visível. Sidebar, links, restrições e lógica de progresso preservados.
- VideoReader preserva react-youtube/iframe, opções e eventos existentes, com fallback Abrir no YouTube e CTA de contraste adequado. Não houve alteração de resolução/entrega de mídia.
- PDF em painel branco, controles claros com foco e superfície de fullscreen branca. URLs, download e autorização preservados.
- Inputs, textareas e tabelas reutilizáveis com tratamento claro sob a flag; formulários de curso e tabela de membros mantêm os handlers e gates existentes.
- Menu mobile com foco inicial na pesquisa, Escape devolvendo foco, fechamento por link e ao mudar para desktop; acesso administrativo continua condicionado aos direitos existentes.
- Google permanece visível somente quando configurado sob a marca; SSO depende da configuração existente. Corrigidas props sem uso no componente de adesão já autenticada; nenhum fluxo de autenticação alterado.

## Verificação real

Executado em apps/web:

- `npx tsc --noEmit`: exit 0, sem saída (typecheck.txt).
- `npx eslint .`: exit 1; **911 problems (24 errors, 887 warnings)** (lint.txt). Os 24 erros estão fora dos arquivos alterados nesta continuação. Não foi executado um baseline novo de main; não se afirma que main está limpo. O script lint do package.json contém `|| true`, por isso foi usado o executável diretamente.
- ESLint dos arquivos TS/TSX alterados desde 3dc410a2: exit 0; **0 erros, 7 avisos** (lint-changed.txt).
- `bun test tests/video-source.test.mjs`: exit 0; **30 pass, 0 fail**, 85 assertions (tests.txt).
- `git diff --check`: sem erros.

A primeira execução de TypeScript encontrou duas props googleConfigured inválidas em LoggedInJoinScreen, corrigidas no commit d8d7cfce. Houve uma tentativa de invocar tsc a partir da raiz sem compilador local; a verificação válida acima foi executada em apps/web. O teste de vídeo exige bun:test; a tentativa com node --test falhou por esse motivo, seguida da execução correta com Bun.

## Contraste estático WCAG

Cálculo de luminância relativa sRGB, razão (Lmaisclaro + 0,05)/(Lmaisescuro + 0,05):

| Uso | Par | Razão |
| --- | --- | --- |
| Texto principal | #172335 / #FFFFFF | 15,81:1 |
| Texto secundário | #526174 / #FFFFFF | 6,32:1 |
| Texto secundário no canvas | #526174 / #F5F6F8 | 5,85:1 |
| CTA branco / azul e foco azul | #FFFFFF / #3268D6 | 5,14:1 |
| Contorno de campo | #7C8898 / #FFFFFF | 3,60:1 |
| Mensagem de erro | #A12622 / #FFFFFF | 7,46:1 |

Texto acima supera 4,5:1; contorno supera 3:1 para componentes. #E3E7EC é separador decorativo, não o único indicador de controle. Inspeção estática confirma nomes acessíveis dos controles de PDF, cards e menu; busca recebe foco ao abrir menu; capítulos respondem a teclado; controles de edição aparecem no toque/foco. Isto não certifica WCAG 2.2 AA em execução: leitura por tecnologia assistiva, ordem de foco, reflow e cores finais computadas precisam de revisão externa.

## Limitações/stubs explícitos

- Sem novas screenshots nem auditoria em browser. Artefatos históricos não foram refeitos nem removidos.
- Sem validação autenticada Admin/Convidado, logout, invite-only, respostas PDF 200/403, reprodução YouTube, quiz 75% ou Trail 4/4. Código e gates foram preservados; esses critérios continuam pendentes de validação funcional externa.
- Admin recebe primitives e superfícies principais; editores avançados, analytics, modais e extensões podem manter apresentação upstream. Não se declara uniformidade visual completa.
- O lint global permanece com os erros listados no log (React/no-undef, escapes, bloco vazio, componentes criados durante render, BlobPart/no-undef). Não foram feitas mudanças fora de escopo para mascará-los.
- Estados vazios e fallbacks são reais; não há cursos, inscrições, autores, comunidades ou pagamentos simulados.
- Nenhuma alteração de API, BD, RBAC, endpoints, motor de mídia, quiz ou progresso nesta continuação; nenhuma publicação em produção ou intervenção nos serviços proibidos.
- PR deve permanecer DRAFT contra main; sem ready ou merge. A avaliação visual ainda depende da captura externa da Helena.

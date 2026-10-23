# Atlas ClubOS — Full Visual System (100%)

**Direção:** identidade Atlas Club existente; sem redigir uma UI genérica, nem copiar a interface LearnHouse e só trocar cores. O backend pode continuar upstream; o frontend e UX visual precisam de 100% de coerência Atlas na V1.

## Linguagem
Escuro premium, azul-marinho, azul elétrico e dourado suave; uso moderado de glow, gradientes e profundidade; triângulo Atlas como assistente. Tipografia legível, espaçamento confortável e visuais diversos/acolhedores. Aulas e exercícios priorizam concentração, não marketing.

## Áreas/rotas a personalizar
- `/` do Campus: home autenticada, próximos passos, atividades, agenda, conquistas.
- `/academias` e `/academias/[slug]`: catálogo de academias lógicas.
- `/programas/[slug]`: objetivos, cursos, edições, requisitos e acesso.
- `/turmas/[id]`: agenda, colegas (privacidade), conteúdos, tarefas e mentores.
- `/aprender/[course]/[lesson]`: player, progresso, notas, downloads, exercício.
- `/comunidade` `/espacos/[slug]`: feed/discussões e grupos.
- `/eventos`: encontros híbridos, inscrição/RSVP, calendário.
- `/projetos`: projetos e equipas.
- `/perfil`, `/notificacoes`, `/conquistas`: identidade e progressão.
- `/admin`: autoria, gestão, moderação, estado de matrícula, suporte.

**Nota:** são rotas-alvo conceptuais. A versão real do LearnHouse tem rotas próprias; o Codex deve propor mapa de migração e redirects e não assumir que os caminhos já existem.

## Padrões
- Header, sidebar desktop, bottom nav mobile, breadcrumbs, cards, campos, modais, toasts, player e skeletons.
- Tema Atlas responsivo (360 / 390 / 768 / 1024 / 1440 / 1920) e acessível por teclado.
- Estados por entitlement e role — sem cards de acesso pago manipuláveis pelo browser.
- Assets visuais da campanha e marca só quando licenciados/fornecidos pela Direção; placeholders honestamente identificados.
- Screenshots antes/depois em staging por rota, design QA com fundador.
- Não expor features ainda inativas como botões funcionais.

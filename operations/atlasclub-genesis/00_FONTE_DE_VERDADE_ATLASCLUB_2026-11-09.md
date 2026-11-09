# ATLASCLUB — FONTE DE VERDADE CANÓNICA V1
**Data de validação:** 09/11/2026. **Estado:** diretriz de produto ratificada pelo fundador; implementação ainda não homologada em produção.
**SUPERSEDE** nomenclaturas, promessas de acesso pago, cronogramas e leituras do nome «Genesis» em materiais anteriores, quando divergirem deste documento. O histórico permanece conservado para rastreabilidade.

## 1. Identidades e fronteiras
- **ATLASCLUB** é o **sistema/plataforma** de comunidades, publicações, cursos, biblioteca, podcasts, playgrounds e espaços colaborativos; a aplicação-alvo é \`app.club.atlashub.si\`, construída sobre o LearnHouse existente, mantendo a licença aplicável e o estilo aprovado.
- Uma instalação **pode acolher múltiplas comunidades**. O registo central do membro não deve implicar uma conta independente por comunidade. Uma pessoa pode participar em várias comunidades, cursos e grupos, com permissões distintas.
- **Comunidade AtlasClub Genesis** é a **primeira comunidade** e o primeiro caso operacional. Não é sinónimo de AtlasClub nem um requisito de pagamento. Tema: **GWD AI-Native como piloto público demonstrador**, IA agêntica, aprendizagem prática e criação de soluções, sem confundir as duas organizações.
- **Comunidade AtlasClub France** é a **segunda comunidade prevista**, em francês, dedicada ao público francófono. Partilha princípios e pode trabalhar também o tema Genesis/GWD, mas com acolhimento, moderação e conteúdos em francês. NÃO duplicar automaticamente publicações, dados pessoais ou anúncios reservados.
- **Outras comunidades:** oportunidades futuras em negócios e IA 2027–2030, Portugal e setores; **não criar nem anunciar como lançadas** neste ciclo.
- GWD mantém governação e sistemas independentes; o AtlasClub recebe somente informações **públicas, aprovadas e verificadas**, identificadas como caso, simulação, piloto ou produção real.

## 2. A experiência comunitária — Genesis
**Modelo inicial:** adesão Free para participar no núcleo social. Algumas funcionalidades, cursos, conteúdos e oportunidades **poderão ser pagas posteriormente** com condições próprias; nunca cobrar automaticamente pelo simples acesso à comunidade Free.
**Conteúdos / superfícies:**
- **Feed e Informações GWD AI-Native:** progresso público do piloto, lições, demos autorizadas, notícias, marcos e atualizações documentadas (com verificação e aprovação editorial).
- **AI Agêntica:** dicas, métodos, arquitetura, agentes, integrações, exemplos, recomendações de boas práticas.
- **Radar GitHub:** referências a repositórios públicos, avaliação de licenças, demos, oportunidades e notas técnicas.
- **Comunidade/Fórum:** publicações dos membros, perguntas, comentários, reações, apresentações, colaboração e moderação humana.
- **Aprendizagem:** percursos e cursos Free; cursos pagos apenas com produto, regras e matrícula verificados.
- **Playground:** estudar e validar módulos reais do LearnHouse (HTML interativo, geração assistida por IA e permissões). Começar com exemplos seguros e dados sintéticos; NÃO prometer agentes Hermes executáveis ou ferramentas com acesso a operações antes de integração e segurança.
- **Biblioteca:** organizar conteúdos por programas com pastas, referências a cursos, podcasts, comunidades, boards, playgrounds e ficheiros; acesso segundo permissão de cada recurso.
- **Podcasts:** séries e episódios com player/áudio e RSS conforme configuração e publicação; testar media e distribuição reais antes de anúncio.

## 3. AtlasClub France
Nome público: **AtlasClub France**.
Mensagem francesa candidata: «La communauté de celles et ceux qui construisent l’avenir avec l’IA.»
Descrição: «Actualités de l’IA agentique, projets AI-Native, démonstrations du laboratoire Genesis et échanges entre membres francophones.»
- Comunicação, acolhimento, normas e suporte em francês; casos e fontes públicos, curadoria própria.
- Modelo de entrada Free semelhante ao Genesis, funcionalidades pagas apenas quando aprovadas.
- Não pressupor a tradução automática nativa de tudo o que existe em português: configurar locale \`fr\` e conteúdos específicos; validar i18n no UI e política de cookies/privacidade adequada.
- A inscrição no AtlasClub não concede por defeito acesso a toda a formação paga, mas membros podem aderir a ambas as comunidades.

## 4. Modelo de organização no LearnHouse
- **Uma organização AtlasClub** na instância LearnHouse, após confirmar o orgslug real, e **duas comunidades nativas** (Genesis, France). Não criar outra organização ou app para France nesta fase.
- Comunidade, curso, grupo, projeto e permissão são entidades distintas. *UserGroups* para turmas/trilhos/equipas; *Boards* privados para colaboração; turmas/cursos separadas por edição e entitlement.
- Nova organização técnica apenas se houver requisito forte de isolamento jurídico, dados, administração ou faturação; é decisão futura e não condição do arranque.
- Perfis: Guest, Member Free, Aluno matriculado, Construtor convidado, Operador atribuído, Moderador/Admin. \`role\` ≠ \`entitlement\` ≠ \`group membership\` ≠ \`country\`.

## 5. Navegação e pequena personalização agora
Ordem prioritária recomendada: **Início / Comunidades / Academia / Biblioteca / Playground / Podcasts / Meu Espaço**, com *Laboratório* como coleção/editoria dentro de Genesis enquanto não existir módulo próprio.
- Usar menu **configurável por organização** já suportado; ajustar nomes, ordem, cartões, cores e imagens sem redesenho completo.
- Página inicial autenticada: seleção de comunidades + anúncio recente real + primeiro passo do membro + cursos recomendados + novidades públicas autorizadas. Sem contadores ou eventos fictícios.
- Mais adiante considerar nova Home social usando dados reais e feature flag; não substituir o shell estável sem QA.
- Respeitar limitações atuais e feature gates do LearnHouse. Não apagar atribuição legal/licença.
- A redação e o design devem comunicar **ATLASCLUB** no topo; **Genesis** e **France** identificam comunidades e não a marca mãe.

## 6. Comércio: **Hotmart + ARO → uma política de acessos**
- **Hotmart:** oferece checkout de produtos existentes, e futuramente pode vender um direito de acesso a curso, área ou comunidade paga; **compra não é automática no Campus** até existir integração comprovada (webhook/API/relatório validado) ou reconciliação manual auditada.
- **ARO:** pode vender diretamente ofertas do AtlasClub e ser o **orquestrador canónico de checkout direto** para BR e, futuramente, outros mercados e provedores (ex.: Stripe em EUR), **apenas após homologação** por método/entidade/país e cumprimento de obrigações legais/fiscais aplicáveis.
- Fonte de verdade do pagamento: respetivo processador e evento confirmado. Fonte de verdade do **acesso no Campus**: registo único de direitos verificados, associado à identidade do membro (não apenas pelo e-mail), com \`provider\`, \`external_order_id\`, \`entitlement_key\`, \`status\`, \`valid_from\`, \`expires_at\`, \`campus_user_id\`, idempotência e auditoria.
- **Um benefício não deve exigir duas compras.** Compras Hotmart não geram por si encomenda ARO artificial. Não misturar Stripe SaaS Billing interno LearnHouse com venda aos alunos.
- Não publicar vendas pagas Genesis antes de reconciliar oferta e entitlement (ver \`07_ARO_PAGAMENTOS_MEMBROS_GATE.md\`). Reembolsos/chargebacks/expiração suspendem apenas o direito correspondente; comunidade Free subsiste.
- A F01 já publicada via Hotmart é um produto específico legado; **não redefinir como sinónimo da comunidade Genesis**, nem conceder automaticamente todas as funcionalidades pagas do AtlasClub.

## 7. Publicação de avanços públicos GWD
\`fonte interna\` → \`seleção editorial\` → \`revisão PII/confidencialidade\` → \`aprovação humana\` → \`publicação identificada no AtlasClub\` → \`comentários/moderação\`.
Partilhar resultados, métricas públicas autorizadas, desafios, demos e boas práticas. Não expor clientes, credenciais, dados de produção, backlog privado, eventos financeiros ou sistema operacional GWD.

## 8. P0: ativação sem aguardar infra nova
1. Validar login real, configuração da organização/feature gates e experiência como convidado e Free.
2. Reutilizar/renomear com inventário comunidade Genesis existente (legacy: «ATLASCLUB | GENESIS») sem duplicar membros, histórico nem posts; configurar primeira comunidade, manifesto, 4 tópicos e 1 update GWD aprovado.
3. Criar AtlasClub France com moderação e textos em francês, mas divulgar apenas após conta convidada testar feed e publicação.
4. Configurar menu por organização e Biblioteca com pastas «Genesis», «France», «IA Agêntica», «GitHub Radar», «Recursos» (sem quebrar permissões dos conteúdos).
5. Fazer um Playground de demonstração isolada/dados sintéticos e uma série de podcast-piloto se os módulos estiverem disponíveis e a cadeia media aprovada; evitar publicação vazia.
6. Ligar CTA de \`club.atlashub.si\` ao registo/login real no \`app.club.atlashub.si\` só com QA e sem presumir SSO.
7. Em paralelo, auditar Hotmart (membros/produtos) e ARO runtime, desenhar normalização do acesso pago; **não ativar pagamentos reais**.
8. CI, browser mobile/desktop e testes de permissões; branch/PR e GO para produção com rollback.

## 9. Critérios mensuráveis de GO
- [ ] Utilizador Free cria sessão, encontra AtlasClub Genesis e publica uma apresentação; moderador revê.
- [ ] Utilizador francófono encontra AtlasClub France e consegue conversar em francês.
- [ ] Genesis publica 1 comunicado do piloto GWD aprovado, com origem e estado claros.
- [ ] Biblioteca abre recursos reais sem ultrapassar autorização; Playground e Podcasts têm demo comprovada ou ficam assinalados como «em preparação».
- [ ] Comprador Hotmart/ARO recebe só direitos contratados, após verificação, sem acesso cruzado, duplicados ou perda de Free.
- [ ] Reembolso/expiração revoga somente o recurso pago.
- [ ] Membros do Discord operacional interno nunca recebem convites públicos por erro.
- [ ] CI e QA em browser aprovados; produção só depois de deploy autorizado.

## 10. Estado e fonte de verdade
Este documento prevalece sobre propostas anteriores quando houver divergência de nomenclatura, âmbito, preço ou papel de Genesis. **Não substitui requisitos técnicos de segurança, licença e direitos já adquiridos pelos compradores de produtos anteriores.** Não confirma que as comunidades France/Genesis já estão em produção, nem que Hotmart/ARO já concedem direitos automaticamente.

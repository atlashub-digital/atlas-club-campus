# Atlas ClubOS — decisões e limitações da primeira wave

## Identidade / ADR-001 — proposta, não homologada
LearnHouse 1.4.2 Community é a base fixada. src/core/deployment_mode.py classifica SSO como EE_ONLY_FEATURES; src/services/plans/plans.py deve ser revalidado antes de qualquer integração headless. Não habilitar flags Enterprise nem presumir que tokens API são liberados.

Opção preferida: validar com upstream uma integração suportada/licenciada em que Supabase Auth Master continua como identidade única. Alternativa sob análise: adaptador de autenticação próprio na base AGPL, com revisão de compatibilidade e licenciamento antes da implementação. Nenhuma destas opções está implementada. Não usar senhas duplicadas, JWT secrets compartilhados ou banco Master para dados educacionais.

Contrato de homologação futuro: validar assinatura/JWKS, issuer, audience e expiração; mapear subject imutável para usuário local; troca server-side de uso único; impedir vinculação automática apenas por email; manter RBAC no LMS; testar replay, logout/revogação, sessões expiradas e ausência de segundo login. ARO continua autoridade financeira; Campus apenas consome direitos aprovados.

## Turmas / ADR-002 — cursos separados por edição (V1)
TrailRun usa trail_id, course_id e user_id; TrailStep usa trailrun_id, activity_id e user_id. Não existe cohort_id nessa identidade. Grupos podem restringir acesso, mas não tornam o progresso independente quando o mesmo aluno reutiliza o mesmo course_id em duas turmas.

Modelo V1 autorizado: uma instância de curso por edição/turma, derivada de um curso-modelo, com UUIDs de atividade distintos. Programa e turma precisam de mapeamento Atlas separado, sem renomear Genesis como plataforma. Alternativa futura: extensão explícita de enrollment/cohort nas chaves de progresso, com migração e compatibilidade upstream. O CI 40038938210 comprovou o mesmo aluno em dois cursos de edições distintas com progressos independentes e acesso negado a outro aluno fora dos grupos. Isso não comprova isolamento de duas turmas compartilhando o mesmo course_id. Reutilização editorial e projeção ARO estão detalhadas em ARO_ENROLLMENT_PLAN.md.

## Licenciamento
LICENSE AGPL upstream preservado, junto com histórico e avisos por diretório (incluindo licença do CLI). A interface inclui acesso ao código-fonte. Antes de produção, revisar obrigações de Corresponding Source e disponibilizar a versão exata implantada, modificações e instruções de build. Recursos Enterprise não foram liberados por alteração de flags. Esta é uma avaliação de engenharia, não um parecer jurídico.

## Design system inicial
CSS Modules em components/Atlas: navy #080e1c, superfícies #111c30, ouro #e0ba73, azul #407bff e texto secundário #adb9ce. Layout 1200px, cards em 3/2/1 colunas, foco visível, tipografia herdada. Homepage consome useCourses e RBAC nativos, sem estatísticas, progresso ou eventos fictícios. A Wave 2 estende o shell Atlas ao catálogo, curso, sala de aprendizagem, comunidade, perfil e dashboard administrativo, preservando os componentes e dados nativos. A personalização integral dos componentes internos continua progressiva. Identidade: ver IDENTITY_IMPLEMENTATION.md.

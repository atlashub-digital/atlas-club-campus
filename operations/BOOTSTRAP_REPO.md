# Bootstrap do GitHub — Atlas Club Campus

**O repositório ainda não existia no momento da preparação (23/10/2026).** O canal de GitHub ligado à conversa permite criar branches, ficheiros, PRs e issues, mas não expõe uma ação para criar novos repositórios. Por isso, este passo precisa de um Codex/Work com capacidade GitHub CLI no ambiente autorizado ou de um proprietário da organização no GitHub.

1. Na organização `atlashub-digital`, criar um repositório privado vazio: `atlas-club-campus`; não criar primeiro em conta pessoal. Verificar permissões de Push/PR e acesso Codex Cloud.
2. Importar o upstream LearnHouse **incluindo a história Git e a licença AGPL**; usar o Git remoto `upstream` apontando para https://github.com/learnhouse/learnhouse.git, e `origin` para o repo da organização. Selecionar release estável/tag/SHA após verificar as releases e dependências de segurança.
3. Exemplos ilustrativos, executar apenas após confirmação de permissões e versão (não executar cegamente em produção):

```bash
# Na máquina autorizada com gh já autenticado na organização AtlasHub:
gh repo create atlashub-digital/atlas-club-campus --private --description 'Atlas ClubOS campus - LearnHouse derived'
git clone https://github.com/learnhouse/learnhouse.git atlas-club-campus
cd atlas-club-campus
git remote rename origin upstream
git remote add origin git@github.com:atlashub-digital/atlas-club-campus.git
git fetch upstream --tags
# confirmar e substituir RELEASE_TAG por uma tag efetivamente existente
# git switch -c main RELEASE_TAG
# git push -u origin main
```

4. Incorporar os ficheiros deste pacote no repo *sem remover ficheiros upstream, LICENSE ou alterações legalmente exigidas*; `AGENTS.md` na raiz, documentação em `docs/atlas/` se conflituar com a upstream. Criar PR da primeira wave e proteger main.
5. GitHub público/privado não modifica obrigações de disponibilização de código correspondente aos utilizadores sob AGPL; cumprir licença em produção e validar a licença empresarial se necessária.

# 0003 — Versionamento com release-please e Conventional Commits

- **Status:** Aceito
- **Data:** 2026-10-01
- **Implementação:** em `feature/npm-publish`

## Contexto

Não há automação de release, tags nem CHANGELOG. O Changesets estava instalado e configurado, mas nunca foi usado. O histórico já segue Conventional Commits em 100% dos commits (12 de 12 em 2026-10-01). A publicação na npm vai rodar no GitHub Actions, com provenance.

## Decisão

Usar **release-please** (manifest mode) na `main`, guiado por Conventional Commits e SemVer:

- `fix:` → patch, `feat:` → minor, `feat!:` / `BREAKING CHANGE:` → major. Na fase `0.x`, breaking gera minor (`bump-minor-pre-major`). A ida para `1.0.0` é decisão explícita (`release-as`).
- O release-please mantém um Release PR com bump e `CHANGELOG.md`. O merge dele cria tag, GitHub Release e dispara a publicação.
- Ele roda com o token de uma **GitHub App** de permissões mínimas.
- O Changesets é removido.

## Alternativas consideradas

- **Changesets:** cada PR traz um arquivo escrito à mão com o bump. Teríamos duas fontes para a mesma informação (título do PR e changeset), que podem divergir (`feat` num, `patch` no outro).
- **`GITHUB_TOKEN` no release-please:** PRs e releases criados com ele não disparam outros workflows. O Release PR não rodaria o CI (os checks obrigatórios travariam o merge), e a release não dispararia deploy nem back-merge.
- **PAT fine-grained:** resolve o disparo de workflows, mas fica preso a uma pessoa e expira.

## Consequências

- O bump é automático e tem uma fonte só: o título do PR ([0002](0002-git-flow-merge-strategy.md)).
- O histórico existente é lido inteiro na primeira release, sem `bootstrap-sha`.
- Exige os secrets `RELEASE_APP_ID` e `RELEASE_APP_PRIVATE_KEY`, além de `NPM_TOKEN` até migrar para trusted publishing.
- Depois de cada release, um PR de back-merge `main` → `develop` leva versão e changelog para a `develop`.

# 0002 — Git flow com estratégia de merge por tipo de PR

- **Status:** Aceito
- **Data:** 2026-10-01
- **Implementação:** regras de repositório e `CONTRIBUTING.md` em `feature/npm-publish`

## Contexto

O repositório já usa git flow (`main` lançada, `develop` de integração, `feature/*`, `fix/*`, `refactor/*`, `hotfix/*`; ver `CLAUDE.md`). O versionamento passa a ser derivado dos commits na `main` ([0003](0003-release-please-conventional-commits.md)), então o método de merge decide quais commits chegam lá e com que mensagem.

## Decisão

| PR                                             | Método                                                      |
| ---------------------------------------------- | ----------------------------------------------------------- |
| `feature/*`, `fix/*`, `refactor/*` → `develop` | Squash, com o título do PR validado em Conventional Commits |
| `develop` → `main` (promoção)                  | Merge commit                                                |
| Release PR → `main`                            | Squash                                                      |
| `hotfix/*` → `main`                            | Squash, título `fix: ...`                                   |
| `main` → `develop` (back-merge)                | Merge commit, nunca squash                                  |

Só o título do PR é validado; não há commitlint/husky por commit.

## Alternativas consideradas

- **Squash em tudo:** a promoção `develop` → `main` viraria um commit só e o changelog perderia os `feat`/`fix` individuais.
- **Rebase merge:** reescreve SHAs e complica o back-merge; desabilitado.
- **Validar cada commit (commitlint + husky):** atrito local sem ganho, já que o squash descarta os commits intermediários.

## Consequências

- O título do PR vira a mensagem do commit e define o bump. Título errado = versão errada; por isso a validação é check obrigatório.
- Back-merge com squash quebra a ancestralidade e faz a próxima promoção conflitar em `package.json` e `CHANGELOG.md`.
- Exige configurar no GitHub: squash e merge commit habilitados, rebase desabilitado, squash usando o título do PR, rulesets em `main` e `develop`.

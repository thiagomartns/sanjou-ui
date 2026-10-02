# Architecture Decision Records

Um ADR registra **por que** uma decisão de arquitetura ou de tooling foi tomada: o contexto, a escolha, as alternativas descartadas e as consequências. O "como funciona hoje" fica nos docs duráveis (`README.md`, `CLAUDE.md`, `CONTRIBUTING.md`); o "por quê" fica aqui.

## Quando escrever

- Escolha de biblioteca, ferramenta ou serviço (ex.: release-please em vez de Changesets).
- Padrão ou fluxo que outras pessoas precisam seguir (ex.: estratégia de merge).
- Mudança de uma decisão anterior: o ADR novo marca o antigo como "Substituído por NNNN".

Não escreva ADR para correções pontuais, detalhes de implementação ou planos de tarefa. Planos, reports e rascunhos de sessão ficam em `.ai/`, fora do git (ver [0001](0001-adrs-and-ai-artifacts-outside-git.md)).

## Convenções

- Arquivo: `NNNN-titulo-em-kebab-case.md`, numeração sequencial a partir de `0001`. Copie [`0000-template.md`](0000-template.md).
- O ADR entra no mesmo PR da decisão (ou antes da implementação, com a nota "implementação em `<branch>`").
- Se duas branches paralelas usarem o mesmo número, quem fizer o merge por último renumera.
- Um ADR aceito não é reescrito: para mudar a decisão, crie outro e atualize só o Status do antigo.
- Curto: um ADR bom cabe numa tela.
- Idioma: ADRs são escritos em português, por serem registros internos do mantenedor. Docs de uso (`README.md`, `CONTRIBUTING.md`), o `CLAUDE.md` e o texto de UI ficam em inglês.

## Índice

| #                                                       | Decisão                                                           | Status |
| ------------------------------------------------------- | ----------------------------------------------------------------- | ------ |
| [0001](0001-adrs-and-ai-artifacts-outside-git.md)       | Registrar decisões em ADRs e manter artefatos de IA fora do git   | Aceito |
| [0002](0002-git-flow-merge-strategy.md)                 | Git flow com estratégia de merge por tipo de PR                   | Aceito |
| [0003](0003-release-please-conventional-commits.md)     | Versionamento com release-please e Conventional Commits           | Aceito |
| [0004](0004-single-version-for-all-packages.md)         | Versão única `vX.Y.Z` para todos os pacotes publicáveis           | Aceito |
| [0005](0005-production-deploy-on-release-only.md)       | Deploy de produção somente na release                             | Aceito |
| [0006](0006-components-as-npm-package-single-source.md) | Distribuir componentes também como `@sanjou/ui`, com fonte única  | Aceito |
| [0007](0007-storybook-on-github-pages.md)               | Storybook público no GitHub Pages, com fontes servidas localmente | Aceito |
| [0008](0008-vscode-personal-settings-skip-worktree.md)  | Settings pessoais do VS Code via `skip-worktree`                  | Aceito |

## Candidatas (decisões existentes sem motivo registrado)

Estas decisões já estão no código, mas o "por quê" não foi escrito em lugar nenhum. Cabe ao mantenedor registrar o motivo real; não reconstruir por suposição.

- Monorepo com pnpm workspaces + Turborepo.
- Gerador de tokens com fonte única (`packages/tokens/src/config.mjs`) e contraste WCAG como gate de CI.
- Distribuição dos componentes no estilo shadcn (código-fonte copiado pelo CLI).
- Stories do Storybook como suíte de testes, com axe em `error`.
- App Next.js como site de docs, host do registry e projeto do Storybook ao mesmo tempo.

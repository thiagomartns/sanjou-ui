# 0001 — Registrar decisões em ADRs e manter artefatos de IA fora do git

- **Status:** Aceito
- **Data:** 2026-10-01

## Contexto

Boa parte do trabalho no repositório é feita com assistentes de IA, que produzem planos, reports de execução e diagnósticos (ex.: `docs/first-run-report.md`, `docs/npm-publish-plan.md`, `docs/plans/*`). Esses arquivos descrevem o processo de uma tarefa, envelhecem logo e misturam decisões importantes com detalhes de sessão. Quem procura o "por quê" de uma escolha precisa garimpar planos antigos.

## Decisão

Classificar cada documento em um de três tipos:

| Tipo    | Critério                                                    | Destino                                      |
| ------- | ----------------------------------------------------------- | -------------------------------------------- |
| Durável | Descreve como o projeto funciona hoje                       | Versionado (README, CLAUDE.md, CONTRIBUTING) |
| Decisão | Registra por que algo foi escolhido, com alternativas       | ADR em `docs/adr/`                           |
| Efêmero | Descreve o processo de uma tarefa (plano, report, rascunho) | `.ai/`, ignorada pelo git                    |

Arquivos mistos são divididos: a decisão vira ADR e o resto vai para `.ai/`. Relatórios de tarefa são entregues na conversa ou na descrição do PR.

## Alternativas consideradas

- **Manter planos e reports versionados em `docs/`:** o histórico fica completo, mas o diretório vira um arquivo morto e as decisões continuam enterradas.
- **Apagar os artefatos efêmeros:** perde-se material de consulta local sem ganho real.

## Consequências

- Decisões ficam encontráveis em um lugar, com índice em `docs/adr/README.md`.
- `.ai/` existe só na máquina de quem trabalhou: não é compartilhada nem tem backup. O que precisar ser compartilhado vai para o PR ou vira ADR.
- O `CLAUDE.md` passa a instruir agentes a seguir esta regra.
- Planos já commitados em feature branches saem do git (`git rm --cached`) quando essas branches receberem a `develop` com esta mudança.

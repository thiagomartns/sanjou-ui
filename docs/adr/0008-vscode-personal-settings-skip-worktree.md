# 0008 — Settings pessoais do VS Code via `skip-worktree`

- **Status:** Aceito
- **Data:** 2026-09-28

## Contexto

O `.vscode/settings.json` é compartilhado, mas a cópia local do mantenedor precisava de um bloco `terminal.integrated.env.linux` com um caminho pessoal (`CLAUDE_CONFIG_DIR`). Esse caminho não pode entrar no repositório.

## Decisão

A versão versionada não tem o bloco pessoal. A cópia local tem, e é marcada com `git update-index --skip-worktree .vscode/settings.json`, para o git ignorar a alteração local.

## Alternativas consideradas

- **Arquivo `.code-workspace` local:** o VS Code só aplica as settings quando o projeto é aberto por esse arquivo. Descartada.
- **Git clean filter que remove o bloco:** foi implementado e desfeito pelo mantenedor.

## Consequências

- O caminho pessoal nunca entra no histórico.
- Uma mudança na versão compartilhada fica invisível para o `git status` dessa máquina. Para commitá-la, rode `git update-index --no-skip-worktree .vscode/settings.json`, tire o bloco pessoal do commit e volte a marcar o arquivo.
- A marcação é local: cada máquina que precisar disso repete o comando.

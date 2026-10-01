# 0004 — Versão única `vX.Y.Z` para todos os pacotes publicáveis

- **Status:** Aceito
- **Data:** 2026-10-01
- **Implementação:** em `feature/npm-publish`

## Contexto

O monorepo terá dois pacotes publicáveis: `@sanjou/tokens` (hoje `0.1.0`, nunca publicado) e `@sanjou/ui` (a criar). A raiz e o `www` são privados. O site e o Storybook são implantados a partir da release ([0005](0005-production-deploy-on-release-only.md)).

## Decisão

O design system tem **um número de versão**. Tag `vX.Y.Z`, uma GitHub Release e um `CHANGELOG.md` na raiz. O release-please tem um componente só na raiz e sincroniza `version` nos `package.json` dos pacotes via `extra-files`. Os pacotes sobem juntos, mesmo que só um deles tenha mudado.

## Alternativas consideradas

- **Versão por pacote** (`tokens-v0.2.0`, `ui-v0.3.0`): mais precisa, mas o gatilho do deploy e o changelog ficam mais complexos, e quem consome precisa cruzar duas versões para saber o que é compatível.

## Consequências

- Comunicação simples: "Sanjou UI 0.4.0" vale para tokens, componentes, site e Storybook.
- Um pacote pode ganhar versão nova sem mudança própria. É aceitável para um design system.
- Todo pacote publicável novo precisa entrar no `extra-files`. Um teste de consistência compara as versões com o manifest.
- `@sanjou/ui` depende de `@sanjou/tokens` como `workspace:^`. O `pnpm publish` troca isso pela versão real.

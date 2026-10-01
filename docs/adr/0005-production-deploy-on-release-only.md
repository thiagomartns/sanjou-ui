# 0005 — Deploy de produção somente na release

- **Status:** Aceito
- **Data:** 2026-10-01
- **Implementação:** workflow de release em `feature/npm-publish`; workflow do Storybook em `feature/storybook-and-components`

## Contexto

Com [0002](0002-git-flow-merge-strategy.md) e [0003](0003-release-please-conventional-commits.md), a `main` recebe a promoção da `develop` antes do merge do Release PR. Nesse intervalo, a `main` tem código ainda não lançado. Hoje não há deploy configurado no repositório: a URL `sanjou-ui.vercel.app` é placeholder. O plano do Storybook previa deploy em todo push na `main`.

## Decisão

Produção (npm, Storybook no GitHub Pages e o site/registry quando houver hospedagem) é implantada **somente** quando uma release é criada: `on: release: types: [published]` ou um job condicionado a `release_created` no workflow de release. Feature branches nunca recebem versão; previews são identificados por branch ou SHA.

## Alternativas consideradas

- **Deploy em todo push na `main`:** publicaria código não lançado e desalinharia a produção da versão anunciada.
- **Integração Git automática da hospedagem (ex.: Vercel em push na `main`):** mesmo problema. Previews por branch podem continuar ligados.

## Consequências

- O que está em produção corresponde sempre a uma tag `vX.Y.Z`.
- Se a Vercel for conectada, o deploy automático de produção precisa ser desligado e trocado por `vercel deploy --prod` ou deploy hook na release.
- O gatilho do workflow do Storybook previsto no plano 01 precisa mudar de `push` para a release.

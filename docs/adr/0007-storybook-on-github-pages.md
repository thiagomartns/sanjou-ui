# 0007 — Storybook público no GitHub Pages, com fontes servidas localmente

- **Status:** Aceito
- **Data:** 2026-10-01
- **Implementação:** tema em `feature/storybook-and-components`; fontes em `chore/storybook-local-fonts` (pacote `geist` copiado por `staticDirs` em `apps/www/.storybook/main.ts`, com `@font-face` em `apps/www/.storybook/static/fonts.css`, ligado pelo `preview-head.html` e pelo `manager-head.html`)

## Contexto

O Storybook (v9, `apps/www/.storybook`) roda as stories como suíte de testes, mas não é publicado em lugar nenhum. A intenção é usá-lo como vitrine e referência pública do design system. O `preview-head.html` carrega a fonte Geist do Google Fonts.

## Decisão

- Publicar o build do Storybook no **GitHub Pages**, via GitHub Actions, na release ([0005](0005-production-deploy-on-release-only.md)).
- Servir as fontes **localmente** (pacote `geist` ou `staticDirs`), no preview e no manager, sem Google Fonts.

## Alternativas consideradas

- **Fontes pelo Google Fonts:** gera uma requisição a terceiro a cada visita, com o IP de quem visita (ponto de atenção de LGPD), e cria dependência de CDN.
- **Outra hospedagem (Chromatic, Vercel):** não registrada como avaliada. O GitHub Pages foi escolhido pelo mantenedor.

## Consequências

- O conteúdo das stories e dos docs fica público. É preciso revisar antes do primeiro deploy: nada de dado de cliente, credencial ou informação interna.
- O build precisa funcionar sob subpath (`https://<org>.github.io/<repo>/`).
- Passo manual: Settings → Pages → Source: GitHub Actions.

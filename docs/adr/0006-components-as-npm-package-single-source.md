# 0006 — Distribuir componentes também como `@sanjou/ui`, com fonte única

- **Status:** Aceito
- **Data:** 2026-09-28
- **Implementação:** em `feature/npm-publish`. Até ela entrar na `develop`, o `CLAUDE.md` continua dizendo "NOT as an npm package".

## Contexto

Hoje os componentes são distribuídos só como código-fonte pelo registry shadcn (`apps/www/registry/sanjou/ui/*.tsx` → `shadcn build`). Os tokens já são um pacote (`@sanjou/tokens`). O mantenedor decidiu publicar tokens **e** componentes na npm.

> **Motivação: a confirmar pelo mantenedor.** O plano de publicação registra a decisão, mas não o motivo. Este ADR não reconstrói o motivo por suposição.

## Decisão

- Os componentes continuam com **fonte única** em `apps/www/registry/sanjou/ui/`. O pacote `@sanjou/ui` é compilado a partir dela (ESM + `.d.ts`, um subpath por componente, `'use client'` preservado por arquivo).
- O registry shadcn continua existindo, com o mesmo conteúdo.
- O CSS **não** é pré-compilado. O consumidor usa Tailwind 4 com `@import '@sanjou/tokens/sanjou.css'` e `@source` apontando para `@sanjou/ui`.

## Alternativas consideradas

- **Só o registry (situação atual):** sem pacote versionado para quem prefere instalar a copiar código.
- **Fonte separada para o pacote:** duas cópias de cada componente, que divergiriam.
- **CSS pré-compilado no pacote:** não registrado como avaliado. Hipótese: duplicaria utilitários já gerados pelo Tailwind do consumidor.

## Consequências

- Um teste de consistência garante que todo item `registry:ui` tem export no pacote, e vice-versa.
- O `CLAUDE.md`, o `README.md` e o checklist de componente mudam quando a implementação entrar.
- O consumidor do pacote precisa de Tailwind 4 configurado com `@source`.

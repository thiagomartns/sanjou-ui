# Sanjou UI — instructions for Claude Code

pnpm workspaces + Turborepo. Always use `pnpm`, never npm/yarn.

## Architecture

- `packages/tokens` — token generator (plain Node ESM, zero deps). `src/config.mjs` is the single source of truth. Everything else in that package (`sanjou.css`, `tokens.json`, `figma/`, `CONTRAST.md`) and the `theme` item in `apps/www/registry.json` are GENERATED: never edit them by hand; edit config and run `pnpm tokens`.
- `apps/www` — Next.js 15 (App Router) app that is at the same time: the docs site, the shadcn registry host (`shadcn build` → `public/r`), and the Storybook project.
- Components live in `apps/www/registry/sanjou/ui/*.tsx`. They are distributed as source through the shadcn CLI, NOT as an npm package.

## Component rules

- One file per component in `registry/sanjou/ui/`, shadcn v4 style: plain functions (React 19, no `forwardRef`), `ComponentProps<'el'>`, `data-slot="<name>"`, variants with `cva`, classes merged with `cn` from `@/lib/utils`.
- Import only `@/lib/utils`, other `@/registry/sanjou/ui/*` files, npm packages. The CLI rewrites these aliases in the consumer project — never use relative imports across folders.
- Add `'use client'` ONLY when the component uses state, effects, context or event-handler props internally (e.g. Radix interactive primitives). Button, Input, Badge, Card are server-safe.
- Styling uses SEMANTIC tokens only (`bg-primary`, `text-muted-foreground`, `border-input`, `bg-brand-subtle`…). Raw scale steps (`gray-9`, `indigo-10`) only for hover/active states that have no semantic token.
- Do not use `text-md` inside registry components: tailwind-merge in consumer projects may read it as a color. Use `text-[1rem]` instead.
- Focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`. Disabled: `disabled:opacity-50 disabled:pointer-events-none`.
- Radix: prefer individual packages (`@radix-ui/react-*`) and list them in the item's `dependencies`.

## Adding a component (checklist)

1. `apps/www/registry/sanjou/ui/<name>.tsx`
2. `apps/www/stories/<name>.stories.tsx` — variants + at least one `play` test for behavior; stories must pass axe (`a11y.test: 'error'` is global).
3. Item in `apps/www/registry.json` (`registry:ui`, `dependencies`, `files`).
4. A `<Preview>` section on `apps/www/app/page.tsx`.
5. Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm registry:build`.

## Branches (git flow)

- `main` holds released code; never commit to it directly.
- `develop` is the integration branch. `feature/*`, `fix/*` and `refactor/*` branch off `develop` and return through a PR.
- Releases go `develop` → `main` through a PR.
- `hotfix/*` branches off `main` and is merged into both `main` and `develop`.

## Commands

- `pnpm dev` / `pnpm storybook` / `pnpm test` / `pnpm lint` / `pnpm typecheck` / `pnpm build`
- `pnpm tokens` (write) / `pnpm tokens:check` (CI)

## Voice

UI copy in English, sentence case, buttons start with a verb, no emoji. See the README of the Sanjou UI design system page for the full brand book.

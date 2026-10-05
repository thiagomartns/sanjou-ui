<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/sanjou-mark-dark.svg">
    <img src=".github/assets/sanjou-mark.svg" alt="Sanjou UI" width="72" height="72">
  </picture>
</p>

# Sanjou UI

A quiet design system for dense product interfaces — in the register of Linear and Vercel. Radix primitives, Tailwind CSS 4, OKLCH tokens, distributed **shadcn-style**: the component code is copied into your project by the shadcn CLI and is yours to edit.

- **Neutral first.** The main action is ink, not color; indigo is reserved for brand moments, links and focus.
- **Borders, not shadows.** Shadows only on what floats.
- **Zero runtime.** No provider, no JS theme: dark mode is a `.dark` class.
- **Server Components by default.** Only components with real interactivity carry `"use client"`.

**Docs and registry:** [sanjou-ui.vercel.app](https://sanjou-ui.vercel.app), published on each release. **Storybook:** [thiagomartns.github.io/sanjou-ui](https://thiagomartns.github.io/sanjou-ui/), published from `develop` until the first release, then on each release.

## Repository layout

```
sanjou-ui/
├── docs/adr/                 Architecture Decision Records (why things are the way they are)
├── apps/www/                 Next.js docs site + shadcn registry host + Storybook
│   ├── registry/sanjou/ui/   ← the components (source of the registry)
│   ├── registry.json         ← registry manifest (the `theme` item is generated)
│   ├── stories/              ← Storybook stories = the test suite
│   └── app/                  ← docs pages
└── packages/tokens/          @sanjou/tokens (npm): the token generator and its outputs
    ├── src/config.mjs        ← THE source of truth for colors, type, radius, spacing
    ├── sanjou.css            ← generated Tailwind 4 theme (light + dark)
    ├── tokens.json           ← generated W3C DTCG tokens
    ├── figma/                ← generated Figma variable files
    └── CONTRAST.md           ← generated WCAG contrast report
```

## Getting started

Requirements: Node ≥ 20.19 (see `.nvmrc`), pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm --filter www exec playwright install chromium   # browser for Storybook tests
pnpm tokens            # regenerate tokens (also runs in build)
pnpm dev               # docs site on http://localhost:3000
pnpm storybook         # Storybook on http://localhost:6006
pnpm test              # token tests + every story as a browser test with axe, light and dark
pnpm lint && pnpm typecheck
```

## Commands

| Command                           | What it does                                                                           |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm tokens`                     | Regenerates CSS, DTCG JSON, Figma files, contrast report and the registry `theme` item |
| `pnpm tokens:check`               | Fails if generated files are stale or any contrast rule fails (CI)                     |
| `pnpm registry:build`             | `shadcn build` → `apps/www/public/r/*.json`                                            |
| `pnpm build`                      | Tokens → registry → Next.js build                                                      |
| `pnpm changeset` / `pnpm release` | Version and publish `@sanjou/tokens` to npm                                            |

## Using the registry in another project

Start from a Next.js + Tailwind CSS 4 project and initialize shadcn/ui with Radix (Sanjou components are built on Radix; the default `init -d` picks Base UI):

```bash
npx shadcn@latest init --base radix
```

Then add the registry:

```jsonc
// components.json
{
  "registries": {
    "@sanjou": "https://sanjou-ui.vercel.app/r/{name}.json",
  },
}
```

```bash
npx shadcn@latest add @sanjou/theme      # tokens into your globals.css
npx shadcn@latest add --overwrite @sanjou/button @sanjou/input @sanjou/label @sanjou/badge @sanjou/card
```

`init` creates its own `components/ui/button.tsx`; `--overwrite` replaces it with the Sanjou one.

Load Geist via `next/font/google` with the variables `--font-geist-sans` and `--font-geist-mono`.

## Changing a token

1. Edit `packages/tokens/src/config.mjs`.
2. `pnpm tokens` — the build fails if any contrast rule breaks.
3. Commit the generated files together with the change; add a changeset.
4. Re-import `packages/tokens/figma/native/*.json` into Figma.

## License

MIT

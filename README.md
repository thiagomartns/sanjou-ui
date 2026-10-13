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

**Docs and registry:** [sanjou-ui.vercel.app](https://sanjou-ui.vercel.app), published on each release. **Storybook:** [thiagomartns.github.io/sanjou-ui](https://thiagomartns.github.io/sanjou-ui/), published on each release.

## Repository layout

```
sanjou-ui/
├── docs/adr/                 Architecture Decision Records (why things are the way they are)
├── apps/www/                 Next.js docs site + shadcn registry host + Storybook
│   ├── registry/sanjou/ui/   ← the components (source of the registry)
│   ├── registry.json         ← registry manifest (the `theme` item is generated)
│   ├── stories/              ← Storybook stories = the test suite
│   └── app/                  ← docs pages
├── packages/ui/              @sanjou/ui (npm): the components, compiled from registry/sanjou/ui
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

| Command               | What it does                                                                           |
| --------------------- | -------------------------------------------------------------------------------------- |
| `pnpm tokens`         | Regenerates CSS, DTCG JSON, Figma files, contrast report and the registry `theme` item |
| `pnpm tokens:check`   | Fails if generated files are stale or any contrast rule fails (CI)                     |
| `pnpm registry:build` | `shadcn build` → `apps/www/public/r/*.json`                                            |
| `pnpm build`          | Tokens → registry → Next.js build                                                      |

## Two ways to install

|                   | Registry (shadcn CLI)                                                             | npm packages                                      |
| ----------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| What you get      | The component source, copied into your project                                    | `@sanjou/ui` and `@sanjou/tokens` as dependencies |
| Customizing       | Edit the files directly                                                           | Through `className` and the tokens                |
| Fixes and updates | Not automatic: run `add --overwrite` again and review the diff against your edits | Bump the version                                  |
| Pick it when      | You want to own and change the code                                               | You want updates by version and no copied code    |

Both come from the same source files, so a component looks and behaves the same either way.

## Using the registry in another project

Start from a Next.js + Tailwind CSS 4 project and initialize shadcn/ui with Radix (Sanjou components are built on Radix; the default `init -d` picks Base UI):

```bash
npx shadcn@4.21.4 init --base radix --preset nova
```

The docs pin the shadcn CLI to the version the Sanjou registry was last tested with. Newer versions usually work, but the CLI has changed its defaults before.

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
npx shadcn@4.21.4 add @sanjou/theme      # tokens into your globals.css
npx shadcn@4.21.4 add --overwrite @sanjou/button @sanjou/input @sanjou/label @sanjou/badge @sanjou/card
```

`--overwrite` replaces any shadcn component of the same name already in `components/ui`.

To get a fix from a newer Sanjou release, run the same `add --overwrite` command again and review the diff: it replaces the whole file, including your own edits.

## Using the npm packages

The same components ship as `@sanjou/ui`, compiled from the registry sources. Both packages are published from `0.1.0` on.

```bash
pnpm add @sanjou/ui @sanjou/tokens
```

```css
/* globals.css */
@import 'tailwindcss';
@import '@sanjou/tokens/sanjou.css';
@source '../node_modules/@sanjou/ui'; /* relative to this file */
```

```tsx
import { Button } from '@sanjou/ui/button';
```

`@sanjou/ui/form` and `@sanjou/ui/sonner` expect `react-hook-form` and `sonner` to be installed by your app. See [`packages/ui/README.md`](packages/ui/README.md).

## Fonts

The theme expects Geist and reads it from two CSS variables, `--font-geist-sans` and `--font-geist-mono`. Without them it looks for fonts named `Geist` and `Geist Mono`, then falls back to `system-ui`.

In Next.js, use `next/font/google` (the default in `create-next-app`):

```tsx
// app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// <body className={`${geistSans.variable} ${geistMono.variable}`}>
```

In any other setup (Vite, Astro, React Router…), install the font files and set the same variables:

```bash
pnpm add @fontsource-variable/geist @fontsource-variable/geist-mono
```

```css
/* globals.css */
@import '@fontsource-variable/geist';
@import '@fontsource-variable/geist-mono';

:root {
  --font-geist-sans: 'Geist Variable';
  --font-geist-mono: 'Geist Mono Variable';
}
```

## Changing a token

1. Edit `packages/tokens/src/config.mjs`.
2. `pnpm tokens` — the build fails if any contrast rule breaks.
3. Commit the generated files together with the change. Releases are cut from the Conventional Commit types (`fix:` → patch, `feat:` → minor), so no extra release file is needed.
4. Re-import `packages/tokens/figma/native/*.json` into Figma.

## Contributing

Branches, pull request titles, merge methods and the release flow are in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

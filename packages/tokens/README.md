# @sanjou/tokens

Design tokens of Sanjou UI: 5 twelve-step OKLCH color scales (light + dark), shadcn-compatible semantic tokens, type scale, radius and shadows.

```css
/* globals.css */
@import 'tailwindcss';
@import '@sanjou/tokens/sanjou.css';
```

Also ships `tokens.json` (W3C DTCG) and `figma/` (variables to import into Figma: `native/` for Figma's importer, `plugin-hex/` for plugins).

Edit `src/config.mjs`, then `pnpm build`. The build fails when a contrast rule in `CONTRAST_RULES` is not met. See `CONTRAST.md`.

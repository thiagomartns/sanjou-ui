# @sanjou/ui

React components of Sanjou UI, built on Radix and Tailwind CSS 4. The package is compiled from the same sources as the [Sanjou shadcn registry](https://sanjou-ui.vercel.app): install it to get updates by version, or use the registry to copy the code into your project and own it.

Requires React 19 and Tailwind CSS 4.

```bash
pnpm add @sanjou/ui @sanjou/tokens
```

```css
/* globals.css */
@import 'tailwindcss';
@import '@sanjou/tokens/sanjou.css';

/* Let Tailwind see the classes the components use. The path is relative to this file. */
@source '../node_modules/@sanjou/ui';
```

Import each component from its own subpath:

```tsx
import { Button } from '@sanjou/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@sanjou/ui/dialog';
```

Dark mode is the `.dark` class on a parent element. Load Geist through `next/font/google` with the variables `--font-geist-sans` and `--font-geist-mono`.

`@sanjou/ui/form` needs `react-hook-form` and `@sanjou/ui/sonner` needs `sonner`. Install them yourself when you use those components, so your app and the components share one copy.

Docs and Storybook: [sanjou-ui.vercel.app](https://sanjou-ui.vercel.app) · [thiagomartns.github.io/sanjou-ui](https://thiagomartns.github.io/sanjou-ui/).

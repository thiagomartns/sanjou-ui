import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(viteConfig) {
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    // @storybook/react-vite does not add the React plugin itself; without a
    // vite.config (this is a Next.js app) JSX would compile to React.createElement.
    const { default: react } = await import('@vitejs/plugin-react');
    return mergeConfig(viteConfig, {
      plugins: [react(), tailwindcss()],
      // addon-docs asks Vite to pre-bundle `@mdx-js/react`, but with pnpm's isolated
      // node_modules it only resolves from inside addon-docs. Without the nested form
      // Vite discovers it at runtime, re-optimizes and reloads mid-render, which broke
      // the first Docs page opened on a cold cache (two copies of React). Same for
      // addon-themes, which the dependency scanner only found at runtime.
      optimizeDeps: {
        include: ['@storybook/addon-docs > @mdx-js/react', '@storybook/addon-themes'],
      },
      resolve: { alias: { '@': path.resolve(dirname, '..') } },
    });
  },
};

export default config;

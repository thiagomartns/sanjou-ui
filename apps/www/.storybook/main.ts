import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(viteConfig) {
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: { alias: { '@': path.resolve(dirname, '..') } },
    });
  },
};

export default config;

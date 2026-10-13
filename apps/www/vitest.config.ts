import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig, type TestProjectInlineConfiguration } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const storybookProject = (name: string, setupFile: string): TestProjectInlineConfiguration => ({
  extends: true,
  plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
  test: {
    name,
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }],
    },
    setupFiles: [setupFile],
  },
});

// The Storybook test panel (addon-vitest sets VITEST_STORYBOOK) renames every storybookTest
// project to `storybook:<configDir>`, so it supports a single project: it runs the light one.
const inStorybookPanel = process.env.VITEST_STORYBOOK === 'true';

// Every story is a test: it must render, pass its play function and have no axe violations,
// once in the light theme and once in the dark theme (CLI and CI).
export default defineConfig({
  test: {
    projects: [
      storybookProject('storybook', '.storybook/vitest.setup.ts'),
      ...(inStorybookPanel
        ? []
        : [storybookProject('storybook-dark', '.storybook/vitest.setup.dark.ts')]),
    ],
  },
});

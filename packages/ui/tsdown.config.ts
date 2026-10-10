import { defineConfig } from 'tsdown';

// Compiles the registry sources (the single source of truth, ADR 0006) one file per module, so
// `@/lib/utils` stays one shared module and each `'use client'` directive stays on its own file.
export default defineConfig({
  entry: ['../../apps/www/registry/sanjou/ui/*.tsx'],
  root: '../../apps/www',
  unbundle: true,
  platform: 'browser',
  format: 'esm',
  dts: true,
  tsconfig: 'tsconfig.json',
  inputOptions: {
    // Unbundled, every module keeps its own directive; test/package.test.mjs checks the output.
    onLog(level, log, handler) {
      if (log.code === 'MODULE_LEVEL_DIRECTIVE') return;
      handler(level, log);
    },
  },
});

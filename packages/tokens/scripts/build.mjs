#!/usr/bin/env node
// Generates every token artifact from src/config.mjs.
//   node scripts/build.mjs          write files
//   node scripts/build.mjs --check  fail if files are stale or contrast rules fail (CI)
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildContrastReport,
  buildCss,
  buildDtcg,
  buildFigma,
  buildPalette,
  buildRegistryTheme,
  checkContrast,
} from '../src/generate.mjs';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const root = join(pkg, '..', '..');
const check = process.argv.includes('--check');

const palette = buildPalette();
const results = checkContrast(palette);
const json = (o) => JSON.stringify(o, null, 2) + '\n';

/** @type {Record<string, string>} */
const outputs = {
  [join(pkg, 'sanjou.css')]: buildCss(palette),
  [join(pkg, 'tokens.json')]: json(buildDtcg(palette)),
  [join(pkg, 'CONTRAST.md')]: buildContrastReport(results),
};
for (const format of ['native', 'plugin-hex'])
  for (const [file, doc] of Object.entries(
    buildFigma(palette, format === 'native' ? 'native' : 'hex'),
  ))
    outputs[join(pkg, 'figma', format, file)] = json(doc);

// Keep the `theme` item of the shadcn registry in sync.
const registryPath = join(root, 'apps', 'www', 'registry.json');
if (existsSync(registryPath)) {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  const item = buildRegistryTheme(palette);
  const i = registry.items.findIndex((x) => x.name === 'theme');
  if (i === -1) registry.items.unshift(item);
  else registry.items[i] = item;
  outputs[registryPath] = json(registry);
}

let stale = 0;
for (const [file, content] of Object.entries(outputs)) {
  const rel = relative(root, file);
  if (check) {
    const current = existsSync(file) ? readFileSync(file, 'utf8') : null;
    if (current !== content) {
      stale++;
      console.error(`stale: ${rel}`);
    }
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
    console.log(`wrote ${rel}`);
  }
}

const failed = results.filter((r) => !r.pass);
for (const r of failed)
  console.error(`contrast ✗ ${r.theme}: ${r.fg} on ${r.bg} = ${r.ratio}:1 (min ${r.min})`);
if (failed.length === 0) console.log(`contrast ✓ ${results.length} pairs`);
if (stale)
  console.error(`\n${stale} generated file(s) are out of date — run \`pnpm tokens\` and commit.`);
if (failed.length || stale) process.exit(1);

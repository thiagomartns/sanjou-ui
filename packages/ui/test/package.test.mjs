import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

// @sanjou/ui is compiled from the registry sources (ADR 0006). These tests keep the package in
// step with the registry, so a new component cannot ship in one and be missing from the other.

const root = new URL('../', import.meta.url);
const www = new URL('../../../apps/www/', import.meta.url);
const sourceDir = new URL('registry/sanjou/ui/', www);

const readJson = (url) => JSON.parse(readFileSync(url, 'utf8'));
const pkg = readJson(new URL('package.json', root));
const wwwPkg = readJson(new URL('package.json', www));
const registry = readJson(new URL('registry.json', www));

const sources = readdirSync(sourceDir)
  .filter((file) => file.endsWith('.tsx'))
  .map((file) => ({
    name: file.replace(/\.tsx$/, ''),
    code: readFileSync(new URL(file, sourceDir), 'utf8'),
  }));
const isClient = (code) => /^['"]use client['"];/.test(code);
const subpaths = Object.keys(pkg.exports).filter((key) => key !== './package.json');

test('every registry:ui item has a package export, and vice versa', () => {
  const items = registry.items
    .filter((item) => item.type === 'registry:ui')
    .map((item) => item.name);
  assert.deepEqual(subpaths.map((key) => key.slice(2)).sort(), items.sort());
});

test('every export points at a built file', () => {
  for (const key of subpaths)
    for (const file of Object.values(pkg.exports[key]))
      assert.ok(existsSync(new URL(file, root)), `${key}: ${file} is missing, run pnpm build`);
});

test("only the 'use client' sources keep the directive in the build", () => {
  for (const { name, code } of sources) {
    const built = readFileSync(new URL(pkg.exports[`./${name}`].default, root), 'utf8');
    assert.equal(isClient(built), isClient(code), `${name}.js`);
  }
});

test('every package the sources import is declared, and nothing else', () => {
  const imported = new Set();
  for (const { code } of sources)
    for (const [, spec] of code.matchAll(/from '([^']+)'/g)) {
      if (spec.startsWith('@/') || spec === 'react' || spec.startsWith('react/')) continue;
      imported.add(
        spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0],
      );
    }
  // `cn` (apps/www/lib/utils.ts) is compiled into the package too.
  imported.add('clsx');
  imported.add('tailwind-merge');
  const runtime = ['react', 'react-dom', 'tailwindcss', '@sanjou/tokens'];
  const declared = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)].filter(
    (name) => !runtime.includes(name),
  );
  assert.deepEqual(declared.sort(), [...imported].sort());
});

test('dependency ranges match the docs site', () => {
  const ranges = { ...pkg.dependencies, ...pkg.peerDependencies };
  for (const [name, range] of Object.entries(ranges)) {
    if (!(name in wwwPkg.dependencies) || ['react', 'react-dom', '@sanjou/tokens'].includes(name))
      continue;
    assert.equal(range, wwwPkg.dependencies[name], name);
  }
});

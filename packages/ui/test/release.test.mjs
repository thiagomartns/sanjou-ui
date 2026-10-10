import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Every published package shares one version (ADR 0004). release-please bumps the root and the
// packages listed in `extra-files`, so a new package missing from that list would stay behind.
// Lives here because @sanjou/ui is the package that already checks the workspace around it.

const repo = new URL('../../../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, repo), 'utf8'));

const manifest = readJson('.release-please-manifest.json');
const config = readJson('release-please-config.json');
const published = readdirSync(new URL('packages/', repo))
  .map((dir) => `packages/${dir}/package.json`)
  .filter((path) => !readJson(path).private);

test('every published package is bumped by release-please', () => {
  const extraFiles = config.packages['.']['extra-files']
    .filter((file) => file.type === 'json' && file.jsonpath === '$.version')
    .map((file) => file.path);
  assert.deepEqual(extraFiles.sort(), published.sort());
});

test('every published package has the released version', () => {
  const released = manifest['.'];
  const next = config.packages['.']['release-as'];
  for (const path of published) {
    const { name, version } = readJson(path);
    // Before the first release the manifest says 0.0.0 and `release-as` holds the version to ship.
    assert.ok(
      version === released || version === next,
      `${name} is ${version}, expected ${released}${next ? ` or ${next}` : ''}`,
    );
  }
});

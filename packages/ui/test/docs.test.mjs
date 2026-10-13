import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The install steps pin one shadcn CLI version (CONTRIBUTING.md). It is written in three places,
// so a bump that misses one would leave the README, the site and Storybook telling different stories.

const repo = new URL('../../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, repo), 'utf8');

const docs = [
  'README.md',
  'apps/www/components/site/shadcn.ts',
  'apps/www/stories/introduction.mdx',
];

test('every install doc pins the same shadcn CLI version', () => {
  const versions = docs.map((path) => {
    const found = [...read(path).matchAll(/shadcn@([^\s'"`]+)/g)].map((match) => match[1]);
    assert.ok(found.length > 0, `${path} does not mention the shadcn CLI`);
    return { path, found: [...new Set(found)] };
  });
  for (const { path, found } of versions) {
    assert.equal(found.length, 1, `${path} uses more than one version: ${found.join(', ')}`);
    assert.match(
      found[0],
      /^\d+\.\d+\.\d+$/,
      `${path} uses shadcn@${found[0]}, not an exact version`,
    );
  }
  assert.equal(new Set(versions.map(({ found }) => found[0])).size, 1, JSON.stringify(versions));
});

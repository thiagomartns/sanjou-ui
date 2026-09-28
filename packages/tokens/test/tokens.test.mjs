import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, oklchToHex } from '../src/color.mjs';
import { buildPalette, checkContrast, buildRegistryTheme } from '../src/generate.mjs';
import { SEMANTIC } from '../src/config.mjs';

test('contrast: black on white is 21:1', () => {
  assert.equal(Math.round(contrast('#000000', '#ffffff')), 21);
});

test('oklchToHex keeps colors inside sRGB', () => {
  const { hex } = oklchToHex(0.6, 0.4, 150); // far out of gamut
  assert.match(hex, /^#[0-9a-f]{6}$/);
});

test('every scale has 12 steps in both themes', () => {
  const p = buildPalette();
  for (const theme of ['light', 'dark'])
    for (const steps of Object.values(p[theme])) assert.equal(steps.length, 12);
});

test('all contrast rules pass', () => {
  const failed = checkContrast(buildPalette()).filter((r) => !r.pass);
  assert.deepEqual(failed, []);
});

test('registry theme exposes every semantic token in light and dark', () => {
  const item = buildRegistryTheme(buildPalette());
  for (const k of Object.keys(SEMANTIC)) {
    assert.ok(item.cssVars.light[k], `light ${k}`);
    assert.ok(item.cssVars.dark[k], `dark ${k}`);
    assert.ok(item.cssVars.theme[`color-${k}`], `theme color-${k}`);
  }
});

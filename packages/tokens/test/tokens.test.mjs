import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, oklchToHex } from '../src/color.mjs';
import {
  buildCss,
  buildDtcg,
  buildFigma,
  buildPalette,
  buildRegistryTheme,
  checkContrast,
  parseRef,
} from '../src/generate.mjs';
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

test('registry theme carries the shadows and easing that sanjou.css defines', () => {
  const item = buildRegistryTheme(buildPalette());
  const css = buildCss(buildPalette());
  for (const name of [
    'shadow-xs',
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'ease-standard',
    'ease-out',
  ]) {
    assert.ok(css.includes(`--${name}: ${item.cssVars.theme[name]};`), name);
  }
  // In cssVars the shadcn CLI would wrap the HSL channels in hsl() and break the shadows.
  assert.equal(item.cssVars.light['shadow-color'], undefined);
  assert.ok(item.css[':root']['--shadow-color']);
  assert.ok(item.css['.dark']['--shadow-color']);
});

test('parseRef splits the alpha suffix', () => {
  assert.deepEqual(parseRef('gray.12/50'), { base: 'gray.12', alpha: 0.5 });
  assert.deepEqual(parseRef('gray.12'), { base: 'gray.12', alpha: 1 });
});

test('overlay keeps its alpha in every output', () => {
  const p = buildPalette();
  assert.match(buildCss(p), /--overlay: color-mix\(in oklch, var\(--gray-12\) 50%, transparent\);/);
  assert.match(buildDtcg(p).light.overlay.$value, /^#[0-9a-f]{6}80$/);
  assert.equal(buildDtcg(p).dark.overlay.$value, '#00000099');
  assert.equal(buildFigma(p, 'native')['Color.Light.tokens.json'].overlay.$value.alpha, 0.5);
  assert.match(buildFigma(p, 'hex')['Color.Dark.tokens.json'].overlay.$value, /^#00000099$/);
});

import tokens from '@sanjou/tokens/tokens.json';
import { create } from 'storybook/theming';

type Mode = 'light' | 'dark';
type Token = { $value: string };

/** Resolves a semantic token to hex, following DTCG references like `{light.scale.indigo.9}`. */
function color(mode: Mode, name: string): string {
  let token = (tokens[mode] as unknown as Record<string, Token | undefined>)[name];
  while (token?.$value.startsWith('{')) {
    const path = token.$value.slice(1, -1).split('.');
    token = path.reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      tokens,
    ) as Token | undefined;
  }
  if (!token) throw new Error(`Unknown token: ${mode}.${name}`);
  return token.$value;
}

// Same colors as the generated mark (packages/tokens `logoColors`): dark uses brand-text.
const accent = (mode: Mode) => color(mode, mode === 'light' ? 'brand' : 'brand-text');

const brand = (mode: Mode) => {
  const ink = color(mode, 'foreground');
  return (
    `<span style="display:inline-flex;align-items:center;gap:8px;font:600 18px/1 Geist,ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.04em;color:${ink}">` +
    `<svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true"><path d="M5 43 A31 31 0 0 1 36 12 A27 27 0 0 0 16 43 Z" fill="${ink}"/><path d="M28 43 L36 30 L44 43 Z" fill="${accent(mode)}"/></svg>` +
    `sanjou<span style="font:500 11px/1 'Geist Mono',ui-monospace,monospace;letter-spacing:0;padding:3px 6px;border:1px solid currentColor;border-radius:5px;opacity:.6">ui</span></span>`
  );
};

const theme = (mode: Mode) =>
  create({
    base: mode,
    brandTitle: brand(mode),
    fontBase: 'Geist, ui-sans-serif, system-ui, sans-serif',
    fontCode: "'Geist Mono', ui-monospace, monospace",
    appBorderRadius: 8,
    inputBorderRadius: 6,
    colorPrimary: accent(mode),
    // Selected sidebar item background, under white text: brand keeps contrast in both modes.
    colorSecondary: color(mode, 'brand'),
    appBg: color(mode, 'muted'),
    appContentBg: color(mode, 'background'),
    appPreviewBg: color(mode, 'background'),
    appBorderColor: color(mode, 'border'),
    textColor: color(mode, 'foreground'),
    textMutedColor: color(mode, 'muted-foreground'),
    textInverseColor: color(mode, 'primary-foreground'),
    barBg: color(mode, 'background'),
    barTextColor: color(mode, 'muted-foreground'),
    barSelectedColor: accent(mode),
    barHoverColor: color(mode, 'foreground'),
    inputBg: color(mode, 'background'),
    inputBorder: color(mode, 'border'),
    inputTextColor: color(mode, 'foreground'),
    buttonBg: color(mode, 'background'),
    buttonBorder: color(mode, 'border'),
    booleanBg: color(mode, 'secondary'),
    booleanSelectedBg: color(mode, 'background'),
  });

export const sanjouLight = theme('light');
export const sanjouDark = theme('dark');

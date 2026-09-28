// Sanjou UI — the single source of truth for every token.
// Edit values here, then run `pnpm tokens` from the repo root.

export const SCALES = ['gray', 'indigo', 'green', 'amber', 'red'];

/** Lightness per step (1–12). Steps 9/10 come from each scale's `solid`. */
export const LIGHTNESS = {
  light: [0.994, 0.982, 0.962, 0.942, 0.921, 0.895, 0.858, 0.795, null, null, 0.505, 0.255],
  dark: [0.165, 0.192, 0.222, 0.248, 0.274, 0.305, 0.352, 0.425, null, null, 0.79, 0.945],
};

/** Chroma per step as a fraction of each scale's peak chroma. */
export const CHROMA_FACTOR = {
  light: [0.03, 0.07, 0.14, 0.21, 0.28, 0.36, 0.46, 0.62, 1, 1, 0.85, 0.45],
  dark: [0.12, 0.16, 0.26, 0.34, 0.42, 0.5, 0.6, 0.72, 1, 1, 0.7, 0.3],
};

/** Gray uses absolute (very low) chroma instead of a factor. */
export const GRAY_CHROMA = {
  light: [0.0015, 0.003, 0.005, 0.006, 0.007, 0.008, 0.01, 0.013, 0.016, 0.016, 0.018, 0.02],
  dark: [0.006, 0.007, 0.009, 0.01, 0.011, 0.012, 0.014, 0.016, 0.016, 0.016, 0.012, 0.004],
};

/** hue, peak chroma, lightness of solid step 9 per theme. */
export const SCALE_DEFS = {
  gray: { hue: 264, chroma: 0.03, solid: { light: 0.64, dark: 0.56 }, neutral: true },
  indigo: { hue: 266, chroma: 0.175, solid: { light: 0.515, dark: 0.56 } },
  green: { hue: 158, chroma: 0.135, solid: { light: 0.54, dark: 0.535 } },
  amber: {
    hue: 78,
    chroma: 0.165,
    solid: { light: 0.815, dark: 0.815 },
    hoverDelta: 0.035,
    lightText: [0.52, 0.33],
  },
  red: { hue: 26, chroma: 0.2, solid: { light: 0.56, dark: 0.575 } },
};

const W = '#ffffff';
/** Semantic tokens: [light ref, dark ref]. Names match shadcn/ui. */
export const SEMANTIC = {
  background: [W, 'gray.1'],
  foreground: ['gray.12', 'gray.12'],
  card: [W, 'gray.2'],
  'card-foreground': ['gray.12', 'gray.12'],
  popover: [W, 'gray.2'],
  'popover-foreground': ['gray.12', 'gray.12'],
  primary: ['gray.12', 'gray.12'],
  'primary-foreground': ['gray.1', 'gray.1'],
  secondary: ['gray.3', 'gray.3'],
  'secondary-foreground': ['gray.12', 'gray.12'],
  muted: ['gray.2', 'gray.2'],
  'muted-foreground': ['gray.11', 'gray.11'],
  accent: ['gray.4', 'gray.4'],
  'accent-foreground': ['gray.12', 'gray.12'],
  destructive: ['red.9', 'red.9'],
  'destructive-foreground': [W, W],
  border: ['gray.6', 'gray.6'],
  input: ['gray.8', 'gray.8'],
  ring: ['indigo.9', 'indigo.9'],
  brand: ['indigo.9', 'indigo.9'],
  'brand-foreground': [W, W],
  'brand-subtle': ['indigo.3', 'indigo.3'],
  'brand-text': ['indigo.11', 'indigo.11'],
  success: ['green.9', 'green.9'],
  'success-foreground': [W, W],
  'success-subtle': ['green.3', 'green.3'],
  'success-text': ['green.11', 'green.11'],
  warning: ['amber.9', 'amber.9'],
  'warning-foreground': ['amber.12', 'amber.1'],
  'warning-subtle': ['amber.3', 'amber.3'],
  'warning-text': ['amber.11', 'amber.11'],
  'danger-subtle': ['red.3', 'red.3'],
  'danger-text': ['red.11', 'red.11'],
};

/** Pairs checked on every build: [fg, bg, minimum ratio]. */
export const CONTRAST_RULES = [
  ['foreground', 'background', 7],
  ['muted-foreground', 'background', 4.5],
  ['muted-foreground', 'muted', 4.5],
  ['primary-foreground', 'primary', 4.5],
  ['secondary-foreground', 'secondary', 4.5],
  ['accent-foreground', 'accent', 4.5],
  ['destructive-foreground', 'destructive', 4.5],
  ['brand-foreground', 'brand', 4.5],
  ['brand-text', 'background', 4.5],
  ['brand-text', 'brand-subtle', 4.5],
  ['success-foreground', 'success', 4.5],
  ['success-text', 'success-subtle', 4.5],
  ['warning-foreground', 'warning', 4.5],
  ['warning-text', 'warning-subtle', 4.5],
  ['danger-text', 'danger-subtle', 4.5],
  ['ring', 'background', 3],
  // Deliberate exception, documented in the README: input borders sit below 3:1.
  ['input', 'background', 1.8],
];

export const RADIUS = { sm: 4, md: 6, lg: 8, xl: 12, full: 9999 };
export const SPACING_STEPS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

/** [name, size px, line-height px, letter-spacing em] */
export const TYPE_SCALE = [
  ['xs', 12, 16, 0],
  ['sm', 13, 20, 0],
  ['base', 14, 20, 0],
  ['md', 16, 24, 0],
  ['lg', 18, 28, 0],
  ['xl', 20, 28, -0.01],
  ['2xl', 24, 32, -0.015],
  ['3xl', 30, 36, -0.02],
  ['4xl', 36, 40, -0.025],
  ['5xl', 48, 52, -0.03],
];

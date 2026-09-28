// OKLCH → sRGB conversion and WCAG 2 contrast. No dependencies.

/** @returns {[number, number, number]} linear sRGB (may be out of gamut) */
export function oklchToLinearSrgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);
const encode = (c) => {
  c = Math.min(Math.max(c, 0), 1);
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};

/**
 * Converts OKLCH to an in-gamut sRGB hex, lowering chroma until it fits.
 * @returns {{ hex: string, C: number }}
 */
export function oklchToHex(L, C, h) {
  while (C > 0 && !inGamut(oklchToLinearSrgb(L, C, h))) C -= 0.002;
  C = Math.max(C, 0);
  const hex =
    '#' +
    oklchToLinearSrgb(L, C, h)
      .map((c) =>
        Math.round(encode(c) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('');
  return { hex, C: Math.round(C * 10000) / 10000 };
}

export function relativeLuminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const hexToComponents = (hex) =>
  [1, 3, 5].map((i) => Math.round((parseInt(hex.slice(i, i + 2), 16) / 255) * 10000) / 10000);

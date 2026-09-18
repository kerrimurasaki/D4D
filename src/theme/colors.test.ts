import { describe, expect, it } from 'vitest';
import { colors, type ColorToken } from './colors';

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: ColorToken, b: ColorToken): number {
  const [hi, lo] = [luminance(colors[a]), luminance(colors[b])].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Every text-on-background pairing used in the app: [foreground, background].
const textPairs: [ColorToken, ColorToken][] = [
  ['ink', 'white'], ['ink', 'sand'], ['ink', 'tint'],
  ['deep', 'white'], ['deep', 'sand'], ['deep', 'tint'],
  ['mute', 'white'], ['mute', 'sand'], ['mute', 'tint'],
  ['amber', 'white'], ['amber', 'sand'], ['amber', 'tint'],
  ['clay', 'white'], ['clay', 'sand'],
  ['sage', 'white'],
  ['white', 'deep'], ['sand', 'deep'],
  ['white', 'amber'], ['white', 'sage'], ['white', 'mute'], ['white', 'clay'],
];

// Non-text UI boundaries and focus rings need 3:1 (WCAG 1.4.11).
const uiPairs: [ColorToken, ColorToken][] = [
  ['deep', 'sand'], ['deep', 'white'], ['sand', 'deep'], ['mute', 'white'], ['deep', 'tint'],
];

describe('colour contrast (WCAG 2.2 AA)', () => {
  it.each(textPairs)('%s text on %s is at least 4.5:1', (fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
  it.each(uiPairs)('%s boundary on %s is at least 3:1', (fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(3);
  });
});

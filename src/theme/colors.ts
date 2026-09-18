/**
 * Palette from the printed pack. Tokens that carry text were darkened where the pack's
 * original value failed WCAG AA (verified in colors.test.ts). The original values are kept
 * as `*-bright` for decorative use only — rules and accents, never text or status.
 */
export const colors = {
  deep: '#1F3A46',
  sand: '#F3ECE2',
  tint: '#EBE1D3',
  amber: '#A34A22', // pack #D97642 is 3.2:1 on white
  'amber-bright': '#D97642',
  sage: '#4F7263', // pack #7FA090 is 2.9:1 with white text
  'sage-bright': '#7FA090',
  clay: '#7A5B42', // pack #8C6A4E is 4.2:1 on sand
  ink: '#22323A',
  mute: '#56656C', // pack #6E7F87 is 4.2:1 on white
  line: '#E5DDD1',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;

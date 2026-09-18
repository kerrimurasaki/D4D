import type { Config } from 'tailwindcss';
import { colors } from './src/theme/colors';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Replace (not extend) the palette so components can only use design tokens.
    colors: { transparent: 'transparent', current: 'currentColor', ...colors },
    extend: {
      fontFamily: {
        serif: ['Cambria', 'Georgia', 'serif'],
        sans: ['Calibri', '"Segoe UI"', 'system-ui', '-apple-system', 'Roboto', 'sans-serif'],
        mono: ['Consolas', '"Courier New"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(31 58 70 / 0.06), 0 4px 14px rgb(31 58 70 / 0.07)',
      },
    },
  },
  plugins: [],
} satisfies Config;

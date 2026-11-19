import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0B0D',
        panel: '#111317',
        surface: '#171A20',
        hairline: '#23272F',
        bone: '#F4F1EA',
        muted: '#8B919A',
        signal: '#FF3B1F',
        lime: '#C8FF00',
        cyan: '#00E5CC',
        cobalt: '#0066FF',
        amber: '#FFB800',
        terracotta: '#FF6B35',
        emerald: '#00C875',
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

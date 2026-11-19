import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8FA',
        surface: '#FFFFFF',
        subtle: '#F1F3F6',
        border: '#E5E8EE',
        ink: '#0F172A',
        muted: '#64748B',
        brand: '#059669',
        brandSoft: '#ECFDF5',
        brandBorder: '#A7F3D0',
        warn: '#D97706',
        warnSoft: '#FFFBEB',
        warnBorder: '#FDE68A',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B2430',
        paper: '#F7F5F0',
        chalk: '#F5C242',
        coral: '#FF6F59',
        slate: '#5B6472',
        pine: '#2E6F5E',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jbmono)', 'monospace'],
      },
      rotate: {
        '1.5': '1.5deg',
        '-1.5': '-1.5deg',
        '2.5': '2.5deg',
        '-2.5': '-2.5deg',
      },
    },
  },
  plugins: [],
};

export default config;

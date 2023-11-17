import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-gray': { DEFAULT: '#1E212F', dark: '#191C28' },
        primary: {
          DEFAULT: '#5AA05F',
          hover: '#4C854F',
          active: '#437445',
          border: '#447648',
        },
        secondary: { DEFAULT: '#939F93', hover: '#869086', active: '#7B837B' },
        error: { DEFAULT: '#E8523E' },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;

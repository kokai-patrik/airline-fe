import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        'primary': '#06038d',
        'secondary': '#c6007e',
        'light-gray': '#f2f2f2',
        'gray': '#919191',
        'blue': '#3434e0',
        'light-magenta': '#fff2fa',
      },
      boxShadow: {
        'box': '6px 6px 15px 0px rgba(0, 0, 0, 0.1)',
        'error': '0 0 10px 0 rgba(198, 0, 126, 0.35)',
      }
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,vue}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: '#06038d',
        secondary: '#c6007e',
        'light-gray': '#f2f2f2',
        'light-gray-2': '#c1c1c1',
        'light-gray-3': '#e5e5e5',
        'light-gray-4': '#e1e1e1',
        'medium-gray': '#343434',
        gray: '#919191',
        blue: '#3434e0',
        'light-magenta': '#fff2fa',
      },
      boxShadow: {
        box: '6px 6px 15px 0px rgba(0, 0, 0, 0.1)',
        error: '0 0 10px 0 rgba(198, 0, 126, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;

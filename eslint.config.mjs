import { createConfigForNuxt } from '@nuxt/eslint-config';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from './prettier.config.mjs';

export default createConfigForNuxt({
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    ...js.configs.recommended.rules,
    'prettier/prettier': ['error', prettierConfig],
    indent: ['error', 2],
  },
}).override('nuxt/vue/rules', {
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 2,
        },
        multiline: {
          max: 1,
        },
      },
    ],
  },
});

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  // 1. CONFIG FOR NODE.JS FILES (Like jest.config.js)
  {
    files: [
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.cjs',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },

  // 2. EXISTING CONFIG FOR REACT/BROWSER FILES (UPDATED FOR JEST)
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      // 🚀 MERGE browser AND jest globals to recognize testing environment variables
      globals: {
        ...globals.browser,
        ...globals.jest, // 
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
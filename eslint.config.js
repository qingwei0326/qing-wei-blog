import eslintPlugin from '@typescript-eslint/eslint-plugin'
import tseslint from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default [
  {
    ignores: ['dist/', 'node_modules/', 'src-tauri/', '.vitepress/cache/', 'docs/.vitepress/cache/'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint,
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...eslintPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]

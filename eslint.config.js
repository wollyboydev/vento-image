import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', '!src/main.ts'],
    ignores: ['**/*.d.ts', 'node_modules/**/*', 'dist/**/*'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        HTMLElement: 'readonly',
        HTMLIFrameElement: 'readonly',
        HTMLButtonElement: 'readonly',
        ResizeObserver: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-undef': 'off',
    },
  },
  prettier,
  {
    ignores: ['dist/**/*', 'node_modules/**/*', '**/*.d.ts', 'src/main.ts'],
  },
];

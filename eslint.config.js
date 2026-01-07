import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export default [
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'coverage/**',
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
    ],
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // Main configuration for source files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // React specific overrides
      'react/prop-types': 'off', // Not using PropTypes
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/display-name': 'off',
      'react/jsx-no-target-blank': 'warn',

      // General JavaScript rules
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'warn',
      'no-duplicate-imports': 'error',
      'no-template-curly-in-string': 'warn',

      // Best practices
      'curly': ['error', 'multi-line'],
      'eqeqeq': ['error', 'smart'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-return-await': 'warn',
      'no-throw-literal': 'error',
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'require-await': 'warn',

      // Style (basic - Prettier handles most formatting)
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
      'no-trailing-spaces': 'warn',
      'comma-dangle': ['warn', 'always-multiline'],
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single', { avoidEscape: true }],

      // ES6+
      'arrow-body-style': ['warn', 'as-needed'],
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'warn',
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],
      'prefer-rest-params': 'warn',
      'prefer-spread': 'warn',
    },
  },
];

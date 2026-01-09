import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export default [
  // Global ignore patterns
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'coverage/**'],
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // Configuration for config files at root (minimal rules, Node.js environment)
  {
    files: ['*.config.js', '*.config.cjs', '*.config.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'off',
    },
  },

  // Main configuration for source files
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
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
        {
          allowConstantExport: true,
          allowExportNames: [
            'useCart',
            'useCartItems',
            'useCartTotals',
            'useCartUI',
            'useCheckout',
            'useProfile',
            'useTheme',
            'useToast',
            'useFilter',
            'useSearch',
            'useProducts',
            'useInfiniteProducts',
            'useProduct',
            'useRelatedProducts',
            'useFeaturedProducts',
            'useProductSearch',
            'CHECKOUT_STAGES',
            'SORT_OPTIONS',
            'LOG_LEVELS',
          ],
        },
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
      curly: ['error', 'multi-line'],
      eqeqeq: ['error', 'smart'],
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
      'comma-dangle': 'off',
      semi: ['warn', 'always'],
      quotes: ['warn', 'single', { avoidEscape: true }],

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

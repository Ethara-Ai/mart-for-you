import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for DOM testing
    environment: 'jsdom',

    // Global test setup file
    setupFiles: ['./src/testing/setup.js'],

    // Enable globals like describe, it, expect without imports
    globals: true,

    // Include test files
    include: ['src/**/*.{test,spec}.{js,jsx}'],

    // Exclude node_modules and dist
    exclude: ['node_modules', 'dist'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/main.jsx',
        'src/__tests__/**',
        'src/**/*.test.{js,jsx}',
        'src/**/*.spec.{js,jsx}',
      ],
      thresholds: {
        lines: 25,
        functions: 25,
        branches: 10,
        statements: 25,
      },
    },

    // Test timeout
    testTimeout: 10000,

    // Reporter options
    reporters: ['verbose'],

    // CSS handling
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});

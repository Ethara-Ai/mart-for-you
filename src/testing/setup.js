// Test setup file for Vitest
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] ?? null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = String(value);
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Create a proper matchMedia mock factory
function createMatchMediaMock(matches = false) {
  return {
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(), // deprecated but still needed for older browsers
    removeListener: vi.fn(), // deprecated but still needed for older browsers
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
}

// Mock matchMedia for theme tests
const matchMediaMock = vi.fn((query) => {
  const mediaQueryList = createMatchMediaMock(false);
  mediaQueryList.media = query;
  return mediaQueryList;
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = MockResizeObserver;

// Mock MutationObserver
class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

window.MutationObserver = MockMutationObserver;

// Mock scrollTo and scroll
window.scrollTo = vi.fn();
window.scroll = vi.fn();

// Mock scrollIntoView on Element prototype
Element.prototype.scrollIntoView = vi.fn();

// Mock requestAnimationFrame and cancelAnimationFrame
let rafId = 0;
window.requestAnimationFrame = vi.fn((callback) => {
  rafId += 1;
  setTimeout(callback, 0);
  return rafId;
});
window.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

// Mock getComputedStyle
window.getComputedStyle = vi.fn(() => ({
  getPropertyValue: vi.fn(() => ''),
}));

// Mock import.meta.env
if (typeof import.meta.env === 'undefined') {
  Object.defineProperty(import.meta, 'env', {
    value: {
      DEV: true,
      PROD: false,
      MODE: 'test',
    },
    writable: true,
  });
}

// Suppress console errors for expected test failures
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Suppress specific React errors that are expected during testing
    const suppressedMessages = [
      'Warning: ReactDOM.render is no longer supported',
      'Warning: An update to',
      'act(...)',
      'Warning: validateDOMNesting',
      'Warning: Each child in a list',
      'Warning: Failed prop type',
      'Error: Uncaught [Error: useTheme must be used',
      'Error: Uncaught [Error: useCart must be used',
      'Error: Uncaught [Error: useProfile must be used',
      'Error: Uncaught [Error: useToast must be used',
      'Error: Uncaught [Error: useSearch must be used',
      'Error: Uncaught [Error: useFilter must be used',
    ];

    const shouldSuppress = suppressedMessages.some(
      (msg) => typeof args[0] === 'string' && args[0].includes(msg)
    );

    if (!shouldSuppress) {
      originalError.call(console, ...args);
    }
  };

  console.warn = (...args) => {
    // Suppress specific warnings
    const suppressedWarnings = ['React does not recognize the', 'Invalid DOM property'];

    const shouldSuppress = suppressedWarnings.some(
      (msg) => typeof args[0] === 'string' && args[0].includes(msg)
    );

    if (!shouldSuppress) {
      originalWarn.call(console, ...args);
    }
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();

  // Reset localStorage mock store
  localStorageMock.store = {};
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();

  // Reset matchMedia mock
  matchMediaMock.mockClear();

  // Reset document classes that might have been added
  document.documentElement.classList.remove('dark');
  document.body.classList.remove('dark:bg-gray-900');
  document.documentElement.removeAttribute('data-theme');
});

// Export utilities for tests that need custom matchMedia behavior
export { createMatchMediaMock, localStorageMock, matchMediaMock };

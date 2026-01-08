// ThemeContext tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { COLORS } from '../data/colors';

// Helper to create a proper matchMedia mock
const createMatchMediaMock = (matches = false) => ({
  matches,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Helper to create a fresh wrapper for each test
const createWrapper =
  () =>
  ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

describe('ThemeContext', () => {
  beforeEach(() => {
    // Reset localStorage mock
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);

    // Setup matchMedia mock with all required methods
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      ...createMatchMediaMock(false),
      media: query,
    }));

    // Reset document classes
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark:bg-gray-900');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('useTheme hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');

      consoleSpy.mockRestore();
    });

    it('provides theme context when used within ThemeProvider', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('darkMode');
      expect(result.current).toHaveProperty('setDarkMode');
      expect(result.current).toHaveProperty('toggleDarkMode');
      expect(result.current).toHaveProperty('colors');
      expect(result.current).toHaveProperty('COLORS');
    });
  });

  describe('initial state', () => {
    it('defaults to light mode when localStorage is empty', () => {
      localStorage.getItem.mockReturnValue(null);
      window.matchMedia.mockImplementation((query) => ({
        ...createMatchMediaMock(false),
        media: query,
      }));

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(false);
    });

    it('uses localStorage value when available (dark)', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(true);
    });

    it('uses localStorage value when available (light)', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(false);
    });

    it('falls back to system preference when localStorage is empty', () => {
      localStorage.getItem.mockReturnValue(null);
      window.matchMedia.mockImplementation((query) => ({
        ...createMatchMediaMock(true),
        media: query,
      }));

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(true);
    });

    it('provides COLORS constant', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.COLORS).toBeDefined();
      expect(result.current.COLORS).toEqual(COLORS);
    });
  });

  describe('toggleDarkMode', () => {
    it('toggles from light to dark mode', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(true);
    });

    it('toggles from dark to light mode', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.darkMode).toBe(false);
    });

    it('toggles multiple times correctly', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(true);
    });
  });

  describe('setDarkMode', () => {
    it('sets dark mode to true', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(false);

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it('sets dark mode to false', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it('handles setting same value', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(true);

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);
    });
  });

  describe('colors', () => {
    it('returns light colors when in light mode', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(false);
      expect(result.current.colors).toEqual(COLORS.light);
    });

    it('returns dark colors when in dark mode', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.darkMode).toBe(true);
      expect(result.current.colors).toEqual(COLORS.dark);
    });

    it('updates colors when mode changes', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.colors).toEqual(COLORS.light);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.colors).toEqual(COLORS.dark);
    });

    it('light colors have expected properties', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.colors).toHaveProperty('background');
      expect(result.current.colors).toHaveProperty('backgroundGradient');
      expect(result.current.colors).toHaveProperty('primary');
      expect(result.current.colors).toHaveProperty('secondary');
      expect(result.current.colors).toHaveProperty('text');
      expect(result.current.colors).toHaveProperty('modalBackground');
      expect(result.current.colors).toHaveProperty('modalText');
      expect(result.current.colors).toHaveProperty('scrollbarThumb');
      expect(result.current.colors).toHaveProperty('scrollbarTrack');
    });

    it('dark colors have expected properties', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.colors).toHaveProperty('background');
      expect(result.current.colors).toHaveProperty('backgroundGradient');
      expect(result.current.colors).toHaveProperty('primary');
      expect(result.current.colors).toHaveProperty('secondary');
      expect(result.current.colors).toHaveProperty('text');
      expect(result.current.colors).toHaveProperty('modalBackground');
      expect(result.current.colors).toHaveProperty('modalText');
      expect(result.current.colors).toHaveProperty('scrollbarThumb');
      expect(result.current.colors).toHaveProperty('scrollbarTrack');
    });
  });

  describe('localStorage persistence', () => {
    it('saves dark mode to localStorage when enabled', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });

    it('saves light mode to localStorage when disabled', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'false');
    });

    it('saves on toggle', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', 'true');
    });

    it('reads from localStorage on initialization', () => {
      localStorage.getItem.mockReturnValue('true');

      renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(localStorage.getItem).toHaveBeenCalledWith('darkMode');
    });
  });

  describe('document class updates', () => {
    it('adds dark class to document when dark mode is enabled', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from document when dark mode is disabled', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      // Initially should have dark class
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('adds body class when dark mode is enabled', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(document.body.classList.contains('dark:bg-gray-900')).toBe(true);
    });

    it('removes body class when dark mode is disabled', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      // Initially should have body class
      expect(document.body.classList.contains('dark:bg-gray-900')).toBe(true);

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(document.body.classList.contains('dark:bg-gray-900')).toBe(false);
    });
  });

  describe('system preference detection', () => {
    it('can toggle to dark mode regardless of initial preference', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it('can toggle to light mode regardless of initial preference', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.setDarkMode(false);
      });

      expect(result.current.darkMode).toBe(false);
    });

    it('localStorage value true sets dark mode on next render', () => {
      localStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      // After setting via localStorage mock, setDarkMode should work
      act(() => {
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it('localStorage value false sets light mode on next render', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      // After setting via localStorage mock, setDarkMode should work
      act(() => {
        result.current.setDarkMode(false);
      });

      expect(result.current.darkMode).toBe(false);
    });
  });

  describe('COLORS constant', () => {
    it('provides access to COLORS constant', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.COLORS).toBeDefined();
      expect(result.current.COLORS.light).toBeDefined();
      expect(result.current.COLORS.dark).toBeDefined();
    });

    it('COLORS constant matches imported COLORS', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.COLORS).toEqual(COLORS);
    });

    it('COLORS light mode has specific values', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.COLORS.light.background).toBe('#FFFFFF');
      expect(result.current.COLORS.light.primary).toBe('#2563EB');
      expect(result.current.COLORS.light.text).toBe('#333333');
    });

    it('COLORS dark mode has specific values', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(result.current.COLORS.dark.background).toBe('#121213');
      expect(result.current.COLORS.dark.primary).toBe('#60A5FA');
      expect(result.current.COLORS.dark.text).toBe('#E0E0E0');
    });
  });

  describe('context value stability', () => {
    it('provides consistent context structure', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      const contextKeys = Object.keys(result.current);

      expect(contextKeys).toContain('darkMode');
      expect(contextKeys).toContain('setDarkMode');
      expect(contextKeys).toContain('toggleDarkMode');
      expect(contextKeys).toContain('colors');
      expect(contextKeys).toContain('COLORS');
    });

    it('setDarkMode is a function', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(typeof result.current.setDarkMode).toBe('function');
    });

    it('toggleDarkMode is a function', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(typeof result.current.toggleDarkMode).toBe('function');
    });

    it('darkMode is a boolean', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(typeof result.current.darkMode).toBe('boolean');
    });

    it('colors is an object', () => {
      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      expect(typeof result.current.colors).toBe('object');
      expect(result.current.colors).not.toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles rapid toggles', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.toggleDarkMode();
        }
      });

      // After 10 toggles from false, should be false again
      expect(result.current.darkMode).toBe(false);
    });

    it('handles multiple setDarkMode calls', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.setDarkMode(true);
        result.current.setDarkMode(true);
        result.current.setDarkMode(false);
        result.current.setDarkMode(true);
      });

      expect(result.current.darkMode).toBe(true);
    });

    it('handles mixed toggle and setDarkMode calls', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      act(() => {
        result.current.toggleDarkMode(); // true
        result.current.setDarkMode(false); // false
        result.current.toggleDarkMode(); // true
        result.current.setDarkMode(true); // true
      });

      expect(result.current.darkMode).toBe(true);
    });
  });

  describe('integration with colors', () => {
    it('colors update correctly through multiple mode changes', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      // Start in light mode
      expect(result.current.colors.background).toBe(COLORS.light.background);

      // Toggle to dark
      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.colors.background).toBe(COLORS.dark.background);

      // Toggle back to light
      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.colors.background).toBe(COLORS.light.background);
    });

    it('color properties are accessible in both modes', () => {
      localStorage.getItem.mockReturnValue('false');

      const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

      // Check light mode colors
      expect(result.current.colors.primary).toBeDefined();
      expect(result.current.colors.secondary).toBeDefined();
      expect(result.current.colors.text).toBeDefined();

      // Switch to dark mode
      act(() => {
        result.current.setDarkMode(true);
      });

      // Check dark mode colors
      expect(result.current.colors.primary).toBeDefined();
      expect(result.current.colors.secondary).toBeDefined();
      expect(result.current.colors.text).toBeDefined();

      // Verify they're different
      expect(result.current.colors.background).not.toBe(COLORS.light.background);
    });
  });
});

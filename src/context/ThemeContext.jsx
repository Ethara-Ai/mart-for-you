import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { COLORS } from '../data/colors';
import { STORAGE_KEYS } from '../constants';

// Create the Theme Context
const ThemeContext = createContext(null);

/**
 * Helper function to get initial dark mode value
 * Checks localStorage first, then falls back to system preference
 * @returns {boolean} Initial dark mode state
 */
function getInitialDarkMode() {
  // SSR safety check
  if (typeof window === 'undefined') {
    return false;
  }

  // Check localStorage first
  const savedDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  if (savedDarkMode !== null) {
    return savedDarkMode === 'true';
  }

  // Fall back to system preference
  if (window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
}

/**
 * ThemeProvider - Provides theme context to the application
 *
 * Manages dark mode state with localStorage persistence and
 * system preference detection. Automatically updates document
 * classes for Tailwind dark mode support.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Update document classes and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-gray-900');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(darkMode));
  }, [darkMode]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event) => {
      // Only update if user hasn't set a preference
      const savedPreference = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (savedPreference === null) {
        setDarkMode(event.matches);
      }
    };

    // Use addEventListener for modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Toggle dark mode - memoized callback
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // Get current theme colors - derived state
  const colors = useMemo(() => (darkMode ? COLORS.dark : COLORS.light), [darkMode]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      toggleDarkMode,
      colors,
      COLORS,
    }),
    [darkMode, toggleDarkMode, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme - Custom hook to access theme context
 *
 * @returns {Object} Theme context value containing:
 *   - darkMode: boolean - Current dark mode state
 *   - setDarkMode: Function - Set dark mode directly
 *   - toggleDarkMode: Function - Toggle dark mode
 *   - colors: Object - Current theme colors
 *   - COLORS: Object - All theme colors (light and dark)
 *
 * @throws {Error} If used outside of ThemeProvider
 *
 * @example
 * const { darkMode, toggleDarkMode, colors } = useTheme();
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;

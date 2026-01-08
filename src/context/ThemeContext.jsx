import { createContext, useContext, useState, useEffect } from 'react';
import { COLORS } from '../data/colors';

// Create the Theme Context
const ThemeContext = createContext(null);

// Helper function to get initial dark mode value
function getInitialDarkMode() {
  // Check localStorage first
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode !== null) {
    return savedDarkMode === 'true';
  }
  // Fall back to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

// Theme Provider Component
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
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Get current theme colors
  const getColors = () => (darkMode ? COLORS.dark : COLORS.light);

  // Context value
  const value = {
    darkMode,
    setDarkMode,
    toggleDarkMode,
    colors: getColors(),
    COLORS,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

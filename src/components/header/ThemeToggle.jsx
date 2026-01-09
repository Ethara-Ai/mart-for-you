import { FiMoon, FiSun } from 'react-icons/fi';

/**
 * ThemeToggle - Dark/Light mode toggle button
 *
 * Displays a toggle button for switching between dark and light modes.
 */
function ThemeToggle({ darkMode, onToggle, colors }) {
  return (
    <button
      onClick={onToggle}
      className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95"
      style={{
        backgroundColor: darkMode ? colors.dark.secondary : colors.light.secondary,
        color: darkMode ? colors.dark.primary : colors.light.primary,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}

export default ThemeToggle;

import { useState, useRef, useEffect } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

/**
 * SearchBar - Reusable search input component
 *
 * A search bar with clear functionality and customizable styling.
 * Supports both desktop and mobile variants.
 *
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Callback when search value changes
 * @param {Function} props.onSubmit - Callback when search is submitted
 * @param {Function} props.onClear - Callback when search is cleared
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.variant - 'desktop' | 'mobile' - Size variant
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.autoFocus - Whether to auto-focus the input
 */
function SearchBar({
  value = '',
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search products...',
  variant = 'desktop',
  className = '',
  autoFocus = false,
}) {
  const { darkMode, COLORS } = useTheme();
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-focus if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Determine styling based on variant
  const isMobile = variant === 'mobile';
  const inputPadding = isMobile ? 'px-3 py-1.5 pr-8' : 'px-4 py-2 pr-10';
  const inputWidth = isMobile ? 'w-full' : 'w-full';
  const iconSize = isMobile ? 'h-3 w-3' : 'h-4 w-4';
  const searchIconSize = isMobile ? 14 : 16;
  const clearButtonPosition = isMobile ? 'right-8' : 'right-10';

  // Input styles
  const inputStyles = {
    backgroundColor: darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    color: darkMode ? COLORS.dark.text : COLORS.light.text,
    borderColor: isFocused
      ? darkMode
        ? COLORS.dark.primary
        : COLORS.light.primary
      : darkMode
        ? 'rgba(100, 116, 139, 0.5)'
        : 'transparent',
    boxShadow: isFocused
      ? `0 0 0 2px ${darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.2)'}`
      : darkMode
        ? '0 1px 3px rgba(0, 0, 0, 0.3)'
        : '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`${inputWidth} ${inputPadding} rounded-full text-sm transition-all duration-200 outline-hidden border-2 placeholder:text-gray-400 dark:placeholder:text-gray-300`}
        style={inputStyles}
        aria-label="Search"
      />

      {/* Clear button - only show when there's a value */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute ${clearButtonPosition} top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}
          style={{
            color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)',
          }}
          aria-label="Clear search"
        >
          <FiX className={iconSize} />
        </button>
      )}

      {/* Search button/icon */}
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        style={{
          color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
        }}
        aria-label="Submit search"
      >
        <FiSearch size={searchIconSize} />
      </button>
    </form>
  );
}

export default SearchBar;

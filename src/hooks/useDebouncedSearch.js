import { useState, useEffect, useRef, useCallback } from 'react';
import { ANIMATION } from '../constants';

/**
 * useDebouncedSearch - Custom hook for debounced search functionality
 *
 * Provides a complete search solution with debouncing, loading state,
 * and callback support. Useful for search inputs that trigger API calls
 * or expensive filtering operations.
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.initialValue=''] - Initial search term
 * @param {number} [options.delay=300] - Debounce delay in milliseconds
 * @param {number} [options.minLength=0] - Minimum length before search triggers
 * @param {Function} [options.onSearch] - Callback when debounced search triggers
 * @param {Function} [options.onClear] - Callback when search is cleared
 * @returns {Object} Search state and handlers
 *
 * @example
 * function SearchComponent() {
 *   const {
 *     searchTerm,
 *     debouncedTerm,
 *     setSearchTerm,
 *     clearSearch,
 *     isSearching,
 *     hasSearched,
 *   } = useDebouncedSearch({
 *     delay: 300,
 *     minLength: 2,
 *     onSearch: (term) => fetchResults(term),
 *     onClear: () => resetResults(),
 *   });
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 */
export function useDebouncedSearch(options = {}) {
  const {
    initialValue = '',
    delay = ANIMATION.DEBOUNCE_DELAY,
    minLength = 0,
    onSearch,
    onClear,
  } = options;

  // State
  const [searchTerm, setSearchTermState] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [hasSearched, setHasSearched] = useState(false);

  // Refs for cleanup and tracking
  const timerRef = useRef(null);
  const onSearchRef = useRef(onSearch);
  const onClearRef = useRef(onClear);
  const isMountedRef = useRef(true);
  const isClearing = useRef(false);
  const isSearchingNow = useRef(false);

  // Update callback refs when they change
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    onClearRef.current = onClear;
  }, [onClear]);

  // Track mounted state for async operations
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Derived searching state - no need for setState in effect
  const isSearching = searchTerm !== debouncedTerm;

  // Debounce effect
  useEffect(() => {
    // Skip if we're in the middle of a programmatic clear or immediate search
    if (isClearing.current) {
      isClearing.current = false;
      return;
    }
    if (isSearchingNow.current) {
      isSearchingNow.current = false;
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set up new timer
    timerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      setDebouncedTerm(searchTerm);

      // Only trigger search if meets minimum length
      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm.length >= minLength) {
        setHasSearched(true);
        if (onSearchRef.current && typeof onSearchRef.current === 'function') {
          onSearchRef.current(trimmedTerm);
        }
      } else if (trimmedTerm.length === 0 && hasSearched) {
        // Clear was triggered
        if (onClearRef.current && typeof onClearRef.current === 'function') {
          onClearRef.current();
        }
      }
    }, delay);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchTerm, delay, minLength, hasSearched]);

  /**
   * Set the search term
   * @param {string} value - New search term
   */
  const setSearchTerm = useCallback((value) => {
    setSearchTermState(value);
  }, []);

  /**
   * Clear the search term and reset state
   */
  const clearSearch = useCallback(() => {
    // Clear any pending timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Set flag to prevent effect from triggering
    isClearing.current = true;

    setSearchTermState('');
    setDebouncedTerm('');
    setHasSearched(false);

    // Trigger clear callback
    if (onClearRef.current && typeof onClearRef.current === 'function') {
      onClearRef.current();
    }
  }, []);

  /**
   * Force immediate search (bypass debounce)
   */
  const searchNow = useCallback(() => {
    // Clear any pending timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Set flag to prevent effect from triggering
    isSearchingNow.current = true;

    const trimmedTerm = searchTerm.trim();
    setDebouncedTerm(trimmedTerm);

    if (trimmedTerm.length >= minLength) {
      setHasSearched(true);
      if (onSearchRef.current && typeof onSearchRef.current === 'function') {
        onSearchRef.current(trimmedTerm);
      }
    }
  }, [searchTerm, minLength]);

  /**
   * Handle input change event
   * @param {Event} event - Input change event
   */
  const handleChange = useCallback((event) => {
    const value = event.target?.value ?? event;
    setSearchTermState(typeof value === 'string' ? value : '');
  }, []);

  /**
   * Handle form submit (immediate search)
   * @param {Event} [event] - Form submit event
   */
  const handleSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      searchNow();
    },
    [searchNow]
  );

  /**
   * Handle key press (Enter for immediate search)
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        searchNow();
      } else if (event.key === 'Escape') {
        clearSearch();
      }
    },
    [searchNow, clearSearch]
  );

  /**
   * Check if search is active (has content)
   */
  const isSearchActive = searchTerm.trim().length > 0;

  /**
   * Check if search meets minimum length requirement
   */
  const meetsMinLength = searchTerm.trim().length >= minLength;

  return {
    // State
    searchTerm,
    debouncedTerm,
    isSearching,
    hasSearched,
    isSearchActive,
    meetsMinLength,

    // Actions
    setSearchTerm,
    clearSearch,
    searchNow,

    // Event handlers (for convenience)
    handleChange,
    handleSubmit,
    handleKeyDown,

    // Input props (spread onto input element)
    inputProps: {
      value: searchTerm,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
    },
  };
}

export default useDebouncedSearch;

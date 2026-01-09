import { useState, useEffect, useRef } from 'react';
import { ANIMATION } from '../constants';

/**
 * useDebouncedValue - Custom hook for debouncing a value
 *
 * Returns a debounced version of the input value that only updates
 * after the specified delay has passed without changes.
 *
 * @param {*} value - The value to debounce
 * @param {number} [delay=300] - The debounce delay in milliseconds
 * @returns {*} The debounced value
 *
 * @example
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearch = useDebouncedValue(searchTerm, 300);
 *
 *   useEffect(() => {
 *     // This effect only runs when debouncedSearch changes
 *     // (300ms after the user stops typing)
 *     if (debouncedSearch) {
 *       fetchSearchResults(debouncedSearch);
 *     }
 *   }, [debouncedSearch]);
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *     />
 *   );
 * }
 */
export function useDebouncedValue(value, delay = ANIMATION.DEBOUNCE_DELAY) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set up new timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup on unmount or when value/delay changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback - Custom hook for debouncing a callback function
 *
 * Returns a debounced version of the callback that only executes
 * after the specified delay has passed without being called again.
 *
 * @param {Function} callback - The callback function to debounce
 * @param {number} [delay=300] - The debounce delay in milliseconds
 * @param {Array} [deps=[]] - Dependencies for the callback
 * @returns {{ callback: Function, cancel: Function, flush: Function }}
 *
 * @example
 * function SearchComponent() {
 *   const { callback: debouncedSearch, cancel } = useDebouncedCallback(
 *     (term) => fetchSearchResults(term),
 *     300,
 *     []
 *   );
 *
 *   useEffect(() => {
 *     return () => cancel(); // Cleanup on unmount
 *   }, [cancel]);
 *
 *   return (
 *     <input onChange={(e) => debouncedSearch(e.target.value)} />
 *   );
 * }
 */
export function useDebouncedCallback(callback, delay = ANIMATION.DEBOUNCE_DELAY, deps = []) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);
  const argsRef = useRef(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  const debouncedCallback = (...args) => {
    argsRef.current = args;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      callbackRef.current(...argsRef.current);
      timerRef.current = null;
    }, delay);
  };

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const flush = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (argsRef.current) {
        callbackRef.current(...argsRef.current);
      }
    }
  };

  return { callback: debouncedCallback, cancel, flush };
}

/**
 * useDebouncedState - Custom hook combining useState with debouncing
 *
 * Returns both the immediate value and a debounced value,
 * along with a setter function.
 *
 * @param {*} initialValue - The initial state value
 * @param {number} [delay=300] - The debounce delay in milliseconds
 * @returns {[*, *, Function]} [immediateValue, debouncedValue, setValue]
 *
 * @example
 * function SearchComponent() {
 *   const [searchTerm, debouncedTerm, setSearchTerm] = useDebouncedState('', 300);
 *
 *   useEffect(() => {
 *     if (debouncedTerm) {
 *       fetchSearchResults(debouncedTerm);
 *     }
 *   }, [debouncedTerm]);
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
export function useDebouncedState(initialValue, delay = ANIMATION.DEBOUNCE_DELAY) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebouncedValue(value, delay);

  return [value, debouncedValue, setValue];
}

export default useDebouncedValue;

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { TOAST_TYPES, ANIMATION } from '../constants';
import { generateToastId } from '../utils/id';

// Create the Toast Context
const ToastContext = createContext(null);

/**
 * ToastProvider - Toast notification state management
 *
 * Provides toast notification functionality including adding,
 * removing, and auto-dismissing toast messages. All values
 * are memoized to prevent unnecessary re-renders.
 *
 * Fixed: Memory leak issue with untracked timeouts
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {number} [props.defaultDuration] - Default toast duration in ms
 * @param {number} [props.maxToasts=5] - Maximum number of toasts to display
 */
export function ToastProvider({
  children,
  defaultDuration = ANIMATION.TOAST_DURATION,
  maxToasts = 5,
}) {
  const [toasts, setToasts] = useState([]);

  // Track all active timeout IDs to prevent memory leaks
  const timeoutRefs = useRef(new Map());

  // Cleanup all timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutRefs.current;

    return () => {
      // Clear all pending timeouts when component unmounts
      timeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeouts.clear();
    };
  }, []);

  /**
   * Clear a specific timeout by toast ID
   * @param {string} toastId - Toast ID whose timeout should be cleared
   */
  const clearToastTimeout = useCallback((toastId) => {
    const timeoutId = timeoutRefs.current.get(toastId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(toastId);
    }
  }, []);

  /**
   * Remove a toast by id
   * @param {string} id - Toast ID to remove
   */
  const removeToast = useCallback(
    (id) => {
      // Clear the associated timeout first
      clearToastTimeout(id);

      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    },
    [clearToastTimeout]
  );

  /**
   * Add a toast notification
   * @param {string} message - Toast message
   * @param {string} [type='success'] - Toast type (success, error, info, warning)
   * @param {Object} [options] - Additional options
   * @param {number} [options.duration] - Duration in ms (0 for no auto-dismiss)
   * @param {string} [options.id] - Custom toast ID
   * @param {boolean} [options.persistent=false] - If true, toast won't auto-dismiss
   * @returns {string} Toast ID for manual removal
   */
  const addToast = useCallback(
    (message, type = TOAST_TYPES.SUCCESS, options = {}) => {
      const { duration = defaultDuration, id: customId, persistent = false } = options;
      const id = customId || generateToastId();

      // Clear any existing timeout for this ID (if reusing an ID)
      clearToastTimeout(id);

      const toast = {
        id,
        message,
        type,
        createdAt: Date.now(),
        persistent,
      };

      setToasts((prev) => {
        // Remove oldest toasts if exceeding max
        const newToasts = [...prev, toast];
        if (newToasts.length > maxToasts) {
          // Get IDs of toasts being removed
          const removedToasts = newToasts.slice(0, newToasts.length - maxToasts);
          // Clear their timeouts
          removedToasts.forEach((t) => clearToastTimeout(t.id));
          return newToasts.slice(-maxToasts);
        }
        return newToasts;
      });

      // Auto-dismiss after duration (if duration > 0 and not persistent)
      if (duration > 0 && !persistent) {
        const timeoutId = setTimeout(() => {
          removeToast(id);
        }, duration);

        // Track the timeout
        timeoutRefs.current.set(id, timeoutId);
      }

      // Return the id so callers can manually remove if needed
      return id;
    },
    [defaultDuration, maxToasts, removeToast, clearToastTimeout]
  );

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutRefs.current.clear();

    setToasts([]);
  }, []);

  /**
   * Show a success toast
   * @param {string} message - Toast message
   * @param {Object} [options] - Additional options
   * @returns {string} Toast ID
   */
  const showSuccess = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.SUCCESS, options),
    [addToast]
  );

  /**
   * Show an error toast
   * @param {string} message - Toast message
   * @param {Object} [options] - Additional options
   * @returns {string} Toast ID
   */
  const showError = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.ERROR, options),
    [addToast]
  );

  /**
   * Show an info toast
   * @param {string} message - Toast message
   * @param {Object} [options] - Additional options
   * @returns {string} Toast ID
   */
  const showInfo = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.INFO, options),
    [addToast]
  );

  /**
   * Show a warning toast
   * @param {string} message - Toast message
   * @param {Object} [options] - Additional options
   * @returns {string} Toast ID
   */
  const showWarning = useCallback(
    (message, options) => addToast(message, TOAST_TYPES.WARNING, options),
    [addToast]
  );

  /**
   * Update an existing toast
   * @param {string} id - Toast ID to update
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.message] - New message
   * @param {string} [updates.type] - New type
   */
  const updateToast = useCallback((id, updates) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, ...updates } : toast)));
  }, []);

  /**
   * Pause auto-dismiss timer for a toast (e.g., on hover)
   * @param {string} id - Toast ID to pause
   */
  const pauseToast = useCallback(
    (id) => {
      clearToastTimeout(id);
    },
    [clearToastTimeout]
  );

  /**
   * Resume auto-dismiss timer for a toast
   * @param {string} id - Toast ID to resume
   * @param {number} [duration] - Remaining duration in ms
   */
  const resumeToast = useCallback(
    (id, duration = defaultDuration) => {
      const toast = toasts.find((t) => t.id === id);
      if (toast && !toast.persistent && duration > 0) {
        const timeoutId = setTimeout(() => {
          removeToast(id);
        }, duration);

        timeoutRefs.current.set(id, timeoutId);
      }
    },
    [toasts, defaultDuration, removeToast]
  );

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      clearToasts,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      updateToast,
      pauseToast,
      resumeToast,
    }),
    [
      toasts,
      addToast,
      removeToast,
      clearToasts,
      showSuccess,
      showError,
      showInfo,
      showWarning,
      updateToast,
      pauseToast,
      resumeToast,
    ]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

/**
 * useToast - Custom hook to access toast context
 *
 * @returns {Object} Toast context value containing:
 *   - toasts: Array - Current toast notifications
 *   - addToast: Function - Add a new toast
 *   - removeToast: Function - Remove a toast by ID
 *   - clearToasts: Function - Clear all toasts
 *   - showSuccess: Function - Show a success toast
 *   - showError: Function - Show an error toast
 *   - showInfo: Function - Show an info toast
 *   - showWarning: Function - Show a warning toast
 *   - updateToast: Function - Update an existing toast
 *   - pauseToast: Function - Pause auto-dismiss timer
 *   - resumeToast: Function - Resume auto-dismiss timer
 *
 * @throws {Error} If used outside of ToastProvider
 *
 * @example
 * const { showSuccess, showError } = useToast();
 *
 * // Show a success message
 * showSuccess('Item added to cart');
 *
 * // Show an error with custom duration
 * showError('Failed to save', { duration: 5000 });
 *
 * // Show a persistent toast (won't auto-dismiss)
 * showInfo('Loading...', { persistent: true, id: 'loading-toast' });
 * // Later...
 * removeToast('loading-toast');
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;

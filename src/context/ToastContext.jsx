import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { TOAST_TYPES, ANIMATION } from '../constants';

// Create the Toast Context
const ToastContext = createContext(null);

/**
 * Generate a unique ID for toasts
 * @returns {string} Unique toast ID
 */
function generateToastId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * ToastProvider - Toast notification state management
 *
 * Provides toast notification functionality including adding,
 * removing, and auto-dismissing toast messages. All values
 * are memoized to prevent unnecessary re-renders.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {number} [props.defaultDuration] - Default toast duration in ms
 */
export function ToastProvider({ children, defaultDuration = ANIMATION.TOAST_DURATION }) {
  const [toasts, setToasts] = useState([]);

  /**
   * Remove a toast by id
   * @param {string} id - Toast ID to remove
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Add a toast notification
   * @param {string} message - Toast message
   * @param {string} [type='success'] - Toast type (success, error, info, warning)
   * @param {Object} [options] - Additional options
   * @param {number} [options.duration] - Duration in ms (0 for no auto-dismiss)
   * @param {string} [options.id] - Custom toast ID
   * @returns {string} Toast ID for manual removal
   */
  const addToast = useCallback(
    (message, type = TOAST_TYPES.SUCCESS, options = {}) => {
      const { duration = defaultDuration, id: customId } = options;
      const id = customId || generateToastId();

      const toast = {
        id,
        message,
        type,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after duration (if duration > 0)
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      // Return the id so callers can manually remove if needed
      return id;
    },
    [defaultDuration, removeToast]
  );

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
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
 * // Show a toast and get its ID for manual removal
 * const toastId = showInfo('Loading...', { duration: 0 });
 * // Later...
 * removeToast(toastId);
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;

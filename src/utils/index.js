/**
 * Utility functions index
 *
 * Centralized exports for all utility functions
 */

// Class name utilities
export { cn, withBase, merge } from './cn';

// ID generation utilities
export {
  generateUUID,
  generateId,
  generateOrderNumber,
  generateToastId,
  generateSequentialId,
  resetSequentialCounter,
  generateCartItemId,
} from './id';

// Timing utilities
export { debounce, throttle, defer, sleep, delayedCall } from './timing';

// Storage utilities
export {
  isStorageAvailable,
  getFromStorage,
  setToStorage,
  removeFromStorage,
  clearStorage,
  getStorageKeys,
  getStorageSize,
  createNamespacedStorage,
  setWithExpiry,
  getWithExpiry,
} from './storage';

// Validation utilities
export {
  validateProduct,
  validateCartItem,
  validateProfile,
  validateShippingOption,
  validateCart,
  validateSearchTerm,
  sanitizeString,
} from './validation';

// Logger utilities
export {
  default as logger,
  Logger,
  LOG_LEVELS,
  debug,
  info,
  warn,
  error,
  createLogger,
} from './logger';

// Sanitization utilities
export {
  encodeHTML,
  decodeHTML,
  removeDangerousPatterns,
  sanitizeString as sanitize,
  sanitizeForURL,
  sanitizeSearchTerm,
  sanitizeEmail,
  sanitizePhone,
  sanitizeURL,
  sanitizeObject,
  sanitizeProfile,
  createSanitizer,
} from './sanitize';

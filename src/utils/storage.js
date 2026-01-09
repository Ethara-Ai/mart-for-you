/**
 * Local Storage Utilities
 *
 * Provides safe, type-aware localStorage operations with error handling.
 * Handles cases where localStorage is unavailable, quota exceeded, or data is corrupted.
 */

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
export function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get an item from localStorage with JSON parsing
 *
 * @param {string} key - The storage key
 * @param {*} [defaultValue=null] - Default value if key doesn't exist or on error
 * @returns {*} The parsed value or defaultValue
 *
 * @example
 * const cart = getFromStorage('cart', []);
 * const user = getFromStorage('user', { name: 'Guest' });
 */
export function getFromStorage(key, defaultValue = null) {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set an item in localStorage with JSON stringification
 *
 * @param {string} key - The storage key
 * @param {*} value - The value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 *
 * @example
 * setToStorage('cart', cartItems);
 * setToStorage('preferences', { darkMode: true });
 */
export function setToStorage(key, value) {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded error
    if (
      error instanceof DOMException &&
      (error.code === 22 || // Legacy Chrome
        error.code === 1014 || // Firefox
        error.name === 'QuotaExceededError' || // Modern browsers
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') // Firefox
    ) {
      console.error('localStorage quota exceeded');
    } else {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
    return false;
  }
}

/**
 * Remove an item from localStorage
 *
 * @param {string} key - The storage key to remove
 * @returns {boolean} True if successful, false otherwise
 *
 * @example
 * removeFromStorage('cart');
 */
export function removeFromStorage(key) {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 *
 * @returns {boolean} True if successful, false otherwise
 *
 * @example
 * clearStorage(); // Clears everything
 */
export function clearStorage() {
  if (!isStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}

/**
 * Get all keys from localStorage that match a prefix
 *
 * @param {string} [prefix=''] - Prefix to filter keys by
 * @returns {string[]} Array of matching keys
 *
 * @example
 * const cartKeys = getStorageKeys('cart_');
 */
export function getStorageKeys(prefix = '') {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const keys = [];
    // Use the standard iteration approach for localStorage
    const { length } = window.localStorage;
    for (let i = 0; i < length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
}

/**
 * Get the approximate size of localStorage usage in bytes
 *
 * @returns {number} Approximate size in bytes
 */
export function getStorageSize() {
  if (!isStorageAvailable()) {
    return 0;
  }

  try {
    let total = 0;
    // Use the standard iteration approach for localStorage
    const { length } = window.localStorage;
    for (let i = 0; i < length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        total += key.length + (window.localStorage.getItem(key)?.length || 0);
      }
    }
    // Multiply by 2 for UTF-16 encoding
    return total * 2;
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
}

/**
 * Create a namespaced storage interface
 * Useful for avoiding key collisions between different parts of the app
 *
 * @param {string} namespace - The namespace prefix
 * @returns {Object} Storage interface with get, set, remove methods
 *
 * @example
 * const cartStorage = createNamespacedStorage('cart');
 * cartStorage.set('items', items);
 * const items = cartStorage.get('items', []);
 */
export function createNamespacedStorage(namespace) {
  const prefix = `${namespace}:`;

  return {
    get: (key, defaultValue = null) => getFromStorage(`${prefix}${key}`, defaultValue),
    set: (key, value) => setToStorage(`${prefix}${key}`, value),
    remove: (key) => removeFromStorage(`${prefix}${key}`),
    clear: () => {
      const keys = getStorageKeys(prefix);
      keys.forEach((key) => removeFromStorage(key));
      return true;
    },
    keys: () => getStorageKeys(prefix).map((key) => key.slice(prefix.length)),
  };
}

/**
 * Storage with expiration support
 * Wraps values with timestamp for TTL functionality
 *
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @param {number} ttlMs - Time to live in milliseconds
 * @returns {boolean} True if successful
 *
 * @example
 * setWithExpiry('session', sessionData, 3600000); // 1 hour
 */
export function setWithExpiry(key, value, ttlMs) {
  const item = {
    value,
    expiry: Date.now() + ttlMs,
  };
  return setToStorage(key, item);
}

/**
 * Get a value with expiration check
 *
 * @param {string} key - The storage key
 * @param {*} [defaultValue=null] - Default value if expired or not found
 * @returns {*} The value or defaultValue if expired/not found
 *
 * @example
 * const session = getWithExpiry('session', null);
 */
export function getWithExpiry(key, defaultValue = null) {
  const item = getFromStorage(key, null);

  if (!item) {
    return defaultValue;
  }

  // Check if it's a wrapped value with expiry
  if (typeof item === 'object' && 'expiry' in item && 'value' in item) {
    if (Date.now() > item.expiry) {
      removeFromStorage(key);
      return defaultValue;
    }
    return item.value;
  }

  // Return as-is if not wrapped (backwards compatibility)
  return item;
}

export default {
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
};

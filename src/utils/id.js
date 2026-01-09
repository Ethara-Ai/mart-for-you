/**
 * Unique ID generation utilities
 *
 * Provides various methods for generating unique identifiers
 * suitable for different use cases in the application.
 */

/**
 * Generate a UUID v4-like identifier
 * Uses crypto.randomUUID if available, otherwise falls back to a polyfill
 *
 * @returns {string} A UUID v4 formatted string
 *
 * @example
 * const id = generateUUID();
 * // Returns something like: "550e8400-e29b-41d4-a716-446655440000"
 */
export function generateUUID() {
  // Use native crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random =
      typeof crypto !== 'undefined'
        ? crypto.getRandomValues(new Uint8Array(1))[0] % 16
        : Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/**
 * Generate a short unique ID
 * Suitable for toast IDs, temporary identifiers, etc.
 *
 * @param {number} [length=8] - Length of the random part
 * @returns {string} A short unique identifier
 *
 * @example
 * const id = generateId();
 * // Returns something like: "lq2x3k4m-a1b2c3d4"
 */
export function generateId(length = 8) {
  // Handle negative or invalid lengths
  const safeLength = Math.max(0, length);
  const timestamp = Date.now().toString(36);

  if (safeLength === 0) {
    return `${timestamp}-`;
  }

  const randomPart =
    typeof crypto !== 'undefined' && crypto.getRandomValues
      ? Array.from(crypto.getRandomValues(new Uint8Array(safeLength)))
          .map((byte) => byte.toString(36).padStart(2, '0'))
          .join('')
          .substring(0, safeLength)
      : Math.random()
          .toString(36)
          .substring(2, 2 + safeLength);

  return `${timestamp}-${randomPart}`;
}

/**
 * Generate an order number
 * Creates a unique, human-readable order number with prefix
 *
 * @param {string} [prefix='ORD'] - Prefix for the order number
 * @returns {string} A formatted order number
 *
 * @example
 * const orderNum = generateOrderNumber();
 * // Returns something like: "ORD-20240115-A1B2C3"
 */
export function generateOrderNumber(prefix = 'ORD') {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');

  // Generate a 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(6));
    randomPart = Array.from(randomBytes)
      .map((byte) => chars[byte % chars.length])
      .join('');
  } else {
    for (let i = 0; i < 6; i++) {
      randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return `${prefix}-${datePart}-${randomPart}`;
}

/**
 * Generate a toast ID
 * Combines timestamp with random string for uniqueness
 *
 * @returns {string} A unique toast identifier
 *
 * @example
 * const toastId = generateToastId();
 * // Returns something like: "toast-1705312345678-abc123"
 */
export function generateToastId() {
  const randomPart =
    typeof crypto !== 'undefined' && crypto.getRandomValues
      ? Array.from(crypto.getRandomValues(new Uint8Array(4)))
          .map((b) => b.toString(36))
          .join('')
      : Math.random().toString(36).substring(2, 9);

  return `toast-${Date.now()}-${randomPart}`;
}

/**
 * Generate a sequential ID with a counter
 * Useful for creating IDs that need to be sortable
 *
 * @param {string} [prefix='id'] - Prefix for the ID
 * @returns {string} A sequential ID
 */
let counter = 0;
export function generateSequentialId(prefix = 'id') {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter.toString().padStart(6, '0')}`;
}

/**
 * Reset the sequential ID counter
 * Useful for testing purposes
 */
export function resetSequentialCounter() {
  counter = 0;
}

/**
 * Generate a cart item ID based on product ID
 * Ensures consistency for the same product
 *
 * @param {number|string} productId - The product ID
 * @returns {string} A cart item identifier
 */
export function generateCartItemId(productId) {
  return `cart-item-${productId}`;
}

export default {
  generateUUID,
  generateId,
  generateOrderNumber,
  generateToastId,
  generateSequentialId,
  resetSequentialCounter,
  generateCartItemId,
};

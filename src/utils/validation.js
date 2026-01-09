/**
 * Validation utilities for runtime data validation
 *
 * Provides validation functions for products, cart items, and user profiles.
 * These utilities help ensure data integrity throughout the application.
 */

/**
 * Validation result object
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the data is valid
 * @property {string[]} errors - Array of error messages
 */

/**
 * Create a validation result
 * @param {boolean} valid - Whether validation passed
 * @param {string[]} [errors=[]] - Array of error messages
 * @returns {ValidationResult}
 */
function createResult(valid, errors = []) {
  return { valid, errors };
}

/**
 * Check if a value is a non-empty string
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if a value is a positive number
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isPositiveNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) && value > 0;
}

/**
 * Check if a value is a non-negative number
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isNonNegativeNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) && value >= 0;
}

/**
 * Check if a value is a valid URL
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isValidUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a value is a valid email
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  // Basic email regex - not exhaustive but covers most cases
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Check if a value is a valid phone number (basic check)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isValidPhone(value) {
  if (typeof value !== 'string') return false;
  // Remove common separators and check for digits
  const digits = value.replace(/[\s\-().+]/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^\d+$/.test(digits);
}

/**
 * Valid product categories
 */
const VALID_CATEGORIES = [
  'electronics',
  'fashion',
  'home',
  'beauty',
  'sports',
  'food',
  'books',
  'toys',
];

/**
 * Validate a product object
 *
 * @param {Object} product - Product object to validate
 * @returns {ValidationResult} Validation result with errors if invalid
 *
 * @example
 * const result = validateProduct({
 *   id: 1,
 *   name: 'Test Product',
 *   price: 19.99,
 *   image: 'https://example.com/image.jpg',
 *   description: 'A test product',
 *   category: 'electronics',
 * });
 *
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 */
export function validateProduct(product) {
  const errors = [];

  if (!product || typeof product !== 'object') {
    return createResult(false, ['Product must be an object']);
  }

  // Required fields
  if (product.id === undefined || product.id === null) {
    errors.push('Product ID is required');
  }

  if (!isNonEmptyString(product.name)) {
    errors.push('Product name must be a non-empty string');
  }

  if (!isPositiveNumber(product.price)) {
    errors.push('Product price must be a positive number');
  }

  if (!isNonEmptyString(product.image)) {
    errors.push('Product image URL is required');
  } else if (!isValidUrl(product.image)) {
    errors.push('Product image must be a valid URL');
  }

  if (!isNonEmptyString(product.description)) {
    errors.push('Product description is required');
  }

  if (!isNonEmptyString(product.category)) {
    errors.push('Product category is required');
  } else if (!VALID_CATEGORIES.includes(product.category)) {
    errors.push(`Product category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Optional fields with validation if present
  if (product.onSale !== undefined) {
    if (typeof product.onSale !== 'boolean') {
      errors.push('Product onSale must be a boolean');
    }

    if (product.onSale && !isPositiveNumber(product.salePrice)) {
      errors.push('Sale price is required when product is on sale');
    }

    if (product.salePrice !== undefined && product.salePrice >= product.price) {
      errors.push('Sale price must be less than regular price');
    }
  }

  if (product.stock !== undefined && !isNonNegativeNumber(product.stock)) {
    errors.push('Product stock must be a non-negative number');
  }

  if (product.weight !== undefined && !isNonEmptyString(product.weight)) {
    errors.push('Product weight must be a non-empty string if provided');
  }

  return createResult(errors.length === 0, errors);
}

/**
 * Validate a cart item object
 *
 * @param {Object} cartItem - Cart item to validate
 * @returns {ValidationResult} Validation result with errors if invalid
 *
 * @example
 * const result = validateCartItem({
 *   id: 1,
 *   name: 'Test Product',
 *   price: 19.99,
 *   quantity: 2,
 * });
 */
export function validateCartItem(cartItem) {
  const errors = [];

  if (!cartItem || typeof cartItem !== 'object') {
    return createResult(false, ['Cart item must be an object']);
  }

  // First validate as a product (inherits product validation)
  const productResult = validateProduct(cartItem);
  if (!productResult.valid) {
    errors.push(...productResult.errors);
  }

  // Cart-specific validation
  if (!Number.isInteger(cartItem.quantity) || cartItem.quantity < 1) {
    errors.push('Cart item quantity must be a positive integer');
  }

  // Check quantity against stock if available
  if (
    cartItem.stock !== undefined &&
    cartItem.quantity > cartItem.stock
  ) {
    errors.push('Cart item quantity cannot exceed available stock');
  }

  return createResult(errors.length === 0, errors);
}

/**
 * Validate a user profile object
 *
 * @param {Object} profile - User profile to validate
 * @param {Object} [options] - Validation options
 * @param {boolean} [options.requireAllFields=false] - Whether all fields are required
 * @returns {ValidationResult} Validation result with errors if invalid
 *
 * @example
 * const result = validateProfile({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john@example.com',
 * });
 */
export function validateProfile(profile, options = {}) {
  const { requireAllFields = false } = options;
  const errors = [];

  if (!profile || typeof profile !== 'object') {
    return createResult(false, ['Profile must be an object']);
  }

  // Required fields
  if (!isNonEmptyString(profile.firstName)) {
    errors.push('First name is required');
  } else if (profile.firstName.length > 50) {
    errors.push('First name must be 50 characters or less');
  }

  if (!isNonEmptyString(profile.lastName)) {
    errors.push('Last name is required');
  } else if (profile.lastName.length > 50) {
    errors.push('Last name must be 50 characters or less');
  }

  if (!isNonEmptyString(profile.email)) {
    errors.push('Email is required');
  } else if (!isValidEmail(profile.email)) {
    errors.push('Email must be a valid email address');
  }

  // Conditionally required fields
  const conditionalFields = ['address', 'city', 'state', 'zip', 'country'];

  for (const field of conditionalFields) {
    if (requireAllFields) {
      if (!isNonEmptyString(profile[field])) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
      }
    } else if (profile[field] !== undefined && !isNonEmptyString(profile[field])) {
      errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a non-empty string if provided`);
    }
  }

  // Phone validation (optional but must be valid if provided)
  if (profile.phone !== undefined && profile.phone !== '') {
    if (!isValidPhone(profile.phone)) {
      errors.push('Phone must be a valid phone number');
    }
  }

  // Avatar URL validation (optional but must be valid if provided)
  if (profile.avatar !== undefined && profile.avatar !== '') {
    if (!isValidUrl(profile.avatar)) {
      errors.push('Avatar must be a valid URL');
    }
  }

  // ZIP code format check (basic)
  if (profile.zip && !/^[\d\w\s-]{3,10}$/i.test(profile.zip)) {
    errors.push('ZIP code format is invalid');
  }

  return createResult(errors.length === 0, errors);
}

/**
 * Validate a shipping option
 *
 * @param {Object} shippingOption - Shipping option to validate
 * @returns {ValidationResult} Validation result with errors if invalid
 */
export function validateShippingOption(shippingOption) {
  const errors = [];

  if (!shippingOption || typeof shippingOption !== 'object') {
    return createResult(false, ['Shipping option must be an object']);
  }

  if (!isNonEmptyString(shippingOption.id)) {
    errors.push('Shipping option ID is required');
  }

  if (!isNonEmptyString(shippingOption.name)) {
    errors.push('Shipping option name is required');
  }

  if (!isNonNegativeNumber(shippingOption.price)) {
    errors.push('Shipping option price must be a non-negative number');
  }

  if (!isNonEmptyString(shippingOption.estimatedDelivery)) {
    errors.push('Shipping option estimated delivery is required');
  }

  return createResult(errors.length === 0, errors);
}

/**
 * Validate an entire cart (array of cart items)
 *
 * @param {Array} cart - Array of cart items to validate
 * @returns {ValidationResult} Validation result with errors if invalid
 */
export function validateCart(cart) {
  const errors = [];

  if (!Array.isArray(cart)) {
    return createResult(false, ['Cart must be an array']);
  }

  cart.forEach((item, index) => {
    const result = validateCartItem(item);
    if (!result.valid) {
      result.errors.forEach((error) => {
        errors.push(`Item ${index + 1}: ${error}`);
      });
    }
  });

  // Check for duplicate product IDs
  const productIds = cart.map((item) => item.id);
  const duplicates = productIds.filter(
    (id, index) => productIds.indexOf(id) !== index
  );

  if (duplicates.length > 0) {
    errors.push(`Cart contains duplicate products: ${[...new Set(duplicates)].join(', ')}`);
  }

  return createResult(errors.length === 0, errors);
}

/**
 * Sanitize a string for safe display
 * Removes potentially dangerous characters while preserving readability
 *
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';

  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize search term
 *
 * @param {string} searchTerm - Search term to validate
 * @returns {{ valid: boolean, sanitized: string, error?: string }}
 */
export function validateSearchTerm(searchTerm) {
  if (typeof searchTerm !== 'string') {
    return { valid: false, sanitized: '', error: 'Search term must be a string' };
  }

  const sanitized = sanitizeString(searchTerm);

  if (sanitized.length > 100) {
    return {
      valid: false,
      sanitized: sanitized.substring(0, 100),
      error: 'Search term must be 100 characters or less',
    };
  }

  return { valid: true, sanitized };
}

export default {
  validateProduct,
  validateCartItem,
  validateProfile,
  validateShippingOption,
  validateCart,
  validateSearchTerm,
  sanitizeString,
};

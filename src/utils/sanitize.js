/**
 * Sanitization Utilities
 *
 * Provides functions for sanitizing user inputs to prevent XSS attacks
 * and ensure data integrity throughout the application.
 *
 * These utilities should be used whenever handling user-provided data
 * that will be displayed or stored.
 */

/**
 * HTML entities map for encoding
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
  '=': '&#x3D;',
};

/**
 * Reverse HTML entities map for decoding
 */
const HTML_ENTITIES_REVERSE = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
  '&#x2F;': '/',
  '&#96;': '`',
  '&#x3D;': '=',
  '&#39;': "'",
  '&apos;': "'",
};

/**
 * Dangerous patterns to remove from inputs
 */
const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /vbscript:/gi,
  /data:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick=, onload=
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /expression\s*\(/gi, // CSS expressions
  /url\s*\(\s*['"]?\s*javascript:/gi,
];

/**
 * Encode HTML entities in a string
 * Prevents XSS by converting special characters to HTML entities
 *
 * @param {string} str - String to encode
 * @returns {string} Encoded string
 *
 * @example
 * encodeHTML('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function encodeHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }

  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Decode HTML entities in a string
 *
 * @param {string} str - String to decode
 * @returns {string} Decoded string
 */
export function decodeHTML(str) {
  if (typeof str !== 'string') {
    return '';
  }

  return str.replace(
    /&(?:amp|lt|gt|quot|#x27|#x2F|#96|#x3D|#39|apos);/gi,
    (entity) => HTML_ENTITIES_REVERSE[entity.toLowerCase()] || entity
  );
}

/**
 * Remove dangerous patterns from a string
 * Use this for content that might contain malicious code
 *
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 *
 * @example
 * removeDangerousPatterns('Click <script>alert(1)</script> here')
 * // Returns: 'Click  here'
 */
export function removeDangerousPatterns(str) {
  if (typeof str !== 'string') {
    return '';
  }

  let result = str;

  for (const pattern of DANGEROUS_PATTERNS) {
    result = result.replace(pattern, '');
  }

  return result;
}

/**
 * Sanitize a string for safe display
 * Combines HTML encoding with dangerous pattern removal
 *
 * @param {string} str - String to sanitize
 * @param {Object} [options] - Sanitization options
 * @param {boolean} [options.encodeEntities=true] - Whether to encode HTML entities
 * @param {boolean} [options.removeDangerous=true] - Whether to remove dangerous patterns
 * @param {boolean} [options.trim=true] - Whether to trim whitespace
 * @param {number} [options.maxLength] - Maximum allowed length
 * @returns {string} Sanitized string
 *
 * @example
 * sanitizeString('<script>alert(1)</script>Hello')
 * // Returns: 'Hello'
 */
export function sanitizeString(str, options = {}) {
  const {
    encodeEntities = true,
    removeDangerous = true,
    trim = true,
    maxLength,
  } = options;

  if (typeof str !== 'string') {
    return '';
  }

  let result = str;

  // Remove dangerous patterns first
  if (removeDangerous) {
    result = removeDangerousPatterns(result);
  }

  // Encode HTML entities
  if (encodeEntities) {
    result = encodeHTML(result);
  }

  // Trim whitespace
  if (trim) {
    result = result.trim();
  }

  // Enforce max length
  if (typeof maxLength === 'number' && maxLength > 0) {
    result = result.substring(0, maxLength);
  }

  return result;
}

/**
 * Sanitize a string for use in URLs
 * Encodes special characters for safe URL usage
 *
 * @param {string} str - String to sanitize
 * @returns {string} URL-safe string
 *
 * @example
 * sanitizeForURL('search term with spaces')
 * // Returns: 'search%20term%20with%20spaces'
 */
export function sanitizeForURL(str) {
  if (typeof str !== 'string') {
    return '';
  }

  // Remove dangerous patterns first
  const cleaned = removeDangerousPatterns(str.trim());

  // Encode for URL
  return encodeURIComponent(cleaned);
}

/**
 * Sanitize a search term
 * Removes potentially harmful characters while preserving search functionality
 *
 * @param {string} searchTerm - Search term to sanitize
 * @param {Object} [options] - Options
 * @param {number} [options.maxLength=100] - Maximum length
 * @param {boolean} [options.allowWildcards=false] - Allow * and ? wildcards
 * @returns {string} Sanitized search term
 *
 * @example
 * sanitizeSearchTerm('<script>test</script> product')
 * // Returns: 'test product'
 */
export function sanitizeSearchTerm(searchTerm, options = {}) {
  const { maxLength = 100, allowWildcards = false } = options;

  if (typeof searchTerm !== 'string') {
    return '';
  }

  let result = searchTerm;

  // Remove HTML tags
  result = result.replace(/<[^>]*>/g, '');

  // Remove dangerous patterns
  result = removeDangerousPatterns(result);

  // Remove special characters except basic punctuation
  if (allowWildcards) {
    result = result.replace(/[^\w\s\-.,?*'"]/g, '');
  } else {
    result = result.replace(/[^\w\s\-.,'"]/g, '');
  }

  // Normalize whitespace
  result = result.replace(/\s+/g, ' ').trim();

  // Enforce max length
  if (result.length > maxLength) {
    result = result.substring(0, maxLength).trim();
  }

  return result;
}

/**
 * Sanitize an email address
 * Validates format and removes potentially harmful characters
 *
 * @param {string} email - Email to sanitize
 * @returns {{ valid: boolean, sanitized: string, error?: string }}
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') {
    return { valid: false, sanitized: '', error: 'Email must be a string' };
  }

  // Trim and lowercase
  let sanitized = email.trim().toLowerCase();

  // Remove any HTML/dangerous content
  sanitized = removeDangerousPatterns(sanitized);
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized, error: 'Invalid email format' };
  }

  // Additional checks
  if (sanitized.length > 254) {
    return { valid: false, sanitized: sanitized.substring(0, 254), error: 'Email too long' };
  }

  return { valid: true, sanitized };
}

/**
 * Sanitize a phone number
 * Keeps only digits and common phone characters
 *
 * @param {string} phone - Phone number to sanitize
 * @returns {{ valid: boolean, sanitized: string, digits: string, error?: string }}
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') {
    return { valid: false, sanitized: '', digits: '', error: 'Phone must be a string' };
  }

  // Remove dangerous patterns
  let sanitized = removeDangerousPatterns(phone.trim());

  // Keep only digits, spaces, dashes, parentheses, and plus
  sanitized = sanitized.replace(/[^\d\s\-().+]/g, '');

  // Extract just digits for validation
  const digits = sanitized.replace(/\D/g, '');

  // Validate digit count (international numbers can be 7-15 digits)
  if (digits.length < 7) {
    return { valid: false, sanitized, digits, error: 'Phone number too short' };
  }

  if (digits.length > 15) {
    return { valid: false, sanitized, digits, error: 'Phone number too long' };
  }

  return { valid: true, sanitized, digits };
}

/**
 * Sanitize a URL
 * Validates and sanitizes URLs, preventing javascript: and other dangerous protocols
 *
 * @param {string} url - URL to sanitize
 * @param {Object} [options] - Options
 * @param {string[]} [options.allowedProtocols=['http:', 'https:']] - Allowed protocols
 * @returns {{ valid: boolean, sanitized: string, error?: string }}
 */
export function sanitizeURL(url, options = {}) {
  const { allowedProtocols = ['http:', 'https:'] } = options;

  if (typeof url !== 'string') {
    return { valid: false, sanitized: '', error: 'URL must be a string' };
  }

  const trimmed = url.trim();

  // Check for dangerous patterns
  const dangerous = DANGEROUS_PATTERNS.some((pattern) => pattern.test(trimmed));
  if (dangerous) {
    return { valid: false, sanitized: '', error: 'URL contains dangerous content' };
  }

  try {
    const parsed = new URL(trimmed);

    // Check protocol
    if (!allowedProtocols.includes(parsed.protocol)) {
      return {
        valid: false,
        sanitized: '',
        error: `Protocol ${parsed.protocol} not allowed`,
      };
    }

    // Return the normalized URL
    return { valid: true, sanitized: parsed.href };
  } catch {
    return { valid: false, sanitized: '', error: 'Invalid URL format' };
  }
}

/**
 * Sanitize an object's string values recursively
 *
 * @param {Object} obj - Object to sanitize
 * @param {Object} [options] - Sanitization options (passed to sanitizeString)
 * @returns {Object} Sanitized object
 *
 * @example
 * sanitizeObject({ name: '<script>bad</script>', age: 25 })
 * // Returns: { name: '', age: 25 }
 */
export function sanitizeObject(obj, options = {}) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === 'string') {
        return sanitizeString(item, options);
      }
      if (typeof item === 'object') {
        return sanitizeObject(item, options);
      }
      return item;
    });
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    // Sanitize the key as well
    const sanitizedKey = sanitizeString(key, { ...options, encodeEntities: false });

    if (typeof value === 'string') {
      result[sanitizedKey] = sanitizeString(value, options);
    } else if (typeof value === 'object' && value !== null) {
      result[sanitizedKey] = sanitizeObject(value, options);
    } else {
      result[sanitizedKey] = value;
    }
  }

  return result;
}

/**
 * Sanitize user profile data
 * Specifically handles profile fields with appropriate sanitization
 *
 * @param {Object} profile - Profile data to sanitize
 * @returns {Object} Sanitized profile
 */
export function sanitizeProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    return {};
  }

  const sanitized = {};

  // Text fields - basic sanitization
  const textFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'country'];
  for (const field of textFields) {
    if (profile[field] !== undefined) {
      sanitized[field] = sanitizeString(profile[field], {
        encodeEntities: false,
        maxLength: field === 'address' ? 200 : 100,
      });
    }
  }

  // Email - special handling
  if (profile.email) {
    const emailResult = sanitizeEmail(profile.email);
    sanitized.email = emailResult.sanitized;
  }

  // Phone - special handling
  if (profile.phone) {
    const phoneResult = sanitizePhone(profile.phone);
    sanitized.phone = phoneResult.sanitized;
  }

  // Avatar URL - special handling
  if (profile.avatar) {
    const urlResult = sanitizeURL(profile.avatar);
    sanitized.avatar = urlResult.valid ? urlResult.sanitized : '';
  }

  return sanitized;
}

/**
 * Create a sanitizer with preset options
 *
 * @param {Object} defaultOptions - Default sanitization options
 * @returns {Function} Sanitizer function
 *
 * @example
 * const sanitize = createSanitizer({ maxLength: 50 });
 * const clean = sanitize('<script>test</script> hello');
 */
export function createSanitizer(defaultOptions = {}) {
  return (str, options = {}) => sanitizeString(str, { ...defaultOptions, ...options });
}

export default {
  encodeHTML,
  decodeHTML,
  removeDangerousPatterns,
  sanitizeString,
  sanitizeForURL,
  sanitizeSearchTerm,
  sanitizeEmail,
  sanitizePhone,
  sanitizeURL,
  sanitizeObject,
  sanitizeProfile,
  createSanitizer,
};

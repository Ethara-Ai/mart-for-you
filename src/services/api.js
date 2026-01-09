/**
 * API Service Layer
 *
 * Provides an abstraction layer for data operations.
 * Currently uses local data but can be easily swapped
 * for real API calls in production.
 */

import { products, shippingOptions, categories } from '../data/products';
import { CATEGORIES, GRID } from '../constants';
import { validateProduct, validateCart, validateProfile } from '../utils/validation';

/**
 * Simulate network delay for realistic async behavior
 * @param {number} [ms=100] - Delay in milliseconds
 * @returns {Promise<void>}
 */
const simulateDelay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulate API error for testing
 * @param {number} [probability=0] - Probability of error (0-1)
 * @throws {Error} Random API error
 */
const maybeThrowError = (probability = 0) => {
  if (Math.random() < probability) {
    throw new Error('Simulated API error');
  }
};

/**
 * Products API
 */
export const productsApi = {
  /**
   * Get all products
   * @param {Object} [options] - Query options
   * @param {number} [options.page=1] - Page number
   * @param {number} [options.limit=24] - Items per page
   * @param {string} [options.category] - Filter by category
   * @param {boolean} [options.onSale] - Filter by sale status
   * @param {string} [options.search] - Search term
   * @param {string} [options.sortBy='name'] - Sort field
   * @param {string} [options.sortOrder='asc'] - Sort order
   * @returns {Promise<{ data: Array, total: number, page: number, totalPages: number }>}
   */
  async getAll(options = {}) {
    await simulateDelay();
    maybeThrowError(0);

    const {
      page = 1,
      limit = GRID.PRODUCTS_PER_PAGE,
      category,
      onSale,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
    } = options;

    let filtered = [...products];

    // Apply category filter
    if (category && category !== CATEGORIES.ALL) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Apply sale filter
    if (onSale !== undefined) {
      filtered = filtered.filter((p) => p.onSale === onSale);
    }

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle string comparison
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    // Calculate pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filtered.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Get a product by ID
   * @param {number|string} id - Product ID
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    await simulateDelay();
    maybeThrowError(0);

    const product = products.find((p) => p.id === Number(id));
    return product || null;
  },

  /**
   * Get products by category
   * @param {string} category - Category name
   * @param {Object} [options] - Additional query options
   * @returns {Promise<{ data: Array, total: number }>}
   */
  getByCategory(category, options = {}) {
    return this.getAll({ ...options, category });
  },

  /**
   * Get products on sale
   * @param {Object} [options] - Additional query options
   * @returns {Promise<{ data: Array, total: number }>}
   */
  getOnSale(options = {}) {
    return this.getAll({ ...options, onSale: true });
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} [options] - Additional query options
   * @returns {Promise<{ data: Array, total: number }>}
   */
  search(query, options = {}) {
    return this.getAll({ ...options, search: query });
  },

  /**
   * Get related products
   * @param {number|string} productId - Product ID
   * @param {number} [limit=4] - Number of related products
   * @returns {Promise<Array>}
   */
  async getRelated(productId, limit = 4) {
    await simulateDelay();
    maybeThrowError(0);

    const product = products.find((p) => p.id === Number(productId));
    if (!product) return [];

    // Get products in the same category, excluding the current product
    const related = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, limit);

    return related;
  },

  /**
   * Validate a product
   * @param {Object} product - Product to validate
   * @returns {Promise<{ valid: boolean, errors: string[] }>}
   */
  async validate(product) {
    await simulateDelay(50);
    return validateProduct(product);
  },
};

/**
 * Categories API
 */
export const categoriesApi = {
  /**
   * Get all categories
   * @returns {Promise<string[]>}
   */
  async getAll() {
    await simulateDelay();
    return categories;
  },

  /**
   * Get category with product count
   * @returns {Promise<Array<{ name: string, count: number }>>}
   */
  async getWithCounts() {
    await simulateDelay();

    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return categories.map((name) => ({
      name,
      count: counts[name] || 0,
    }));
  },
};

/**
 * Shipping API
 */
export const shippingApi = {
  /**
   * Get all shipping options
   * @returns {Promise<Array>}
   */
  async getOptions() {
    await simulateDelay();
    return shippingOptions;
  },

  /**
   * Get shipping option by ID
   * @param {string} id - Shipping option ID
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    await simulateDelay();
    return shippingOptions.find((opt) => opt.id === id) || null;
  },

  /**
   * Calculate shipping cost
   * @param {string} shippingId - Shipping option ID
   * @param {Array} _cartItems - Cart items (reserved for future weight-based calculations)
   * @returns {Promise<{ cost: number, estimatedDelivery: string }>}
   */
  async calculateCost(shippingId, _cartItems) {
    await simulateDelay();
    maybeThrowError(0);

    const option = shippingOptions.find((opt) => opt.id === shippingId);
    if (!option) {
      throw new Error('Invalid shipping option');
    }

    // Could add logic here for weight-based shipping, free shipping thresholds, etc.
    return {
      cost: option.price,
      estimatedDelivery: option.estimatedDelivery,
    };
  },
};

/**
 * Cart API
 */
export const cartApi = {
  /**
   * Validate cart
   * @param {Array} items - Cart items to validate
   * @returns {Promise<{ valid: boolean, errors: string[] }>}
   */
  async validate(items) {
    await simulateDelay();
    return validateCart(items);
  },

  /**
   * Check stock availability for cart items
   * @param {Array} _cartItems - Cart items to check
   * @returns {Promise<Array<{ id: number, available: boolean, maxQuantity: number }>>}
   */
  async checkStock(_cartItems) {
    await simulateDelay();
    maybeThrowError(0);

    return _cartItems.map((item) => {
      const product = products.find((p) => p.id === item.id);
      const stock = product?.stock ?? 10;

      return {
        id: item.id,
        available: item.quantity <= stock,
        maxQuantity: stock,
        requestedQuantity: item.quantity,
      };
    });
  },
};

/**
 * Orders API
 */
export const ordersApi = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @param {Array} orderData.items - Cart items
   * @param {Object} orderData.shipping - Shipping info
   * @param {Object} orderData.customer - Customer info
   * @returns {Promise<{ success: boolean, orderId: string, message: string }>}
   */
  async create(orderData) {
    await simulateDelay(300);
    maybeThrowError(0);

    const { items, shipping } = orderData;

    // Validate cart
    const cartValidation = await cartApi.validate(items);
    if (!cartValidation.valid) {
      return {
        success: false,
        orderId: null,
        message: 'Cart validation failed',
        errors: cartValidation.errors,
      };
    }

    // Check stock
    const stockCheck = await cartApi.checkStock(items);
    const outOfStock = stockCheck.filter((item) => !item.available);
    if (outOfStock.length > 0) {
      return {
        success: false,
        orderId: null,
        message: 'Some items are out of stock',
        errors: outOfStock.map(
          (item) =>
            `Product ${item.id}: Requested ${item.requestedQuantity}, available ${item.maxQuantity}`
        ),
      };
    }

    // Generate order ID
    const { generateOrderNumber } = await import('../utils/id');
    const orderId = generateOrderNumber();

    // In a real app, this would save to a database
    return {
      success: true,
      orderId,
      message: 'Order placed successfully',
      estimatedDelivery: shipping?.estimatedDelivery || '3-5 business days',
    };
  },

  /**
   * Get order by ID (mock implementation)
   * @param {string} _orderId - Order ID
   * @returns {Promise<Object|null>}
   */
  async getById(_orderId) {
    await simulateDelay();
    // In a real app, this would fetch from a database
    return null;
  },
};

/**
 * Profile API
 */
export const profileApi = {
  /**
   * Save user profile
   * @param {Object} profileData - Profile data to save
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async save(profileData) {
    await simulateDelay(200);
    maybeThrowError(0);

    const validation = validateProfile(profileData);
    if (!validation.valid) {
      return {
        success: false,
        message: 'Profile validation failed',
        errors: validation.errors,
      };
    }

    // In a real app, this would save to a database/API
    return {
      success: true,
      message: 'Profile saved successfully',
    };
  },

  /**
   * Get user profile (mock implementation)
   * @returns {Promise<Object|null>}
   */
  async get() {
    await simulateDelay();
    // In a real app, this would fetch from a database
    return null;
  },
};

/**
 * Unified API object
 */
const api = {
  products: productsApi,
  categories: categoriesApi,
  shipping: shippingApi,
  cart: cartApi,
  orders: ordersApi,
  profile: profileApi,
};

export default api;

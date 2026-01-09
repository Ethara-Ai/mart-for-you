/**
 * Products API Service
 *
 * Provides an API-like interface for fetching products with pagination,
 * filtering, and search functionality. This abstraction layer allows for:
 *
 * 1. Easy migration from static data to a real API
 * 2. Built-in pagination for large datasets
 * 3. Caching for improved performance
 * 4. Consistent async interface throughout the app
 *
 * Currently uses static data but is designed for seamless API integration.
 */

import { products as allProducts, categories } from '../data/products';
import { createLogger } from '../utils/logger';
import { sanitizeSearchTerm } from '../utils/sanitize';
import { CATEGORIES, GRID } from '../constants';

// Create logger for this service
const log = createLogger('ProductsAPI');

/**
 * Default pagination settings
 */
const DEFAULT_PAGE_SIZE = GRID.PRODUCTS_PER_PAGE || 24;
const DEFAULT_PAGE = 1;

/**
 * Sort options
 */
export const SORT_OPTIONS = {
  DEFAULT: 'default',
  PRICE_LOW_HIGH: 'price_asc',
  PRICE_HIGH_LOW: 'price_desc',
  NAME_A_Z: 'name_asc',
  NAME_Z_A: 'name_desc',
  NEWEST: 'newest',
  ON_SALE: 'on_sale',
};

/**
 * Simple in-memory cache for API responses
 */
class ProductsCache {
  constructor(maxSize = 50, ttlMs = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  /**
   * Generate cache key from request parameters
   */
  generateKey(params) {
    return JSON.stringify(params);
  }

  /**
   * Get cached response
   */
  get(params) {
    const key = this.generateKey(params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    log.debug('Cache hit', { key });
    return entry.data;
  }

  /**
   * Set cached response
   */
  set(params, data) {
    const key = this.generateKey(params);

    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.ttlMs,
    });

    log.debug('Cache set', { key });
  }

  /**
   * Clear the cache
   */
  clear() {
    this.cache.clear();
    log.debug('Cache cleared');
  }

  /**
   * Invalidate entries matching a pattern
   */
  invalidate(pattern) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
    log.debug('Cache invalidated', { pattern, count: keysToDelete.length });
  }
}

// Create cache instance
const cache = new ProductsCache();

/**
 * Simulate network delay for realistic API behavior
 * @param {number} minMs - Minimum delay
 * @param {number} maxMs - Maximum delay
 */
async function simulateNetworkDelay(minMs = 50, maxMs = 200) {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Sort products based on sort option
 * @param {Array} products - Products to sort
 * @param {string} sortBy - Sort option
 * @returns {Array} Sorted products
 */
function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case SORT_OPTIONS.PRICE_LOW_HIGH:
      return sorted.sort((a, b) => {
        const priceA = a.onSale ? a.salePrice : a.price;
        const priceB = b.onSale ? b.salePrice : b.price;
        return priceA - priceB;
      });

    case SORT_OPTIONS.PRICE_HIGH_LOW:
      return sorted.sort((a, b) => {
        const priceA = a.onSale ? a.salePrice : a.price;
        const priceB = b.onSale ? b.salePrice : b.price;
        return priceB - priceA;
      });

    case SORT_OPTIONS.NAME_A_Z:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case SORT_OPTIONS.NAME_Z_A:
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case SORT_OPTIONS.ON_SALE:
      return sorted.sort((a, b) => {
        if (a.onSale && !b.onSale) return -1;
        if (!a.onSale && b.onSale) return 1;
        return 0;
      });

    case SORT_OPTIONS.NEWEST:
      // Assuming higher ID = newer (in real app, use createdAt)
      return sorted.sort((a, b) => b.id - a.id);

    case SORT_OPTIONS.DEFAULT:
    default:
      return sorted;
  }
}

/**
 * Filter products based on criteria
 * @param {Array} products - Products to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
function filterProducts(products, filters = {}) {
  const {
    category,
    search,
    onSale,
    minPrice,
    maxPrice,
    inStock,
  } = filters;

  return products.filter((product) => {
    // Category filter
    if (category && category !== CATEGORIES.ALL && product.category !== category) {
      return false;
    }

    // Search filter
    if (search) {
      const sanitized = sanitizeSearchTerm(search).toLowerCase();
      const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      if (!searchableText.includes(sanitized)) {
        return false;
      }
    }

    // On sale filter
    if (onSale === true && !product.onSale) {
      return false;
    }

    // Price range filter
    const effectivePrice = product.onSale ? product.salePrice : product.price;
    if (typeof minPrice === 'number' && effectivePrice < minPrice) {
      return false;
    }
    if (typeof maxPrice === 'number' && effectivePrice > maxPrice) {
      return false;
    }

    // In stock filter
    if (inStock === true && product.stock !== undefined && product.stock <= 0) {
      return false;
    }

    return true;
  });
}

/**
 * Paginate products array
 * @param {Array} products - Products to paginate
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} Paginated result
 */
function paginateProducts(products, page, pageSize) {
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = products.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex,
      endIndex: Math.min(endIndex, totalItems),
    },
  };
}

/**
 * Fetch products with filtering, sorting, and pagination
 *
 * @param {Object} options - Fetch options
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.pageSize=24] - Items per page
 * @param {string} [options.category] - Category filter
 * @param {string} [options.search] - Search term
 * @param {boolean} [options.onSale] - Filter to on-sale items only
 * @param {number} [options.minPrice] - Minimum price filter
 * @param {number} [options.maxPrice] - Maximum price filter
 * @param {boolean} [options.inStock] - Filter to in-stock items only
 * @param {string} [options.sortBy='default'] - Sort option
 * @param {boolean} [options.useCache=true] - Whether to use cache
 * @returns {Promise<Object>} Paginated products response
 *
 * @example
 * const { items, pagination } = await fetchProducts({
 *   page: 1,
 *   pageSize: 12,
 *   category: 'electronics',
 *   sortBy: 'price_asc',
 * });
 */
export async function fetchProducts(options = {}) {
  const {
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
    category,
    search,
    onSale,
    minPrice,
    maxPrice,
    inStock,
    sortBy = SORT_OPTIONS.DEFAULT,
    useCache = true,
  } = options;

  const cacheKey = { ...options, type: 'products' };

  // Check cache first
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Simulate API delay
  await simulateNetworkDelay();

  log.debug('Fetching products', { page, pageSize, category, search, sortBy });

  try {
    // Filter products
    let filtered = filterProducts(allProducts, {
      category,
      search,
      onSale,
      minPrice,
      maxPrice,
      inStock,
    });

    // Sort products
    filtered = sortProducts(filtered, sortBy);

    // Paginate results
    const result = paginateProducts(filtered, page, pageSize);

    // Add metadata
    const response = {
      ...result,
      meta: {
        filters: { category, search, onSale, minPrice, maxPrice, inStock },
        sortBy,
        fetchedAt: new Date().toISOString(),
      },
    };

    // Cache the response
    if (useCache) {
      cache.set(cacheKey, response);
    }

    return response;
  } catch (error) {
    log.error('Error fetching products', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Fetch a single product by ID
 *
 * @param {number|string} productId - Product ID
 * @param {Object} [options] - Options
 * @param {boolean} [options.useCache=true] - Whether to use cache
 * @returns {Promise<Object|null>} Product or null if not found
 *
 * @example
 * const product = await fetchProductById(123);
 */
export async function fetchProductById(productId, options = {}) {
  const { useCache = true } = options;
  const cacheKey = { productId, type: 'product' };

  // Check cache
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  await simulateNetworkDelay(30, 100);

  log.debug('Fetching product by ID', { productId });

  const product = allProducts.find((p) => p.id === Number(productId)) || null;

  if (useCache && product) {
    cache.set(cacheKey, product);
  }

  return product;
}

/**
 * Fetch multiple products by IDs
 *
 * @param {Array<number|string>} productIds - Array of product IDs
 * @returns {Promise<Array>} Array of products (in same order as IDs)
 *
 * @example
 * const products = await fetchProductsByIds([1, 2, 3]);
 */
export async function fetchProductsByIds(productIds) {
  await simulateNetworkDelay(50, 150);

  log.debug('Fetching products by IDs', { count: productIds.length });

  const idSet = new Set(productIds.map(Number));
  const productsMap = new Map();

  allProducts.forEach((product) => {
    if (idSet.has(product.id)) {
      productsMap.set(product.id, product);
    }
  });

  // Return in same order as requested IDs
  return productIds.map((id) => productsMap.get(Number(id))).filter(Boolean);
}

/**
 * Fetch products for infinite scroll
 * Returns a cursor-based pagination result
 *
 * @param {Object} options - Fetch options
 * @param {string} [options.cursor] - Cursor for next page (product ID)
 * @param {number} [options.limit=24] - Items to fetch
 * @param {string} [options.category] - Category filter
 * @param {string} [options.search] - Search term
 * @param {boolean} [options.onSale] - Filter to on-sale items
 * @returns {Promise<Object>} Cursor-paginated result
 *
 * @example
 * // Initial fetch
 * const { items, nextCursor, hasMore } = await fetchProductsInfinite({ limit: 12 });
 *
 * // Load more
 * const more = await fetchProductsInfinite({ cursor: nextCursor, limit: 12 });
 */
export async function fetchProductsInfinite(options = {}) {
  const {
    cursor,
    limit = DEFAULT_PAGE_SIZE,
    category,
    search,
    onSale,
    sortBy = SORT_OPTIONS.DEFAULT,
  } = options;

  await simulateNetworkDelay();

  log.debug('Fetching products (infinite)', { cursor, limit, category });

  // Filter products
  let filtered = filterProducts(allProducts, { category, search, onSale });

  // Sort products
  filtered = sortProducts(filtered, sortBy);

  // Find starting index based on cursor
  let startIndex = 0;
  if (cursor) {
    const cursorIndex = filtered.findIndex((p) => p.id === Number(cursor));
    if (cursorIndex !== -1) {
      startIndex = cursorIndex + 1;
    }
  }

  // Get items
  const items = filtered.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < filtered.length;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : null;

  return {
    items,
    nextCursor,
    hasMore,
    totalItems: filtered.length,
  };
}

/**
 * Fetch all categories
 *
 * @returns {Promise<Array>} Array of category objects
 */
export async function fetchCategories() {
  const cacheKey = { type: 'categories' };
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  await simulateNetworkDelay(20, 50);

  log.debug('Fetching categories');

  const result = categories || [];
  cache.set(cacheKey, result);

  return result;
}

/**
 * Fetch category product counts
 *
 * @returns {Promise<Object>} Object with category counts
 */
export async function fetchCategoryCounts() {
  const cacheKey = { type: 'categoryCounts' };
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  await simulateNetworkDelay(30, 80);

  log.debug('Fetching category counts');

  const counts = { all: allProducts.length };

  allProducts.forEach((product) => {
    const cat = product.category;
    counts[cat] = (counts[cat] || 0) + 1;
  });

  cache.set(cacheKey, counts);

  return counts;
}

/**
 * Search products with auto-complete suggestions
 *
 * @param {string} query - Search query
 * @param {Object} [options] - Options
 * @param {number} [options.limit=10] - Maximum suggestions
 * @returns {Promise<Object>} Search suggestions
 */
export async function searchProductsSuggestions(query, options = {}) {
  const { limit = 10 } = options;

  if (!query || query.length < 2) {
    return { suggestions: [], products: [] };
  }

  await simulateNetworkDelay(30, 100);

  const sanitized = sanitizeSearchTerm(query).toLowerCase();

  // Find matching products
  const matches = allProducts.filter((product) => {
    const searchableText = `${product.name} ${product.category}`.toLowerCase();
    return searchableText.includes(sanitized);
  });

  // Get unique search terms from matches
  const suggestions = [...new Set(matches.map((p) => p.name))]
    .filter((name) => name.toLowerCase().includes(sanitized))
    .slice(0, limit);

  // Get top products
  const products = matches.slice(0, limit);

  return {
    suggestions,
    products,
    totalMatches: matches.length,
  };
}

/**
 * Get featured/recommended products
 *
 * @param {Object} [options] - Options
 * @param {number} [options.limit=8] - Number of products
 * @param {Array} [options.excludeIds=[]] - Product IDs to exclude
 * @returns {Promise<Array>} Featured products
 */
export async function fetchFeaturedProducts(options = {}) {
  const { limit = 8, excludeIds = [] } = options;
  const cacheKey = { type: 'featured', limit, excludeIds };

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  await simulateNetworkDelay(30, 100);

  log.debug('Fetching featured products');

  const excludeSet = new Set(excludeIds.map(Number));

  // Get on-sale items first, then fill with random popular items
  const onSaleProducts = allProducts.filter(
    (p) => p.onSale && !excludeSet.has(p.id)
  );
  const regularProducts = allProducts.filter(
    (p) => !p.onSale && !excludeSet.has(p.id)
  );

  // Shuffle regular products
  const shuffled = [...regularProducts].sort(() => Math.random() - 0.5);

  // Combine: sale items first, then random
  const featured = [...onSaleProducts, ...shuffled].slice(0, limit);

  cache.set(cacheKey, featured);

  return featured;
}

/**
 * Get related products
 *
 * @param {number|string} productId - Reference product ID
 * @param {Object} [options] - Options
 * @param {number} [options.limit=4] - Number of related products
 * @returns {Promise<Array>} Related products
 */
export async function fetchRelatedProducts(productId, options = {}) {
  const { limit = 4 } = options;

  await simulateNetworkDelay(30, 100);

  const product = allProducts.find((p) => p.id === Number(productId));

  if (!product) {
    return [];
  }

  log.debug('Fetching related products', { productId, category: product.category });

  // Find products in same category, excluding current product
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);

  // If not enough, add from other categories
  if (related.length < limit) {
    const others = allProducts
      .filter((p) => p.category !== product.category && p.id !== product.id)
      .slice(0, limit - related.length);
    related.push(...others);
  }

  return related;
}

/**
 * Clear the products cache
 * Call this after data mutations
 */
export function clearProductsCache() {
  cache.clear();
}

/**
 * Invalidate specific cache entries
 * @param {string} pattern - Pattern to match cache keys
 */
export function invalidateProductsCache(pattern) {
  cache.invalidate(pattern);
}

/**
 * Prefetch products for a category
 * Useful for prefetching data on hover
 *
 * @param {string} category - Category to prefetch
 */
export async function prefetchCategory(category) {
  const cacheKey = { page: 1, pageSize: DEFAULT_PAGE_SIZE, category, type: 'products' };

  if (!cache.get(cacheKey)) {
    await fetchProducts({ category, page: 1, useCache: true });
    log.debug('Prefetched category', { category });
  }
}

// Export cache for testing/debugging
export { cache as productsCache };

export default {
  fetchProducts,
  fetchProductById,
  fetchProductsByIds,
  fetchProductsInfinite,
  fetchCategories,
  fetchCategoryCounts,
  searchProductsSuggestions,
  fetchFeaturedProducts,
  fetchRelatedProducts,
  clearProductsCache,
  invalidateProductsCache,
  prefetchCategory,
  SORT_OPTIONS,
};

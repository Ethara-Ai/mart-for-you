/**
 * useProducts Hook
 *
 * A custom React hook for fetching products with pagination, filtering,
 * and search functionality. Provides loading and error states, and
 * integrates with the products API service.
 *
 * Features:
 * - Pagination support (page-based and infinite scroll)
 * - Category and search filtering
 * - Sorting options
 * - Loading and error states
 * - Automatic refetching on filter changes
 * - Cache integration
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  fetchProducts,
  fetchProductById,
  fetchProductsInfinite,
  fetchRelatedProducts,
  fetchFeaturedProducts,
  searchProductsSuggestions,
  SORT_OPTIONS,
} from '../services/productsApi';
import { createLogger } from '../utils/logger';
import { CATEGORIES } from '../constants';

// Create logger for this hook
const log = createLogger('useProducts');

/**
 * useProducts - Main hook for fetching products with pagination
 *
 * @param {Object} options - Hook options
 * @param {number} [options.initialPage=1] - Initial page number
 * @param {number} [options.pageSize=24] - Items per page
 * @param {string} [options.category] - Category filter
 * @param {string} [options.search] - Search term
 * @param {boolean} [options.onSale] - Filter to on-sale items
 * @param {string} [options.sortBy='default'] - Sort option
 * @param {boolean} [options.enabled=true] - Whether to fetch automatically
 * @returns {Object} Products state and controls
 *
 * @example
 * const {
 *   products,
 *   isLoading,
 *   error,
 *   pagination,
 *   goToPage,
 *   nextPage,
 *   prevPage,
 *   refetch,
 * } = useProducts({
 *   pageSize: 12,
 *   category: 'electronics',
 * });
 */
export function useProducts(options = {}) {
  const {
    initialPage = 1,
    pageSize = 24,
    category,
    search,
    onSale,
    minPrice,
    maxPrice,
    inStock,
    sortBy = SORT_OPTIONS.DEFAULT,
    enabled = true,
  } = options;

  // State
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    pageSize,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track current request to handle race conditions
  const requestIdRef = useRef(0);

  // Current page state for controlled pagination
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Memoize filter options to prevent unnecessary refetches
  const filterOptions = useMemo(
    () => ({
      category: category === CATEGORIES.ALL ? undefined : category,
      search: search?.trim() || undefined,
      onSale,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
    }),
    [category, search, onSale, minPrice, maxPrice, inStock, sortBy]
  );

  /**
   * Fetch products with current options
   */
  const fetchProductsData = useCallback(
    async (page = currentPage) => {
      if (!enabled) return;

      const requestId = ++requestIdRef.current;

      setIsLoading(true);
      setError(null);

      try {
        log.debug('Fetching products', { page, pageSize, ...filterOptions });

        const response = await fetchProducts({
          page,
          pageSize,
          ...filterOptions,
        });

        // Only update if this is the latest request
        if (requestId === requestIdRef.current) {
          setProducts(response.items);
          setPagination(response.pagination);
          setIsInitialLoading(false);
        }
      } catch (err) {
        if (requestId === requestIdRef.current) {
          log.error('Error fetching products', err);
          setError(err.message || 'Failed to fetch products');
          setProducts([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [enabled, currentPage, pageSize, filterOptions]
  );

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchProductsData(currentPage);
  }, [fetchProductsData, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterOptions]);

  /**
   * Go to a specific page
   */
  const goToPage = useCallback(
    (page) => {
      const validPage = Math.max(1, Math.min(page, pagination.totalPages || 1));
      setCurrentPage(validPage);
    },
    [pagination.totalPages]
  );

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pagination.hasNextPage]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [pagination.hasPrevPage]);

  /**
   * Refetch current page
   */
  const refetch = useCallback(() => {
    fetchProductsData(currentPage);
  }, [fetchProductsData, currentPage]);

  return {
    // Data
    products,
    pagination,

    // Loading states
    isLoading,
    isInitialLoading,

    // Error state
    error,

    // Navigation
    currentPage,
    goToPage,
    nextPage,
    prevPage,

    // Actions
    refetch,

    // Computed
    isEmpty: !isLoading && products.length === 0,
    hasProducts: products.length > 0,
  };
}

/**
 * useInfiniteProducts - Hook for infinite scroll pagination
 *
 * @param {Object} options - Hook options
 * @param {number} [options.pageSize=24] - Items per page
 * @param {string} [options.category] - Category filter
 * @param {string} [options.search] - Search term
 * @param {boolean} [options.onSale] - Filter to on-sale items
 * @param {string} [options.sortBy='default'] - Sort option
 * @returns {Object} Products state and controls for infinite scroll
 *
 * @example
 * const {
 *   products,
 *   isLoading,
 *   hasMore,
 *   loadMore,
 *   error,
 * } = useInfiniteProducts({
 *   pageSize: 12,
 *   category: 'electronics',
 * });
 *
 * // In component
 * const onEndReached = () => {
 *   if (hasMore && !isLoading) {
 *     loadMore();
 *   }
 * };
 */
export function useInfiniteProducts(options = {}) {
  const {
    pageSize = 24,
    category,
    search,
    onSale,
    sortBy = SORT_OPTIONS.DEFAULT,
    enabled = true,
  } = options;

  // State
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track requests
  const requestIdRef = useRef(0);

  // Memoize filter options
  const filterOptions = useMemo(
    () => ({
      category: category === CATEGORIES.ALL ? undefined : category,
      search: search?.trim() || undefined,
      onSale,
      sortBy,
    }),
    [category, search, onSale, sortBy]
  );

  /**
   * Fetch initial products
   */
  const fetchInitial = useCallback(async () => {
    if (!enabled) return;

    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setIsInitialLoading(true);
    setError(null);

    try {
      log.debug('Fetching initial products (infinite)', { pageSize, ...filterOptions });

      const response = await fetchProductsInfinite({
        limit: pageSize,
        ...filterOptions,
      });

      if (requestId === requestIdRef.current) {
        setProducts(response.items);
        setCursor(response.nextCursor);
        setHasMore(response.hasMore);
        setTotalItems(response.totalItems);
        setIsInitialLoading(false);
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        log.error('Error fetching initial products', err);
        setError(err.message || 'Failed to fetch products');
        setProducts([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, pageSize, filterOptions]);

  /**
   * Load more products
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || isLoadingMore || !cursor) return;

    const requestId = ++requestIdRef.current;

    setIsLoadingMore(true);
    setError(null);

    try {
      log.debug('Loading more products', { cursor, pageSize });

      const response = await fetchProductsInfinite({
        cursor,
        limit: pageSize,
        ...filterOptions,
      });

      if (requestId === requestIdRef.current) {
        setProducts((prev) => [...prev, ...response.items]);
        setCursor(response.nextCursor);
        setHasMore(response.hasMore);
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        log.error('Error loading more products', err);
        setError(err.message || 'Failed to load more products');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoadingMore(false);
      }
    }
  }, [hasMore, isLoading, isLoadingMore, cursor, pageSize, filterOptions]);

  // Fetch on mount and when filters change
  useEffect(() => {
    // Reset state when filters change
    setProducts([]);
    setCursor(null);
    setHasMore(true);
    fetchInitial();
  }, [fetchInitial]);

  /**
   * Refetch all products
   */
  const refetch = useCallback(() => {
    setProducts([]);
    setCursor(null);
    setHasMore(true);
    fetchInitial();
  }, [fetchInitial]);

  return {
    // Data
    products,
    totalItems,

    // Loading states
    isLoading,
    isLoadingMore,
    isInitialLoading,

    // Pagination
    hasMore,
    cursor,

    // Error state
    error,

    // Actions
    loadMore,
    refetch,

    // Computed
    isEmpty: !isLoading && !isInitialLoading && products.length === 0,
    hasProducts: products.length > 0,
  };
}

/**
 * useProduct - Hook for fetching a single product by ID
 *
 * @param {number|string} productId - Product ID to fetch
 * @param {Object} [options] - Hook options
 * @param {boolean} [options.enabled=true] - Whether to fetch automatically
 * @returns {Object} Product state
 *
 * @example
 * const { product, isLoading, error } = useProduct(123);
 */
export function useProduct(productId, options = {}) {
  const { enabled = true } = options;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !productId) {
      setProduct(null);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProductById(productId);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          log.error('Error fetching product', err);
          setError(err.message || 'Failed to fetch product');
          setProduct(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, enabled]);

  const refetch = useCallback(() => {
    if (productId) {
      setIsLoading(true);
      fetchProductById(productId)
        .then(setProduct)
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [productId]);

  return {
    product,
    isLoading,
    error,
    refetch,
    notFound: !isLoading && !product && !error,
  };
}

/**
 * useRelatedProducts - Hook for fetching related products
 *
 * @param {number|string} productId - Reference product ID
 * @param {Object} [options] - Hook options
 * @param {number} [options.limit=4] - Number of related products
 * @returns {Object} Related products state
 */
export function useRelatedProducts(productId, options = {}) {
  const { limit = 4, enabled = true } = options;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !productId) {
      setProducts([]);
      return;
    }

    let cancelled = false;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchRelatedProducts(productId, { limit });

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          log.error('Error fetching related products', err);
          setError(err.message);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [productId, limit, enabled]);

  return {
    products,
    isLoading,
    error,
  };
}

/**
 * useFeaturedProducts - Hook for fetching featured products
 *
 * @param {Object} [options] - Hook options
 * @param {number} [options.limit=8] - Number of products
 * @param {Array} [options.excludeIds=[]] - Product IDs to exclude
 * @returns {Object} Featured products state
 */
export function useFeaturedProducts(options = {}) {
  const { limit = 8, excludeIds = [], enabled = true } = options;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const excludeIdsKey = excludeIds.join(',');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    // Reconstruct excludeIds from the key to avoid dependency issues
    const excludeIdsFromKey = excludeIdsKey ? excludeIdsKey.split(',').map(Number) : [];

    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchFeaturedProducts({ limit, excludeIds: excludeIdsFromKey });

        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          log.error('Error fetching featured products', err);
          setError(err.message);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [limit, excludeIdsKey, enabled]);

  return {
    products,
    isLoading,
    error,
  };
}

/**
 * useProductSearch - Hook for search with suggestions
 *
 * @param {string} query - Search query
 * @param {Object} [options] - Hook options
 * @param {number} [options.limit=10] - Maximum suggestions
 * @param {number} [options.debounceMs=300] - Debounce delay
 * @returns {Object} Search state with suggestions
 */
export function useProductSearch(query, options = {}) {
  const { limit = 10, debounceMs = 300 } = options;

  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear results if query is too short
    if (!query || query.length < 2) {
      setSuggestions([]);
      setProducts([]);
      setTotalMatches(0);
      return;
    }

    // Debounce the search
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true);

      try {
        const result = await searchProductsSuggestions(query, { limit });
        setSuggestions(result.suggestions);
        setProducts(result.products);
        setTotalMatches(result.totalMatches);
      } catch (err) {
        log.error('Error searching products', err);
        setSuggestions([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, limit, debounceMs]);

  const clear = useCallback(() => {
    setSuggestions([]);
    setProducts([]);
    setTotalMatches(0);
  }, []);

  return {
    suggestions,
    products,
    totalMatches,
    isLoading,
    clear,
    hasResults: suggestions.length > 0 || products.length > 0,
  };
}

// Export sort options for convenience
export { SORT_OPTIONS };

export default useProducts;

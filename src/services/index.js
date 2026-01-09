/**
 * Services Index
 *
 * Centralized exports for all service modules.
 * Services provide abstraction layers for data operations,
 * making it easier to swap implementations (e.g., mock vs API).
 */

// Products API Service - main data fetching layer
export {
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
  productsCache,
  SORT_OPTIONS,
  default as productsApi,
} from './productsApi';

// Legacy API exports (for backwards compatibility)
export { default as api } from './api';

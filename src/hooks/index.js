/**
 * Custom Hooks Index
 *
 * Centralized exports for all custom hooks
 */

// Navigation hooks
export { useNavigateToSection } from './useNavigateToSection';

// Accessibility hooks
export { useReducedMotion } from './useReducedMotion';

// UI state hooks
export { useScrollLock } from './useScrollLock';

// Debounce hooks
export { useDebouncedValue, useDebouncedCallback, useDebouncedState } from './useDebouncedValue';
export { useDebouncedSearch } from './useDebouncedSearch';

// Products data fetching hooks
export {
  useProducts,
  useInfiniteProducts,
  useProduct,
  useRelatedProducts,
  useFeaturedProducts,
  useProductSearch,
  SORT_OPTIONS,
} from './useProducts';

// Re-export defaults for convenience
export { default as useNavigateToSectionDefault } from './useNavigateToSection';
export { default as useReducedMotionDefault } from './useReducedMotion';
export { default as useScrollLockDefault } from './useScrollLock';
export { default as useDebouncedValueDefault } from './useDebouncedValue';
export { default as useDebouncedSearchDefault } from './useDebouncedSearch';
export { default as useProductsDefault } from './useProducts';

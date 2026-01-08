/**
 * Application-wide constants
 *
 * Centralizes magic numbers and configuration values
 * for easier maintenance and consistency.
 */

// Default values for products and cart
export const DEFAULTS = {
  STOCK_LIMIT: 10,
  MAX_ORDER_NUMBER: 10_000_000,
  CART_MAX_QUANTITY: 99,
};

// Animation timing (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  PAGE_TRANSITION: 200,
  MODAL_TRANSITION: 300,
  TOAST_DURATION: 3000,
  SCROLL_DELAY: 100,
  DEBOUNCE_DELAY: 300,
  NAVIGATION_SCROLL_DELAY: 100,
};

// Breakpoints (should match Tailwind config)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

// Grid configuration
export const GRID = {
  PRODUCTS_PER_PAGE: 24,
  SKELETON_COUNT: 12,
  CATEGORY_SCROLL_COUNT: 10,
};

// Z-index layers for consistent stacking
export const Z_INDEX = {
  DROPDOWN: 50,
  STICKY: 60,
  MODAL_BACKDROP: 100,
  MODAL: 101,
  TOAST: 110,
  TOOLTIP: 120,
};

// Local storage keys
export const STORAGE_KEYS = {
  DARK_MODE: 'darkMode',
  CART: 'cart',
  USER_PROFILE: 'userProfile',
};

// Route paths
export const ROUTES = {
  HOME: '/home',
  PRODUCTS: '/products',
  OFFERS: '/offers',
  CART: '/cart',
  PROFILE: '/profile',
  LANDING: '/',
};

// Section IDs for scroll navigation
export const SECTION_IDS = {
  HERO: 'hero-section',
  PRODUCTS: 'products-section',
  PROFILE_CARD: 'profile-card',
  CART_PANEL: 'cart-panel',
};

// Category keys
export const CATEGORIES = {
  ALL: 'all',
  ELECTRONICS: 'electronics',
  FASHION: 'fashion',
  HOME: 'home',
  BEAUTY: 'beauty',
  SPORTS: 'sports',
  FOOD: 'food',
  BOOKS: 'books',
  TOYS: 'toys',
};

// Category display names
export const CATEGORY_DISPLAY_NAMES = {
  [CATEGORIES.ELECTRONICS]: 'Electronics',
  [CATEGORIES.FASHION]: 'Fashion & Apparel',
  [CATEGORIES.HOME]: 'Home & Living',
  [CATEGORIES.BEAUTY]: 'Beauty & Personal Care',
  [CATEGORIES.SPORTS]: 'Sports & Fitness',
  [CATEGORIES.FOOD]: 'Food & Beverages',
  [CATEGORIES.BOOKS]: 'Books & Stationery',
  [CATEGORIES.TOYS]: 'Toys & Games',
};

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Shipping option IDs
export const SHIPPING = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
};

export default {
  DEFAULTS,
  ANIMATION,
  BREAKPOINTS,
  GRID,
  Z_INDEX,
  STORAGE_KEYS,
  ROUTES,
  SECTION_IDS,
  CATEGORIES,
  CATEGORY_DISPLAY_NAMES,
  TOAST_TYPES,
  SHIPPING,
};

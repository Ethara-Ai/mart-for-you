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

// Framer Motion animation variants (extracted to prevent re-creation on every render)
export const MOTION_VARIANTS = {
  // Card animations
  card: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    hover: { y: -4 },
  },
  // Modal/Drawer animations
  modal: {
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slideRight: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    slideLeft: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },
  // List item animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  // Fade animations
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  // Page transition animations
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  // Toast animations
  toast: {
    initial: { opacity: 0, y: -50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 },
  },
  // Profile card dropdown
  dropdown: {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  },
};

// Framer Motion transition presets
export const MOTION_TRANSITIONS = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.2, ease: 'easeInOut' },
  slow: { duration: 0.3, ease: 'easeInOut' },
  spring: { type: 'spring', damping: 25, stiffness: 300 },
  springBouncy: { type: 'spring', damping: 20, stiffness: 400 },
  springGentle: { type: 'spring', damping: 30, stiffness: 200 },
  modal: { type: 'spring', damping: 30, stiffness: 300 },
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
  MOTION_VARIANTS,
  MOTION_TRANSITIONS,
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

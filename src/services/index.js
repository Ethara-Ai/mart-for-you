/**
 * Services Index
 *
 * Centralized exports for all service modules.
 * Services provide abstraction layers for data operations,
 * making it easier to swap implementations (e.g., mock vs API).
 */

// Product service
export {
  productService,
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductsOnSale,
  searchProducts,
} from './productService';

// Cart service
export { cartService, calculateCartTotal, validateCartItems } from './cartService';

// Order service
export { orderService, createOrder, getOrderById } from './orderService';

// Storage service (for persistence)
export { storageService } from './storageService';

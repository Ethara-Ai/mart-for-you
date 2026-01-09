/**
 * CartContext - Backwards Compatibility Module
 *
 * This file provides backwards compatibility for code that imports
 * from the original CartContext location. The cart functionality
 * has been split into focused contexts for better performance:
 *
 * - CartItemsContext: Cart items CRUD operations
 * - CartTotalsContext: Cart totals and shipping calculations
 * - CartUIContext: Cart modal UI state
 * - CheckoutContext: Checkout flow management
 *
 * For better performance, prefer importing from './cart' and using
 * the specific hooks you need:
 *
 * @example
 * // Recommended - granular imports for better performance
 * import { useCartItems, useCartUI, useCheckout } from '@context/cart';
 *
 * // Component only re-renders when cart items change
 * const { addToCart, isInCart } = useCartItems();
 *
 * // Component only re-renders when modal state changes
 * const { isCartOpen, openCart } = useCartUI();
 *
 * @example
 * // For convenience (but less performant)
 * import { useCart, CartProvider } from '@context/CartContext';
 *
 * // Gets everything - re-renders on any cart change
 * const { cartItems, isCartOpen, handleCheckout } = useCart();
 *
 * @example
 * // For constants, import directly from cart/constants
 * import { CHECKOUT_STAGES } from '@context/cart/constants';
 *
 * @deprecated Import from './cart' for better performance
 */

// Import default for re-export
import CartProvider from './cart';

// Re-export everything from the new cart module
export {
  // Main provider and combined hook
  CartProvider,
  useCart,

  // Individual context providers
  CartItemsProvider,
  CartTotalsProvider,
  CartUIProvider,
  CheckoutProvider,

  // Individual hooks for granular access (recommended)
  useCartItems,
  useCartTotals,
  useCartUI,
  useCheckout,
} from './cart';

// Default export for backwards compatibility
export default CartProvider;

// NOTE: For constants like CHECKOUT_STAGES, import directly from:
// import { CHECKOUT_STAGES } from '@context/cart/constants';

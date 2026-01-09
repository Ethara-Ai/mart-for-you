/**
 * Cart Context Module
 *
 * This module provides split cart contexts for better performance and maintainability.
 * Instead of one monolithic cart context, functionality is divided into:
 *
 * - CartItemsContext: Cart items CRUD operations
 * - CartTotalsContext: Cart totals and shipping calculations
 * - CartUIContext: Cart modal UI state
 * - CheckoutContext: Checkout flow management
 *
 * For convenience, a combined CartProvider and useCart hook are provided
 * for backwards compatibility and simpler usage when performance isn't critical.
 *
 * @example
 * // Simple usage with combined hook
 * import { CartProvider, useCart } from '@context/cart';
 *
 * // In App.jsx
 * <CartProvider>
 *   <App />
 * </CartProvider>
 *
 * // In components
 * const { cartItems, addToCart, isCartOpen, handleCheckout } = useCart();
 *
 * @example
 * // Optimized usage with specific hooks (recommended for performance)
 * import { useCartItems, useCartTotals, useCartUI, useCheckout } from '@context/cart';
 *
 * // Component that only needs cart items won't re-render when modal opens/closes
 * const ProductCard = () => {
 *   const { addToCart, isInCart } = useCartItems();
 *   // ...
 * };
 *
 * // Component that only needs UI state won't re-render when items change
 * const CartButton = () => {
 *   const { isCartOpen, openCart } = useCartUI();
 *   // ...
 * };
 */

// Main combined provider and hook
export { CartProvider, useCart } from './CartProvider';

// Individual context providers
export { CartItemsProvider } from './CartItemsContext';
export { CartTotalsProvider } from './CartTotalsContext';
export { CartUIProvider } from './CartUIContext';
export { CheckoutProvider } from './CheckoutContext';

// Individual hooks for granular access (recommended for performance)
export { useCartItems } from './CartItemsContext';
export { useCartTotals } from './CartTotalsContext';
export { useCartUI } from './CartUIContext';
export { useCheckout } from './CheckoutContext';

// Constants
export { CHECKOUT_STAGES } from './constants';

// Default export is the combined provider
export { default } from './CartProvider';

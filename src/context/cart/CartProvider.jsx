import { useCallback } from 'react';
import { CartItemsProvider, useCartItems } from './CartItemsContext';
import { CartTotalsProvider, useCartTotals } from './CartTotalsContext';
import { CartUIProvider, useCartUI } from './CartUIContext';
import { CheckoutProvider, useCheckout } from './CheckoutContext';

/**
 * CartProvider - Combined cart context provider
 *
 * This component composes all cart-related contexts together:
 * - CartItemsContext: Cart items CRUD operations
 * - CartTotalsContext: Cart totals and shipping calculations
 * - CartUIContext: Cart modal UI state
 * - CheckoutContext: Checkout flow management
 *
 * The separation allows for better performance as components can
 * subscribe only to the data they need, preventing unnecessary re-renders.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 *
 * @example
 * // In App.jsx
 * <CartProvider>
 *   <App />
 * </CartProvider>
 *
 * // In components - use specific hooks for better performance
 * const { cartItems, addToCart } = useCartItems();
 * const { cartTotal, shippingCost } = useCartTotals();
 * const { isCartOpen, openCart } = useCartUI();
 * const { handleCheckout, orderPlaced } = useCheckout();
 *
 * // Or use the combined hook for convenience
 * const { cartItems, cartTotal, isCartOpen, handleCheckout } = useCart();
 */
function CartProviderInner({ children }) {
  const cartItems = useCartItems();
  const { clearCart } = cartItems;

  return (
    <CartTotalsProvider cartItems={cartItems.cartItems}>
      <CheckoutProvider clearCart={clearCart}>{children}</CheckoutProvider>
    </CartTotalsProvider>
  );
}

/**
 * CartProvider - Main provider component
 *
 * Wraps children with all cart-related contexts in the correct order.
 * CartUIProvider is outermost as it has no dependencies.
 * CartItemsProvider is next as it provides data to others.
 * CartTotalsProvider and CheckoutProvider depend on CartItems.
 */
export function CartProvider({ children }) {
  return (
    <CartUIProvider>
      <CartItemsProvider>
        <CartProviderInner>{children}</CartProviderInner>
      </CartItemsProvider>
    </CartUIProvider>
  );
}

/**
 * useCart - Combined hook for backwards compatibility
 *
 * This hook combines all cart contexts into a single interface.
 * For better performance, prefer using the specific hooks:
 * - useCartItems() - for cart item operations
 * - useCartTotals() - for totals and shipping
 * - useCartUI() - for modal state
 * - useCheckout() - for checkout flow
 *
 * @returns {Object} Combined cart context value
 *
 * @example
 * const {
 *   // From CartItemsContext
 *   cartItems,
 *   addToCart,
 *   removeFromCart,
 *   updateQuantity,
 *   clearCart,
 *   isInCart,
 *   getItemQuantity,
 *   totalItems,
 *   hasItems,
 *
 *   // From CartTotalsContext
 *   cartTotal,
 *   selectedShipping,
 *   setSelectedShipping,
 *   getShippingCost,
 *   getTotal,
 *   shippingOptions,
 *
 *   // From CartUIContext
 *   isCartOpen,
 *   openCart,
 *   closeCart,
 *   toggleCart,
 *
 *   // From CheckoutContext
 *   handleCheckout,
 *   orderPlaced,
 *   orderNumber,
 *   isCheckingOut,
 *   checkoutError,
 *   resetOrder,
 * } = useCart();
 */
export function useCart() {
  const cartItems = useCartItems();
  const cartTotals = useCartTotals();
  const cartUI = useCartUI();
  const checkout = useCheckout();

  // Create a checkout handler that passes the cart data
  const handleCheckoutWithData = useCallback(
    (options = {}) =>
      checkout.handleCheckout({
        cartItems: cartItems.cartItems,
        total: cartTotals.cartTotal,
        ...options,
      }),
    [checkout, cartItems.cartItems, cartTotals.cartTotal]
  );

  // Combine all context values
  // Note: This creates a new object on each render, which is why
  // using specific hooks is preferred for performance-critical components
  return {
    // Cart Items
    cartItems: cartItems.cartItems,
    addToCart: cartItems.addToCart,
    removeFromCart: cartItems.removeFromCart,
    updateQuantity: cartItems.updateQuantity,
    clearCart: cartItems.clearCart,
    isInCart: cartItems.isInCart,
    getItemQuantity: cartItems.getItemQuantity,
    getCartItem: cartItems.getCartItem,
    totalItems: cartItems.totalItems,
    hasItems: cartItems.hasItems,
    hasItemsAtLimit: cartItems.hasItemsAtLimit,

    // Cart Totals
    cartTotal: cartTotals.cartSubtotal, // Using subtotal as cartTotal for compatibility
    cartSubtotal: cartTotals.cartSubtotal,
    selectedShipping: cartTotals.selectedShipping,
    setSelectedShipping: cartTotals.setSelectedShipping,
    shippingCost: cartTotals.shippingCost,
    getShippingCost: cartTotals.getShippingCost,
    getSelectedShippingOption: cartTotals.getSelectedShippingOption,
    getTotal: cartTotals.getTotal,
    shippingOptions: cartTotals.shippingOptions,
    totalSavings: cartTotals.totalSavings,
    formattedTotals: cartTotals.formattedTotals,
    qualifiesForFreeShipping: cartTotals.qualifiesForFreeShipping,
    amountToFreeShipping: cartTotals.amountToFreeShipping,

    // Cart UI
    isCartOpen: cartUI.isCartOpen,
    openCart: cartUI.openCart,
    closeCart: cartUI.closeCart,
    toggleCart: cartUI.toggleCart,
    isAnimating: cartUI.isAnimating,

    // Checkout
    handleCheckout: handleCheckoutWithData,
    orderPlaced: checkout.orderPlaced,
    setOrderPlaced: (value) => (value ? null : checkout.resetOrder()), // Legacy support
    orderNumber: checkout.orderNumber,
    orderDetails: checkout.orderDetails,
    isCheckingOut: checkout.isCheckingOut,
    checkoutError: checkout.checkoutError,
    resetOrder: checkout.resetOrder,
    checkoutStage: checkout.checkoutStage,
    CHECKOUT_STAGES: checkout.CHECKOUT_STAGES,
  };
}

// Re-export individual hooks for granular access
export { useCartItems } from './CartItemsContext';
export { useCartTotals } from './CartTotalsContext';
export { useCartUI } from './CartUIContext';
export { useCheckout } from './CheckoutContext';

// Re-export providers for custom composition
export { CartItemsProvider } from './CartItemsContext';
export { CartTotalsProvider } from './CartTotalsContext';
export { CartUIProvider } from './CartUIContext';
export { CheckoutProvider } from './CheckoutContext';

export default CartProvider;

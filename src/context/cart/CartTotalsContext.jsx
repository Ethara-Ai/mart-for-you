import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { shippingOptions } from '../../data/products';
import { SHIPPING } from '../../constants';

// Create the Cart Totals Context
const CartTotalsContext = createContext(null);

/**
 * CartTotalsProvider - Manages cart totals and shipping calculations
 *
 * This context handles all computed values related to cart pricing,
 * including subtotal, shipping costs, and final total.
 * Separated from items management for focused responsibility.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Array} props.cartItems - Cart items from CartItemsContext
 */
export function CartTotalsProvider({ children, cartItems = [] }) {
  // Shipping state
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING.STANDARD);

  /**
   * Calculate cart subtotal (before shipping)
   */
  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = item.onSale ? item.salePrice : item.price;
        return sum + price * item.quantity;
      }, 0),
    [cartItems]
  );

  /**
   * Calculate total savings from sale items
   */
  const totalSavings = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        if (item.onSale && item.salePrice) {
          const savings = (item.price - item.salePrice) * item.quantity;
          return sum + savings;
        }
        return sum;
      }, 0),
    [cartItems]
  );

  /**
   * Get shipping cost based on selected option
   * @returns {number} Shipping cost
   */
  const getShippingCost = useCallback(() => {
    const option = shippingOptions.find((opt) => opt.id === selectedShipping);
    return option ? option.price : 0;
  }, [selectedShipping]);

  /**
   * Shipping cost as a memoized value
   */
  const shippingCost = useMemo(() => getShippingCost(), [getShippingCost]);

  /**
   * Get selected shipping option details
   * @returns {Object|null} Shipping option details
   */
  const getSelectedShippingOption = useCallback(
    () => shippingOptions.find((opt) => opt.id === selectedShipping) || null,
    [selectedShipping]
  );

  /**
   * Selected shipping option as memoized value
   */
  const selectedShippingOption = useMemo(
    () => getSelectedShippingOption(),
    [getSelectedShippingOption]
  );

  /**
   * Calculate total with shipping
   * @returns {number} Total including shipping
   */
  const getTotal = useCallback(() => cartSubtotal + shippingCost, [cartSubtotal, shippingCost]);

  /**
   * Cart total as memoized value
   */
  const cartTotal = useMemo(() => getTotal(), [getTotal]);

  /**
   * Check if free shipping threshold is met (example: $50)
   */
  const freeShippingThreshold = 50;
  const qualifiesForFreeShipping = useMemo(
    () => cartSubtotal >= freeShippingThreshold,
    [cartSubtotal]
  );

  /**
   * Amount remaining for free shipping
   */
  const amountToFreeShipping = useMemo(
    () => Math.max(0, freeShippingThreshold - cartSubtotal),
    [cartSubtotal]
  );

  /**
   * Formatted currency values for display
   */
  const formattedTotals = useMemo(
    () => ({
      subtotal: cartSubtotal.toFixed(2),
      shipping: shippingCost === 0 ? 'Free' : shippingCost.toFixed(2),
      total: cartTotal.toFixed(2),
      savings: totalSavings.toFixed(2),
      toFreeShipping: amountToFreeShipping.toFixed(2),
    }),
    [cartSubtotal, shippingCost, cartTotal, totalSavings, amountToFreeShipping]
  );

  // Memoize context value
  const value = useMemo(
    () => ({
      // Shipping state
      selectedShipping,
      setSelectedShipping,
      shippingOptions,

      // Computed values
      cartSubtotal,
      shippingCost,
      cartTotal,
      totalSavings,

      // Free shipping
      freeShippingThreshold,
      qualifiesForFreeShipping,
      amountToFreeShipping,

      // Formatted values
      formattedTotals,

      // Functions (for backwards compatibility)
      getShippingCost,
      getSelectedShippingOption,
      getTotal,
      selectedShippingOption,
    }),
    [
      selectedShipping,
      cartSubtotal,
      shippingCost,
      cartTotal,
      totalSavings,
      qualifiesForFreeShipping,
      amountToFreeShipping,
      formattedTotals,
      getShippingCost,
      getSelectedShippingOption,
      getTotal,
      selectedShippingOption,
    ]
  );

  return <CartTotalsContext.Provider value={value}>{children}</CartTotalsContext.Provider>;
}

/**
 * useCartTotals - Hook to access cart totals context
 *
 * @returns {Object} Cart totals context value
 * @throws {Error} If used outside of CartTotalsProvider
 *
 * @example
 * const { cartSubtotal, shippingCost, cartTotal, formattedTotals } = useCartTotals();
 */
export function useCartTotals() {
  const context = useContext(CartTotalsContext);
  if (!context) {
    throw new Error('useCartTotals must be used within a CartTotalsProvider');
  }
  return context;
}

export default CartTotalsContext;

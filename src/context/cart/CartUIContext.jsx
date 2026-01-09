import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// Create the Cart UI Context
const CartUIContext = createContext(null);

/**
 * CartUIProvider - Manages cart UI state (modal visibility)
 *
 * This context handles only UI-related state for the cart,
 * specifically the cart modal/drawer open/close state.
 * Separated from data management for better performance -
 * UI state changes won't trigger re-renders in data consumers.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} [props.initialOpen=false] - Initial modal state
 */
export function CartUIProvider({ children, initialOpen = false }) {
  // Modal state
  const [isCartOpen, setIsCartOpen] = useState(initialOpen);

  // Animation state for smoother transitions
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Open cart modal
   */
  const openCart = useCallback(() => {
    setIsAnimating(true);
    setIsCartOpen(true);
  }, []);

  /**
   * Close cart modal
   */
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
    // Reset animation state after transition completes
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  /**
   * Toggle cart modal
   */
  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => {
      if (!prev) {
        setIsAnimating(true);
      } else {
        setTimeout(() => setIsAnimating(false), 300);
      }
      return !prev;
    });
  }, []);

  /**
   * Set cart open state directly
   * @param {boolean} open - Whether cart should be open
   */
  const setCartOpen = useCallback((open) => {
    if (open) {
      openCart();
    } else {
      closeCart();
    }
  }, [openCart, closeCart]);

  // Memoize context value
  const value = useMemo(
    () => ({
      // State
      isCartOpen,
      isAnimating,

      // Actions
      openCart,
      closeCart,
      toggleCart,
      setCartOpen,
    }),
    [isCartOpen, isAnimating, openCart, closeCart, toggleCart, setCartOpen]
  );

  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

/**
 * useCartUI - Hook to access cart UI context
 *
 * Use this hook when you only need to control the cart modal visibility.
 * This prevents unnecessary re-renders when cart items change.
 *
 * @returns {Object} Cart UI context value
 * @throws {Error} If used outside of CartUIProvider
 *
 * @example
 * const { isCartOpen, openCart, closeCart, toggleCart } = useCartUI();
 *
 * // Open cart when clicking a button
 * <button onClick={openCart}>View Cart</button>
 */
export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error('useCartUI must be used within a CartUIProvider');
  }
  return context;
}

export default CartUIContext;

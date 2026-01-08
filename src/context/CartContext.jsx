import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { shippingOptions } from '../data/products';
import { DEFAULTS, SHIPPING } from '../constants';

// Create the Cart Context
const CartContext = createContext(null);

/**
 * CartProvider - Shopping cart state management
 *
 * Provides cart functionality including adding/removing items,
 * quantity management, shipping selection, and checkout handling.
 * All values are memoized to prevent unnecessary re-renders.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING.STANDARD);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  /**
   * Add item to cart (respects stock limit)
   * @param {Object} product - Product to add
   */
  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const stockLimit = product.stock || DEFAULTS.STOCK_LIMIT;

      if (existingItem) {
        // Don't exceed stock limit
        if (existingItem.quantity >= stockLimit) {
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  /**
   * Remove item from cart
   * @param {number|string} id - Product ID to remove
   */
  const removeFromCart = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  /**
   * Update item quantity (respects stock limit)
   * @param {number|string} id - Product ID
   * @param {number} newQuantity - New quantity value
   */
  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const stockLimit = item.stock || DEFAULTS.STOCK_LIMIT;
          // Don't exceed stock limit
          const clampedQuantity = Math.min(newQuantity, stockLimit);
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      })
    );
  }, []);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  /**
   * Calculate total items in cart
   */
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  /**
   * Calculate cart subtotal
   */
  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = item.onSale ? item.salePrice : item.price;
        return sum + price * item.quantity;
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
   * Calculate total with shipping
   * @returns {number} Total including shipping
   */
  const getTotal = useCallback(() => cartTotal + getShippingCost(), [cartTotal, getShippingCost]);

  /**
   * Handle checkout process
   * Generates order number and clears cart
   * @returns {Object} Checkout result with success status and orderId
   */
  const handleCheckout = useCallback(() => {
    // Generate order number at checkout time (not during render)
    const newOrderNumber = Math.floor(Math.random() * DEFAULTS.MAX_ORDER_NUMBER);
    setOrderNumber(newOrderNumber);
    setOrderPlaced(true);
    // Clear cart items immediately after placing order
    setCartItems([]);
    return { success: true, orderId: newOrderNumber };
  }, []);

  /**
   * Reset order state (called after order confirmation)
   */
  const resetOrder = useCallback(() => {
    setOrderPlaced(false);
    setOrderNumber(null);
  }, []);

  /**
   * Check if item is in cart
   * @param {number|string} productId - Product ID to check
   * @returns {boolean} True if item is in cart
   */
  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  );

  /**
   * Get item quantity in cart
   * @param {number|string} productId - Product ID
   * @returns {number} Quantity in cart (0 if not in cart)
   */
  const getItemQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((cartItem) => cartItem.id === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      cartItems,
      selectedShipping,
      setSelectedShipping,
      orderPlaced,
      setOrderPlaced,
      orderNumber,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      cartTotal,
      getShippingCost,
      getTotal,
      handleCheckout,
      resetOrder,
      isInCart,
      getItemQuantity,
      shippingOptions,
    }),
    [
      cartItems,
      selectedShipping,
      orderPlaced,
      orderNumber,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      cartTotal,
      getShippingCost,
      getTotal,
      handleCheckout,
      resetOrder,
      isInCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * useCart - Custom hook to access cart context
 *
 * @returns {Object} Cart context value containing cart state and methods
 * @throws {Error} If used outside of CartProvider
 *
 * @example
 * const { cartItems, addToCart, removeFromCart, totalItems, cartTotal } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;

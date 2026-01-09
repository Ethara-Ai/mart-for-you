import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { shippingOptions } from '../data/products';
import { DEFAULTS, SHIPPING, STORAGE_KEYS } from '../constants';
import { generateOrderNumber } from '../utils/id';
import { getFromStorage, setToStorage } from '../utils/storage';
import { validateCartItem } from '../utils/validation';

// Create the Cart Context
const CartContext = createContext(null);

/**
 * Load cart from localStorage
 * @returns {Array} Cart items array
 */
function loadCartFromStorage() {
  const savedCart = getFromStorage(STORAGE_KEYS.CART, []);

  // Validate loaded cart items
  if (!Array.isArray(savedCart)) {
    return [];
  }

  // Filter out invalid items
  return savedCart.filter((item) => {
    const validation = validateCartItem(item);
    return validation.valid;
  });
}

/**
 * Save cart to localStorage
 * @param {Array} cartItems - Cart items to save
 */
function saveCartToStorage(cartItems) {
  setToStorage(STORAGE_KEYS.CART, cartItems);
}

/**
 * CartProvider - Shopping cart state management
 *
 * Provides cart functionality including adding/removing items,
 * quantity management, shipping selection, modal state, and checkout handling.
 * Persists cart data to localStorage and validates operations.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function CartProvider({ children }) {
  // Cart state - initialized from localStorage
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING.STANDARD);

  // Order state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Modal state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  /**
   * Open cart modal
   */
  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  /**
   * Close cart modal
   */
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  /**
   * Toggle cart modal
   */
  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  /**
   * Add item to cart (respects stock limit)
   * @param {Object} product - Product to add
   * @returns {{ success: boolean, message: string }} Result of operation
   */
  const addToCart = useCallback((product) => {
    if (!product || !product.id) {
      return { success: false, message: 'Invalid product' };
    }

    const stockLimit = product.stock || DEFAULTS.STOCK_LIMIT;

    // Check if out of stock
    if (stockLimit <= 0) {
      return { success: false, message: `${product.name} is out of stock` };
    }

    let result = { success: true, message: '' };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Don't exceed stock limit
        if (existingItem.quantity >= stockLimit) {
          result = { success: false, message: 'Maximum quantity reached' };
          return prevItems;
        }
        result.message = `Added another ${product.name} to cart`;
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      result.message = `${product.name} added to cart`;
      return [...prevItems, { ...product, quantity: 1 }];
    });

    return result;
  }, []);

  /**
   * Remove item from cart
   * @param {number|string} id - Product ID to remove
   * @returns {{ success: boolean, message: string }} Result of operation
   */
  const removeFromCart = useCallback((id) => {
    let removedName = '';

    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.id === id);
      if (item) {
        removedName = item.name;
      }
      return prevItems.filter((item) => item.id !== id);
    });

    return {
      success: true,
      message: removedName ? `${removedName} removed from cart` : 'Item removed',
    };
  }, []);

  /**
   * Update item quantity (respects stock limit)
   * @param {number|string} id - Product ID
   * @param {number} newQuantity - New quantity value
   * @returns {{ success: boolean, message: string }} Result of operation
   */
  const updateQuantity = useCallback(
    (id, newQuantity) => {
      if (newQuantity < 1) {
        return removeFromCart(id);
      }

      let result = { success: true, message: '' };

      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            const stockLimit = item.stock || DEFAULTS.STOCK_LIMIT;

            // Don't exceed stock limit
            if (newQuantity > stockLimit) {
              result = { success: false, message: 'Maximum quantity reached' };
              return { ...item, quantity: stockLimit };
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );

      return result;
    },
    [removeFromCart]
  );

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    return { success: true, message: 'Cart cleared' };
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
   * Get selected shipping option details
   * @returns {Object|null} Shipping option details
   */
  const getSelectedShippingOption = useCallback(
    () => shippingOptions.find((opt) => opt.id === selectedShipping) || null,
    [selectedShipping]
  );

  /**
   * Calculate total with shipping
   * @returns {number} Total including shipping
   */
  const getTotal = useCallback(() => cartTotal + getShippingCost(), [cartTotal, getShippingCost]);

  /**
   * Handle checkout process
   * Generates order number and clears cart
   * @returns {Promise<{ success: boolean, orderId?: string, error?: string }>} Checkout result
   */
  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate unique order number
      const newOrderNumber = generateOrderNumber();

      setOrderNumber(newOrderNumber);
      setOrderPlaced(true);

      // Clear cart items after placing order
      setCartItems([]);

      return { success: true, orderId: newOrderNumber };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Checkout failed';
      setCheckoutError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsCheckingOut(false);
    }
  }, [cartItems.length]);

  /**
   * Reset order state (called after order confirmation)
   */
  const resetOrder = useCallback(() => {
    setOrderPlaced(false);
    setOrderNumber(null);
    setCheckoutError(null);
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

  /**
   * Get cart item by product ID
   * @param {number|string} productId - Product ID
   * @returns {Object|null} Cart item or null
   */
  const getCartItem = useCallback(
    (productId) => cartItems.find((item) => item.id === productId) || null,
    [cartItems]
  );

  /**
   * Check if cart has items
   */
  const hasItems = useMemo(() => cartItems.length > 0, [cartItems]);

  /**
   * Check if any item is at stock limit
   */
  const hasItemsAtLimit = useMemo(
    () =>
      cartItems.some((item) => {
        const stockLimit = item.stock || DEFAULTS.STOCK_LIMIT;
        return item.quantity >= stockLimit;
      }),
    [cartItems]
  );

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(
    () => ({
      // Cart state
      cartItems,
      selectedShipping,
      setSelectedShipping,

      // Order state
      orderPlaced,
      setOrderPlaced,
      orderNumber,
      isCheckingOut,
      checkoutError,

      // Modal state
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,

      // Cart operations
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,

      // Computed values
      totalItems,
      cartTotal,
      hasItems,
      hasItemsAtLimit,

      // Shipping
      getShippingCost,
      getSelectedShippingOption,
      getTotal,
      shippingOptions,

      // Checkout
      handleCheckout,
      resetOrder,

      // Item queries
      isInCart,
      getItemQuantity,
      getCartItem,
    }),
    [
      cartItems,
      selectedShipping,
      orderPlaced,
      orderNumber,
      isCheckingOut,
      checkoutError,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      cartTotal,
      hasItems,
      hasItemsAtLimit,
      getShippingCost,
      getSelectedShippingOption,
      getTotal,
      handleCheckout,
      resetOrder,
      isInCart,
      getItemQuantity,
      getCartItem,
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
 * const {
 *   cartItems,
 *   addToCart,
 *   removeFromCart,
 *   totalItems,
 *   cartTotal,
 *   isCartOpen,
 *   openCart,
 *   closeCart,
 * } = useCart();
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;

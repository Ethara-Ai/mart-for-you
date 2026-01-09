import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { DEFAULTS, STORAGE_KEYS } from '../../constants';
import { getFromStorage, setToStorage } from '../../utils/storage';
import { validateCartItem } from '../../utils/validation';
import { createLogger } from '../../utils/logger';

// Create logger for this context
const log = createLogger('CartItemsContext');

// Create the Cart Items Context
const CartItemsContext = createContext(null);

/**
 * Load cart from localStorage with validation
 * @returns {Array} Valid cart items array
 */
function loadCartFromStorage() {
  const savedCart = getFromStorage(STORAGE_KEYS.CART, []);

  // Validate loaded cart items
  if (!Array.isArray(savedCart)) {
    log.warn('Invalid cart data in storage, resetting to empty cart');
    return [];
  }

  // Filter out invalid items and log any issues
  const validItems = [];
  const invalidCount = { count: 0 };

  savedCart.forEach((item, index) => {
    const validation = validateCartItem(item);
    if (validation.valid) {
      validItems.push(item);
    } else {
      invalidCount.count++;
      log.debug(`Invalid cart item at index ${index}`, { errors: validation.errors });
    }
  });

  if (invalidCount.count > 0) {
    log.warn(`Removed ${invalidCount.count} invalid items from cart`);
  }

  return validItems;
}

/**
 * Save cart to localStorage
 * @param {Array} cartItems - Cart items to save
 */
function saveCartToStorage(cartItems) {
  const success = setToStorage(STORAGE_KEYS.CART, cartItems);
  if (!success) {
    log.error('Failed to save cart to localStorage');
  }
}

/**
 * CartItemsProvider - Manages cart items state and CRUD operations
 *
 * This is a focused context that only handles cart items data.
 * Separated from UI state (modal) and checkout logic for better
 * performance and maintainability.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Function} [props.onCartChange] - Callback when cart changes
 */
export function CartItemsProvider({ children, onCartChange }) {
  // Cart state - initialized from localStorage
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage());

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cartItems);
    onCartChange?.(cartItems);
  }, [cartItems, onCartChange]);

  /**
   * Add item to cart (respects stock limit)
   * @param {Object} product - Product to add
   * @returns {{ success: boolean, message: string }} Result of operation
   */
  const addToCart = useCallback((product) => {
    if (!product || !product.id) {
      log.warn('Attempted to add invalid product to cart');
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
      log.debug('Product added to cart', { productId: product.id, name: product.name });
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
        log.debug('Product removed from cart', { productId: id, name: removedName });
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
      let _itemName = '';

      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            _itemName = item.name;
            const stockLimit = item.stock || DEFAULTS.STOCK_LIMIT;

            // Don't exceed stock limit
            if (newQuantity > stockLimit) {
              result = { success: false, message: 'Maximum quantity reached' };
              return { ...item, quantity: stockLimit };
            }

            // Quantity updated successfully (message intentionally empty - no toast needed for quantity changes)
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
   * @returns {{ success: boolean, message: string }}
   */
  const clearCart = useCallback(() => {
    log.debug('Cart cleared');
    setCartItems([]);
    return { success: true, message: 'Cart cleared' };
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
   * Calculate total items in cart
   */
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
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

  // Memoize context value
  const value = useMemo(
    () => ({
      // State
      cartItems,

      // Actions
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,

      // Queries
      isInCart,
      getItemQuantity,
      getCartItem,

      // Computed values
      totalItems,
      hasItems,
      hasItemsAtLimit,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
      getCartItem,
      totalItems,
      hasItems,
      hasItemsAtLimit,
    ]
  );

  return <CartItemsContext.Provider value={value}>{children}</CartItemsContext.Provider>;
}

/**
 * useCartItems - Hook to access cart items context
 *
 * @returns {Object} Cart items context value
 * @throws {Error} If used outside of CartItemsProvider
 *
 * @example
 * const { cartItems, addToCart, removeFromCart } = useCartItems();
 */
export function useCartItems() {
  const context = useContext(CartItemsContext);
  if (!context) {
    throw new Error('useCartItems must be used within a CartItemsProvider');
  }
  return context;
}

export default CartItemsContext;

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { shippingOptions } from '../data/products';

// Create the Cart Context
const CartContext = createContext(null);

// Cart Provider Component
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  // Add item to cart (respects stock limit)
  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      const stockLimit = product.stock || 10;

      if (existingItem) {
        // Don't exceed stock limit
        if (existingItem.quantity >= stockLimit) {
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  // Update item quantity (respects stock limit)
  const updateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const stockLimit = item.stock || 10;
          // Don't exceed stock limit
          const clampedQuantity = Math.min(newQuantity, stockLimit);
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      }),
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate total items in cart
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  // Calculate cart subtotal
  const cartTotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = item.onSale ? item.salePrice : item.price;
        return sum + price * item.quantity;
      }, 0),
    [cartItems],
  );

  // Get shipping cost
  const getShippingCost = useCallback(() => {
    const option = shippingOptions.find((opt) => opt.id === selectedShipping);
    return option ? option.price : 0;
  }, [selectedShipping]);

  // Calculate total with shipping
  const getTotal = useCallback(() => cartTotal + getShippingCost(), [cartTotal, getShippingCost]);

  // Handle checkout
  const handleCheckout = useCallback(() => {
    // Generate order number at checkout time (not during render)
    const newOrderNumber = Math.floor(Math.random() * 10000000);
    setOrderNumber(newOrderNumber);
    setOrderPlaced(true);

    // Simulate order processing
    return new Promise((resolve) => {
      setTimeout(() => {
        setCartItems([]);
        setOrderPlaced(false);
        setOrderNumber(null);
        resolve({ success: true, orderId: newOrderNumber });
      }, 3000);
    });
  }, []);

  // Check if item is in cart
  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems],
  );

  // Get item quantity in cart
  const getItemQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    },
    [cartItems],
  );

  // Context value
  const value = {
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
    isInCart,
    getItemQuantity,
    shippingOptions,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;

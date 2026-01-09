import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { generateOrderNumber } from '../../utils/id';
import { createLogger } from '../../utils/logger';
import { CHECKOUT_STAGES } from './constants';

// Create logger for this context
const log = createLogger('CheckoutContext');

// Create the Checkout Context
const CheckoutContext = createContext(null);

/**
 * CheckoutProvider - Manages checkout flow state
 *
 * This context handles all checkout-related state including:
 * - Order placement and confirmation
 * - Loading/error states during checkout
 * - Checkout stage progression
 *
 * Separated from cart items/totals for focused responsibility
 * and to prevent unnecessary re-renders during checkout flow.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {Function} [props.onOrderPlaced] - Callback when order is placed
 * @param {Function} [props.clearCart] - Function to clear cart after checkout
 */
export function CheckoutProvider({ children, onOrderPlaced, clearCart }) {
  // Order state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Checkout process state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Checkout stage tracking
  const [checkoutStage, setCheckoutStage] = useState(CHECKOUT_STAGES.CART);

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Clear checkout error
   */
  const clearError = useCallback(() => {
    setCheckoutError(null);
  }, []);

  /**
   * Clear validation errors
   */
  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  /**
   * Set a validation error for a specific field
   * @param {string} field - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((field, error) => {
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  /**
   * Clear a specific field error
   * @param {string} field - Field name
   */
  const clearFieldError = useCallback((field) => {
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /**
   * Move to next checkout stage
   */
  const nextStage = useCallback(() => {
    setCheckoutStage((current) => {
      const stages = Object.values(CHECKOUT_STAGES);
      const currentIndex = stages.indexOf(current);
      const nextIndex = Math.min(currentIndex + 1, stages.length - 1);
      return stages[nextIndex];
    });
  }, []);

  /**
   * Move to previous checkout stage
   */
  const previousStage = useCallback(() => {
    setCheckoutStage((current) => {
      const stages = Object.values(CHECKOUT_STAGES);
      const currentIndex = stages.indexOf(current);
      const prevIndex = Math.max(currentIndex - 1, 0);
      return stages[prevIndex];
    });
  }, []);

  /**
   * Go to a specific checkout stage
   * @param {string} stage - Stage to go to
   */
  const goToStage = useCallback((stage) => {
    if (Object.values(CHECKOUT_STAGES).includes(stage)) {
      setCheckoutStage(stage);
    }
  }, []);

  /**
   * Handle checkout process
   * Validates cart, generates order number, and clears cart
   *
   * @param {Object} options - Checkout options
   * @param {Array} options.cartItems - Cart items to checkout
   * @param {number} options.total - Order total
   * @param {Object} [options.shippingInfo] - Shipping information
   * @param {Object} [options.paymentInfo] - Payment information
   * @returns {Promise<{ success: boolean, orderId?: string, error?: string }>} Checkout result
   */
  const handleCheckout = useCallback(
    async (options = {}) => {
      const { cartItems = [], total = 0, shippingInfo, paymentInfo } = options;

      // Validate cart has items
      if (!cartItems || cartItems.length === 0) {
        const error = 'Cart is empty';
        setCheckoutError(error);
        return { success: false, error };
      }

      setIsCheckingOut(true);
      setCheckoutError(null);
      clearValidationErrors();

      try {
        log.info('Starting checkout process', { itemCount: cartItems.length, total });

        // Simulate API call delay (replace with actual API call in production)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In production, this would:
        // 1. Validate inventory
        // 2. Process payment
        // 3. Create order in database
        // 4. Send confirmation email

        // Generate unique order number
        const newOrderNumber = generateOrderNumber();

        // Store order details
        const details = {
          orderNumber: newOrderNumber,
          items: cartItems,
          total,
          shippingInfo,
          paymentInfo: paymentInfo ? { ...paymentInfo, cardNumber: '****' } : null, // Don't store full card
          createdAt: new Date().toISOString(),
        };

        setOrderNumber(newOrderNumber);
        setOrderDetails(details);
        setOrderPlaced(true);
        setCheckoutStage(CHECKOUT_STAGES.CONFIRMATION);

        // Clear cart after successful checkout
        if (clearCart) {
          clearCart();
        }

        // Trigger callback
        if (onOrderPlaced) {
          onOrderPlaced(details);
        }

        log.info('Checkout completed successfully', { orderNumber: newOrderNumber });

        return { success: true, orderId: newOrderNumber };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Checkout failed';
        setCheckoutError(errorMessage);
        log.error('Checkout failed', error);
        return { success: false, error: errorMessage };
      } finally {
        setIsCheckingOut(false);
      }
    },
    [clearCart, onOrderPlaced, clearValidationErrors]
  );

  /**
   * Reset order state (called after order confirmation dismissed)
   */
  const resetOrder = useCallback(() => {
    setOrderPlaced(false);
    setOrderNumber(null);
    setOrderDetails(null);
    setCheckoutError(null);
    setCheckoutStage(CHECKOUT_STAGES.CART);
    setValidationErrors({});
    log.debug('Order state reset');
  }, []);

  /**
   * Start new checkout (alias for resetOrder + goToStage)
   */
  const startNewCheckout = useCallback(() => {
    resetOrder();
    setCheckoutStage(CHECKOUT_STAGES.SHIPPING);
  }, [resetOrder]);

  /**
   * Check if checkout can proceed
   * @param {Array} cartItems - Current cart items
   * @returns {boolean}
   */
  const canProceed = useCallback(
    (cartItems = []) => cartItems.length > 0 && !isCheckingOut,
    [isCheckingOut]
  );

  /**
   * Has validation errors
   */
  const hasValidationErrors = useMemo(
    () => Object.keys(validationErrors).length > 0,
    [validationErrors]
  );

  // Memoize context value
  const value = useMemo(
    () => ({
      // Order state
      orderPlaced,
      orderNumber,
      orderDetails,

      // Process state
      isCheckingOut,
      checkoutError,
      checkoutStage,

      // Validation
      validationErrors,
      hasValidationErrors,

      // Actions
      handleCheckout,
      resetOrder,
      startNewCheckout,
      clearError,

      // Stage navigation
      nextStage,
      previousStage,
      goToStage,

      // Validation actions
      setFieldError,
      clearFieldError,
      clearValidationErrors,

      // Helpers
      canProceed,

      // Stage constants
      CHECKOUT_STAGES,
    }),
    [
      orderPlaced,
      orderNumber,
      orderDetails,
      isCheckingOut,
      checkoutError,
      checkoutStage,
      validationErrors,
      hasValidationErrors,
      handleCheckout,
      resetOrder,
      startNewCheckout,
      clearError,
      nextStage,
      previousStage,
      goToStage,
      setFieldError,
      clearFieldError,
      clearValidationErrors,
      canProceed,
    ]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

/**
 * useCheckout - Hook to access checkout context
 *
 * Use this hook for checkout flow management.
 * Separated from cart items/totals to prevent unnecessary re-renders.
 *
 * @returns {Object} Checkout context value
 * @throws {Error} If used outside of CheckoutProvider
 *
 * @example
 * const {
 *   handleCheckout,
 *   isCheckingOut,
 *   orderPlaced,
 *   orderNumber,
 *   resetOrder,
 * } = useCheckout();
 *
 * const onCheckout = async () => {
 *   const result = await handleCheckout({ cartItems, total });
 *   if (result.success) {
 *     showToast('Order placed!');
 *   }
 * };
 */
export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}

export default CheckoutContext;

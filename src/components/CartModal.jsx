import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useScrollLock, useNavigateToSection } from '../hooks';
import { ROUTES, SECTION_IDS, Z_INDEX } from '../constants';
import CartItem from './CartItem';
import ShippingOptions from './ShippingOptions';

/**
 * CartModal - Shopping cart slide-over drawer component
 *
 * Displays the shopping cart contents in a right-side sliding drawer
 * with cart items, shipping options, order summary, and checkout.
 * Handles empty cart and order confirmation states.
 *
 * Now uses CartContext for open/close state management (removing prop drilling).
 */
function CartModal() {
  const navigateToSection = useNavigateToSection();
  const { darkMode, COLORS } = useTheme();
  const {
    // Modal state from context
    isCartOpen,
    closeCart,
    // Cart data
    cartItems,
    totalItems,
    cartTotal,
    hasItems,
    // Shipping
    getShippingCost,
    getTotal,
    // Checkout
    handleCheckout,
    resetOrder,
    orderPlaced,
    orderNumber,
    isCheckingOut,
  } = useCart();

  // Use the scroll lock hook to handle body scroll locking
  useScrollLock(isCartOpen);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isCartOpen, closeCart]);

  // Handle checkout button click
  const onCheckout = async () => {
    const result = await handleCheckout();
    // Could show error toast here if result.success is false
    return result;
  };

  // Handle continue button click (after order confirmation)
  const handleContinue = () => {
    resetOrder();
    closeCart();
  };

  // Handle continue shopping - navigates to home and scrolls to hero
  const handleContinueShopping = () => {
    closeCart();
    navigateToSection(ROUTES.HOME, SECTION_IDS.HERO);
  };

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const bgColor = darkMode ? COLORS.dark.modalBackground : COLORS.light.modalBackground;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop - clicking this closes the drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/50"
            style={{ zIndex: Z_INDEX.MODAL_BACKDROP }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Right Side Drawer */}
          <motion.div
            id={SECTION_IDS.CART_PANEL}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-105 md:w-120 flex flex-col shadow-2xl"
            style={{
              zIndex: Z_INDEX.MODAL,
              background: bgColor,
              color: darkMode ? COLORS.dark.modalText : COLORS.light.modalText,
              boxShadow: darkMode
                ? '-10px 0 40px rgba(0, 0, 0, 0.5)'
                : '-10px 0 40px rgba(0, 0, 0, 0.15)',
              overscrollBehavior: 'contain',
            }}
          >
            {/* Header - Fixed at top */}
            <div
              className="flex items-center justify-between p-4 sm:p-6 border-b shrink-0"
              style={{ borderColor }}
            >
              <h2
                id="cart-title"
                className="text-xl font-bold flex items-center gap-2"
                style={{
                  color: textColor,
                  fontFamily: "'Metropolis', sans-serif",
                  letterSpacing: '-0.3px',
                }}
              >
                <FiShoppingCart className="h-5 w-5" style={{ color: primaryColor }} />
                Your Cart
                {totalItems > 0 && (
                  <span
                    className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: primaryColor,
                      color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer transition-all hover:scale-110 active:scale-95"
                style={{ color: textColor }}
                aria-label="Close cart"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: darkMode
                  ? `${COLORS.dark.scrollbarThumb} ${COLORS.dark.scrollbarTrack}`
                  : `${COLORS.light.scrollbarThumb} ${COLORS.light.scrollbarTrack}`,
                overscrollBehavior: 'contain',
              }}
            >
              {orderPlaced ? (
                /* Order Placed Confirmation */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div
                    className="mx-auto h-20 w-20 flex items-center justify-center rounded-full mb-6"
                    style={{
                      backgroundColor: darkMode
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(34, 197, 94, 0.1)',
                    }}
                  >
                    <FiCheck className="h-10 w-10" style={{ color: '#22c55e' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                    Order Placed Successfully!
                  </h3>
                  <p className="mb-4" style={{ color: '#22c55e' }}>
                    Thank you for your purchase.
                  </p>
                  <div
                    className="p-4 rounded-lg mb-6"
                    style={{
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    }}
                  >
                    <p className="text-sm mb-1" style={{ color: subtextColor }}>
                      Order confirmation sent to your email
                    </p>
                    <p className="text-sm font-medium" style={{ color: primaryColor }}>
                      Order #: {orderNumber}
                    </p>
                  </div>
                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    className="inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: primaryColor,
                      color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Continue Shopping
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : !hasItems ? (
                /* Empty Cart */
                <div className="text-center py-16">
                  <div
                    className="mx-auto h-24 w-24 flex items-center justify-center rounded-full mb-6"
                    style={{
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <FiShoppingCart
                      className="h-12 w-12"
                      style={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
                    Your cart is empty
                  </h3>
                  <p className="text-sm mb-6" style={{ color: subtextColor }}>
                    Looks like you haven&apos;t added any items yet
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: primaryColor,
                      color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Shop now
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Cart Contents */
                <div className="space-y-0">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom (only when cart has items) */}
            {!orderPlaced && hasItems && (
              <div
                className="shrink-0 border-t p-4 sm:p-5"
                style={{
                  borderColor,
                  backgroundColor: bgColor,
                }}
              >
                {/* Shipping Options - Compact */}
                <ShippingOptions className="mb-3" compact={true} />

                {/* Order Summary */}
                <div className="space-y-1 mb-3">
                  {/* Subtotal */}
                  <div className="flex justify-between text-xs">
                    <p style={{ color: subtextColor }}>Subtotal</p>
                    <p style={{ color: textColor }}>${cartTotal.toFixed(2)}</p>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-xs">
                    <p style={{ color: subtextColor }}>Shipping</p>
                    <p style={{ color: getShippingCost() === 0 ? '#22c55e' : textColor }}>
                      {getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}
                    </p>
                  </div>

                  {/* Total */}
                  <div
                    className="flex justify-between text-base font-bold pt-2 mt-1 border-t"
                    style={{ borderColor }}
                  >
                    <p style={{ color: textColor }}>Total</p>
                    <p style={{ color: primaryColor }}>${getTotal().toFixed(2)}</p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={onCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    backgroundColor: primaryColor,
                    color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {isCheckingOut ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <FiArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Continue Shopping Link */}
                <button
                  onClick={handleContinueShopping}
                  className="w-full mt-2 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:underline text-center"
                  style={{ color: subtextColor }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartModal;

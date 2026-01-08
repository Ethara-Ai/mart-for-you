import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiCheck, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import ShippingOptions from './ShippingOptions';

/**
 * CartModal - Shopping cart slide-over drawer component
 *
 * Displays the shopping cart contents in a right-side sliding drawer
 * with cart items, shipping options, order summary, and checkout.
 * Handles empty cart and order confirmation states.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Callback to close the drawer
 */
function CartModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { darkMode, COLORS } = useTheme();
  const {
    cartItems,
    totalItems,
    cartTotal,
    getShippingCost,
    getTotal,
    handleCheckout,
    orderPlaced,
    orderNumber,
  } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and lock body
      const { scrollY } = window;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Lock both html and body to prevent all scroll scenarios
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
      document.body.style.overflow = 'hidden';
      // Prevent layout shift from scrollbar disappearing
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        // Restore scroll position when drawer closes
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.bottom = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle checkout button click
  const onCheckout = async () => {
    await handleCheckout();
    // Close drawer after order is processed
    setTimeout(() => {
      onClose();
    }, 3500);
  };

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const bgColor = darkMode ? COLORS.dark.modalBackground : COLORS.light.modalBackground;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - clicking this closes the drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/50 z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Right Side Drawer */}
          <motion.div
            id="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] md:w-[480px] z-[101] flex flex-col shadow-2xl"
            style={{
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
                onClick={onClose}
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
                </motion.div>
              ) : cartItems.length === 0 ? (
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
                    onClick={() => {
                      onClose();
                      navigate('/home');
                      setTimeout(() => {
                        const heroSection = document.getElementById('hero-section');
                        if (heroSection) {
                          heroSection.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: primaryColor,
                      color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    Start Shopping
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
            {!orderPlaced && cartItems.length > 0 && (
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
                  className="w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: primaryColor,
                    color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  Proceed to Checkout
                  <FiArrowRight className="h-4 w-4" />
                </button>

                {/* Continue Shopping Link */}
                <button
                  onClick={() => {
                    onClose();
                    navigate('/home');
                    setTimeout(() => {
                      const heroSection = document.getElementById('hero-section');
                      if (heroSection) {
                        heroSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }, 100);
                  }}
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

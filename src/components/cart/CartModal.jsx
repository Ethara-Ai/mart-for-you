import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiX, FiCheck } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import ShippingOptions from './ShippingOptions';

/**
 * CartModal - Shopping cart modal/slide-over component
 *
 * Displays the shopping cart contents in a modal overlay with
 * cart items, shipping options, order summary, and checkout.
 * Handles empty cart and order confirmation states.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and lock body
      const { scrollY } = window;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle escape key to close modal
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
    // Navigate to home after order is processed
    setTimeout(() => {
      onClose();
    }, 3500);
  };

  // Handle backdrop click - close modal
  const handleBackdropClick = (e) => {
    // Only close if clicking directly on the backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
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
          {/* Backdrop - clicking this closes the modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-xs bg-black/40 z-100"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container - Centered with Flexbox */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-101 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            {/* Cart Modal - Stop propagation to prevent closing when clicking inside */}
            <motion.div
              id="cart-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full max-w-2xl max-h-[85vh] shadow-xl overflow-y-auto rounded-lg"
              style={{
                background: bgColor,
                color: darkMode ? COLORS.dark.modalText : COLORS.light.modalText,
                boxShadow: darkMode
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                scrollbarWidth: 'thin',
                scrollbarColor: darkMode
                  ? `${COLORS.dark.scrollbarThumb} ${COLORS.dark.scrollbarTrack}`
                  : `${COLORS.light.scrollbarThumb} ${COLORS.light.scrollbarTrack}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="cart-title"
                    className="text-xl font-bold"
                    style={{
                      color: textColor,
                      fontFamily: "'Metropolis', sans-serif",
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Your Cart
                    {totalItems > 0 && (
                      <span className="ml-2 text-sm font-normal" style={{ color: subtextColor }}>
                        ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer transition-colors"
                    style={{ color: textColor }}
                    aria-label="Close cart"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                {orderPlaced ? (
                  /* Order Placed Confirmation */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div
                      className="mx-auto h-24 w-24 flex items-center justify-center rounded-full mb-6"
                      style={{
                        backgroundColor: darkMode
                          ? 'rgba(120, 145, 120, 0.2)'
                          : 'rgba(8, 73, 16, 0.1)',
                      }}
                    >
                      <FiCheck className="h-12 w-12" style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                      Order Placed!
                    </h3>
                    <p className="mb-6" style={{ color: primaryColor }}>
                      Thank you for your purchase.
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: subtextColor }}>
                        Order confirmation has been sent to your email.
                      </p>
                      <p className="text-sm" style={{ color: subtextColor }}>
                        Order #: {orderNumber}
                      </p>
                    </div>
                  </motion.div>
                ) : cartItems.length === 0 ? (
                  /* Empty Cart */
                  <div className="text-center py-12">
                    <FiShoppingCart
                      className="mx-auto h-12 w-12"
                      style={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      }}
                    />
                    <p className="mt-4" style={{ color: subtextColor }}>
                      Your cart is empty
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/home');
                        // Scroll to hero section after navigation
                        setTimeout(() => {
                          const heroSection = document.getElementById('hero-section');
                          if (heroSection) {
                            heroSection.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }, 100);
                      }}
                      className="mt-6 px-4 py-2 font-medium rounded-md transition-all cursor-pointer transform hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: primaryColor,
                        color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  /* Cart Contents */
                  <>
                    {/* Cart Items */}
                    <div className="space-y-0 mb-6">
                      <AnimatePresence mode="popLayout">
                        {cartItems.map((item) => (
                          <CartItem key={item.id} item={item} />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Checkout Section */}
                    <div className="border-t pt-6" style={{ borderColor }}>
                      {/* Shipping Options */}
                      <ShippingOptions className="mb-6" />

                      {/* Order Summary */}
                      <div className="space-y-2 mb-4">
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                          <p style={{ color: textColor }}>Subtotal</p>
                          <p style={{ color: textColor }}>${cartTotal.toFixed(2)}</p>
                        </div>

                        {/* Shipping */}
                        <div className="flex justify-between text-sm">
                          <p style={{ color: textColor }}>Shipping</p>
                          <p style={{ color: textColor }}>
                            {getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}
                          </p>
                        </div>

                        {/* Total */}
                        <div
                          className="flex justify-between text-base font-medium pt-2 border-t"
                          style={{
                            borderColor: darkMode
                              ? 'rgba(255, 255, 255, 0.2)'
                              : 'rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <p style={{ color: textColor }}>Total</p>
                          <p style={{ color: textColor }}>${getTotal().toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={onCheckout}
                        className="w-full py-3 px-4 font-medium rounded-md transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          backgroundColor: primaryColor,
                          color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        Checkout
                      </button>

                      {/* Continue Shopping Link */}
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => {
                            onClose();
                            navigate('/home');
                            // Scroll to hero section after navigation
                            setTimeout(() => {
                              const heroSection = document.getElementById('hero-section');
                              if (heroSection) {
                                heroSection.scrollIntoView({ behavior: 'smooth' });
                              } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }, 100);
                          }}
                          className="text-sm font-medium cursor-pointer transition-colors hover:underline"
                          style={{ color: primaryColor }}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartModal;

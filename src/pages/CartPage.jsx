import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCheck, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CartItem from '../components/CartItem';
import ShippingOptions from '../components/ShippingOptions';

/**
 * CartPage - Full page shopping cart component
 *
 * Displays the complete shopping cart with items, shipping options,
 * order summary, and checkout functionality. Provides a more detailed
 * view than the cart modal.
 */
function CartPage() {
  const navigate = useNavigate();
  const { darkMode, COLORS } = useTheme();
  const { showSuccess } = useToast();
  const {
    cartItems,
    totalItems,
    cartTotal,
    getShippingCost,
    getTotal,
    handleCheckout,
    clearCart,
    orderPlaced,
    orderNumber,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);

  // Handle checkout
  const onCheckout = async () => {
    setIsProcessing(true);
    try {
      await handleCheckout();
      // Navigate to home after order is processed
      setTimeout(() => {
        navigate('/home');
      }, 3500);
    } catch (error) {
      console.error('Checkout error:', error);
    }
    setIsProcessing(false);
  };

  // Handle clear cart
  const handleClearCart = () => {
    clearCart();
    showSuccess('Cart cleared');
  };

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const cardBg = darkMode ? COLORS.dark.secondary : COLORS.light.background;

  return (
    <main
      className="min-h-screen py-8"
      style={{
        background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
      }}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {/* Back Link */}
          <button
            onClick={() => {
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
            className="inline-flex items-center text-sm font-medium mb-4 hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: primaryColor }}
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold"
                style={{
                  color: textColor,
                  fontFamily: "'Metropolis', sans-serif",
                }}
              >
                Shopping Cart
              </h1>
              {totalItems > 0 && (
                <p className="mt-1 text-sm" style={{ color: subtextColor }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              )}
            </div>

            {/* Clear Cart Button */}
            {cartItems.length > 0 && !orderPlaced && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all hover:opacity-80"
                style={{
                  color: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                }}
              >
                <FiTrash2 className="h-4 w-4" />
                Clear Cart
              </button>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {orderPlaced ? (
          /* Order Placed Confirmation */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-lg"
            style={{ backgroundColor: cardBg }}
          >
            <div
              className="mx-auto h-24 w-24 flex items-center justify-center rounded-full mb-6"
              style={{
                backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
              }}
            >
              <FiCheck className="h-12 w-12" style={{ color: 'rgb(34, 197, 94)' }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
              Order Placed Successfully!
            </h2>
            <p className="mb-6 text-lg" style={{ color: primaryColor }}>
              Thank you for your purchase.
            </p>
            <div className="space-y-2 mb-8">
              <p className="text-sm" style={{ color: subtextColor }}>
                Order confirmation has been sent to your email.
              </p>
              <p className="text-sm font-medium" style={{ color: textColor }}>
                Order #: {orderNumber}
              </p>
            </div>
            <Link
              to="/home"
              className="inline-block px-6 py-3 font-medium rounded-md transition-all hover:opacity-90"
              style={{
                backgroundColor: primaryColor,
                color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
              }}
            >
              Return to Home
            </Link>
          </motion.div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 rounded-lg"
            style={{ backgroundColor: cardBg }}
          >
            <FiShoppingCart
              className="mx-auto h-16 w-16 mb-6"
              style={{
                color: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              }}
            />
            <h2 className="text-xl font-bold mb-2" style={{ color: textColor }}>
              Your cart is empty
            </h2>
            <p className="mb-8" style={{ color: subtextColor }}>
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 font-medium rounded-md transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: primaryColor,
                color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          /* Cart Contents */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="rounded-lg p-6" style={{ backgroundColor: cardBg }}>
                <h2
                  className="text-lg font-bold mb-4 pb-4 border-b"
                  style={{
                    color: textColor,
                    borderColor,
                  }}
                >
                  Cart Items
                </h2>

                {/* Cart Items List */}
                <div className="space-y-0">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Order Summary - Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="rounded-lg p-6 sticky top-24" style={{ backgroundColor: cardBg }}>
                <h2
                  className="text-lg font-bold mb-4 pb-4 border-b"
                  style={{
                    color: textColor,
                    borderColor,
                  }}
                >
                  Order Summary
                </h2>

                {/* Shipping Options */}
                <ShippingOptions className="mb-6" />

                {/* Summary Lines */}
                <div className="space-y-3 py-4 border-t" style={{ borderColor }}>
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span style={{ color: subtextColor }}>Subtotal ({totalItems} items)</span>
                    <span style={{ color: textColor }}>${cartTotal.toFixed(2)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span style={{ color: subtextColor }}>Shipping</span>
                    <span
                      style={{
                        color: getShippingCost() === 0 ? 'rgb(34, 197, 94)' : textColor,
                      }}
                    >
                      {getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}
                    </span>
                  </div>

                  {/* Tax (estimated) */}
                  <div className="flex justify-between text-sm">
                    <span style={{ color: subtextColor }}>Estimated Tax</span>
                    <span style={{ color: textColor }}>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between py-4 border-t" style={{ borderColor }}>
                  <span className="text-lg font-bold" style={{ color: textColor }}>
                    Total
                  </span>
                  <span className="text-lg font-bold" style={{ color: textColor }}>
                    ${(getTotal() + cartTotal * 0.08).toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={onCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 font-medium rounded-md transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: primaryColor,
                    color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                {/* Secure Checkout Notice */}
                <p
                  className="mt-4 text-xs text-center flex items-center justify-center gap-1"
                  style={{ color: subtextColor }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Secure checkout
                </p>

                {/* Continue Shopping Link */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
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
                    className="text-sm font-medium hover:underline cursor-pointer"
                    style={{ color: primaryColor }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CartPage;

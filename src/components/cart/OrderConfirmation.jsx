import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight } from 'react-icons/fi';

/**
 * OrderConfirmation - Order confirmation success component
 *
 * Displays after successful order placement with order number
 * and confirmation message.
 */
function OrderConfirmation({ orderNumber, onContinue, darkMode, colors }) {
  const textColor = darkMode ? colors.dark.text : colors.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const primaryColor = darkMode ? colors.dark.primary : colors.light.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div
        className="mx-auto h-20 w-20 flex items-center justify-center rounded-full mb-6"
        style={{
          backgroundColor: darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
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
      <button
        onClick={onContinue}
        className="inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        style={{
          backgroundColor: primaryColor,
          color: darkMode ? colors.dark.modalBackground : colors.light.background,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        Continue Shopping
        <FiArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export default OrderConfirmation;

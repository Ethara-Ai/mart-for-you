import { FiShoppingCart, FiArrowRight } from 'react-icons/fi';

/**
 * EmptyCart - Empty cart state component
 *
 * Displays when cart has no items with a call-to-action
 * to start shopping.
 */
function EmptyCart({ onContinueShopping, darkMode, colors }) {
  const textColor = darkMode ? colors.dark.text : colors.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const primaryColor = darkMode ? colors.dark.primary : colors.light.primary;

  return (
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
        onClick={onContinueShopping}
        className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        style={{
          backgroundColor: primaryColor,
          color: darkMode ? colors.dark.modalBackground : colors.light.background,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        Start Shopping
        <FiArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default EmptyCart;

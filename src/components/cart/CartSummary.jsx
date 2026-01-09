import { FiArrowRight } from 'react-icons/fi';
import ShippingOptions from '../ShippingOptions';

/**
 * CartSummary - Cart summary and checkout section
 *
 * Displays shipping options, order totals, and checkout button.
 */
function CartSummary({
  cartTotal,
  shippingCost,
  total,
  onCheckout,
  onContinueShopping,
  isCheckingOut,
  darkMode,
  colors,
}) {
  const textColor = darkMode ? colors.dark.text : colors.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const primaryColor = darkMode ? colors.dark.primary : colors.light.primary;
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const bgColor = darkMode ? colors.dark.modalBackground : colors.light.modalBackground;

  return (
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
          <p style={{ color: shippingCost === 0 ? '#22c55e' : textColor }}>
            {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
          </p>
        </div>

        {/* Total */}
        <div
          className="flex justify-between text-base font-bold pt-2 mt-1 border-t"
          style={{ borderColor }}
        >
          <p style={{ color: textColor }}>Total</p>
          <p style={{ color: primaryColor }}>${total.toFixed(2)}</p>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isCheckingOut}
        className="w-full py-3 px-4 text-sm font-semibold rounded-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{
          backgroundColor: primaryColor,
          color: darkMode ? colors.dark.modalBackground : colors.light.background,
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
        onClick={onContinueShopping}
        className="w-full mt-2 py-1.5 text-xs font-medium cursor-pointer transition-colors hover:underline text-center"
        style={{ color: subtextColor }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default CartSummary;

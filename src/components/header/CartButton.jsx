import { FiShoppingCart } from 'react-icons/fi';

/**
 * CartButton - Shopping cart button component
 *
 * Displays a cart icon with item count badge.
 * Reusable across mobile and desktop layouts.
 */
function CartButton({
  totalItems,
  onClick,
  darkMode,
  colors,
  size = 'md',
  id = 'cart-button',
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4 sm:h-5 sm:w-5',
    lg: 'h-5 w-5',
  };

  const badgeSizes = {
    sm: 'min-w-4 h-4 text-[10px]',
    md: 'min-w-4 h-4 sm:min-w-5 sm:h-5 text-[10px] sm:text-xs',
    lg: 'min-w-5 h-5 text-xs',
  };

  return (
    <button
      id={id}
      onClick={onClick}
      className={`relative ${sizeClasses[size]} flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95 shrink-0`}
      style={{
        backgroundColor: darkMode ? colors.dark.secondary : colors.light.secondary,
        color: darkMode ? colors.dark.primary : colors.light.primary,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      aria-label={`View shopping cart with ${totalItems} items`}
    >
      <FiShoppingCart className={iconSizes[size]} />
      {totalItems > 0 && (
        <span
          className={`absolute -top-1 -right-1 ${badgeSizes[size]} flex items-center justify-center font-bold rounded-full px-1`}
          style={{
            backgroundColor: darkMode ? colors.dark.primary : colors.light.primary,
            color: darkMode ? colors.dark.modalBackground : colors.light.background,
          }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}

export default CartButton;

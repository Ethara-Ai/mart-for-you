import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

/**
 * CartItem - Individual cart item display component
 *
 * Displays a cart item with image, name, price, quantity controls,
 * and remove functionality. Used in the cart modal and cart page.
 *
 * @param {Object} props
 * @param {Object} props.item - Cart item object
 * @param {number} props.item.id - Item ID
 * @param {string} props.item.name - Item name
 * @param {number} props.item.price - Item price
 * @param {string} props.item.image - Item image URL
 * @param {number} props.item.quantity - Quantity in cart
 * @param {boolean} props.item.onSale - Whether item is on sale
 * @param {number} props.item.salePrice - Sale price (if on sale)
 * @param {boolean} props.compact - Whether to use compact layout
 * @param {Function} props.onQuantityChange - Optional custom quantity change handler
 * @param {Function} props.onRemove - Optional custom remove handler
 */
function CartItem({ item, compact = false, onQuantityChange, onRemove }) {
  const { darkMode, COLORS } = useTheme();
  const { updateQuantity, removeFromCart } = useCart();

  // Handle quantity increase
  const handleIncrease = () => {
    if (onQuantityChange) {
      onQuantityChange(item.id, item.quantity + 1);
    } else {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    if (item.quantity > 1) {
      if (onQuantityChange) {
        onQuantityChange(item.id, item.quantity - 1);
      } else {
        updateQuantity(item.id, item.quantity - 1);
      }
    } else if (item.quantity === 1) {
      // Remove from cart when quantity reaches 0
      if (onRemove) {
        onRemove(item.id);
      } else {
        removeFromCart(item.id);
      }
    }
  };

  // Handle remove item
  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    } else {
      removeFromCart(item.id);
    }
  };

  // Get the actual price (sale price if on sale)
  const actualPrice = item.onSale ? item.salePrice : item.price;
  const itemTotal = actualPrice * item.quantity;

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const buttonColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';

  // Image size based on compact mode
  const imageSize = compact ? 'h-12 w-12' : 'h-16 w-16';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center border-b py-4 ${compact ? 'py-3' : 'py-4'}`}
      style={{ borderColor }}
    >
      {/* Product Image */}
      <div className={`${imageSize} shrink-0 rounded-md overflow-hidden`}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className={`ml-4 grow min-w-0 ${compact ? 'ml-3' : 'ml-4'}`}>
        {/* Product Name */}
        <h3
          className={`font-medium truncate ${compact ? 'text-xs' : 'text-sm'}`}
          style={{ color: textColor }}
          title={item.name}
        >
          {item.name}
        </h3>

        {/* Price Display */}
        <div className="flex items-center gap-2">
          <p
            className={compact ? 'text-xs' : 'text-sm'}
            style={{ color: subtextColor }}
          >{`$${actualPrice.toFixed(2)}`}</p>
          {item.onSale && (
            <span
              className="text-xs line-through"
              style={{
                color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
              }}
            >
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center mt-2">
          <button
            onClick={handleDecrease}
            className={`p-1 cursor-pointer rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10 ${
              compact ? 'p-0.5' : 'p-1'
            }`}
            style={{ color: buttonColor }}
            aria-label="Decrease quantity"
          >
            <FiMinus className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
          </button>

          <span
            className={`mx-2 min-w-5 text-center ${compact ? 'text-xs' : 'text-sm'}`}
            style={{ color: textColor }}
          >
            {item.quantity}
          </span>

          <button
            onClick={handleIncrease}
            className={`p-1 cursor-pointer rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10 ${
              compact ? 'p-0.5' : 'p-1'
            }`}
            style={{ color: buttonColor }}
            aria-label="Increase quantity"
          >
            <FiPlus className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
          </button>
        </div>
      </div>

      {/* Item Total and Remove */}
      <div className={`ml-4 flex flex-col items-end ${compact ? 'ml-2' : 'ml-4'}`}>
        {/* Item Total Price */}
        <p
          className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}
          style={{ color: textColor }}
        >
          ${itemTotal.toFixed(2)}
        </p>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className={`mt-2 flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80 ${
            compact ? 'text-xs' : 'text-xs'
          }`}
          style={{
            color: darkMode ? 'rgba(220, 38, 38, 0.8)' : 'rgba(220, 38, 38, 1)',
          }}
          aria-label={`Remove ${item.name} from cart`}
        >
          <FiTrash2 className={compact ? 'h-3 w-3' : 'h-3 w-3'} />
          <span>Remove</span>
        </button>
      </div>
    </motion.div>
  );
}

export default CartItem;

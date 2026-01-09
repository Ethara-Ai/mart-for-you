import { FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAppState } from '../hooks';
import { QuantitySelector, PriceDisplay } from './common';

/**
 * CartItem - Individual cart item component (Refactored)
 *
 * Displays a cart item with quantity controls and remove button.
 * Uses common components for better modularity.
 *
 * Improvements:
 * - Uses useAppState facade hook (reduced from 3 contexts to 1)
 * - Uses PriceDisplay component
 * - Uses QuantitySelector component
 * - Cleaner, more maintainable code
 */
function CartItem({ item, compact = false, onQuantityChange, onRemove }) {
  const { theme, cart, toast } = useAppState();

  // Get stock limit
  const stockLimit = item.stock || 10;
  const isAtStockLimit = item.quantity >= stockLimit;

  // Quantity handlers
  const handleIncrease = () => {
    if (isAtStockLimit) {
      toast.showSuccess('Maximum quantity reached');
      return;
    }
    const newQuantity = item.quantity + 1;
    if (onQuantityChange) {
      onQuantityChange(item.id, newQuantity);
    } else {
      cart.updateQuantity(item.id, newQuantity);
    }
    if (newQuantity >= stockLimit) {
      toast.showSuccess('Maximum quantity reached');
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      if (onQuantityChange) {
        onQuantityChange(item.id, item.quantity - 1);
      } else {
        cart.updateQuantity(item.id, item.quantity - 1);
      }
    } else if (item.quantity === 1) {
      if (onRemove) {
        onRemove(item.id);
      } else {
        cart.removeItem(item.id);
      }
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    } else {
      cart.removeItem(item.id);
    }
  };

  // Styles
  const borderColor = theme.darkMode
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';
  const imageSize = compact ? 'h-12 w-12' : 'h-16 w-16';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center border-b ${compact ? 'py-3' : 'py-4'}`}
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
      <div className={`${compact ? 'ml-3' : 'ml-4'} grow min-w-0`}>
        {/* Product Name */}
        <h3
          className={`font-medium truncate ${compact ? 'text-xs' : 'text-sm'}`}
          style={{ color: theme.textColor }}
          title={item.name}
        >
          {item.name}
        </h3>

        {/* Price Display - Using common component */}
        <PriceDisplay
          price={item.price}
          salePrice={item.salePrice}
          onSale={item.onSale}
          size={compact ? 'xs' : 'sm'}
          layout="horizontal"
        />

        {/* Quantity Controls - Using common component */}
        <div className="mt-2">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            max={stockLimit}
            size={compact ? 'sm' : 'md'}
            ariaLabel={`Quantity controls for ${item.name}`}
          />
        </div>
      </div>

      {/* Item Total and Remove */}
      <div className={`${compact ? 'ml-2' : 'ml-4'} flex flex-col items-start`}>
        {/* Item Total Price */}
        <PriceDisplay
          price={item.price}
          salePrice={item.salePrice}
          onSale={item.onSale}
          quantity={item.quantity}
          size={compact ? 'xs' : 'sm'}
        />

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className={`mt-2 flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80 ${compact ? 'text-xs' : 'text-xs'}`}
          style={{
            color: theme.darkMode ? '#ff0000' : '#dc2626',
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

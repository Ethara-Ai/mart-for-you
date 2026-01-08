import { motion } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

/**
 * ProductCard - Individual product display component
 *
 * Displays a product with image, name, description, price,
 * category badge, sale indicator, and add to cart functionality.
 *
 * @param {Object} props
 * @param {Object} props.product - Product data object
 * @param {number} props.product.id - Product ID
 * @param {string} props.product.name - Product name
 * @param {number} props.product.price - Product price
 * @param {string} props.product.image - Product image URL
 * @param {string} props.product.description - Product description
 * @param {string} props.product.category - Product category
 * @param {boolean} props.product.onSale - Whether product is on sale
 * @param {number} props.product.salePrice - Sale price (if on sale)
 * @param {Function} props.onAddToCart - Optional custom add to cart handler
 */
function ProductCard({ product, onAddToCart }) {
  const { darkMode, COLORS } = useTheme();
  const { addToCart, removeFromCart, updateQuantity, isInCart, getItemQuantity } = useCart();
  const { showSuccess } = useToast();

  // Handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
      const quantity = getItemQuantity(product.id);
      if (quantity > 0) {
        showSuccess(`Added another ${product.name} to cart`);
      } else {
        showSuccess(`${product.name} added to cart`);
      }
    }
  };

  // Handle quantity increase
  const handleIncrease = (e) => {
    e.stopPropagation();
    const currentQty = getItemQuantity(product.id);
    updateQuantity(product.id, currentQty + 1);
  };

  // Handle quantity decrease
  const handleDecrease = (e) => {
    e.stopPropagation();
    const currentQty = getItemQuantity(product.id);
    if (currentQty > 1) {
      updateQuantity(product.id, currentQty - 1);
    } else if (currentQty === 1) {
      // Remove from cart when quantity reaches 0
      removeFromCart(product.id);
      showSuccess(`${product.name} removed from cart`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut',
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="overflow-hidden group cursor-pointer"
      style={{
        backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.background,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        transform: 'translateZ(0)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Product Image */}
      <div className="h-64 w-full overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quantity badge if in cart */}
        {isInCart(product.id) && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
              color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
            }}
          >
            {getItemQuantity(product.id)}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block px-2 py-1 text-xs font-medium rounded-full capitalize"
            style={{
              backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.secondary,
              color: darkMode ? COLORS.dark.background : COLORS.light.primary,
            }}
          >
            {product.category}
          </span>

          {/* Sale Badge */}
          {product.onSale && (
            <span
              className="inline-block px-2 py-1 text-xs font-bold rounded-full"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: '#ffffff',
              }}
            >
              SALE
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3
          className="text-lg font-medium line-clamp-1"
          style={{
            color: darkMode ? COLORS.dark.text : COLORS.light.text,
            fontFamily: "'Metropolis', sans-serif",
            fontWeight: 500,
          }}
        >
          {product.name}
        </h3>

        {/* Product Description */}
        <p
          className="text-sm mt-1 h-12 overflow-hidden line-clamp-2"
          style={{
            color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
            fontFamily: "'Metropolis', sans-serif",
          }}
        >
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
          {/* Price Display */}
          <div className="shrink-0">
            {product.onSale ? (
              <div className="flex flex-col">
                <span
                  className="font-medium text-lg"
                  style={{
                    color: darkMode ? COLORS.dark.text : COLORS.light.text,
                  }}
                >
                  ${product.salePrice?.toFixed(2)}
                </span>
                <span
                  className="text-xs line-through"
                  style={{
                    color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  }}
                >
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span
                className="font-medium text-lg"
                style={{
                  color: darkMode ? COLORS.dark.text : COLORS.light.text,
                }}
              >
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button or Quantity Selector */}
          {!isInCart(product.id) ? (
            /* Add to Cart Button - When NOT in cart */
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto flex items-center justify-center px-3 md:px-4 py-2 text-sm md:text-base font-medium rounded-md transition-all cursor-pointer transform hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{
                backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          ) : (
            /* Quantity Selector - When IN cart */
            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
              {/* Decrease Button */}
              <button
                onClick={handleDecrease}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md transition-all cursor-pointer transform hover:scale-110 active:scale-95 shrink-0"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                aria-label="Decrease quantity"
              >
                <FiMinus className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>

              {/* Quantity Display */}
              <span
                className="min-w-[1.75rem] md:min-w-[2rem] text-center font-semibold text-base md:text-lg"
                style={{
                  color: darkMode ? COLORS.dark.text : COLORS.light.text,
                }}
              >
                {getItemQuantity(product.id)}
              </span>

              {/* Increase Button */}
              <button
                onClick={handleIncrease}
                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md transition-all cursor-pointer transform hover:scale-110 active:scale-95 shrink-0"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                aria-label="Increase quantity"
              >
                <FiPlus className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;

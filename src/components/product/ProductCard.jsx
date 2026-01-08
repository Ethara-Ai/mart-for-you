import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ProductDetailModal from './ProductDetailModal';

/**
 * ProductCard - Individual product display component
 *
 * Displays a product with image, name, weight/quantity,
 * price, and add to cart functionality in a compact card design.
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
 * @param {string} props.product.weight - Product weight/quantity info
 * @param {Function} props.onAddToCart - Optional custom add to cart handler
 */
function ProductCard({ product, onAddToCart }) {
  const { darkMode, COLORS } = useTheme();
  const { addToCart, removeFromCart, updateQuantity, isInCart, getItemQuantity } = useCart();
  const { showSuccess } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle card click to open modal
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // Get stock limit (default to 10 if not specified)
  const stockLimit = product.stock || 10;
  const currentQuantity = getItemQuantity(product.id);
  const isAtStockLimit = currentQuantity >= stockLimit;

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    if (stockLimit <= 0) {
      showSuccess(`${product.name} is out of stock`);
      return;
    }
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
    if (isAtStockLimit) {
      showSuccess(`Maximum ${stockLimit} items allowed per order`);
      return;
    }
    updateQuantity(product.id, currentQuantity + 1);
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

  // Get display price
  const displayPrice = product.onSale ? product.salePrice : product.price;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        onClick={handleCardClick}
        className="overflow-hidden group cursor-pointer rounded-lg border"
        style={{
          backgroundColor: darkMode ? COLORS.dark.secondary : '#ffffff',
          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Product Image Container */}
        <div
          className="relative p-3 flex items-center justify-center"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f8f8f8',
          }}
        >
          <div className="w-full aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Sale Badge */}
          {product.onSale && (
            <div
              className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                color: '#ffffff',
              }}
            >
              SALE
            </div>
          )}

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
        <div className="p-3">
          {/* Product Name and Weight Container - Fixed height for consistent card sizing */}
          <div style={{ minHeight: '3rem' }}>
            {/* Product Name */}
            <h3
              className="text-sm font-medium line-clamp-2 leading-tight"
              style={{
                color: darkMode ? COLORS.dark.text : COLORS.light.text,
                fontFamily: "'Metropolis', sans-serif",
              }}
            >
              {product.name}
            </h3>

            {/* Weight/Quantity Info */}
            <p
              className="text-xs mt-1"
              style={{
                color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.45)',
              }}
            >
              {product.weight || `${product.description?.substring(0, 20)}...`}
            </p>
          </div>

          {/* Price and Add Button Row */}
          <div className="flex items-center justify-between mt-1">
            {/* Price Display - Fixed height for consistent alignment */}
            <div className="flex flex-col" style={{ minHeight: '2.75rem' }}>
              <span
                className="font-semibold text-base"
                style={{
                  color: darkMode ? COLORS.dark.text : COLORS.light.text,
                }}
              >
                ${displayPrice?.toFixed(2)}
              </span>
              {/* Always reserve space for strikethrough price */}
              <span
                className={`text-xs ${product.onSale ? 'line-through' : 'invisible'}`}
                style={{
                  color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
                }}
              >
                {product.onSale ? `$${product.price.toFixed(2)}` : '$0.00'}
              </span>
            </div>

            {/* Add Button or Quantity Selector */}
            {!isInCart(product.id) ? (
              /* ADD Button - When NOT in cart */
              <button
                onClick={handleAddToCart}
                className="px-5 py-1.5 text-sm font-semibold rounded-lg transition-all cursor-pointer transform hover:scale-105 active:scale-95 border-2"
                style={{
                  backgroundColor: darkMode ? 'transparent' : 'rgba(37, 99, 235, 0.08)',
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  borderColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                }}
                aria-label={`Add ${product.name} to cart`}
              >
                ADD
              </button>
            ) : (
              /* Quantity Selector - When IN cart */
              <div
                className="flex items-center rounded-lg overflow-hidden"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                }}
              >
                {/* Decrease Button */}
                <button
                  onClick={handleDecrease}
                  className="w-8 h-8 flex items-center justify-center transition-all cursor-pointer hover:bg-black/10 active:scale-95"
                  style={{
                    color: '#ffffff',
                  }}
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="h-3.5 w-3.5" />
                </button>

                {/* Quantity Display */}
                <span
                  className="min-w-[1.5rem] text-center font-semibold text-sm"
                  style={{
                    color: '#ffffff',
                  }}
                >
                  {getItemQuantity(product.id)}
                </span>

                {/* Increase Button */}
                <button
                  onClick={handleIncrease}
                  disabled={isAtStockLimit}
                  className={`w-8 h-8 flex items-center justify-center transition-all ${
                    isAtStockLimit
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-black/10 active:scale-95'
                  }`}
                  style={{
                    color: '#ffffff',
                  }}
                  aria-label={isAtStockLimit ? 'Stock limit reached' : 'Increase quantity'}
                >
                  <FiPlus className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
}

export default ProductCard;

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { DEFAULTS, MOTION_VARIANTS, MOTION_TRANSITIONS } from '../constants';
import ProductDetailModal from './ProductDetailModal';

/**
 * ProductCard - Individual product display component
 *
 * Displays a product with image, name, weight/quantity,
 * price, and add to cart functionality in a compact card design.
 * Uses extracted animation constants for better performance.
 *
 * Accessibility: Fully keyboard accessible with proper ARIA attributes.
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
  const { addToCart, removeFromCart, updateQuantity, isInCart, getItemQuantity } = useCart();
  const { showSuccess, showWarning } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get stock limit (default to DEFAULTS.STOCK_LIMIT if not specified)
  const stockLimit = product.stock || DEFAULTS.STOCK_LIMIT;
  const currentQuantity = getItemQuantity(product.id);
  const isAtStockLimit = currentQuantity >= stockLimit;

  // Handle card click to open modal
  const handleCardClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Handle keyboard activation (Enter or Space)
  const handleCardKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent card click

      if (stockLimit <= 0) {
        showWarning(`${product.name} is out of stock`);
        return;
      }

      if (onAddToCart) {
        onAddToCart(product);
        return;
      }

      const result = addToCart(product);

      if (result.success) {
        showSuccess(result.message);
      } else {
        showWarning(result.message);
      }
    },
    [product, stockLimit, onAddToCart, addToCart, showSuccess, showWarning]
  );

  // Handle keyboard activation for add button
  const handleAddToCartKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleAddToCart(e);
      }
    },
    [handleAddToCart]
  );

  // Handle quantity increase
  const handleIncrease = useCallback(
    (e) => {
      e.stopPropagation();

      if (isAtStockLimit) {
        showWarning('Maximum quantity reached');
        return;
      }

      const result = updateQuantity(product.id, currentQuantity + 1);

      if (!result.success) {
        showWarning(result.message);
      } else if (currentQuantity + 1 >= stockLimit) {
        showSuccess('Maximum quantity reached');
      }
    },
    [
      product.id,
      currentQuantity,
      stockLimit,
      isAtStockLimit,
      updateQuantity,
      showSuccess,
      showWarning,
    ]
  );

  // Handle keyboard activation for increase button
  const handleIncreaseKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleIncrease(e);
      }
    },
    [handleIncrease]
  );

  // Handle quantity decrease
  const handleDecrease = useCallback(
    (e) => {
      e.stopPropagation();

      if (currentQuantity > 1) {
        updateQuantity(product.id, currentQuantity - 1);
      } else if (currentQuantity === 1) {
        const result = removeFromCart(product.id);
        if (result.success) {
          showSuccess(result.message);
        }
      }
    },
    [product.id, currentQuantity, updateQuantity, removeFromCart, showSuccess]
  );

  // Handle keyboard activation for decrease button
  const handleDecreaseKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleDecrease(e);
      }
    },
    [handleDecrease]
  );

  // Get display price
  const displayPrice = product.onSale ? product.salePrice : product.price;

  return (
    <>
      <motion.article
        layout
        variants={MOTION_VARIANTS.card}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        transition={MOTION_TRANSITIONS.normal}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}, ${product.onSale ? `on sale for $${displayPrice}` : `$${displayPrice}`}`}
        className="overflow-hidden group cursor-pointer rounded-lg card focus:outline-none focus:ring-2 focus:ring-accent-primary"
        style={{ '--tw-ring-offset-color': 'var(--bg-primary)' }}
      >
        {/* Product Image Container */}
        <div className="relative p-3 flex items-center justify-center bg-theme-tertiary">
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
            <div className="absolute top-2 left-2 badge-sale" aria-label="On sale">
              SALE
            </div>
          )}

          {/* Quantity badge if in cart */}
          {isInCart(product.id) && (
            <div
              className="absolute top-2 right-2 badge-quantity"
              aria-label={`${getItemQuantity(product.id)} in cart`}
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
            <h3 className="text-sm font-medium line-clamp-2 leading-tight text-theme-primary font-sans">
              {product.name}
            </h3>

            {/* Weight/Quantity Info */}
            <p className="text-xs mt-1 text-theme-muted">
              {product.weight || `${product.description?.substring(0, 20)}...`}
            </p>
          </div>

          {/* Price and Add Button Row */}
          <div
            className="flex items-center justify-between mt-1 gap-1"
            style={{ minHeight: '2.75rem' }}
          >
            {/* Price Display */}
            <div className="flex flex-col justify-center shrink-0">
              <span className="font-semibold text-sm sm:text-base text-theme-primary">
                ${displayPrice?.toFixed(2)}
              </span>
              {/* Only show strikethrough when on sale */}
              {product.onSale && (
                <span className="text-xs text-theme-muted line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Add Button or Quantity Selector */}
            {!isInCart(product.id) ? (
              /* ADD Button - When NOT in cart */
              <button
                onClick={handleAddToCart}
                onKeyDown={handleAddToCartKeyDown}
                disabled={stockLimit <= 0}
                className="btn-outline px-3 sm:px-5 py-1.5 text-xs sm:text-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={
                  stockLimit <= 0
                    ? `${product.name} is out of stock`
                    : `Add ${product.name} to cart`
                }
              >
                {stockLimit <= 0 ? 'OUT' : 'ADD'}
              </button>
            ) : (
              /* Quantity Selector - When IN cart */
              <div
                className="flex items-center rounded-lg overflow-hidden shrink-0 bg-accent-primary"
                role="group"
                aria-label={`Quantity controls for ${product.name}`}
              >
                {/* Decrease Button */}
                <button
                  onClick={handleDecrease}
                  onKeyDown={handleDecreaseKeyDown}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all cursor-pointer hover:bg-black/10 active:scale-95 text-white"
                  aria-label={
                    currentQuantity === 1
                      ? `Remove ${product.name} from cart`
                      : `Decrease quantity of ${product.name}`
                  }
                >
                  <FiMinus className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                </button>

                {/* Quantity Display */}
                <span
                  className="min-w-5 sm:min-w-6 text-center font-semibold text-xs sm:text-sm text-white"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {currentQuantity}
                </span>

                {/* Increase Button */}
                <button
                  onClick={handleIncrease}
                  onKeyDown={handleIncreaseKeyDown}
                  disabled={isAtStockLimit}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all text-white ${
                    isAtStockLimit
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:bg-black/10 active:scale-95'
                  }`}
                  aria-label={
                    isAtStockLimit ? 'Stock limit reached' : `Increase quantity of ${product.name}`
                  }
                >
                  <FiPlus className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.article>

      {/* Product Detail Modal */}
      <ProductDetailModal isOpen={isModalOpen} onClose={handleCloseModal} product={product} />
    </>
  );
}

export default ProductCard;

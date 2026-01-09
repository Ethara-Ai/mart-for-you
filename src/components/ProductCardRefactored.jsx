import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../hooks';
import { DEFAULTS, MOTION_VARIANTS, MOTION_TRANSITIONS } from '../constants';
import ProductDetailModal from './ProductDetailModal';
import { QuantitySelector, PriceDisplay } from './common';

/**
 * ProductCard - Individual product display component (Refactored)
 *
 * Displays a product with image, name, price, and cart functionality.
 * Uses extracted common components for better modularity.
 *
 * Improvements:
 * - Uses useAppState facade hook (reduced context dependencies)
 * - Uses PriceDisplay component (reusable price logic)
 * - Uses QuantitySelector component (reusable quantity control)
 * - Cleaner, more focused code
 */
function ProductCard({ product, onAddToCart }) {
  const { cart, toast, theme } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get stock limit
  const stockLimit = product.stock || DEFAULTS.STOCK_LIMIT;
  const currentQuantity = cart.getItemQuantity(product.id);
  const isAtStockLimit = currentQuantity >= stockLimit;
  const isInCart = cart.isInCart(product.id);

  // Modal handlers
  const handleCardClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCardKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Add to cart handler
  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();

      if (stockLimit <= 0) {
        toast.showWarning(`${product.name} is out of stock`);
        return;
      }

      if (onAddToCart) {
        onAddToCart(product);
        return;
      }

      const result = cart.addItem(product);
      if (result.success) {
        toast.showSuccess(result.message);
      } else {
        toast.showWarning(result.message);
      }
    },
    [product, stockLimit, onAddToCart, cart, toast]
  );

  // Quantity handlers
  const handleIncrease = useCallback(
    (e) => {
      e?.stopPropagation();

      if (isAtStockLimit) {
        toast.showWarning('Maximum quantity reached');
        return;
      }

      const result = cart.updateQuantity(product.id, currentQuantity + 1);
      if (!result.success) {
        toast.showWarning(result.message);
      } else if (currentQuantity + 1 >= stockLimit) {
        toast.showSuccess('Maximum quantity reached');
      }
    },
    [product.id, currentQuantity, stockLimit, isAtStockLimit, cart, toast]
  );

  const handleDecrease = useCallback(
    (e) => {
      e?.stopPropagation();

      if (currentQuantity > 1) {
        cart.updateQuantity(product.id, currentQuantity - 1);
      } else if (currentQuantity === 1) {
        const result = cart.removeItem(product.id);
        if (result.success) {
          toast.showSuccess(result.message);
        }
      }
    },
    [product.id, currentQuantity, cart, toast]
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
          {isInCart && (
            <div
              className="absolute top-2 right-2 badge-quantity"
              aria-label={`${currentQuantity} in cart`}
            >
              {currentQuantity}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3">
          {/* Product Name and Weight - Fixed height */}
          <div style={{ minHeight: '3rem' }}>
            <h3 className="text-sm font-medium line-clamp-2 leading-tight text-theme-primary font-sans">
              {product.name}
            </h3>
            <p className="text-xs mt-1 text-theme-muted">
              {product.weight || `${product.description?.substring(0, 20)}...`}
            </p>
          </div>

          {/* Price and Action Row */}
          <div className="flex items-center justify-between mt-1 gap-1">
            {/* Price Display - Using common component */}
            <div style={{ minHeight: '2.75rem' }}>
              <PriceDisplay
                price={product.price}
                salePrice={product.salePrice}
                onSale={product.onSale}
                size="sm"
              />
            </div>

            {/* Add Button or Quantity Selector */}
            {!isInCart ? (
              <button
                onClick={handleAddToCart}
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
              <QuantitySelector
                quantity={currentQuantity}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                max={stockLimit}
                size="sm"
                variant="primary"
                ariaLabel={`Quantity controls for ${product.name}`}
              />
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

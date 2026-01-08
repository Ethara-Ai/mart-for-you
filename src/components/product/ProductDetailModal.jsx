import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiPackage,
  FiTruck,
  FiShield,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

/**
 * Generate default specifications based on product data
 */
const generateSpecifications = (product) => {
  // Category-specific defaults
  const categoryDefaults = {
    electronics: {
      type: 'Electronic Device',
      boxContent: `1x ${product.name}, User Manual, Warranty Card, Charging Cable`,
      model: `${product.name.replace(/\s+/g, '-').toUpperCase()}-${product.id}`,
      colour: 'Black / Silver',
      warranty: '1 Year Manufacturer Warranty',
    },
    fashion: {
      type: 'Fashion Accessory',
      boxContent: `1x ${product.name}, Dust Bag, Care Instructions`,
      model: `FA-${product.id}${new Date().getFullYear()}`,
      colour: 'As shown in image',
      warranty: '6 Months Warranty on Manufacturing Defects',
    },
    home: {
      type: 'Home & Kitchen Product',
      boxContent: `1x ${product.name}, Assembly Instructions (if applicable), Warranty Card`,
      model: `HK-${product.id}-${new Date().getFullYear()}`,
      colour: 'As per listing',
      warranty: '1 Year Warranty',
    },
    beauty: {
      type: 'Beauty & Personal Care',
      boxContent: `${product.name} with packaging, Usage Instructions`,
      model: `BP-${product.id}`,
      colour: 'N/A',
      warranty: 'Check expiry date on packaging',
    },
    sports: {
      type: 'Sports & Fitness Equipment',
      boxContent: `1x ${product.name}, Carrying Pouch (if applicable), User Guide`,
      model: `SF-${product.id}-PRO`,
      colour: 'As shown in image',
      warranty: '6 Months Warranty',
    },
    food: {
      type: 'Food & Beverages',
      boxContent: `${product.name} in sealed packaging`,
      model: 'N/A',
      colour: 'N/A',
      warranty: 'Best before date on packaging',
    },
    books: {
      type: 'Books & Stationery',
      boxContent: `${product.name}`,
      model: `ISBN-${product.id}${Math.floor(Math.random() * 10000)}`,
      colour: 'N/A',
      warranty: 'N/A - Non-returnable if sealed',
    },
    toys: {
      type: 'Toys & Games',
      boxContent: `${product.name}, Assembly Instructions (if required)`,
      model: `TG-${product.id}-${new Date().getFullYear()}`,
      colour: 'Multi-color / As shown',
      warranty: '3 Months Warranty on Manufacturing Defects',
    },
  };

  const defaults = categoryDefaults[product.category] || {
    type: 'General Product',
    boxContent: `1x ${product.name}`,
    model: `GP-${product.id}`,
    colour: 'As shown',
    warranty: 'Standard Warranty Applicable',
  };

  return {
    description: product.description || 'High-quality product designed to meet your needs.',
    boxContent: product.boxContent || defaults.boxContent,
    model: product.model || defaults.model,
    colour: product.colour || defaults.colour,
    type: product.type || defaults.type,
    serviceCenterDetails:
      product.serviceCenterDetails ||
      'For service center locations, please visit our website or contact customer care.',
    customerCareDetails:
      product.customerCareDetails ||
      'Customer Care: 1800-XXX-XXXX (Toll Free)\nEmail: support@martforyou.com\nWorking Hours: Mon-Sat, 9 AM - 6 PM',
    disclaimer:
      product.disclaimer ||
      'Product color may slightly vary due to photographic lighting or your monitor settings. Please check specifications before purchasing.',
    countryOfOrigin: product.countryOfOrigin || 'Imported / Made in India',
    warranty: product.warranty || defaults.warranty,
  };
};

/**
 * SpecItem - Specification item display component
 */
function SpecItem({ label, value, borderColor, subtextColor, textColor }) {
  return (
    <div className="py-3 border-b" style={{ borderColor }}>
      <dt
        className="text-xs font-medium uppercase tracking-wider mb-1"
        style={{ color: subtextColor }}
      >
        {label}
      </dt>
      <dd className="text-sm whitespace-pre-line" style={{ color: textColor }}>
        {value}
      </dd>
    </div>
  );
}

/**
 * ProductDetailModal - Detailed product view modal
 *
 * Displays comprehensive product information including:
 * - Large product image
 * - Full description
 * - Price details
 * - Category and sale information
 * - Add to cart / Quantity controls
 * - Product features and benefits
 * - Expandable specifications section
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Callback to close modal
 * @param {Object} props.product - Product data object
 */
function ProductDetailModal({ isOpen, onClose, product }) {
  const { darkMode, COLORS } = useTheme();
  const { addToCart, removeFromCart, updateQuantity, isInCart, getItemQuantity } = useCart();
  const { showSuccess } = useToast();
  const [showSpecifications, setShowSpecifications] = useState(false);
  const specificationsRef = useRef(null);
  const modalContentRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Lock both html and body to prevent all scroll scenarios
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.bottom = '0';
      document.body.style.overflow = 'hidden';
      // Prevent layout shift from scrollbar disappearing
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.bottom = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Auto-scroll to specifications when expanded
  useEffect(() => {
    if (showSpecifications && specificationsRef.current && modalContentRef.current) {
      // Small delay to allow the animation to start
      setTimeout(() => {
        specificationsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [showSpecifications]);

  // Handle specifications toggle with scroll
  const handleSpecificationsToggle = () => {
    setShowSpecifications((prev) => !prev);
  };

  if (!product) return null;

  // Generate specifications for the product
  const specifications = generateSpecifications(product);

  // Get stock limit
  const stockLimit = product.stock || 10;
  const currentQuantity = getItemQuantity(product.id);
  const isAtStockLimit = currentQuantity >= stockLimit;

  // Handle add to cart
  const handleAddToCart = () => {
    if (stockLimit <= 0) {
      showSuccess(`${product.name} is out of stock`);
      return;
    }
    addToCart(product);
    showSuccess(`${product.name} added to cart`);
  };

  // Handle quantity increase
  const handleIncrease = () => {
    if (isAtStockLimit) {
      showSuccess('Maximum quantity reached');
      return;
    }
    const newQuantity = currentQuantity + 1;
    updateQuantity(product.id, newQuantity);
    // Show toast when reaching maximum quantity
    if (newQuantity >= stockLimit) {
      showSuccess('Maximum quantity reached');
    }
  };

  // Handle quantity decrease
  const handleDecrease = () => {
    if (currentQuantity > 1) {
      updateQuantity(product.id, currentQuantity - 1);
    } else if (currentQuantity === 1) {
      removeFromCart(product.id);
      showSuccess(`${product.name} removed from cart`);
    }
  };

  // Calculate savings
  const savings = product.onSale ? (product.price - product.salePrice).toFixed(2) : 0;
  const savingsPercent = product.onSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const borderColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const bgColor = darkMode ? COLORS.dark.modalBackground : COLORS.light.modalBackground;
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const secondaryBg = darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            style={{ overscrollBehavior: 'contain' }}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl max-h-[90vh] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Positioned outside/above the card */}
              <button
                onClick={onClose}
                className="absolute -top-2 -right-2 z-10 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: darkMode
                    ? COLORS.dark.modalBackground
                    : COLORS.light.modalBackground,
                  color: textColor,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
                aria-label="Close"
              >
                <FiX className="h-6 w-6" />
              </button>

              <div
                ref={modalContentRef}
                className="rounded-lg shadow-2xl overflow-hidden overflow-y-auto"
                style={{ backgroundColor: bgColor, overscrollBehavior: 'contain' }}
              >
                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
                  {/* Left Column - Image */}
                  <div className="relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Badges on Image */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className="px-3 py-1 text-xs font-medium rounded-full capitalize"
                        style={{
                          backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.secondary,
                          color: darkMode ? COLORS.dark.background : COLORS.light.primary,
                        }}
                      >
                        {product.category}
                      </span>
                      {product.onSale && (
                        <span
                          className="px-3 py-1 text-xs font-bold rounded-full"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                            color: '#ffffff',
                          }}
                        >
                          SALE {savingsPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* In Cart Badge */}
                    {isInCart(product.id) && (
                      <div
                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                          color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                        }}
                      >
                        {getItemQuantity(product.id)} in cart
                      </div>
                    )}
                  </div>

                  {/* Right Column - Details */}
                  <div className="flex flex-col">
                    {/* Product Name */}
                    <h2
                      className="text-2xl md:text-3xl font-bold mb-2"
                      style={{
                        color: textColor,
                        fontFamily: "'Metropolis', sans-serif",
                      }}
                    >
                      {product.name}
                    </h2>

                    {/* Description */}
                    <p
                      className="text-base mb-4"
                      style={{
                        color: subtextColor,
                        fontFamily: "'Metropolis', sans-serif",
                      }}
                    >
                      {product.description}
                    </p>

                    {/* Price Section */}
                    <div className="mb-6 pb-6 border-b" style={{ borderColor }}>
                      {product.onSale ? (
                        <div>
                          <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-3xl font-bold" style={{ color: primaryColor }}>
                              ${product.salePrice.toFixed(2)}
                            </span>
                            <span className="text-xl line-through" style={{ color: subtextColor }}>
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm" style={{ color: 'rgb(34, 197, 94)' }}>
                            You save ${savings} ({savingsPercent}% off)
                          </p>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold" style={{ color: textColor }}>
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart / Quantity Section */}
                    <div className="mb-6">
                      {!isInCart(product.id) ? (
                        <button
                          onClick={handleAddToCart}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                          style={{
                            backgroundColor: primaryColor,
                            color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          }}
                        >
                          <FiShoppingCart className="h-5 w-5" />
                          Add to Cart
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleDecrease}
                              className="w-12 h-12 flex items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95"
                              style={{
                                backgroundColor: darkMode
                                  ? COLORS.dark.secondary
                                  : COLORS.light.secondary,
                                color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              }}
                            >
                              <FiMinus className="h-5 w-5" />
                            </button>

                            <div
                              className="flex-1 h-12 flex items-center justify-center rounded-lg font-bold text-xl"
                              style={{
                                backgroundColor: darkMode
                                  ? 'rgba(255, 255, 255, 0.05)'
                                  : 'rgba(0, 0, 0, 0.05)',
                                color: textColor,
                              }}
                            >
                              {getItemQuantity(product.id)}
                            </div>

                            <button
                              onClick={handleIncrease}
                              disabled={isAtStockLimit}
                              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                                isAtStockLimit
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'hover:scale-110 active:scale-95'
                              }`}
                              style={{
                                backgroundColor: primaryColor,
                                color: darkMode
                                  ? COLORS.dark.modalBackground
                                  : COLORS.light.background,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              }}
                              aria-label={
                                isAtStockLimit ? 'Stock limit reached' : 'Increase quantity'
                              }
                            >
                              <FiPlus className="h-5 w-5" />
                            </button>
                          </div>
                          <p className="text-sm text-center" style={{ color: subtextColor }}>
                            Total: $
                            {(
                              (product.onSale ? product.salePrice : product.price) *
                              getItemQuantity(product.id)
                            ).toFixed(2)}
                          </p>
                          {isAtStockLimit && (
                            <p
                              className="text-xs text-center mt-1"
                              style={{ color: 'rgb(239, 68, 68)' }}
                            >
                              Max {stockLimit} items per order
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Specifications Toggle Button */}
                    <button
                      onClick={handleSpecificationsToggle}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg mb-4 transition-all hover:opacity-90"
                      style={{
                        backgroundColor: secondaryBg,
                        color: textColor,
                        border: `1px solid ${borderColor}`,
                      }}
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <FiInfo className="h-5 w-5" style={{ color: primaryColor }} />
                        Product Specifications
                      </span>
                      {showSpecifications ? (
                        <FiChevronUp className="h-5 w-5" />
                      ) : (
                        <FiChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {/* Features */}
                    <div className="space-y-3 pt-4 border-t" style={{ borderColor }}>
                      <h3
                        className="text-sm font-semibold uppercase tracking-wider mb-3"
                        style={{ color: textColor }}
                      >
                        Product Benefits
                      </h3>
                      <div className="flex items-start gap-3">
                        <FiPackage
                          className="h-5 w-5 mt-0.5 shrink-0"
                          style={{ color: primaryColor }}
                        />
                        <div>
                          <p className="font-medium text-sm" style={{ color: textColor }}>
                            Free Returns
                          </p>
                          <p className="text-xs" style={{ color: subtextColor }}>
                            30-day return policy
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiTruck
                          className="h-5 w-5 mt-0.5 shrink-0"
                          style={{ color: primaryColor }}
                        />
                        <div>
                          <p className="font-medium text-sm" style={{ color: textColor }}>
                            Fast Shipping
                          </p>
                          <p className="text-xs" style={{ color: subtextColor }}>
                            Multiple delivery options available
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FiShield
                          className="h-5 w-5 mt-0.5 shrink-0"
                          style={{ color: primaryColor }}
                        />
                        <div>
                          <p className="font-medium text-sm" style={{ color: textColor }}>
                            Secure Checkout
                          </p>
                          <p className="text-xs" style={{ color: subtextColor }}>
                            Your data is protected
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specifications Panel - Full Width Below */}
                <AnimatePresence>
                  {showSpecifications && (
                    <motion.div
                      ref={specificationsRef}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 md:px-8 pb-6 md:pb-8 pt-4"
                        style={{ borderTop: `1px solid ${borderColor}` }}
                      >
                        <h3
                          className="text-lg font-bold mb-4 flex items-center gap-2"
                          style={{ color: textColor }}
                        >
                          <FiInfo className="h-5 w-5" style={{ color: primaryColor }} />
                          Product Specifications & Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                          {/* Left Column */}
                          <dl>
                            <SpecItem
                              label="Description"
                              value={specifications.description}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Box Contents"
                              value={specifications.boxContent}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Model Number"
                              value={specifications.model}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Colour"
                              value={specifications.colour}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Type"
                              value={specifications.type}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                          </dl>

                          {/* Right Column */}
                          <dl>
                            <SpecItem
                              label="Service Center Details"
                              value={specifications.serviceCenterDetails}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Customer Care"
                              value={specifications.customerCareDetails}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Warranty"
                              value={specifications.warranty}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Country of Origin"
                              value={specifications.countryOfOrigin}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                            <SpecItem
                              label="Disclaimer"
                              value={specifications.disclaimer}
                              borderColor={borderColor}
                              subtextColor={subtextColor}
                              textColor={textColor}
                            />
                          </dl>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ProductDetailModal;

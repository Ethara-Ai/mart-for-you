import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMenu, FiShoppingCart } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/products';

/**
 * Navigation - Category navigation component
 *
 * Displays category filters, cart button, and offers link.
 * Includes mobile-responsive menu that collapses on smaller screens.
 *
 * @param {Object} props
 * @param {string} props.activeCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Callback when category changes
 * @param {boolean} props.viewingOffers - Whether offers filter is active
 * @param {Function} props.onOffersClick - Callback when offers is clicked
 * @param {Function} props.onCartClick - Callback when cart button is clicked
 */
function Navigation({
  activeCategory = 'all',
  onCategoryChange,
  viewingOffers = false,
  onOffersClick,
  onCartClick,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, COLORS } = useTheme();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef(null);
  const placeholderRef = useRef(null);

  // Handle scroll to determine if nav should be sticky
  useEffect(() => {
    const handleScroll = () => {
      if (placeholderRef.current) {
        const placeholderTop = placeholderRef.current.getBoundingClientRect().top;
        // Stick when placeholder scrolls past the top of viewport
        setIsSticky(placeholderTop <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle category click
  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation();

    if (onCategoryChange) {
      onCategoryChange(category);
    }
    // If on a different page, navigate to products
    if (location.pathname !== '/home' && location.pathname !== '/products') {
      navigate('/products');
    }
    setMobileMenuOpen(false);
  };

  // Handle offers click
  const handleOffersClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onOffersClick) {
      onOffersClick();
    }
    // If on a different page, navigate to products (same as categories)
    if (location.pathname !== '/home' && location.pathname !== '/products') {
      navigate('/products');
    }
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Grey color for inactive items
  const inactiveColor = darkMode ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)';
  // Blue color for active items
  const activeColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;

  // Get button styles
  const getButtonStyles = (isActive) => ({
    color: isActive ? activeColor : inactiveColor,
    borderColor: isActive ? activeColor : 'transparent',
    fontFamily: "'Metropolis', sans-serif",
  });

  return (
    <>
      {/* Placeholder to maintain layout space when nav is fixed */}
      <div ref={placeholderRef} className={isSticky ? 'h-16 sm:h-14' : 'h-0'} />

      <nav
        ref={navRef}
        className={`py-3 sm:py-4 z-50 left-0 right-0 transition-all duration-300 ${isSticky ? 'fixed top-0 shadow-md' : 'relative'}`}
        style={{
          background: isSticky
            ? darkMode
              ? COLORS.dark.backgroundGradient
              : COLORS.light.backgroundGradient
            : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button - Left Side */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
                style={{
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  backgroundColor: darkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(219, 234, 254, 0.3)',
                }}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <FiMenu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>

            {/* Desktop/Tablet Category Navigation */}
            <div className="hidden lg:flex space-x-4 xl:space-x-8 shrink-0">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  onClick={(e) => handleCategoryClick(e, category)}
                  className={`px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium capitalize cursor-pointer transition-all whitespace-nowrap ${
                    activeCategory === category && !viewingOffers ? 'border-b-2' : ''
                  } hover:-translate-y-0.5`}
                  style={getButtonStyles(activeCategory === category && !viewingOffers)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {category}
                </motion.button>
              ))}

              {/* Offers Button */}
              <motion.button
                type="button"
                onClick={(e) => handleOffersClick(e)}
                className={`px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium cursor-pointer transition-all whitespace-nowrap ${
                  viewingOffers ? 'border-b-2' : ''
                } hover:-translate-y-0.5`}
                style={getButtonStyles(viewingOffers)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Offers
              </motion.button>
            </div>

            {/* Tablet View - Compact Categories */}
            <div className="hidden md:flex lg:hidden space-x-2 shrink-0">
              {/* Show only first 4 categories on tablet */}
              {categories.slice(0, 4).map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  onClick={(e) => handleCategoryClick(e, category)}
                  className={`px-2 py-1.5 text-xs font-medium capitalize cursor-pointer transition-all whitespace-nowrap ${
                    activeCategory === category && !viewingOffers ? 'border-b-2' : ''
                  }`}
                  style={getButtonStyles(activeCategory === category && !viewingOffers)}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {category}
                </motion.button>
              ))}

              {/* More button for tablet */}
              <button
                onClick={toggleMobileMenu}
                className="px-2 py-1.5 text-xs font-medium cursor-pointer transition-all whitespace-nowrap"
                style={{
                  color: inactiveColor,
                }}
              >
                More...
              </button>
            </div>

            {/* Cart Button - Right Side (All Screens) */}
            <div className="flex items-center">
              <button
                id="cart-button"
                onClick={onCartClick}
                className="relative w-9 h-9 sm:w-10 sm:h-10 lg:w-10 lg:h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                aria-label={`View shopping cart with ${totalItems} items`}
              >
                <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                      color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                    }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="lg:hidden border-t mt-3"
              style={{
                backgroundColor: darkMode ? COLORS.dark.navbackground : COLORS.light.background,
                borderColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
              }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 max-h-[60vh] overflow-y-auto">
                {categories.map((category, index) => {
                  const isActive = activeCategory === category && !viewingOffers;
                  return (
                    <motion.button
                      key={category}
                      type="button"
                      onClick={(e) => handleCategoryClick(e, category)}
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="block px-3 py-2.5 sm:py-2 rounded-md text-sm sm:text-base font-medium w-full text-left capitalize cursor-pointer transition-all"
                      style={{
                        backgroundColor: isActive
                          ? darkMode
                            ? 'rgba(96, 165, 250, 0.15)'
                            : 'rgba(59, 130, 246, 0.1)'
                          : 'transparent',
                        color: isActive ? activeColor : inactiveColor,
                        fontFamily: "'Metropolis', sans-serif",
                      }}
                    >
                      {category}
                    </motion.button>
                  );
                })}

                {/* Mobile Offers Menu Option */}
                <motion.button
                  type="button"
                  onClick={(e) => handleOffersClick(e)}
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: categories.length * 0.05 }}
                  className="block px-3 py-2.5 sm:py-2 rounded-md text-sm sm:text-base font-medium w-full text-left cursor-pointer transition-all"
                  style={{
                    backgroundColor: viewingOffers
                      ? darkMode
                        ? 'rgba(96, 165, 250, 0.15)'
                        : 'rgba(59, 130, 246, 0.1)'
                      : 'transparent',
                    color: viewingOffers ? activeColor : inactiveColor,
                    fontFamily: "'Metropolis', sans-serif",
                  }}
                >
                  🔥 Offers
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

export default Navigation;

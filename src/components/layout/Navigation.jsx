import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useSearch } from '../../context';
import { categories } from '../../data/products';
import SearchBar from '../common/SearchBar';

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
  const { searchTerm, setSearchTerm, onSearchSubmit, clearSearch } = useSearch();
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
      {/* Placeholder to maintain layout space when nav is fixed (hidden on mobile/tablet) */}
      <div
        ref={placeholderRef}
        className={`hidden lg:block ${isSticky ? 'h-16 sm:h-14' : 'h-0'}`}
      />

      {/* Navigation hidden on mobile/tablet (categories now in sidebar), visible on desktop only */}
      <nav
        ref={navRef}
        className={`hidden lg:block py-3 sm:py-4 z-50 left-0 right-0 transition-all duration-300 ${isSticky ? 'fixed top-0 shadow-md' : 'relative'}`}
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
            {/* Desktop Category Navigation */}
            <div className="flex space-x-1 xl:space-x-3 shrink-0">
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

            {/* Search Bar and Cart Button - Right Side (Only when sticky) */}
            <AnimatePresence>
              {isSticky && (
                <motion.div
                  className="flex items-center gap-2 sm:gap-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Search Bar */}
                  <div className="w-[120px] sm:w-[160px] md:w-[200px] lg:w-[250px]">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      onSubmit={onSearchSubmit}
                      onClear={clearSearch}
                      placeholder="Search..."
                      variant="desktop"
                    />
                  </div>

                  {/* Cart Button */}
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;

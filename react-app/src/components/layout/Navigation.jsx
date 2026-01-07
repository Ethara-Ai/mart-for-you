import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMenu } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { categories } from "../../data/products";
import SearchBar from "../common/SearchBar";

/**
 * Navigation - Category navigation and search component
 *
 * Displays category filters, search bar, and offers link.
 * Includes mobile-responsive menu that collapses on smaller screens.
 *
 * @param {Object} props
 * @param {string} props.activeCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Callback when category changes
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Callback when search changes
 * @param {boolean} props.viewingOffers - Whether offers filter is active
 * @param {Function} props.onOffersClick - Callback when offers is clicked
 */
function Navigation({
  activeCategory = "all",
  onCategoryChange,
  searchTerm = "",
  onSearchChange,
  viewingOffers = false,
  onOffersClick,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, COLORS } = useTheme();
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle category click
  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation();

    if (onCategoryChange) {
      onCategoryChange(category);
    }
    // If on a different page, navigate to products
    if (location.pathname !== "/home" && location.pathname !== "/products") {
      navigate("/products");
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
    if (location.pathname !== "/home" && location.pathname !== "/products") {
      navigate("/products");
    }
    setMobileMenuOpen(false);
  };

  // Handle search change
  const handleSearchChange = (value) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (value) => {
    // Navigate to products page if not already there
    if (location.pathname !== "/home" && location.pathname !== "/products") {
      navigate("/products");
    }
  };

  // Clear search
  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Get button styles
  const getButtonStyles = (isActive) => ({
    color: isActive
      ? darkMode
        ? COLORS.dark.primary
        : COLORS.light.primary
      : darkMode
        ? COLORS.light.background
        : COLORS.light.primary,
    borderColor: isActive
      ? darkMode
        ? COLORS.dark.primary
        : COLORS.light.primary
      : "transparent",
    fontFamily: "'Metropolis', sans-serif",
  });

  return (
    <>
      {/* Placeholder to maintain layout space when nav is fixed */}
      <div ref={placeholderRef} className={isSticky ? "h-14" : "h-0"} />
      
      <nav
        ref={navRef}
        className={`shadow-md py-4 z-50 left-0 right-0 ${
          isSticky ? "fixed top-0" : "relative"
        }`}
        style={{
          background: darkMode
            ? COLORS.dark.backgroundGradient
            : COLORS.light.backgroundGradient,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Desktop Category Navigation */}
          <div className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <motion.button
                key={category}
                type="button"
                onClick={(e) => handleCategoryClick(e, category)}
                className={`px-3 py-2 text-sm font-medium capitalize cursor-pointer transition-all ${
                  activeCategory === category && !viewingOffers
                    ? "border-b-2"
                    : ""
                } hover:-translate-y-0.5`}
                style={getButtonStyles(
                  activeCategory === category && !viewingOffers,
                )}
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
              className={`px-3 py-2 text-sm font-medium cursor-pointer transition-all ${
                viewingOffers ? "border-b-2" : ""
              } hover:-translate-y-0.5`}
              style={getButtonStyles(viewingOffers)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              Offers
            </motion.button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block grow max-w-md mx-4">
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
              onClear={handleClearSearch}
              placeholder="Search products..."
              variant="desktop"
            />
          </div>

          {/* Mobile Search and Menu */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md cursor-pointer transform hover:scale-105 active:scale-95"
              style={{
                color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                backgroundColor: darkMode
                  ? "rgba(30, 41, 59, 0.3)"
                  : "rgba(219, 234, 254, 0.3)",
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>

            {/* Mobile Search */}
            <div className="relative" style={{ width: "220px" }}>
              <SearchBar
                value={searchTerm}
                onChange={handleSearchChange}
                onSubmit={handleSearchSubmit}
                onClear={handleClearSearch}
                placeholder="Search..."
                variant="mobile"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t"
            style={{
              backgroundColor: darkMode
                ? COLORS.dark.navbackground
                : COLORS.light.background,
              borderColor: darkMode
                ? COLORS.dark.secondary
                : COLORS.light.secondary,
            }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  type="button"
                  onClick={(e) => handleCategoryClick(e, category)}
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left capitalize cursor-pointer transition-all ${
                    activeCategory === category && !viewingOffers
                      ? "bg-opacity-20"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      activeCategory === category && !viewingOffers
                        ? darkMode
                          ? COLORS.dark.primary
                          : COLORS.light.secondary
                        : "transparent",
                    color: darkMode
                      ? COLORS.light.background
                      : COLORS.light.primary,
                    fontFamily: "'Metropolis', sans-serif",
                  }}
                >
                  {category}
                </motion.button>
              ))}

              {/* Mobile Offers Menu Option */}
              <motion.button
                type="button"
                onClick={(e) => handleOffersClick(e)}
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: categories.length * 0.05 }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left cursor-pointer transition-all ${
                  viewingOffers ? "bg-opacity-20" : ""
                }`}
                style={{
                  backgroundColor: viewingOffers
                    ? darkMode
                      ? COLORS.dark.primary
                      : COLORS.light.secondary
                    : "transparent",
                  color: darkMode
                    ? COLORS.light.background
                    : COLORS.light.primary,
                  fontFamily: "'Metropolis', sans-serif",
                }}
              >
                Offers
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

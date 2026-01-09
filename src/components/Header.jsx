import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiEdit, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context';
import Logo from './Logo';
import SearchBar from './SearchBar';
import MobileSidebar from './MobileSidebar';
import { ROUTES, SECTION_IDS } from '../constants';

/**
 * Header - Main application header component
 *
 * Contains the brand logo, search bar, dark mode toggle, cart button, and user profile button.
 * Sticky positioned at the top of the page.
 * On mobile: Profile icon → Logo → Search → Cart (no theme toggle, profile opens sidebar)
 *
 * Now consumes contexts directly instead of receiving props (removing prop drilling).
 */
function Header() {
  const navigate = useNavigate();

  // Theme context
  const { darkMode, toggleDarkMode, COLORS } = useTheme();

  // Cart context - now includes modal state
  const { totalItems, openCart } = useCart();

  // Profile context
  const {
    userProfile,
    isProfileCardOpen,
    toggleProfileCard,
    closeProfileCard,
    fullName,
    formattedAddress,
  } = useProfile();

  // Search context - consumed directly instead of props
  const { searchTerm, setSearchTerm, onSearchSubmit, clearSearch } = useSearch();

  // Filter context - no longer needed in Header since MobileSidebar uses it directly
  // Keeping unused import for now as it may be needed elsewhere

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mobile search expanded state
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);

  // Handle click outside to close profile card
  useEffect(() => {
    const handleClickOutside = (e) => {
      const { target } = e;
      if (
        isProfileCardOpen &&
        !target.closest(`#${SECTION_IDS.PROFILE_CARD}`) &&
        !target.closest('#profile-photo-button')
      ) {
        closeProfileCard();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileCardOpen, closeProfileCard]);

  // Handle mobile profile icon click - opens sidebar on mobile
  const handleMobileProfileClick = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  // Close mobile sidebar
  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Expand mobile search
  const expandMobileSearch = useCallback(() => {
    setIsMobileSearchExpanded(true);
  }, []);

  // Collapse mobile search
  const collapseMobileSearch = useCallback(() => {
    setIsMobileSearchExpanded(false);
  }, []);

  // Handle mobile search submit - collapse after search
  const handleMobileSearchSubmit = useCallback(
    (value) => {
      if (onSearchSubmit) {
        onSearchSubmit(value);
      }
      collapseMobileSearch();
    },
    [onSearchSubmit, collapseMobileSearch]
  );

  // Handle mobile search clear - collapse after clear
  const handleMobileSearchClear = useCallback(() => {
    if (clearSearch) {
      clearSearch();
    }
    collapseMobileSearch();
  }, [clearSearch, collapseMobileSearch]);

  // Handle logo click - navigate to home
  const handleLogoClick = useCallback(() => {
    navigate(ROUTES.HOME);
  }, [navigate]);

  // Handle edit profile click
  const handleEditProfile = useCallback(() => {
    closeProfileCard();
    navigate(ROUTES.PROFILE);
  }, [closeProfileCard, navigate]);

  // Handle cart click
  const handleCartClick = useCallback(() => {
    openCart();
  }, [openCart]);

  return (
    <>
      <header
        className="shadow-xs sticky top-0 z-60"
        style={{
          background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        }}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Mobile/Tablet Layout: [Profile + Logo] on left, [Search + Cart] on right */}
          <div className="flex lg:hidden justify-between h-14 sm:h-16 items-center relative">
            {/* Expanded Search Overlay - Shows when search is active */}
            <AnimatePresence>
              {isMobileSearchExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute inset-0 flex items-center gap-2 sm:gap-3 z-10 px-1"
                  style={{
                    background: darkMode
                      ? COLORS.dark.backgroundGradient
                      : COLORS.light.backgroundGradient,
                  }}
                >
                  {/* Back Button */}
                  <button
                    onClick={collapseMobileSearch}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
                    style={{
                      backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                      color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                    }}
                    aria-label="Close search"
                  >
                    <FiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {/* Expanded Search Bar */}
                  <div className="flex-1">
                    <SearchBar
                      value={searchTerm}
                      onChange={setSearchTerm}
                      onSubmit={handleMobileSearchSubmit}
                      onClear={handleMobileSearchClear}
                      placeholder="Search products..."
                      variant="desktop"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Left Group: Profile + Logo */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 md:gap-3"
              style={{ opacity: isMobileSearchExpanded ? 0 : 1 }}
            >
              {/* Profile Photo Button (Mobile/Tablet - Opens Sidebar) */}
              <button
                id="mobile-profile-button"
                onClick={handleMobileProfileClick}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden transition-transform cursor-pointer transform hover:scale-105 active:scale-95 border-2 shrink-0"
                style={{
                  borderColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                aria-label="Open menu"
              >
                <img
                  src={userProfile.avatar}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Logo (Mobile/Tablet) */}
              <div className="flex items-center shrink-0">
                {/* Extra small logo for screens < 360px */}
                <div className="block min-[360px]:hidden">
                  <Logo onClick={handleLogoClick} size="xs" animate={false} />
                </div>
                {/* Small logo for screens >= 360px and < 768px */}
                <div className="hidden min-[360px]:block md:hidden">
                  <Logo onClick={handleLogoClick} size="sm" animate={false} />
                </div>
                {/* Medium logo for tablet (768px+) */}
                <div className="hidden md:block">
                  <Logo onClick={handleLogoClick} size="md" animate={false} />
                </div>
              </div>
            </div>

            {/* Right Group: Search + Cart */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 md:gap-3"
              style={{ opacity: isMobileSearchExpanded ? 0 : 1 }}
            >
              {/* Mini Search Bar (Mobile/Tablet) - Expands on focus */}
              <button
                onClick={expandMobileSearch}
                className="w-25 min-[360px]:w-30 sm:w-35 md:w-50 flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer text-left"
                style={{
                  backgroundColor: darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                  boxShadow: darkMode
                    ? '0 1px 3px rgba(0, 0, 0, 0.3)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: darkMode ? 'rgba(100, 116, 139, 0.5)' : 'transparent',
                }}
                aria-label="Open search"
              >
                <span className="text-sm truncate flex-1">{searchTerm || 'Search...'}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={darkMode ? COLORS.dark.primary : COLORS.light.primary}
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Cart Button (Mobile/Tablet) */}
              <button
                id="mobile-cart-button"
                onClick={handleCartClick}
                className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                aria-label={`View shopping cart with ${totalItems} items`}
              >
                <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-4 h-4 sm:min-w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-full px-1"
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

          {/* Desktop Layout: Logo | Search | Theme + Cart + Profile */}
          <div className="hidden lg:flex justify-between h-16 items-center">
            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
              <Logo onClick={handleLogoClick} size="lg" animate={false} />
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSubmit={onSearchSubmit}
                onClear={clearSearch}
                placeholder="Search products..."
                variant="desktop"
              />
            </div>

            {/* Right: Theme + Cart + Profile */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>

              {/* Cart Button */}
              <button
                id="desktop-cart-button"
                onClick={handleCartClick}
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                aria-label={`View shopping cart with ${totalItems} items`}
              >
                <FiShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full px-1"
                    style={{
                      backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                      color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                    }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Profile Photo Button (Desktop) */}
              <div className="relative">
                <button
                  id="profile-photo-button"
                  onClick={toggleProfileCard}
                  className="w-10 h-10 rounded-full overflow-hidden transition-transform cursor-pointer transform hover:scale-105 active:scale-95 border-2"
                  style={{
                    borderColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  aria-label="Toggle profile card"
                  aria-expanded={isProfileCardOpen}
                >
                  <img
                    src={userProfile.avatar}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Card Dropdown */}
                <AnimatePresence>
                  {isProfileCardOpen && (
                    <motion.div
                      id={SECTION_IDS.PROFILE_CARD}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl overflow-hidden z-50"
                      style={{
                        backgroundColor: darkMode
                          ? COLORS.dark.modalBackground
                          : COLORS.light.modalBackground,
                        boxShadow: darkMode
                          ? '0 10px 40px rgba(0, 0, 0, 0.5)'
                          : '0 10px 40px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {/* Profile Header */}
                      <div
                        className="p-4 flex items-center gap-3 border-b"
                        style={{
                          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <img
                          src={userProfile.avatar}
                          alt="User profile"
                          className="w-14 h-14 rounded-full object-cover border-2"
                          style={{
                            borderColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold truncate"
                            style={{
                              color: darkMode ? COLORS.dark.text : COLORS.light.text,
                            }}
                          >
                            {fullName}
                          </h3>
                          <p
                            className="text-sm truncate"
                            style={{
                              color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                            }}
                          >
                            {userProfile.email}
                          </p>
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="p-4">
                        <p
                          className="text-sm mb-3"
                          style={{
                            color: darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)',
                          }}
                        >
                          {formattedAddress}
                        </p>
                        <button
                          onClick={handleEditProfile}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] font-medium text-sm"
                          style={{
                            backgroundColor: darkMode
                              ? 'rgba(96, 165, 250, 0.1)'
                              : 'rgba(37, 99, 235, 0.1)',
                            color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                            border: `1px solid ${
                              darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.3)'
                            }`,
                          }}
                        >
                          <FiEdit className="h-4 w-4" />
                          Edit Profile
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar - now uses FilterContext directly */}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={closeMobileSidebar} />
    </>
  );
}

export default Header;

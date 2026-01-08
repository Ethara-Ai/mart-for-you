import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiSun, FiEdit, FiShoppingCart } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useProfile } from '../../context/ProfileContext';
import { useCart } from '../../context/CartContext';
import Logo from './Logo';
import SearchBar from '../common/SearchBar';
import MobileSidebar from './MobileSidebar';

/**
 * Header - Main application header component
 *
 * Contains the brand logo, search bar, dark mode toggle, cart button, and user profile button.
 * Sticky positioned at the top of the page.
 * On mobile: Profile icon → Logo → Search → Cart (no theme toggle, profile opens sidebar)
 *
 * @param {Object} props
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onSearchChange - Callback when search changes
 * @param {Function} props.onSearchSubmit - Callback when search is submitted
 * @param {Function} props.onSearchClear - Callback when search is cleared
 * @param {Function} props.onCartClick - Callback when cart button is clicked
 * @param {string} props.activeCategory - Currently selected category (for mobile sidebar)
 * @param {Function} props.onCategoryChange - Callback when category changes (for mobile sidebar)
 * @param {boolean} props.viewingOffers - Whether offers filter is active (for mobile sidebar)
 * @param {Function} props.onOffersClick - Callback when offers is clicked (for mobile sidebar)
 */
function Header({
  searchTerm = '',
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onCartClick,
  activeCategory,
  onCategoryChange,
  viewingOffers,
  onOffersClick,
}) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, COLORS } = useTheme();
  const { totalItems } = useCart();
  const {
    userProfile,
    isProfileCardOpen,
    toggleProfileCard,
    closeProfileCard,
    getFullName,
    getFormattedAddress,
  } = useProfile();

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle mobile profile icon click - opens sidebar on mobile
  const handleMobileProfileClick = () => {
    setIsMobileSidebarOpen(true);
  };

  // Close mobile sidebar
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Handle logo click - navigate to home
  const handleLogoClick = () => {
    navigate('/home');
  };

  // Handle edit profile click
  const handleEditProfile = () => {
    closeProfileCard();
    navigate('/profile');
  };

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
          <div className="flex lg:hidden justify-between h-14 sm:h-16 items-center">
            {/* Left Group: Profile + Logo */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
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

              {/* Logo (Mobile/Tablet) - xs size for very small screens, sm for larger mobile, md for tablet */}
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
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              {/* Search Bar (Mobile/Tablet) - responsive width */}
              <div className="w-[100px] min-[360px]:w-[120px] sm:w-[140px] md:w-[200px]">
                <SearchBar
                  value={searchTerm}
                  onChange={onSearchChange}
                  onSubmit={onSearchSubmit}
                  onClear={onSearchClear}
                  placeholder="Search..."
                  variant="desktop"
                />
              </div>

              {/* Cart Button (Mobile/Tablet) */}
              <button
                id="mobile-cart-button"
                onClick={onCartClick}
                className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                aria-label={`View shopping cart with ${totalItems} items`}
              >
                <FiShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 md:w-5 md:h-5 text-xs font-bold rounded-full"
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

          {/* Desktop Layout (1024px+) */}
          <div className="hidden lg:flex justify-between h-16 items-center gap-4">
            {/* Logo - More prominent on desktop */}
            <div className="flex items-center flex-shrink-0">
              <Logo onClick={handleLogoClick} size="md" animate={false} />
            </div>

            {/* Actions - Search, Dark Mode Toggle, Cart, Profile */}
            <div className="flex items-center space-x-3 md:space-x-4 flex-1 justify-end">
              {/* Search Bar */}
              <div className="flex-1 max-w-[200px] md:max-w-[280px] lg:max-w-[350px]">
                <SearchBar
                  value={searchTerm}
                  onChange={onSearchChange}
                  onSubmit={onSearchSubmit}
                  onClear={onSearchClear}
                  placeholder="Search..."
                  variant="desktop"
                />
              </div>

              {/* Dark Mode Toggle (Desktop/Tablet only) */}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: darkMode ? COLORS.dark.secondary : COLORS.light.secondary,
                  color: darkMode ? COLORS.light.background : COLORS.light.primary,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>

              {/* Cart Button */}
              <button
                id="header-cart-button"
                onClick={onCartClick}
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
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                    style={{
                      backgroundColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                      color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
                    }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Profile Photo Button (Desktop/Tablet - Shows Dropdown) */}
              <div className="relative flex items-center justify-center">
                <button
                  id="profile-photo-button"
                  onClick={toggleProfileCard}
                  className="w-10 h-10 rounded-full overflow-hidden transition-transform cursor-pointer transform hover:scale-105 active:scale-95 border-2"
                  style={{
                    borderColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  aria-label="View profile"
                  aria-expanded={isProfileCardOpen}
                >
                  <img
                    src={userProfile.avatar}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Profile Card Dropdown (Desktop/Tablet only) */}
                <AnimatePresence>
                  {isProfileCardOpen && (
                    <motion.div
                      id="profile-card"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-lg shadow-lg z-100"
                      style={{
                        backgroundColor: darkMode
                          ? COLORS.dark.modalBackground
                          : COLORS.light.modalBackground,
                        boxShadow: darkMode
                          ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                          : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                              src={userProfile.avatar}
                              alt="User profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-medium text-base truncate"
                              style={{
                                color: darkMode ? COLORS.dark.text : COLORS.light.text,
                              }}
                            >
                              {getFullName()}
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
                          <button
                            id="edit-profile-button"
                            onClick={handleEditProfile}
                            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer shrink-0"
                            style={{
                              color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                            }}
                            aria-label="Edit profile"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                        </div>

                        <div
                          className="space-y-2 text-sm border-t pt-3"
                          style={{
                            borderColor: darkMode
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <div>
                            <span
                              className="font-medium block"
                              style={{
                                color: darkMode ? COLORS.dark.text : COLORS.light.text,
                              }}
                            >
                              Address:
                            </span>
                            <span
                              style={{
                                color: darkMode
                                  ? 'rgba(224, 224, 224, 0.7)'
                                  : 'rgba(51, 51, 51, 0.7)',
                              }}
                            >
                              {getFormattedAddress()}
                            </span>
                          </div>
                          <div>
                            <span
                              className="font-medium block"
                              style={{
                                color: darkMode ? COLORS.dark.text : COLORS.light.text,
                              }}
                            >
                              Phone:
                            </span>
                            <span
                              style={{
                                color: darkMode
                                  ? 'rgba(224, 224, 224, 0.7)'
                                  : 'rgba(51, 51, 51, 0.7)',
                              }}
                            >
                              {userProfile.phone}
                            </span>
                          </div>
                        </div>

                        {/* View Full Profile Link */}
                        <div
                          className="mt-3 pt-3 border-t"
                          style={{
                            borderColor: darkMode
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <Link
                            to="/profile"
                            onClick={closeProfileCard}
                            className="block text-center text-sm font-medium py-2 rounded-md transition-colors hover:opacity-80"
                            style={{
                              color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                            }}
                          >
                            View Full Profile
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        viewingOffers={viewingOffers}
        onOffersClick={onOffersClick}
      />
    </>
  );
}

export default Header;

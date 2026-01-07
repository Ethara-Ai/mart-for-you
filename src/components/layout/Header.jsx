import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiMoon, FiSun, FiEdit } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useProfile } from '../../context/ProfileContext';
import Logo from './Logo';

/**
 * Header - Main application header component
 *
 * Contains the brand logo, dark mode toggle, user profile button,
 * and shopping cart button. Sticky positioned at the top of the page.
 *
 * @param {Object} props
 * @param {Function} props.onCartClick - Callback when cart button is clicked
 */
function Header({ onCartClick }) {
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
    <header
      className="shadow-xs sticky top-0 z-60"
      style={{
        background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Logo onClick={handleLogoClick} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
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

            {/* Profile Photo Button */}
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

              {/* Profile Card Dropdown */}
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
                          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
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
                          borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
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

            {/* Cart button */}
            <button
              id="cart-button"
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

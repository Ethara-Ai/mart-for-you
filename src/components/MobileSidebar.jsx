import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit, FiMoon, FiSun, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import { categories } from '../data/products';

/**
 * MobileSidebar - Left-side mobile navigation sidebar
 *
 * Contains profile section, theme toggle, and categories dropdown.
 * Opens from the left side with 70% viewport width.
 * Only visible on mobile screens.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the sidebar is open
 * @param {Function} props.onClose - Callback when sidebar should close
 * @param {string} props.activeCategory - Currently selected category
 * @param {Function} props.onCategoryChange - Callback when category changes
 * @param {boolean} props.viewingOffers - Whether offers filter is active
 * @param {Function} props.onOffersClick - Callback when offers is clicked
 */
function MobileSidebar({
  isOpen,
  onClose,
  activeCategory = 'all',
  onCategoryChange,
  viewingOffers = false,
  onOffersClick,
}) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, COLORS } = useTheme();
  const { userProfile, closeProfileCard, getFullName, getFormattedAddress } = useProfile();

  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // Disable body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle edit profile click
  const handleEditProfile = () => {
    closeProfileCard();
    onClose();
    navigate('/profile');
  };

  // Handle view full profile click
  const handleViewProfile = () => {
    onClose();
    navigate('/profile');
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    onClose();
  };

  // Handle offers click
  const handleOffersClick = () => {
    if (onOffersClick) {
      onOffersClick();
    }
    onClose();
  };

  // Toggle categories dropdown
  const toggleCategories = () => {
    setCategoriesExpanded((prev) => !prev);
  };

  // Grey color for inactive items
  const inactiveColor = darkMode ? 'rgba(156, 163, 175, 1)' : 'rgba(107, 114, 128, 1)';
  // Blue color for active items
  const activeColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;

  // Sidebar animation variants
  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  // Overlay animation variants
  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Background */}
          <motion.div
            className="fixed inset-0 z-100 md:hidden"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.aside
            className="fixed top-0 left-0 h-full z-101 md:hidden mobile-sidebar-scroll"
            style={{
              width: '70%',
              maxWidth: '320px',
              backgroundColor: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
            }}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Sidebar Content Container */}
            <div className="h-full flex flex-col">
              {/* Header with Close Button */}
              <div
                className="flex items-center justify-between p-4 border-b shrink-0"
                style={{
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }}
              >
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: darkMode ? COLORS.dark.text : COLORS.light.text,
                    fontFamily: "'Metropolis', sans-serif",
                  }}
                >
                  Menu
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    color: darkMode ? COLORS.dark.text : COLORS.light.text,
                  }}
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto mobile-sidebar-content">
                {/* Section 1: Profile Section */}
                <div
                  className="p-4 border-b"
                  style={{
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-14 h-14 rounded-full overflow-hidden border-2 shrink-0"
                      style={{
                        borderColor: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                      }}
                    >
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
                        className="text-xs"
                        style={{
                          color: darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)',
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
                          color: darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)',
                        }}
                      >
                        {userProfile.phone}
                      </span>
                    </div>
                  </div>

                  {/* View Full Profile Link */}
                  <button
                    onClick={handleViewProfile}
                    className="w-full text-center text-sm font-medium py-2 mt-3 rounded-md transition-colors hover:opacity-80 cursor-pointer"
                    style={{
                      color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                      backgroundColor: darkMode
                        ? 'rgba(96, 165, 250, 0.1)'
                        : 'rgba(37, 99, 235, 0.1)',
                    }}
                  >
                    View Full Profile
                  </button>
                </div>

                {/* Section 2: Theme Toggle */}
                <div
                  className="p-4 border-b"
                  style={{
                    borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors cursor-pointer"
                    style={{
                      backgroundColor: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-9 h-9 flex items-center justify-center rounded-full"
                        style={{
                          backgroundColor: darkMode
                            ? COLORS.dark.secondary
                            : COLORS.light.secondary,
                          color: darkMode ? COLORS.light.background : COLORS.light.primary,
                        }}
                      >
                        {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                      </div>
                      <span
                        className="font-medium"
                        style={{
                          color: darkMode ? COLORS.dark.text : COLORS.light.text,
                        }}
                      >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </div>
                    <div
                      className="w-11 h-6 rounded-full p-1 transition-colors"
                      style={{
                        backgroundColor: darkMode
                          ? COLORS.dark.primary
                          : 'rgba(156, 163, 175, 0.5)',
                      }}
                    >
                      <motion.div
                        className="w-4 h-4 rounded-full bg-white"
                        animate={{
                          x: darkMode ? 20 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    </div>
                  </button>
                </div>

                {/* Section 3: Categories Menu */}
                <div className="p-4">
                  {/* Categories Header (Dropdown Toggle) */}
                  <button
                    onClick={toggleCategories}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors cursor-pointer mb-2"
                    style={{
                      backgroundColor: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    <span
                      className="font-semibold"
                      style={{
                        color: darkMode ? COLORS.dark.text : COLORS.light.text,
                      }}
                    >
                      Categories
                    </span>
                    <motion.div
                      animate={{ rotate: categoriesExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FiChevronDown
                        className="w-5 h-5"
                        style={{
                          color: darkMode ? COLORS.dark.text : COLORS.light.text,
                        }}
                      />
                    </motion.div>
                  </button>

                  {/* Categories Dropdown Content */}
                  <AnimatePresence>
                    {categoriesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 pl-2">
                          {categories.map((category) => {
                            const isActive = activeCategory === category && !viewingOffers;
                            return (
                              <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium capitalize cursor-pointer transition-all"
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
                                <FiChevronRight
                                  className="w-4 h-4"
                                  style={{
                                    opacity: isActive ? 1 : 0.5,
                                  }}
                                />
                                <span>{category}</span>
                              </button>
                            );
                          })}

                          {/* Offers Option */}
                          <button
                            onClick={handleOffersClick}
                            className="w-full flex items-center space-x-2 py-2.5 px-3 rounded-md text-sm font-medium cursor-pointer transition-all"
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
                            <span className="text-base">🔥</span>
                            <span>Offers</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileSidebar;

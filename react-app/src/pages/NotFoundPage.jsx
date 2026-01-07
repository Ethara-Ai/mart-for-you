import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

/**
 * NotFoundPage - 404 error page component
 *
 * Displays a user-friendly 404 error page when a route is not found.
 * Includes navigation options to return to home or browse products.
 */
function NotFoundPage() {
  const { darkMode, COLORS } = useTheme();

  // Styles
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center py-12 px-4"
      style={{
        background: darkMode
          ? COLORS.dark.backgroundGradient
          : COLORS.light.backgroundGradient,
      }}
    >
      <motion.div
        className="text-center max-w-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Number */}
        <motion.div variants={itemVariants} className="mb-6">
          <span
            className="text-9xl font-extrabold tracking-tight"
            style={{
              color: primaryColor,
              fontFamily: "'Metropolis', sans-serif",
              opacity: 0.2,
            }}
          >
            404
          </span>
        </motion.div>

        {/* Shopping Bag Icon */}
        <motion.div
          variants={itemVariants}
          className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{
            backgroundColor: darkMode
              ? 'rgba(96, 165, 250, 0.1)'
              : 'rgba(37, 99, 235, 0.1)',
          }}
        >
          <FiShoppingBag
            className="w-12 h-12"
            style={{ color: primaryColor }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{
            color: textColor,
            fontFamily: "'Metropolis', sans-serif",
          }}
        >
          Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg mb-8"
          style={{ color: subtextColor }}
        >
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 font-medium rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'transparent',
              color: primaryColor,
              border: `2px solid ${primaryColor}`,
            }}
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          {/* Home Button */}
          <Link
            to="/home"
            className="flex items-center gap-2 px-6 py-3 font-medium rounded-full transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: primaryColor,
              color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <FiHome className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-8 border-t"
          style={{
            borderColor: darkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          <p className="text-sm mb-4" style={{ color: subtextColor }}>
            Looking for something specific?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: primaryColor }}
            >
              Browse Products
            </Link>
            <span style={{ color: subtextColor }}>•</span>
            <Link
              to="/offers"
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: primaryColor }}
            >
              View Offers
            </Link>
            <span style={{ color: subtextColor }}>•</span>
            <Link
              to="/cart"
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: primaryColor }}
            >
              Your Cart
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default NotFoundPage;

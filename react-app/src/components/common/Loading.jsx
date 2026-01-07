import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Loading - Loading spinner component for Suspense fallback
 *
 * Displays an animated loading spinner with optional message.
 * Adapts to dark/light mode and can be used as a full-page
 * loader or inline loader.
 *
 * @param {Object} props
 * @param {string} props.message - Optional loading message
 * @param {boolean} props.fullScreen - Whether to display as full-screen overlay
 * @param {string} props.size - 'sm' | 'md' | 'lg' - Spinner size
 * @param {string} props.className - Additional CSS classes
 */
function Loading({
  message = 'Loading...',
  fullScreen = true,
  size = 'md',
  className = '',
}) {
  const { darkMode, COLORS } = useTheme();

  // Size configurations
  const sizeConfig = {
    sm: {
      spinner: 'w-8 h-8',
      border: 'border-2',
      text: 'text-sm',
    },
    md: {
      spinner: 'w-12 h-12',
      border: 'border-3',
      text: 'text-base',
    },
    lg: {
      spinner: 'w-16 h-16',
      border: 'border-4',
      text: 'text-lg',
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const bgColor = darkMode
    ? COLORS.dark.backgroundGradient
    : COLORS.light.backgroundGradient;

  // Spinner animation variants
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  // Pulse animation for dots
  const dotVariants = {
    animate: (i) => ({
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        delay: i * 0.15,
      },
    }),
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner */}
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`${config.spinner} ${config.border} rounded-full`}
        style={{
          borderColor: darkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
          borderTopColor: primaryColor,
        }}
      />

      {/* Loading message */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 font-medium ${config.text}`}
          style={{ color: textColor }}
        >
          {message}
        </motion.p>
      )}

      {/* Animated dots */}
      <div className="flex space-x-1 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={dotVariants}
            animate="animate"
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
        ))}
      </div>
    </div>
  );

  // Full screen wrapper
  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: bgColor }}
      >
        {content}
      </div>
    );
  }

  return content;
}

export default Loading;

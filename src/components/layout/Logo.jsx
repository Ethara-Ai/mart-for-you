import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Logo - Animated brand logo component
 *
 * Displays the MART brand logo with animated shopping bag icon
 * and text animations. The logo adapts to dark/light mode.
 *
 * @param {Object} props
 * @param {string} props.size - 'sm' | 'md' | 'lg' - Logo size variant
 * @param {boolean} props.animate - Whether to show animations (default: true)
 * @param {Function} props.onClick - Optional click handler
 */
function Logo({ size = 'md', animate = true, onClick }) {
  const { darkMode, COLORS } = useTheme();

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'ml-10',
      svg: { width: 32, height: 32 },
      text: 'text-lg',
      tagline: 'text-xs',
    },
    md: {
      container: 'ml-12',
      svg: { width: 40, height: 40 },
      text: 'text-xl',
      tagline: 'text-xs',
    },
    lg: {
      container: 'ml-16',
      svg: { width: 56, height: 56 },
      text: 'text-2xl',
      tagline: 'text-sm',
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const textColor = darkMode ? COLORS.light.background : COLORS.light.primary;

  // Animation variants
  const letterVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (delay) => ({
      opacity: 1,
      y: 0,
      transition: { delay: animate ? delay : 0, duration: 0.4 },
    }),
  };

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: (delay) => ({
      pathLength: 1,
      transition: { duration: animate ? 1.2 : 0, ease: 'easeInOut', delay: animate ? delay : 0 },
    }),
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (delay) => ({
      scale: 1,
      opacity: 1,
      transition: animate ? { delay, type: 'spring', stiffness: 200 } : { duration: 0 },
    }),
  };

  return (
    <motion.div
      className="relative flex items-center cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      {/* Shopping bag outline that animates */}
      <motion.div
        className="absolute left-0"
        initial={{ y: 0 }}
        animate={animate ? { y: [0, -3, 0] } : { y: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width={config.svg.width}
          height={config.svg.height}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <motion.path
            d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          />
          <motion.path
            d="M3 6h18"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            custom={0.6}
          />
          <motion.path
            d="M16 10a4 4 0 01-8 0"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
            initial="hidden"
            animate="visible"
            custom={1.1}
          />
        </svg>
      </motion.div>

      {/* Animated items appearing in the shopping bag */}
      <motion.div className="absolute left-3 top-5 z-10">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={1.4}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="8"
              fill={darkMode ? 'rgba(96, 165, 250, 0.7)' : 'rgba(37, 99, 235, 0.7)'}
            />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div className="absolute left-8 top-8 z-10">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={1.6}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="6"
              y="6"
              width="12"
              height="12"
              rx="2"
              fill={darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(22, 57, 115, 0.7)'}
            />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div className="absolute left-12 top-6 z-10">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={1.8}
        >
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={darkMode ? 'rgba(191, 219, 254, 0.8)' : 'rgba(30, 58, 138, 0.8)'}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Text MART with interactive elements */}
      <div className={`${config.container} flex flex-col`}>
        <div className="flex items-center">
          {['M', 'A', 'R', 'T'].map((letter, index) => (
            <motion.span
              key={letter + index}
              className={`${config.text} font-extrabold tracking-tighter uppercase`}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              custom={0.4 + index * 0.1}
              style={{ color: textColor }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Animated underline */}
        <motion.div
          className="h-0.5 w-full -mt-0.5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: animate ? 1.2 : 0, duration: 0.6 }}
          style={{
            background: `linear-gradient(90deg, ${primaryColor} 0%, transparent 100%)`,
            transformOrigin: 'left',
          }}
        />

        {/* for you tagline */}
        <motion.div
          className="relative h-4 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: 'auto' }}
          transition={{ delay: animate ? 1.8 : 0, duration: 0.5 }}
        >
          <motion.span
            className={`${config.tagline} block whitespace-nowrap`}
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: animate ? 1.8 : 0, duration: 0.5, ease: 'easeOut' }}
            style={{ color: primaryColor }}
          >
              For You
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Logo;

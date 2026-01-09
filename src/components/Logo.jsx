import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

/**
 * Logo - Professional shopping cart brand logo
 *
 * A clean, minimal logo featuring:
 * - Modern shopping cart icon with integrated M letter
 * - Strong wordmark with clear hierarchy
 * - Works seamlessly on light/dark backgrounds
 * - Scalable from favicons to banners
 *
 * @param {Object} props
 * @param {string} props.size - 'xs' | 'sm' | 'md' | 'lg' | 'xl' - Logo size variant
 * @param {boolean} props.animate - Whether to show entrance animations (default: true)
 * @param {boolean} props.iconOnly - Show only the icon without text
 * @param {Function} props.onClick - Optional click handler
 */
function Logo({ size = 'md', animate = true, iconOnly = false, onClick }) {
  const { darkMode } = useTheme();

  // Size configurations for responsive scaling
  const sizeConfig = {
    xs: {
      icon: 28,
      gap: 'gap-1.5',
      mart: 'text-sm font-bold',
      tagline: 'text-[8px]',
    },
    sm: {
      icon: 34,
      gap: 'gap-2',
      mart: 'text-base font-bold',
      tagline: 'text-[9px]',
    },
    md: {
      icon: 40,
      gap: 'gap-2.5',
      mart: 'text-lg font-bold',
      tagline: 'text-[10px]',
    },
    lg: {
      icon: 48,
      gap: 'gap-3',
      mart: 'text-xl font-bold',
      tagline: 'text-xs',
    },
    xl: {
      icon: 60,
      gap: 'gap-4',
      mart: 'text-2xl font-bold',
      tagline: 'text-sm',
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Professional color palette
  const textPrimary = darkMode ? '#F8FAFC' : '#0F172A';
  const textSecondary = darkMode ? '#94A3B8' : '#64748B';

  // Subtle, professional animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: animate ? 0.1 : 0, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className={`flex items-center ${config.gap} cursor-pointer select-none`}
      variants={containerVariants}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      role="img"
      aria-label="Mart For You logo"
    >
      {/* Icon Mark - Shopping Cart with integrated M (PNG image) */}
      <motion.div variants={iconVariants} className="flex-shrink-0">
        <img
          src="/Frame 2147227200.png"
          alt="Mart For You"
          width={config.icon}
          height={config.icon}
          style={{
            width: config.icon,
            height: config.icon,
            objectFit: 'contain',
          }}
          aria-hidden="true"
        />
      </motion.div>

      {/* Wordmark - Only shown when iconOnly is false */}
      {!iconOnly && (
        <motion.div
          variants={textVariants}
          className="flex flex-col justify-center leading-none"
        >
          {/* Primary text: MART */}
          <span
            className={`${config.mart} tracking-tight`}
            style={{
              color: textPrimary,
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            MART
          </span>

          {/* Secondary text: For You */}
          <span
            className={`${config.tagline} font-medium tracking-wide uppercase`}
            style={{
              color: textSecondary,
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              letterSpacing: '0.08em',
              marginTop: '1px',
            }}
          >
            For You
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default Logo;

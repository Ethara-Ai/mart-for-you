import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

/**
 * Hero - Hero section component with video background
 *
 * Displays a full-height hero section with video background,
 * overlay, heading, description, and call-to-action button.
 * Includes animated entrance effects and scroll indicator.
 *
 * @param {Object} props
 * @param {string} props.title - Main heading text
 * @param {string} props.subtitle - Description text
 * @param {string} props.ctaText - Call-to-action button text
 * @param {string} props.ctaLink - Link for CTA button (default: scrolls to products)
 * @param {string} props.videoUrl - Background video URL
 * @param {boolean} props.showScrollIndicator - Whether to show scroll indicator
 */
function Hero({
  title = 'Your One-Stop Shopping Destination',
  subtitle = 'Everything you need, just a click away',
  ctaText = 'Shop Now',
  ctaLink,
  videoUrl = 'https://videos.pexels.com/video-files/29068393/12563855_1920_1080_30fps.mp4',
  showScrollIndicator = true,
}) {
  const navigate = useNavigate();
  const { darkMode, COLORS } = useTheme();

  // Handle CTA button click
  const handleCtaClick = () => {
    if (ctaLink) {
      navigate(ctaLink);
    } else {
      // Scroll to products section
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to products page if section not found
        navigate('/products');
      }
    }
  };

  // Handle scroll indicator click
  const handleScrollClick = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Overlay color based on theme
  const overlayColor = darkMode
    ? 'rgba(15, 23, 42, 0.6)'
    : 'rgba(37, 99, 235, 0.3)';

  return (
    <section
      id="hero-section"
      className="relative h-[80vh] overflow-hidden"
      style={{
        backgroundColor: darkMode
          ? COLORS.dark.secondary
          : COLORS.light.secondary,
      }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div
          className="absolute inset-0 backdrop-blur-xs"
          style={{ backgroundColor: overlayColor }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-3xl"
          style={{ color: COLORS.light.background }}
        >
          {/* Main Heading */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              fontFamily: "'Metropolis', sans-serif",
              letterSpacing: '-0.5px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl mb-8"
            style={{
              fontFamily: "'Metropolis', sans-serif",
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            onClick={handleCtaClick}
            className="px-8 py-3 font-medium rounded-full transition-colors cursor-pointer"
            style={{
              backgroundColor: darkMode
                ? COLORS.dark.primary
                : COLORS.light.primary,
              color: COLORS.light.background,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
              fontFamily: "'Metropolis', sans-serif",
              letterSpacing: '0.3px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {ctaText}
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
          <motion.button
            className="animate-bounce cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={handleScrollClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            aria-label="Scroll to products"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.button>
        </div>
      )}
    </section>
  );
}

export default Hero;

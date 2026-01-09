import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';

/**
 * LandingPage - Initial landing page component
 *
 * A full-viewport landing page with the MART logo, tagline,
 * and call-to-action button. Matches the website's theme.
 */
function LandingPage() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode, COLORS } = useTheme();

  // Handle enter button click
  const handleEnter = () => {
    navigate('/home');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 },
    },
  };

  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const secondaryColor = darkMode ? COLORS.dark.secondary : COLORS.light.secondary;

  return (
    <div
      className="h-screen w-full overflow-hidden flex flex-col"
      style={{
        background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
      }}
    >
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer hover:scale-110 active:scale-95"
          style={{
            backgroundColor: secondaryColor,
            color: primaryColor,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* Main Content - Centered */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo Icon */}
        <motion.div variants={logoVariants} className="mb-6">
          <img
            src="/Frame 2147227200.png"
            alt="Mart For You Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
            style={{
              filter: darkMode ? 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4))' : 'drop-shadow(0 20px 40px rgba(37, 99, 235, 0.2))',
            }}
          />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-2"
          style={{
            color: textColor,
            fontFamily: "'Metropolis', sans-serif",
            letterSpacing: '-2px',
          }}
        >
          MART
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl mb-8 text-center"
          style={{
            color: primaryColor,
            fontFamily: "'Metropolis', sans-serif",
            fontWeight: 500,
          }}
        >
          For You
        </motion.p>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg mb-10 text-center max-w-md px-4"
          style={{
            color: darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)',
            fontFamily: "'Metropolis', sans-serif",
          }}
        >
          Shop electronics, fashion, beauty, home essentials, and more
        </motion.p>

        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          onClick={handleEnter}
          className="group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
          style={{
            background: darkMode
              ? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
              : 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
            color: '#FFFFFF',
            fontFamily: "'Metropolis', sans-serif",
          }}
        >
          Start Shopping
          <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="py-6 text-center"
      ></motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full pointer-events-none"
        style={{
          background: primaryColor,
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-20 right-10 w-40 h-40 sm:w-56 sm:h-56 rounded-full pointer-events-none"
        style={{
          background: primaryColor,
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="absolute top-1/2 left-1/4 w-24 h-24 sm:w-32 sm:h-32 rounded-full pointer-events-none"
        style={{
          background: primaryColor,
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
}

export default LandingPage;

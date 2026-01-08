import { FaRecycle } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

/**
 * Footer - Application footer component
 *
 * Displays copyright information and sustainability badge.
 * Adapts styling based on dark/light mode.
 */
function Footer() {
  const { darkMode, COLORS } = useTheme();

  const currentYear = new Date().getFullYear();

  // Text color based on theme
  const textColor = darkMode ? COLORS.dark.text : 'rgba(24, 14, 60, 0.7)';
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.dark.secondary;

  return (
    <footer
      className="py-8"
      style={{
        background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Bottom Section - Copyright & Sustainability */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <p className="text-sm" style={{ color: textColor }}>
            &copy; {currentYear} Mart - For You. All rights reserved.
          </p>

          {/* Sustainability Badge */}
          <div className="flex items-center mt-4 md:mt-0">
            <FaRecycle className="h-5 w-5 mr-2" style={{ color: primaryColor }} />
            <span className="text-sm" style={{ color: textColor }}>
              Made with sustainable code
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p
            className="text-xs"
            style={{
              color: darkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
            }}
          ></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

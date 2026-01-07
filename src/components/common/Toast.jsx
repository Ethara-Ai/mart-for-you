import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiShoppingBag } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

/**
 * Toast - Notification toast component
 *
 * Displays a notification message that auto-dismisses after 3 seconds.
 * Supports success, error, and info types with different styling.
 *
 * @param {Object} props
 * @param {Object} props.toast - Toast object containing id, message, and type
 * @param {Function} props.onClose - Callback to remove the toast
 */
function Toast({ toast, onClose }) {
  const { darkMode } = useTheme();

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Get background color based on toast type
  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return darkMode ? 'rgba(96, 165, 250, 0.9)' : 'rgba(37, 99, 235, 0.9)';
      case 'error':
        return 'rgba(220, 38, 38, 0.9)';
      case 'info':
        return darkMode ? 'rgba(96, 165, 250, 0.9)' : 'rgba(37, 99, 235, 0.9)';
      default:
        return 'rgba(0, 0, 0, 0.8)';
    }
  };

  // Get icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheck className="h-5 w-5" />;
      case 'error':
        return <FiX className="h-5 w-5" />;
      case 'info':
        return <FiShoppingBag className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, y: 20 }}
      className="p-4 mb-3 rounded-lg shadow-lg flex items-center"
      style={{
        backgroundColor: getBgColor(),
        color: '#FFFFFF'
      }}
    >
      <div className="mr-3">
        {getIcon()}
      </div>
      <p className="flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="ml-3 p-1 text-white hover:text-gray-300 cursor-pointer rounded-full hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <FiX className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export default Toast;

import { AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import Toast from './Toast';

/**
 * ToastContainer - Container component for displaying toast notifications
 *
 * This component renders all active toast notifications in a fixed position.
 * Desktop: Bottom-right corner
 * Mobile: Bottom-center (centered horizontally)
 * Uses AnimatePresence for smooth enter/exit animations.
 *
 * Usage:
 * Place this component once in your app layout (typically in App.jsx or a layout component)
 * Then use the useToast hook to trigger toasts from anywhere in your app.
 *
 * @example
 * // In your layout component
 * <ToastContainer />
 *
 * // In any component
 * const { showSuccess, showError, showInfo } = useToast();
 * showSuccess('Item added to cart!');
 */
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 flex flex-col space-y-2 pointer-events-none w-[calc(100%-2rem)] max-w-md md:w-auto"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;

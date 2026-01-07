import { AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';

/**
 * ToastContainer - Container component for displaying toast notifications
 *
 * This component renders all active toast notifications in a fixed position
 * at the bottom-right corner of the screen. Uses AnimatePresence for
 * smooth enter/exit animations.
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
      className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;

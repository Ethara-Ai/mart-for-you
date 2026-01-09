import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotion } from '../hooks';
import { ROUTES } from '../constants';
import { createLogger } from '../utils/logger';

// Create logger for error boundary
const log = createLogger('ErrorBoundary');

/**
 * ErrorFallback - Functional component for displaying error UI
 *
 * Extracted from ErrorBoundary to allow use of React hooks
 * for theming and reduced motion preferences.
 *
 * @param {Object} props
 * @param {Error} props.error - The error that was caught
 * @param {Object} props.errorInfo - React error info with component stack
 * @param {Function} props.onReset - Callback to reset error state
 * @param {Function} props.onReload - Callback to reload page
 * @param {Function} props.onGoHome - Callback to navigate home
 */
function ErrorFallback({ error, errorInfo, onReset, onReload, onGoHome }) {
  const { darkMode, COLORS } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Theme-aware styles
  const bgGradient = darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient;
  const cardBg = darkMode ? COLORS.dark.modalBackground : COLORS.light.modalBackground;
  const textColor = darkMode ? COLORS.dark.text : COLORS.light.text;
  const subtextColor = darkMode ? 'rgba(224, 224, 224, 0.7)' : 'rgba(51, 51, 51, 0.7)';
  const primaryColor = darkMode ? COLORS.dark.primary : COLORS.light.primary;

  // Development mode check
  const isDevelopment = import.meta.env?.DEV ?? process.env.NODE_ENV === 'development';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: bgGradient }}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`max-w-lg w-full p-8 rounded-lg shadow-xl text-center ${
          prefersReducedMotion ? '' : 'animate-fadeIn'
        }`}
        style={{ backgroundColor: cardBg }}
      >
        {/* Error Icon */}
        <div
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <FiAlertTriangle className="w-10 h-10" style={{ color: '#EF4444' }} aria-hidden="true" />
        </div>

        {/* Error Title */}
        <h1
          className="text-2xl font-bold mb-3"
          style={{
            color: textColor,
            fontFamily: "'Metropolis', sans-serif",
          }}
        >
          Oops! Something went wrong
        </h1>

        {/* Error Description */}
        <p className="mb-6" style={{ color: subtextColor }}>
          We&apos;re sorry, but something unexpected happened. Please try again or return to the
          home page.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div
            className="mb-6 p-4 rounded-md text-left overflow-auto max-h-40"
            style={{ backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)' }}
          >
            <p className="text-sm font-mono mb-2" style={{ color: '#EF4444' }}>
              {error.toString()}
            </p>
            {errorInfo?.componentStack && (
              <details>
                <summary className="text-xs cursor-pointer mb-2" style={{ color: subtextColor }}>
                  Component Stack
                </summary>
                <pre
                  className="text-xs font-mono whitespace-pre-wrap"
                  style={{ color: subtextColor }}
                >
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Try Again Button */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: primaryColor,
              color: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
            }}
          >
            <FiRefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>

          {/* Go Home Button */}
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: 'transparent',
              color: primaryColor,
              border: `1px solid ${primaryColor}`,
            }}
          >
            <FiHome className="w-4 h-4" aria-hidden="true" />
            Go Home
          </button>
        </div>

        {/* Reload Link */}
        <button
          onClick={onReload}
          className="mt-4 text-sm underline hover:no-underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          style={{ color: subtextColor }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

/**
 * StaticErrorFallback - Fallback component when ThemeProvider is not available
 *
 * Used when the error occurs outside the ThemeProvider context,
 * such as errors in the provider itself.
 *
 * @param {Object} props
 * @param {Error} props.error - The error that was caught
 * @param {Object} props.errorInfo - React error info with component stack
 * @param {Function} props.onReset - Callback to reset error state
 * @param {Function} props.onReload - Callback to reload page
 * @param {Function} props.onGoHome - Callback to navigate home
 */
function StaticErrorFallback({ error, errorInfo, onReset, onReload, onGoHome }) {
  const isDevelopment = import.meta.env?.DEV ?? process.env.NODE_ENV === 'development';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(to bottom, #0F172A, #1E293B)' }}
      role="alert"
      aria-live="assertive"
    >
      <div
        className="max-w-lg w-full p-8 rounded-lg shadow-xl text-center"
        style={{ backgroundColor: '#1E293B' }}
      >
        {/* Error Icon */}
        <div
          className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <FiAlertTriangle className="w-10 h-10" style={{ color: '#EF4444' }} aria-hidden="true" />
        </div>

        {/* Error Title */}
        <h1
          className="text-2xl font-bold mb-3"
          style={{
            color: '#E0E0E0',
            fontFamily: "'Metropolis', sans-serif",
          }}
        >
          Oops! Something went wrong
        </h1>

        {/* Error Description */}
        <p className="mb-6" style={{ color: 'rgba(224, 224, 224, 0.7)' }}>
          We&apos;re sorry, but something unexpected happened. Please try again or return to the
          home page.
        </p>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <div
            className="mb-6 p-4 rounded-md text-left overflow-auto max-h-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          >
            <p className="text-sm font-mono mb-2" style={{ color: '#EF4444' }}>
              {error.toString()}
            </p>
            {errorInfo?.componentStack && (
              <details>
                <summary
                  className="text-xs cursor-pointer mb-2"
                  style={{ color: 'rgba(224, 224, 224, 0.5)' }}
                >
                  Component Stack
                </summary>
                <pre
                  className="text-xs font-mono whitespace-pre-wrap"
                  style={{ color: 'rgba(224, 224, 224, 0.5)' }}
                >
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Try Again Button */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: '#60A5FA',
              color: '#1E293B',
            }}
          >
            <FiRefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>

          {/* Go Home Button */}
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: 'transparent',
              color: '#60A5FA',
              border: '1px solid #60A5FA',
            }}
          >
            <FiHome className="w-4 h-4" aria-hidden="true" />
            Go Home
          </button>
        </div>

        {/* Reload Link */}
        <button
          onClick={onReload}
          className="mt-4 text-sm underline hover:no-underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          style={{ color: 'rgba(224, 224, 224, 0.5)' }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

/**
 * ErrorBoundary - React error boundary component for catching JavaScript errors
 *
 * This component catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree
 * that crashed. Essential for production applications to prevent complete app crashes.
 *
 * @class ErrorBoundary
 * @extends Component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @param {React.ReactNode} [props.fallback] - Custom fallback UI to render on error
 * @param {Function} [props.onError] - Callback when an error is caught
 *
 * @example
 * // Basic usage
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * @example
 * // With custom fallback
 * <ErrorBoundary fallback={<CustomErrorPage />}>
 *   <App />
 * </ErrorBoundary>
 *
 * @example
 * // With error callback for logging
 * <ErrorBoundary onError={(error, errorInfo) => logErrorToService(error, errorInfo)}>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state so the next render will show the fallback UI.
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state with hasError set to true
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Catch errors in any components below and log them
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Object with componentStack property
   */
  componentDidCatch(error, errorInfo) {
    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Log error using the logger utility
    log.error('Caught an error in component tree', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
    });

    // Call optional onError callback prop
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reset the error state to try rendering again
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = ROUTES.HOME;
  };

  /**
   * Reload the page
   */
  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Use the static error fallback since ErrorBoundary is outside ThemeProvider
      return (
        <StaticErrorFallback
          error={error}
          errorInfo={errorInfo}
          onReset={this.handleReset}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return children;
  }
}

// Export ErrorFallback for use with ThemeProvider context
export { ErrorFallback };

export default ErrorBoundary;

import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

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
 * // With error callback
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

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo?.componentStack);
    }

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
    window.location.href = '/home';
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

      // Default error UI
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{
            background: 'linear-gradient(to bottom, #0F172A, #1E293B)',
          }}
        >
          <div
            className="max-w-lg w-full p-8 rounded-lg shadow-xl text-center"
            style={{
              backgroundColor: '#1E293B',
            }}
          >
            {/* Error Icon */}
            <div
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
              }}
            >
              <FiAlertTriangle
                className="w-10 h-10"
                style={{ color: '#EF4444' }}
              />
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
            <p
              className="mb-6"
              style={{
                color: 'rgba(224, 224, 224, 0.7)',
              }}
            >
              We're sorry, but something unexpected happened. Please try again or return to the home
              page.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div
                className="mb-6 p-4 rounded-md text-left overflow-auto max-h-40"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <p
                  className="text-sm font-mono mb-2"
                  style={{ color: '#EF4444' }}
                >
                  {error.toString()}
                </p>
                {errorInfo?.componentStack && (
                  <pre
                    className="text-xs font-mono whitespace-pre-wrap"
                    style={{ color: 'rgba(224, 224, 224, 0.5)' }}
                  >
                    {errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Try Again Button */}
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: '#60A5FA',
                  color: '#1E293B',
                }}
              >
                <FiRefreshCw className="w-4 h-4" />
                Try Again
              </button>

              {/* Go Home Button */}
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: 'transparent',
                  color: '#60A5FA',
                  border: '1px solid #60A5FA',
                }}
              >
                <FiHome className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {/* Reload Link */}
            <button
              onClick={this.handleReload}
              className="mt-4 text-sm underline hover:no-underline cursor-pointer"
              style={{ color: 'rgba(224, 224, 224, 0.5)' }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

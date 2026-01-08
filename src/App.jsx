import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import { useTheme } from './context/ThemeContext';
import { useProfile } from './context/ProfileContext';

// Layout components (not lazy loaded as they're always needed)
import { Header, Footer } from './components/layout';
import { CartModal } from './components/cart';
import { ToastContainer, ErrorBoundary, Loading } from './components/common';

// Lazy load page components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * ScrollToTop - Component to scroll to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * PageLoader - Loading component for lazy-loaded pages
 */
function PageLoader() {
  return <Loading message="Loading page..." fullScreen={true} size="md" />;
}

/**
 * AppLayout - Main application layout wrapper
 *
 * Wraps all pages with common layout elements like Header, Footer,
 * CartModal, and ToastContainer. Handles global click events for
 * closing modals.
 */
function AppLayout() {
  const { darkMode, COLORS } = useTheme();
  const { closeProfileCard, isProfileCardOpen } = useProfile();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Handle click outside to close profile card
  useEffect(() => {
    const handleClickOutside = (e) => {
      const {target} = e;
      if (
        isProfileCardOpen &&
        !target.closest('#profile-card') &&
        !target.closest('#profile-photo-button')
      ) {
        closeProfileCard();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileCardOpen, closeProfileCard]);

  // Open cart modal
  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  // Close cart modal
  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}
      style={{
        background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        color: darkMode ? COLORS.dark.text : COLORS.light.text,
        fontFamily: "'Metropolis', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Header */}
      <Header />

      {/* Main content area - Routes */}
      <div className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* 404 Not Found route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={handleCartClose} />
    </div>
  );
}

/**
 * AppRoutes - Handles routing between Landing page and Main app
 */
function AppRoutes() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    );
  }

  return <AppLayout />;
}

/**
 * App - Root application component
 *
 * Sets up the application with all necessary providers, error boundary,
 * and routing. Provider hierarchy:
 * - ErrorBoundary (catches JavaScript errors)
 * - BrowserRouter (routing)
 * - AppProvider (theme, cart, toast, profile contexts)
 * - AppRoutes (landing page or main layout)
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

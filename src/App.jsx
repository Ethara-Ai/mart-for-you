import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Context
import AppProvider from './context/AppProvider';
import { useTheme } from './context/ThemeContext';

// Layout components (not lazy loaded as they're always needed)
import Header from './components/Header';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

// Constants
import { ROUTES } from './constants';

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
 * SkipLink - Accessibility skip navigation link
 */
function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}

/**
 * AppLayout - Main application layout wrapper
 *
 * Wraps all pages with common layout elements like Header, Footer,
 * CartModal, and ToastContainer.
 *
 * Note: Header and other components now consume contexts directly
 * instead of receiving props (removing prop drilling anti-pattern).
 */
function AppLayout() {
  const { darkMode, COLORS } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}
      style={{
        background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        color: darkMode ? COLORS.dark.text : COLORS.light.text,
        fontFamily: "'Metropolis', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Accessibility skip link */}
      <SkipLink />

      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Header - consumes its own contexts now */}
      <Header />

      {/* Main content area - Routes */}
      <main id="main-content" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
            <Route path={ROUTES.OFFERS} element={<OffersPage />} />
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            {/* 404 Not Found route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Modal - Uses CartContext for open/close state */}
      <CartModal />
    </div>
  );
}

/**
 * RedirectToLandingOnRefresh - Redirects to landing page on page refresh
 *
 * Uses sessionStorage to detect fresh page loads vs in-app navigation.
 * On refresh/new tab, redirects to landing page once, then allows normal navigation.
 */
function RedirectToLandingOnRefresh() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Check if this is a fresh page load (not in-app navigation)
    const hasVisitedInSession = sessionStorage.getItem('mart_session_active');

    // Only redirect if:
    // 1. Not already on landing page
    // 2. Haven't redirected yet in this component lifecycle
    // 3. This is a fresh page load (no session flag)
    if (!hasVisitedInSession && !hasRedirected.current && location.pathname !== ROUTES.LANDING) {
      hasRedirected.current = true;
      // Set session flag before navigating
      sessionStorage.setItem('mart_session_active', 'true');
      navigate(ROUTES.LANDING, { replace: true });
    } else if (!hasVisitedInSession) {
      // Set session flag for landing page visits too
      sessionStorage.setItem('mart_session_active', 'true');
    }
  }, [navigate, location.pathname]);

  return null;
}

/**
 * AppRoutes - Handles routing between Landing page and Main app
 */
function AppRoutes() {
  const location = useLocation();
  const isLandingPage = location.pathname === ROUTES.LANDING;

  return (
    <>
      {/* Handle redirect to landing on page refresh */}
      <RedirectToLandingOnRefresh />

      {isLandingPage ? (
        <Suspense fallback={<PageLoader />}>
          <LandingPage />
        </Suspense>
      ) : (
        <AppLayout />
      )}
    </>
  );
}

/**
 * App - Root application component
 *
 * Sets up the application with all necessary providers, error boundary,
 * and routing. Provider hierarchy:
 * - ErrorBoundary (catches JavaScript errors)
 * - BrowserRouter (routing)
 * - AppProvider (theme, cart, toast, profile, search, filter contexts)
 * - AppRoutes (landing page or main layout)
 *
 * Note: AppProvider must be inside BrowserRouter because SearchProvider
 * and FilterProvider use router hooks (useNavigate, useSearchParams).
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

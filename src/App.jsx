import { lazy, Suspense, useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Context
import AppProvider from './context/AppProvider';
import { useTheme } from './context/ThemeContext';
import { useProfile } from './context/ProfileContext';
import { useSearch, useFilter } from './context';

// Layout components (not lazy loaded as they're always needed)
import Header from './components/Header';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

// Constants
import { ROUTES, SECTION_IDS } from './constants';

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
  const navigate = useNavigate();
  const { darkMode, COLORS } = useTheme();
  const { closeProfileCard, isProfileCardOpen } = useProfile();
  const { searchTerm, setSearchTerm, onSearchSubmit, clearSearch } = useSearch();
  const { activeCategory, viewingOffers, setActiveCategory, enableOffersView } = useFilter();

  // Cart modal state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Handle click outside to close profile card
  useEffect(() => {
    const handleClickOutside = (e) => {
      const { target } = e;
      if (
        isProfileCardOpen &&
        !target.closest(`#${SECTION_IDS.PROFILE_CARD}`) &&
        !target.closest('#profile-photo-button')
      ) {
        closeProfileCard();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileCardOpen, closeProfileCard]);

  // Close cart modal
  const handleCartClose = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Open cart modal
  const handleCartOpen = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  // Handle category change from mobile sidebar
  const handleCategoryChange = useCallback(
    (category) => {
      setActiveCategory(category);
      // Navigate to products page with category in URL
      if (category === 'all') {
        navigate(ROUTES.PRODUCTS);
      } else {
        navigate(`${ROUTES.PRODUCTS}?category=${category}`);
      }
    },
    [setActiveCategory, navigate]
  );

  // Handle offers click from mobile sidebar
  const handleOffersClick = useCallback(() => {
    enableOffersView();
    // Navigate to offers page
    navigate(ROUTES.OFFERS);
  }, [enableOffersView, navigate]);

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
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={onSearchSubmit}
        onSearchClear={clearSearch}
        onCartClick={handleCartOpen}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        viewingOffers={viewingOffers}
        onOffersClick={handleOffersClick}
      />

      {/* Main content area - Routes */}
      <div className="flex-1">
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
  const isLandingPage = location.pathname === ROUTES.LANDING;

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

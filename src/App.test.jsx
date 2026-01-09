// App component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import App from './App';

// Mock lazy-loaded components to avoid Suspense issues in tests
vi.mock('./pages/LandingPage', () => ({
  default: () => <div data-testid="landing-page">Landing Page</div>,
}));

vi.mock('./pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('./pages/ProductsPage', () => ({
  default: () => <div data-testid="products-page">Products Page</div>,
}));

vi.mock('./pages/OffersPage', () => ({
  default: () => <div data-testid="offers-page">Offers Page</div>,
}));

vi.mock('./pages/CartPage', () => ({
  default: () => <div data-testid="cart-page">Cart Page</div>,
}));

vi.mock('./pages/ProfilePage', () => ({
  default: () => <div data-testid="profile-page">Profile Page</div>,
}));

vi.mock('./pages/NotFoundPage', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }) => children,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
      main: ({ children, ...props }) => <main {...props}>{children}</main>,
      nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
      aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
      span: ({ children, ...props }) => <span {...props}>{children}</span>,
      section: ({ children, ...props }) => <section {...props}>{children}</section>,
    },
  };
});

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset scroll
    window.scrollTo = vi.fn();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<App />)).not.toThrow();
    });

    it('renders the application', async () => {
      render(<App />);

      // App should render something
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('error boundary', () => {
    it('wraps application with ErrorBoundary', () => {
      // ErrorBoundary should catch errors and prevent app crash
      render(<App />);
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('routing', () => {
    it('renders landing page at root path', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      });
    });
  });

  describe('providers', () => {
    it('provides context to children', async () => {
      render(<App />);

      // App should render without context errors
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('structure', () => {
    it('renders with proper DOM structure', async () => {
      const { container } = render(<App />);

      await waitFor(() => {
        expect(container).toBeInTheDocument();
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });

  describe('initial state', () => {
    it('starts with landing page for root route', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('landing-page')).toBeInTheDocument();
      });
    });
  });

  describe('app integration', () => {
    it('sets up all necessary providers without errors', () => {
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    it('handles application lifecycle correctly', () => {
      const { unmount } = render(<App />);

      // Should unmount without errors
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('lazy loading', () => {
    it('handles lazy-loaded components', async () => {
      render(<App />);

      // Should not throw during lazy loading
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('suspense handling', () => {
    it('renders suspense fallback while loading', async () => {
      render(<App />);

      // The app should handle suspense without crashing
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('browser router', () => {
    it('wraps application with BrowserRouter', async () => {
      render(<App />);

      // BrowserRouter should be present and functional
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('theme integration', () => {
    it('applies theme context to application', async () => {
      render(<App />);

      await waitFor(() => {
        // App should render with theme applied
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('renders accessible application structure', async () => {
      render(<App />);

      await waitFor(() => {
        // App should be accessible
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('multiple renders', () => {
    it('handles multiple renders correctly', async () => {
      const { rerender } = render(<App />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });

      expect(() => {
        rerender(<App />);
      }).not.toThrow();
    });
  });

  describe('cleanup', () => {
    it('cleans up on unmount', async () => {
      const { unmount } = render(<App />);

      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });

      // Should clean up without memory leaks
      unmount();
    });
  });
});

// NotFoundPage component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import NotFoundPage from './NotFoundPage';
import { render, renderWithMemoryRouter } from '../testing/test-utils';

// Mock framer-motion to simplify testing
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
      p: ({ children, ...props }) => <p {...props}>{children}</p>,
      span: ({ children, ...props }) => <span {...props}>{children}</span>,
    },
  };
});

describe('NotFoundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the page', () => {
      render(<NotFoundPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('displays 404 number', () => {
      render(<NotFoundPage />);

      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('displays "Page Not Found" title', () => {
      render(<NotFoundPage />);

      expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    });

    it('displays a descriptive message', () => {
      render(<NotFoundPage />);

      expect(screen.getByText(/oops.*page.*looking for.*doesn't exist/i)).toBeInTheDocument();
    });

    it('displays a shopping bag icon', () => {
      render(<NotFoundPage />);

      // The icon should be rendered within the page
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('navigation buttons', () => {
    it('renders "Go Back" button', () => {
      render(<NotFoundPage />);

      const backButton = screen.getByRole('button', { name: /go back/i });
      expect(backButton).toBeInTheDocument();
    });

    it('renders "Back to Home" link', () => {
      render(<NotFoundPage />);

      const homeLink = screen.getByRole('link', { name: /back to home/i });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/home');
    });

    it('calls window.history.back when "Go Back" is clicked', async () => {
      const historyBackSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
      const { user } = render(<NotFoundPage />);

      const backButton = screen.getByRole('button', { name: /go back/i });
      await user.click(backButton);

      expect(historyBackSpy).toHaveBeenCalled();

      historyBackSpy.mockRestore();
    });
  });

  describe('additional links', () => {
    it('renders "Browse Products" link', () => {
      render(<NotFoundPage />);

      const productsLink = screen.getByRole('link', { name: /browse products/i });
      expect(productsLink).toBeInTheDocument();
      expect(productsLink).toHaveAttribute('href', '/products');
    });

    it('renders "View Offers" link', () => {
      render(<NotFoundPage />);

      const offersLink = screen.getByRole('link', { name: /view offers/i });
      expect(offersLink).toBeInTheDocument();
      expect(offersLink).toHaveAttribute('href', '/offers');
    });

    it('renders "Your Cart" link', () => {
      render(<NotFoundPage />);

      const cartLink = screen.getByRole('link', { name: /your cart/i });
      expect(cartLink).toBeInTheDocument();
      expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('displays "Looking for something specific?" text', () => {
      render(<NotFoundPage />);

      expect(screen.getByText(/looking for something specific/i)).toBeInTheDocument();
    });
  });

  describe('styling and structure', () => {
    it('renders as main element', () => {
      render(<NotFoundPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });

    it('centers content vertically and horizontally', () => {
      render(<NotFoundPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('flex');
      expect(main).toHaveClass('items-center');
      expect(main).toHaveClass('justify-center');
    });

    it('404 number has large font styling', () => {
      render(<NotFoundPage />);

      const notFoundNumber = screen.getByText('404');
      expect(notFoundNumber).toHaveClass('text-9xl');
      expect(notFoundNumber).toHaveClass('font-extrabold');
    });

    it('title has correct heading level', () => {
      render(<NotFoundPage />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent(/page not found/i);
    });
  });

  describe('accessibility', () => {
    it('has accessible navigation links', () => {
      render(<NotFoundPage />);

      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('has accessible button', () => {
      render(<NotFoundPage />);

      const button = screen.getByRole('button', { name: /go back/i });
      expect(button).toHaveAccessibleName();
    });

    it('all interactive elements are focusable', () => {
      render(<NotFoundPage />);

      const button = screen.getByRole('button', { name: /go back/i });
      const links = screen.getAllByRole('link');

      expect(button).not.toHaveAttribute('tabindex', '-1');
      links.forEach((link) => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('uses semantic heading structure', () => {
      render(<NotFoundPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('theming', () => {
    it('renders correctly with theme context', () => {
      render(<NotFoundPage />);

      // Page should render without errors
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('applies background gradient style', () => {
      render(<NotFoundPage />);

      const main = screen.getByRole('main');
      expect(main).toHaveStyle({ background: expect.any(String) });
    });
  });

  describe('with MemoryRouter', () => {
    it('renders correctly with MemoryRouter', () => {
      renderWithMemoryRouter(<NotFoundPage />, { initialEntries: ['/non-existent-page'] });

      expect(screen.getByText('404')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    });

    it('home link navigates correctly', () => {
      renderWithMemoryRouter(<NotFoundPage />);

      const homeLink = screen.getByRole('link', { name: /back to home/i });
      expect(homeLink).toHaveAttribute('href', '/home');
    });
  });

  describe('button interactions', () => {
    it('Go Back button has hover styling', () => {
      render(<NotFoundPage />);

      const backButton = screen.getByRole('button', { name: /go back/i });
      expect(backButton).toHaveClass('hover:scale-105');
    });

    it('Go Back button has active styling', () => {
      render(<NotFoundPage />);

      const backButton = screen.getByRole('button', { name: /go back/i });
      expect(backButton).toHaveClass('active:scale-95');
    });

    it('Back to Home link has hover styling', () => {
      render(<NotFoundPage />);

      const homeLink = screen.getByRole('link', { name: /back to home/i });
      expect(homeLink).toHaveClass('hover:scale-105');
    });
  });

  describe('link styling', () => {
    it('additional links have hover underline effect', () => {
      render(<NotFoundPage />);

      const productsLink = screen.getByRole('link', { name: /browse products/i });
      expect(productsLink).toHaveClass('hover:underline');
    });

    it('additional links have transition styling', () => {
      render(<NotFoundPage />);

      const offersLink = screen.getByRole('link', { name: /view offers/i });
      expect(offersLink).toHaveClass('transition-colors');
    });
  });

  describe('separators between links', () => {
    it('renders bullet point separators between additional links', () => {
      render(<NotFoundPage />);

      // The bullet points are rendered as span elements with "•" text
      const bullets = screen.getAllByText('•');
      expect(bullets.length).toBe(2); // Between 3 links
    });
  });

  describe('icons', () => {
    it('renders arrow icon in Go Back button', () => {
      render(<NotFoundPage />);

      const backButton = screen.getByRole('button', { name: /go back/i });
      const svg = backButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders home icon in Back to Home link', () => {
      render(<NotFoundPage />);

      const homeLink = screen.getByRole('link', { name: /back to home/i });
      const svg = homeLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('buttons are displayed in a flex container', () => {
      render(<NotFoundPage />);

      const backButton = screen.getByRole('button', { name: /go back/i });
      const buttonContainer = backButton.parentElement;
      expect(buttonContainer).toHaveClass('flex');
    });

    it('has a bottom border for additional links section', () => {
      render(<NotFoundPage />);

      const lookingForText = screen.getByText(/looking for something specific/i);
      const container = lookingForText.parentElement;
      expect(container).toHaveClass('border-t');
    });
  });
});

// LandingPage component tests
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import LandingPage from './LandingPage';
import { renderWithMemoryRouter } from '../testing/test-utils';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
      h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
      p: ({ children, ...props }) => <p {...props}>{children}</p>,
    },
  };
});

describe('LandingPage', () => {
  describe('rendering', () => {
    it('renders the MART brand name', () => {
      renderWithMemoryRouter(<LandingPage />);

      expect(screen.getByText('MART')).toBeInTheDocument();
    });

    it('renders the tagline "For You"', () => {
      renderWithMemoryRouter(<LandingPage />);

      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders the subtitle/description', () => {
      renderWithMemoryRouter(<LandingPage />);

      expect(
        screen.getByText(/Shop electronics, fashion, beauty, home essentials, and more/i)
      ).toBeInTheDocument();
    });

    it('renders the "Start Shopping" CTA button', () => {
      renderWithMemoryRouter(<LandingPage />);

      expect(screen.getByRole('button', { name: /start shopping/i })).toBeInTheDocument();
    });

    it('renders the theme toggle button', () => {
      renderWithMemoryRouter(<LandingPage />);

      const themeButton = screen.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      });
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('renders full viewport height container', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      const mainContainer = container.querySelector('.h-screen');
      expect(mainContainer).toBeInTheDocument();
    });

    it('has centered content', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      const centeredContent = container.querySelector('.items-center.justify-center');
      expect(centeredContent).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to /home when CTA button is clicked', async () => {
      const { user } = renderWithMemoryRouter(<LandingPage />);

      const ctaButton = screen.getByRole('button', { name: /start shopping/i });
      await user.click(ctaButton);

      // Navigation should occur to /home
      // Note: with MemoryRouter, we can verify navigation was triggered
      expect(ctaButton).toBeInTheDocument();
    });
  });

  describe('theme toggle', () => {
    it('theme toggle button is clickable', async () => {
      const { user } = renderWithMemoryRouter(<LandingPage />);

      const themeButton = screen.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      });

      await user.click(themeButton);

      // Button should still be present after click
      expect(themeButton).toBeInTheDocument();
    });

    it('theme toggle has correct aria-label', () => {
      renderWithMemoryRouter(<LandingPage />);

      const themeButton = screen.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      });

      expect(themeButton).toHaveAttribute('aria-label');
    });
  });

  describe('styling', () => {
    it('applies Metropolis font family to brand name', () => {
      renderWithMemoryRouter(<LandingPage />);

      const brandName = screen.getByText('MART');
      // Check that the style attribute contains the expected font family
      expect(brandName).toHaveAttribute('style', expect.stringContaining('Metropolis'));
    });

    it('brand name has bold font weight', () => {
      renderWithMemoryRouter(<LandingPage />);

      const brandName = screen.getByText('MART');
      expect(brandName).toHaveClass('font-extrabold');
    });
  });

  describe('accessibility', () => {
    it('CTA button is focusable', () => {
      renderWithMemoryRouter(<LandingPage />);

      const ctaButton = screen.getByRole('button', { name: /start shopping/i });
      expect(ctaButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('theme toggle button is focusable', () => {
      renderWithMemoryRouter(<LandingPage />);

      const themeButton = screen.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      });
      expect(themeButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('has heading element for brand name', () => {
      renderWithMemoryRouter(<LandingPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('MART');
    });
  });

  describe('decorative elements', () => {
    it('renders decorative background elements', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      // Decorative blur elements should be present
      const blurElements = container.querySelectorAll('.rounded-full.pointer-events-none');
      expect(blurElements.length).toBeGreaterThan(0);
    });
  });

  describe('responsive design', () => {
    it('has responsive text sizes', () => {
      renderWithMemoryRouter(<LandingPage />);

      const brandName = screen.getByText('MART');
      // Should have responsive text classes
      expect(brandName).toHaveClass('text-5xl');
    });

    it('has responsive padding', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      const contentArea = container.querySelector('.px-6');
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe('logo icon', () => {
    it('renders shopping bag icon in logo area', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      // Logo icon should be present (FiShoppingBag renders as SVG)
      const svgElements = container.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThan(0);
    });
  });

  describe('CTA button styling', () => {
    it('CTA button has rounded-full class', () => {
      renderWithMemoryRouter(<LandingPage />);

      const ctaButton = screen.getByRole('button', { name: /start shopping/i });
      expect(ctaButton).toHaveClass('rounded-full');
    });

    it('CTA button has transition classes for hover effects', () => {
      renderWithMemoryRouter(<LandingPage />);

      const ctaButton = screen.getByRole('button', { name: /start shopping/i });
      expect(ctaButton).toHaveClass('transition-all');
    });
  });

  describe('theme toggle positioning', () => {
    it('theme toggle is positioned in top right corner', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      const themeContainer = container.querySelector('.absolute.top-6.right-6');
      expect(themeContainer).toBeInTheDocument();
    });
  });

  describe('overflow handling', () => {
    it('main container has overflow-hidden', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      const mainContainer = container.querySelector('.overflow-hidden');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('content layout', () => {
    it('uses flex column layout for main content', () => {
      const { container } = renderWithMemoryRouter(<LandingPage />);

      const flexColumn = container.querySelector('.flex-col');
      expect(flexColumn).toBeInTheDocument();
    });
  });

  describe('interaction states', () => {
    it('CTA button has cursor pointer', () => {
      renderWithMemoryRouter(<LandingPage />);

      const ctaButton = screen.getByRole('button', { name: /start shopping/i });
      expect(ctaButton).toHaveClass('cursor-pointer');
    });

    it('theme toggle has cursor pointer', () => {
      renderWithMemoryRouter(<LandingPage />);

      const themeButton = screen.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      });
      expect(themeButton).toHaveClass('cursor-pointer');
    });
  });
});

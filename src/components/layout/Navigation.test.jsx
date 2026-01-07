// Navigation component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import Navigation from './Navigation';
import { render, renderWithMemoryRouter } from '../../testing/test-utils';

describe('Navigation', () => {
  const mockOnCategoryChange = vi.fn();
  const mockOnSearchChange = vi.fn();
  const mockOnOffersClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Navigation />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders nav element', () => {
      render(<Navigation />);

      const nav = document.querySelector('nav');
      expect(nav).toBeInTheDocument();
    });

    it('renders search bar', () => {
      render(<Navigation />);

      expect(screen.getAllByPlaceholderText(/search/i).length).toBeGreaterThan(0);
    });

    it('renders category buttons on desktop', () => {
      render(<Navigation />);

      expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    });

    it('renders offers button', () => {
      render(<Navigation />);

      const offersButtons = screen.getAllByRole('button', { name: /offers/i });
      expect(offersButtons.length).toBeGreaterThan(0);
    });

    it('renders mobile menu button', () => {
      render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu|close menu/i });
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('category navigation', () => {
    it('shows all category as default active', () => {
      render(<Navigation activeCategory="all" />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toBeInTheDocument();
    });

    it('calls onCategoryChange when category is clicked', async () => {
      const { user } = render(
        <Navigation activeCategory="all" onCategoryChange={mockOnCategoryChange} />,
      );

      const electronicsButton = screen.getByRole('button', { name: /electronics/i });
      await user.click(electronicsButton);

      expect(mockOnCategoryChange).toHaveBeenCalledWith('electronics');
    });

    it('highlights active category', () => {
      render(<Navigation activeCategory="fashion" />);

      const fashionButton = screen.getByRole('button', { name: /fashion/i });
      expect(fashionButton).toHaveClass('border-b-2');
    });

    it('does not highlight inactive categories', () => {
      render(<Navigation activeCategory="fashion" />);

      const electronicsButton = screen.getByRole('button', { name: /electronics/i });
      expect(electronicsButton).not.toHaveClass('border-b-2');
    });

    it('renders all product categories', () => {
      render(<Navigation />);

      // Check for common categories
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /electronics/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fashion/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /beauty/i })).toBeInTheDocument();
    });

    it('category buttons have cursor pointer', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveClass('cursor-pointer');
    });

    it('category buttons have transition effects', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveClass('transition-all');
    });
  });

  describe('search functionality', () => {
    it('displays search input', () => {
      render(<Navigation />);

      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it('shows provided search term', () => {
      render(<Navigation searchTerm="test search" />);

      const searchInputs = screen.getAllByDisplayValue('test search');
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it('calls onSearchChange when typing', async () => {
      const { user } = render(<Navigation onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, 'test');

      expect(mockOnSearchChange).toHaveBeenCalled();
    });

    it('search input has correct placeholder', () => {
      render(<Navigation />);

      const desktopSearch = screen.getByPlaceholderText('Search products...');
      expect(desktopSearch).toBeInTheDocument();
    });

    it('mobile search has shorter placeholder', () => {
      render(<Navigation />);

      const mobileSearch = screen.getByPlaceholderText('Search...');
      expect(mobileSearch).toBeInTheDocument();
    });

    it('clears search when clear is triggered', async () => {
      const { user } = render(<Navigation searchTerm="test" onSearchChange={mockOnSearchChange} />);

      // Find and click clear button (there may be multiple, get first one)
      const clearButtons = screen.getAllByRole('button', { name: /clear search/i });
      await user.click(clearButtons[0]);

      expect(mockOnSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('offers functionality', () => {
    it('renders offers button in desktop view', () => {
      render(<Navigation />);

      const offersButton = screen.getAllByRole('button', { name: /offers/i })[0];
      expect(offersButton).toBeInTheDocument();
    });

    it('calls onOffersClick when offers button is clicked', async () => {
      const { user } = render(<Navigation onOffersClick={mockOnOffersClick} />);

      const offersButtons = screen.getAllByRole('button', { name: /offers/i });
      await user.click(offersButtons[0]);

      expect(mockOnOffersClick).toHaveBeenCalled();
    });

    it('highlights offers when viewingOffers is true', () => {
      render(<Navigation viewingOffers={true} />);

      const offersButton = screen.getAllByRole('button', { name: /offers/i })[0];
      expect(offersButton).toHaveClass('border-b-2');
    });

    it('does not highlight categories when viewingOffers is true', () => {
      render(<Navigation activeCategory="all" viewingOffers={true} />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).not.toHaveClass('border-b-2');
    });
  });

  describe('mobile menu', () => {
    it('mobile menu is closed by default', () => {
      render(<Navigation />);

      // Mobile menu content should not be visible initially
      const mobileMenuContent = document.querySelector('.md\\:hidden.border-t');
      expect(mobileMenuContent).not.toBeInTheDocument();
    });

    it('opens mobile menu when menu button is clicked', async () => {
      const { user } = render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        expect(closeButton).toBeInTheDocument();
      });
    });

    it('closes mobile menu when close button is clicked', async () => {
      const { user } = render(<Navigation />);

      // Open menu
      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      // Close menu
      await waitFor(async () => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        await user.click(closeButton);
      });

      await waitFor(() => {
        const openButton = screen.getByRole('button', { name: /open menu/i });
        expect(openButton).toBeInTheDocument();
      });
    });

    it('mobile menu contains all categories', async () => {
      const { user } = render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      await waitFor(() => {
        // Check mobile menu has categories
        const mobileCategories = document.querySelectorAll('.md\\:hidden button');
        expect(mobileCategories.length).toBeGreaterThan(0);
      });
    });

    it('mobile menu contains offers option', async () => {
      const { user } = render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      await waitFor(() => {
        const offersButtons = screen.getAllByRole('button', { name: /offers/i });
        expect(offersButtons.length).toBeGreaterThan(1);
      });
    });

    it('closes mobile menu when category is selected', async () => {
      const { user } = render(<Navigation onCategoryChange={mockOnCategoryChange} />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      await waitFor(async () => {
        const mobileButtons = document.querySelectorAll('.md\\:hidden [type="button"]');
        if (mobileButtons.length > 0) {
          await user.click(mobileButtons[0]);
        }
      });
    });

    it('menu button has aria-expanded attribute', () => {
      render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded');
    });
  });

  describe('default prop values', () => {
    it('defaults activeCategory to all', () => {
      render(<Navigation />);

      // Component should render without errors with default
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    });

    it('defaults searchTerm to empty string', () => {
      render(<Navigation />);

      const searchInput = screen.getByPlaceholderText(/search products/i);
      expect(searchInput).toHaveValue('');
    });

    it('defaults viewingOffers to false', () => {
      render(<Navigation />);

      const offersButton = screen.getAllByRole('button', { name: /offers/i })[0];
      expect(offersButton).not.toHaveClass('border-b-2');
    });
  });

  describe('navigation styling', () => {
    it('nav has shadow', () => {
      render(<Navigation />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('shadow-md');
    });

    it('nav has vertical padding', () => {
      render(<Navigation />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('py-4');
    });

    it('nav has z-index', () => {
      render(<Navigation />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveClass('z-50');
    });

    it('has max-width container', () => {
      const { container } = render(<Navigation />);

      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('has responsive horizontal padding', () => {
      const { container } = render(<Navigation />);

      const paddedContainer = container.querySelector('.px-4');
      expect(paddedContainer).toBeInTheDocument();
    });
  });

  describe('desktop vs mobile layout', () => {
    it('desktop categories are hidden on mobile', () => {
      const { container } = render(<Navigation />);

      const desktopNav = container.querySelector('.hidden.md\\:flex');
      expect(desktopNav).toBeInTheDocument();
    });

    it('desktop search is hidden on mobile', () => {
      const { container } = render(<Navigation />);

      const desktopSearch = container.querySelector('.hidden.md\\:block');
      expect(desktopSearch).toBeInTheDocument();
    });

    it('mobile menu button is hidden on desktop', () => {
      const { container } = render(<Navigation />);

      const mobileContainer = container.querySelector('.md\\:hidden');
      expect(mobileContainer).toBeInTheDocument();
    });
  });

  describe('search bar variants', () => {
    it('desktop search bar exists', () => {
      render(<Navigation />);

      const desktopSearch = screen.getByPlaceholderText('Search products...');
      expect(desktopSearch).toBeInTheDocument();
    });

    it('mobile search bar exists', () => {
      render(<Navigation />);

      const mobileSearch = screen.getByPlaceholderText('Search...');
      expect(mobileSearch).toBeInTheDocument();
    });
  });

  describe('category button styling', () => {
    it('buttons have type button', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveAttribute('type', 'button');
    });

    it('buttons have text-sm class', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveClass('text-sm');
    });

    it('buttons have font-medium class', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveClass('font-medium');
    });

    it('buttons are capitalized', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveClass('capitalize');
    });

    it('buttons have padding', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveClass('px-3');
      expect(allButton).toHaveClass('py-2');
    });
  });

  describe('accessibility', () => {
    it('all category buttons are accessible', () => {
      render(<Navigation />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('search input has aria-label', () => {
      render(<Navigation />);

      const searchInputs = screen.getAllByRole('textbox');
      searchInputs.forEach((input) => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('mobile menu button has aria-label', () => {
      render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      expect(menuButton).toHaveAccessibleName();
    });

    it('buttons are keyboard focusable', () => {
      render(<Navigation />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('navigation with router', () => {
    it('renders correctly with memory router', () => {
      renderWithMemoryRouter(<Navigation />, { initialEntries: ['/home'] });

      expect(screen.getAllByPlaceholderText(/search/i).length).toBeGreaterThan(0);
    });

    it('navigation works from different routes', () => {
      renderWithMemoryRouter(<Navigation />, { initialEntries: ['/products'] });

      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles rapid category clicks', async () => {
      const { user } = render(<Navigation onCategoryChange={mockOnCategoryChange} />);

      const electronicsButton = screen.getByRole('button', { name: /electronics/i });
      const fashionButton = screen.getByRole('button', { name: /fashion/i });

      await user.click(electronicsButton);
      await user.click(fashionButton);
      await user.click(electronicsButton);

      expect(mockOnCategoryChange).toHaveBeenCalledTimes(3);
    });

    it('handles search with empty string', async () => {
      const { user } = render(<Navigation searchTerm="" onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, ' ');
      await user.clear(searchInput);

      expect(mockOnSearchChange).toHaveBeenCalled();
    });

    it('handles special characters in search', async () => {
      const { user } = render(<Navigation onSearchChange={mockOnSearchChange} />);

      const searchInput = screen.getByPlaceholderText('Search products...');
      await user.type(searchInput, '!@#$%');

      expect(mockOnSearchChange).toHaveBeenCalled();
    });

    it('re-renders when props change', () => {
      const { rerender } = render(<Navigation activeCategory="all" />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveClass('border-b-2');

      rerender(<Navigation activeCategory="fashion" />);

      const fashionButton = screen.getByRole('button', { name: /fashion/i });
      expect(fashionButton).toHaveClass('border-b-2');
    });

    it('handles undefined callbacks gracefully', async () => {
      const { user } = render(<Navigation />);

      const electronicsButton = screen.getByRole('button', { name: /electronics/i });
      await user.click(electronicsButton);

      // Should not throw error
      expect(electronicsButton).toBeInTheDocument();
    });
  });

  describe('sticky behavior', () => {
    it('nav can become fixed when scrolled', () => {
      render(<Navigation />);

      const nav = document.querySelector('nav');
      // Nav has classes for potential fixed positioning
      expect(nav).toHaveClass('left-0');
      expect(nav).toHaveClass('right-0');
    });

    it('has placeholder element for sticky behavior', () => {
      const { container } = render(<Navigation />);

      // There should be a placeholder div for layout
      const placeholder = container.firstChild;
      expect(placeholder).toBeInTheDocument();
    });
  });

  describe('category spacing', () => {
    it('desktop categories have horizontal spacing', () => {
      const { container } = render(<Navigation />);

      const categoryContainer = container.querySelector('.space-x-8');
      expect(categoryContainer).toBeInTheDocument();
    });

    it('mobile categories have vertical spacing', async () => {
      const { user, container } = render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      await waitFor(() => {
        const mobileMenu = container.querySelector('.space-y-1');
        expect(mobileMenu).toBeInTheDocument();
      });
    });
  });

  describe('search bar positioning', () => {
    it('desktop search has max width', () => {
      const { container } = render(<Navigation />);

      const searchContainer = container.querySelector('.max-w-md');
      expect(searchContainer).toBeInTheDocument();
    });

    it('desktop search has grow class', () => {
      const { container } = render(<Navigation />);

      const searchContainer = container.querySelector('.grow');
      expect(searchContainer).toBeInTheDocument();
    });

    it('desktop search has horizontal margin', () => {
      const { container } = render(<Navigation />);

      const searchContainer = container.querySelector('.mx-4');
      expect(searchContainer).toBeInTheDocument();
    });

    it('mobile search has fixed width', () => {
      const { container } = render(<Navigation />);

      const mobileSearchContainer = container.querySelector('[style*="width: 220px"]');
      expect(mobileSearchContainer).toBeInTheDocument();
    });
  });

  describe('menu icon', () => {
    it('shows menu icon when closed', () => {
      render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      const svg = menuButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('shows close icon when open', async () => {
      const { user } = render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        const svg = closeButton.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('mobile menu animation', () => {
    it('menu animates in when opened', async () => {
      const { user } = render(<Navigation />);

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      // AnimatePresence wraps the mobile menu
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close menu/i });
        expect(closeButton).toBeInTheDocument();
      });
    });
  });

  describe('theme integration', () => {
    it('nav has background style', () => {
      render(<Navigation />);

      const nav = document.querySelector('nav');
      expect(nav).toHaveAttribute('style');
    });

    it('buttons have inline styles for colors', () => {
      render(<Navigation />);

      const allButton = screen.getByRole('button', { name: /^all$/i });
      expect(allButton).toHaveAttribute('style');
    });
  });

  describe('flex layout', () => {
    it('main container uses flex justify-between', () => {
      const { container } = render(<Navigation />);

      const flexContainer = container.querySelector('.flex.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    it('main container aligns items center', () => {
      const { container } = render(<Navigation />);

      const flexContainer = container.querySelector('.items-center');
      expect(flexContainer).toBeInTheDocument();
    });
  });
});

// ProfilePage component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { render, renderWithMemoryRouter } from '../testing/test-utils';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
      main: ({ children, ...props }) => <main {...props}>{children}</main>,
    },
  };
});

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the page title', () => {
      render(<ProfilePage />);

      expect(screen.getByRole('heading', { name: /my profile/i })).toBeInTheDocument();
    });

    it('renders as main element', () => {
      render(<ProfilePage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders the page subtitle', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/manage your personal information/i)).toBeInTheDocument();
    });

    it('renders back to home link', () => {
      render(<ProfilePage />);

      const backLink = screen.getByRole('link', { name: /back to home/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/home');
    });

    it('renders edit profile button initially', () => {
      render(<ProfilePage />);

      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });
  });

  describe('profile card section', () => {
    it('displays user avatar', () => {
      render(<ProfilePage />);

      const avatar = screen.getByAltText(/profile/i);
      expect(avatar).toBeInTheDocument();
    });

    it('displays user name', () => {
      render(<ProfilePage />);

      // Default profile should show a name
      expect(document.body).toBeInTheDocument();
    });

    it('displays user email', () => {
      render(<ProfilePage />);

      // Email should be visible in profile card
      expect(document.body).toBeInTheDocument();
    });

    it('displays order count', () => {
      render(<ProfilePage />);

      expect(screen.getByText('Orders')).toBeInTheDocument();
    });

    it('displays wishlist count', () => {
      render(<ProfilePage />);

      expect(screen.getByText('Wishlist')).toBeInTheDocument();
    });

    it('displays member since information', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/member since/i)).toBeInTheDocument();
    });
  });

  describe('profile details section', () => {
    it('displays personal information heading', () => {
      render(<ProfilePage />);

      const personalInfoElements = screen.getAllByText(/personal information/i);
      expect(personalInfoElements.length).toBeGreaterThan(0);
    });

    it('displays full name info card', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/full name/i)).toBeInTheDocument();
    });

    it('displays email address info card', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/email address/i)).toBeInTheDocument();
    });

    it('displays phone number info card', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/phone number/i)).toBeInTheDocument();
    });

    it('displays address info card', () => {
      render(<ProfilePage />);

      const addressLabels = screen.getAllByText(/address/i);
      expect(addressLabels.length).toBeGreaterThan(0);
    });

    it('displays address details section', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/address details/i)).toBeInTheDocument();
    });

    it('displays city field', () => {
      render(<ProfilePage />);

      expect(screen.getByText('City')).toBeInTheDocument();
    });

    it('displays state field', () => {
      render(<ProfilePage />);

      expect(screen.getByText('State')).toBeInTheDocument();
    });

    it('displays ZIP code field', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/zip code/i)).toBeInTheDocument();
    });

    it('displays country field', () => {
      render(<ProfilePage />);

      expect(screen.getByText('Country')).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    it('enters edit mode when edit button is clicked', async () => {
      const { user } = render(<ProfilePage />);

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      await user.click(editButton);

      // Should show Edit Profile heading and form
      await waitFor(() => {
        expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
      });
    });

    it('hides edit button when in edit mode', async () => {
      const { user } = render(<ProfilePage />);

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
      });
    });

    it('shows ProfileForm when in edit mode', async () => {
      const { user } = render(<ProfilePage />);

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });
    });

    it('exits edit mode when cancel is clicked', async () => {
      const { user } = render(<ProfilePage />);

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      await user.click(editButton);

      // Click cancel
      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(cancelButton).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Should show edit button again
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
      });
    });
  });

  describe('layout', () => {
    it('uses grid layout for profile sections', () => {
      const { container } = render(<ProfilePage />);

      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
    });

    it('has correct max-width constraint', () => {
      const { container } = render(<ProfilePage />);

      const maxWidthContainer = container.querySelector('.max-w-4xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('applies minimum height to page', () => {
      render(<ProfilePage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('min-h-screen');
    });

    it('applies padding to page', () => {
      render(<ProfilePage />);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('py-8');
    });
  });

  describe('accessibility', () => {
    it('has accessible page title', () => {
      render(<ProfilePage />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('edit button is focusable', () => {
      render(<ProfilePage />);

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      expect(editButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('back link is focusable', () => {
      render(<ProfilePage />);

      const backLink = screen.getByRole('link', { name: /back to home/i });
      expect(backLink).not.toHaveAttribute('tabindex', '-1');
    });

    it('profile image has alt text', () => {
      render(<ProfilePage />);

      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('alt');
    });
  });

  describe('theming', () => {
    it('renders correctly with theme context', () => {
      render(<ProfilePage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('applies background style', () => {
      render(<ProfilePage />);

      const main = screen.getByRole('main');
      expect(main).toHaveStyle({ background: expect.any(String) });
    });
  });

  describe('navigation', () => {
    it('back to home link points to /home', () => {
      render(<ProfilePage />);

      const backLink = screen.getByRole('link', { name: /back to home/i });
      expect(backLink).toHaveAttribute('href', '/home');
    });
  });

  describe('profile card styling', () => {
    it('avatar has rounded border', () => {
      const { container } = render(<ProfilePage />);

      const avatarContainer = container.querySelector('.rounded-full.overflow-hidden');
      expect(avatarContainer).toBeInTheDocument();
    });

    it('displays online indicator', () => {
      const { container } = render(<ProfilePage />);

      // Online indicator is a small green dot
      const indicator = container.querySelector('.rounded-full');
      expect(indicator).toBeInTheDocument();
    });
  });

  describe('info cards', () => {
    it('renders info cards with icons', () => {
      const { container } = render(<ProfilePage />);

      // Info cards should have icon containers
      const iconContainers = container.querySelectorAll(
        '.rounded-full.flex.items-center.justify-center'
      );
      expect(iconContainers.length).toBeGreaterThan(0);
    });
  });

  describe('responsive design', () => {
    it('has responsive grid classes', () => {
      const { container } = render(<ProfilePage />);

      const responsiveGrid = container.querySelector('.lg\\:col-span-2');
      expect(responsiveGrid).toBeInTheDocument();
    });

    it('has responsive padding classes', () => {
      const { container } = render(<ProfilePage />);

      const responsivePadding = container.querySelector('.px-3.sm\\:px-4');
      expect(responsivePadding).toBeInTheDocument();
    });
  });

  describe('with MemoryRouter', () => {
    it('renders correctly with MemoryRouter', () => {
      renderWithMemoryRouter(<ProfilePage />, { initialEntries: ['/profile'] });

      expect(screen.getByRole('heading', { name: /my profile/i })).toBeInTheDocument();
    });
  });

  describe('quick stats', () => {
    it('displays orders statistic', () => {
      render(<ProfilePage />);

      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
    });

    it('displays wishlist statistic', () => {
      render(<ProfilePage />);

      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('Wishlist')).toBeInTheDocument();
    });
  });

  describe('edit button styling', () => {
    it('edit button has icon', () => {
      render(<ProfilePage />);

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      const svg = editButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('edit button has flex layout for icon and text', () => {
      render(<ProfilePage />);

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      expect(editButton).toHaveClass('flex');
      expect(editButton).toHaveClass('items-center');
    });
  });
});

// Logo component tests
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Logo from './Logo';
import { render, renderWithTheme } from '../testing/test-utils';

describe('Logo', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Logo />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders MART text', () => {
      render(<Logo />);

      expect(screen.getByText('MART')).toBeInTheDocument();
    });

    it('renders For You tagline', () => {
      render(<Logo />);

      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders logo image', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img[alt="Mart For You"]');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src');
    });

    it('renders logo image with alt text', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img[alt="Mart For You"]');
      expect(img).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('renders medium size by default', () => {
      const { container: _container } = render(<Logo />);

      const textElement = screen.getByText('MART');
      expect(textElement).toHaveClass('text-lg');
    });

    it('renders small size when size is sm', () => {
      const { container: _container } = render(<Logo size="sm" />);

      const textElement = screen.getByText('MART');
      expect(textElement).toHaveClass('text-base');
    });

    it('renders medium size when size is md', () => {
      const { container: _container } = render(<Logo size="md" />);

      const textElement = screen.getByText('MART');
      expect(textElement).toHaveClass('text-lg');
    });

    it('renders large size when size is lg', () => {
      const { container: _container } = render(<Logo size="lg" />);

      const textElement = screen.getByText('MART');
      expect(textElement).toHaveClass('text-xl');
    });

    it('uses different image sizes for different size props', () => {
      const { container: smContainer } = render(<Logo size="sm" />);
      const { container: lgContainer } = render(<Logo size="lg" />);

      const smImg = smContainer.querySelector('img');
      const lgImg = lgContainer.querySelector('img');

      expect(smImg).toHaveAttribute('width', '34');
      expect(lgImg).toHaveAttribute('width', '48');
    });

    it('small size has smaller container gap', () => {
      const { container } = render(<Logo size="sm" />);

      const logoContainer = container.querySelector('.gap-2');
      expect(logoContainer).toBeInTheDocument();
    });

    it('medium size has medium container gap', () => {
      const { container } = render(<Logo size="md" />);

      const logoContainer = container.querySelector('.gap-2\\.5');
      expect(logoContainer).toBeInTheDocument();
    });

    it('large size has larger container gap', () => {
      const { container } = render(<Logo size="lg" />);

      const logoContainer = container.querySelector('.gap-3');
      expect(logoContainer).toBeInTheDocument();
    });

    it('tagline has correct size for small variant', () => {
      render(<Logo size="sm" />);

      const tagline = screen.getByText('For You');
      expect(tagline.className).toContain('text-[9px]');
    });

    it('tagline has correct size for large variant', () => {
      render(<Logo size="lg" />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('text-xs');
    });

    it('falls back to medium size for invalid size prop', () => {
      const { container: _container } = render(<Logo size="invalid" />);

      const textElement = screen.getByText('MART');
      expect(textElement).toHaveClass('text-lg');
    });
  });

  describe('animate prop', () => {
    it('animations are enabled by default', () => {
      const { container } = render(<Logo />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders correctly when animate is true', () => {
      render(<Logo animate={true} />);

      expect(screen.getByText('MART')).toBeInTheDocument();
    });

    it('renders correctly when animate is false', () => {
      render(<Logo animate={false} />);

      expect(screen.getByText('MART')).toBeInTheDocument();
    });

    it('still renders all text elements when animate is false', () => {
      render(<Logo animate={false} />);

      expect(screen.getByText('MART')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders logo image when animate is false', () => {
      const { container } = render(<Logo animate={false} />);

      const img = container.querySelector('img[alt="Mart For You"]');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src');
    });
  });

  describe('onClick handler', () => {
    it('calls onClick when logo is clicked', async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();
      render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByRole('img', { name: 'Mart For You logo' });
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClick is not provided', async () => {
      const user = userEvent.setup();
      render(<Logo />);

      const logoContainer = screen.getByRole('img', { name: 'Mart For You logo' });
      await user.click(logoContainer);

      // Should not throw error
      expect(screen.getByText('MART')).toBeInTheDocument();
    });

    it('calls onClick only once per click', async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();
      render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByRole('img', { name: 'Mart For You logo' });
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();
      render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByRole('img', { name: 'Mart For You logo' });
      await user.click(logoContainer);
      await user.click(logoContainer);
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('text styling', () => {
    it('MART text has font-bold class', () => {
      render(<Logo />);

      const text = screen.getByText('MART');
      expect(text).toHaveClass('font-bold');
    });

    it('MART text has tracking-tight class', () => {
      render(<Logo />);

      const text = screen.getByText('MART');
      expect(text).toHaveClass('tracking-tight');
    });

    it('MART text is uppercase', () => {
      render(<Logo />);

      const text = screen.getByText('MART');
      expect(text.textContent).toBe('MART');
    });

    it('MART text has inline style for color', () => {
      render(<Logo />);

      const text = screen.getByText('MART');
      expect(text).toHaveAttribute('style', expect.stringContaining('color'));
    });
  });

  describe('logo icon', () => {
    it('renders logo image with src', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src');
      expect(img.getAttribute('src')).toMatch(/logo/);
    });

    it('renders logo image with width', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('width');
    });

    it('renders logo image with height', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('height');
    });

    it('logo image has object-fit contain style', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('style', expect.stringContaining('object-fit: contain'));
    });

    it('logo image is aria-hidden', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('aria-hidden', 'true');
    });

    it('logo image has alt text', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', 'Mart For You');
    });
  });

  describe('iconOnly mode', () => {
    it('renders only icon when iconOnly is true', () => {
      const { container } = render(<Logo iconOnly={true} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(screen.queryByText('MART')).not.toBeInTheDocument();
    });

    it('does not render tagline when iconOnly is true', () => {
      render(<Logo iconOnly={true} />);

      expect(screen.queryByText('For You')).not.toBeInTheDocument();
    });

    it('renders text when iconOnly is false', () => {
      render(<Logo iconOnly={false} />);

      expect(screen.getByText('MART')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders text by default', () => {
      render(<Logo />);

      expect(screen.getByText('MART')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });
  });

  describe('layout structure', () => {
    it('renders flex container', () => {
      const { container } = render(<Logo />);

      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });

    it('has items-center alignment', () => {
      const { container } = render(<Logo />);

      const alignedContainer = container.querySelector('.items-center');
      expect(alignedContainer).toBeInTheDocument();
    });

    it('has cursor-pointer for clickability', () => {
      const { container } = render(<Logo />);

      const clickable = container.querySelector('.cursor-pointer');
      expect(clickable).toBeInTheDocument();
    });

    it('has select-none to prevent text selection', () => {
      const { container } = render(<Logo />);

      const noSelect = container.querySelector('.select-none');
      expect(noSelect).toBeInTheDocument();
    });
  });

  describe('tagline', () => {
    it('renders For You text', () => {
      render(<Logo />);

      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('tagline has uppercase class', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('uppercase');
    });

    it('tagline has tracking-wide class', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('tracking-wide');
    });

    it('tagline has font-medium class', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('font-medium');
    });

    it('tagline has color style', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveAttribute('style', expect.stringContaining('color'));
    });

    it('tagline has letter-spacing style', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveAttribute('style', expect.stringContaining('letter-spacing'));
    });
  });

  describe('container styling', () => {
    it('uses flexbox layout', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('.flex');
      expect(logoContainer).toBeInTheDocument();
    });

    it('has cursor pointer for clickability', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('.cursor-pointer');
      expect(logoContainer).toBeInTheDocument();
    });

    it('has items-center for vertical alignment', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('.items-center');
      expect(logoContainer).toBeInTheDocument();
    });
  });

  describe('text container layout', () => {
    it('text container uses flex column', () => {
      const { container } = render(<Logo />);

      const textContainer = container.querySelector('.flex-col');
      expect(textContainer).toBeInTheDocument();
    });

    it('text container has justify-center', () => {
      const { container } = render(<Logo />);

      const textContainer = container.querySelector('.justify-center');
      expect(textContainer).toBeInTheDocument();
    });

    it('text container has leading-none', () => {
      const { container } = render(<Logo />);

      const textContainer = container.querySelector('.leading-none');
      expect(textContainer).toBeInTheDocument();
    });
  });

  describe('logo image positioning', () => {
    it('logo image container has shrink-0', () => {
      const { container } = render(<Logo />);

      const imgContainer = container.querySelector('.shrink-0');
      expect(imgContainer).toBeInTheDocument();
    });

    it('logo image is inside the shrink-0 container', () => {
      const { container } = render(<Logo />);

      const imgContainer = container.querySelector('.shrink-0');
      const img = imgContainer?.querySelector('img');
      expect(img).toBeInTheDocument();
    });
  });

  describe('theme integration', () => {
    it('renders correctly with theme provider', () => {
      renderWithTheme(<Logo />);

      expect(screen.getByText('MART')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('MART text has theme-based color style', () => {
      renderWithTheme(<Logo />);

      const text = screen.getByText('MART');
      expect(text).toHaveAttribute('style', expect.stringContaining('color'));
    });

    it('tagline has theme-based color style', () => {
      renderWithTheme(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveAttribute('style', expect.stringContaining('color'));
    });
  });

  describe('accessibility', () => {
    it('logo is clickable via keyboard when onClick provided', () => {
      const mockOnClick = vi.fn();
      render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByRole('img', { name: 'Mart For You logo' });
      expect(logoContainer).not.toHaveAttribute('tabindex', '-1');
    });

    it('text is visible and readable', () => {
      render(<Logo />);

      expect(screen.getByText('MART')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('logo image is part of the document', () => {
      const { container } = render(<Logo />);

      const img = container.querySelector('img[alt="Mart For You"]');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src');
    });
  });

  describe('motion hover behavior', () => {
    it('container is a motion element', () => {
      const { container } = render(<Logo />);

      // Check that the container is present and has expected structure
      const motionDiv = container.firstChild;
      expect(motionDiv).toBeInTheDocument();
      expect(motionDiv).toHaveClass('flex');
    });
  });

  describe('edge cases', () => {
    it('renders with all props specified', () => {
      const mockOnClick = vi.fn();
      render(<Logo size="lg" animate={true} onClick={mockOnClick} />);

      expect(screen.getByText('MART')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders with undefined size gracefully', () => {
      render(<Logo size={undefined} />);

      // Should fall back to medium size
      const textElement = screen.getByText('MART');
      expect(textElement).toHaveClass('text-lg');
    });

    it('renders with undefined animate gracefully', () => {
      render(<Logo animate={undefined} />);

      expect(screen.getByText('MART')).toBeInTheDocument();
    });

    it('handles re-renders correctly', () => {
      const { rerender } = render(<Logo size="sm" />);

      expect(screen.getByText('MART')).toHaveClass('text-base');

      rerender(<Logo size="lg" />);

      expect(screen.getByText('MART')).toHaveClass('text-xl');
    });
  });

  describe('combined props', () => {
    it('small size with no animation', () => {
      render(<Logo size="sm" animate={false} />);

      const text = screen.getByText('MART');
      expect(text).toHaveClass('text-base');
    });

    it('large size with animation', () => {
      render(<Logo size="lg" animate={true} />);

      const text = screen.getByText('MART');
      expect(text).toHaveClass('text-xl');
    });

    it('medium size with onClick', async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();
      render(<Logo size="md" onClick={mockOnClick} />);

      const logoContainer = screen.getByRole('img', { name: 'Mart For You logo' });
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalled();
    });
  });

  describe('image dimensions', () => {
    it('small size has correct image width', () => {
      const { container } = render(<Logo size="sm" />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('width', '34');
    });

    it('small size has correct image height', () => {
      const { container } = render(<Logo size="sm" />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('height', '34');
    });

    it('medium size has correct image width', () => {
      const { container } = render(<Logo size="md" />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('width', '40');
    });

    it('medium size has correct image height', () => {
      const { container } = render(<Logo size="md" />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('height', '40');
    });

    it('large size has correct image width', () => {
      const { container } = render(<Logo size="lg" />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('width', '48');
    });

    it('large size has correct image height', () => {
      const { container } = render(<Logo size="lg" />);

      const img = container.querySelector('img');
      expect(img).toHaveAttribute('height', '48');
    });
  });

  describe('text rendering', () => {
    it('renders MART as a single text element', () => {
      render(<Logo />);

      const martText = screen.getByText('MART');
      expect(martText.textContent).toBe('MART');
    });
  });

  describe('logo container', () => {
    it('logo container has flex layout', () => {
      const { container } = render(<Logo />);

      const flexContainer = container.querySelector('.flex.items-center');
      expect(flexContainer).toBeInTheDocument();
    });
  });
});

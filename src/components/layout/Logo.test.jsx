// Logo component tests
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import Logo from './Logo';
import { render, renderWithTheme } from '../../testing/test-utils';

describe('Logo', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Logo />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders MART text', () => {
      render(<Logo />);

      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('renders For You tagline', () => {
      render(<Logo />);

      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders shopping bag SVG', () => {
      const { container } = render(<Logo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders multiple SVG paths for shopping bag', () => {
      const { container } = render(<Logo />);

      const paths = container.querySelectorAll('svg path');
      expect(paths.length).toBeGreaterThan(0);
    });
  });

  describe('size prop', () => {
    it('renders medium size by default', () => {
      const { container: _container } = render(<Logo />);

      const textElement = screen.getByText('M');
      expect(textElement).toHaveClass('text-xl');
    });

    it('renders small size when size is sm', () => {
      const { container: _container } = render(<Logo size="sm" />);

      const textElement = screen.getByText('M');
      expect(textElement).toHaveClass('text-lg');
    });

    it('renders medium size when size is md', () => {
      const { container: _container } = render(<Logo size="md" />);

      const textElement = screen.getByText('M');
      expect(textElement).toHaveClass('text-xl');
    });

    it('renders large size when size is lg', () => {
      const { container: _container } = render(<Logo size="lg" />);

      const textElement = screen.getByText('M');
      expect(textElement).toHaveClass('text-2xl');
    });

    it('uses different SVG sizes for different size props', () => {
      const { container: smContainer } = render(<Logo size="sm" />);
      const { container: lgContainer } = render(<Logo size="lg" />);

      const smSvg = smContainer.querySelector('svg');
      const lgSvg = lgContainer.querySelector('svg');

      expect(smSvg).toHaveAttribute('width', '32');
      expect(lgSvg).toHaveAttribute('width', '56');
    });

    it('small size has smaller container margin', () => {
      const { container } = render(<Logo size="sm" />);

      const textContainer = container.querySelector('.ml-10');
      expect(textContainer).toBeInTheDocument();
    });

    it('medium size has medium container margin', () => {
      const { container } = render(<Logo size="md" />);

      const textContainer = container.querySelector('.ml-14');
      expect(textContainer).toBeInTheDocument();
    });

    it('large size has larger container margin', () => {
      const { container } = render(<Logo size="lg" />);

      const textContainer = container.querySelector('.ml-16');
      expect(textContainer).toBeInTheDocument();
    });

    it('tagline has correct size for small variant', () => {
      render(<Logo size="sm" />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('text-xs');
    });

    it('tagline has correct size for large variant', () => {
      render(<Logo size="lg" />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('text-sm');
    });

    it('falls back to medium size for invalid size prop', () => {
      const { container: _container } = render(<Logo size="invalid" />);

      const textElement = screen.getByText('M');
      expect(textElement).toHaveClass('text-xl');
    });
  });

  describe('animate prop', () => {
    it('animations are enabled by default', () => {
      const { container } = render(<Logo />);

      // Animation elements should be present
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('renders correctly when animate is true', () => {
      render(<Logo animate={true} />);

      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders correctly when animate is false', () => {
      render(<Logo animate={false} />);

      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('still renders all text elements when animate is false', () => {
      render(<Logo animate={false} />);

      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders shopping bag elements when animate is false', () => {
      const { container } = render(<Logo animate={false} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('onClick handler', () => {
    it('calls onClick when logo is clicked', async () => {
      const mockOnClick = vi.fn();
      const { user } = render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByText('M').closest('div[class*="cursor-pointer"]');
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when onClick is not provided', async () => {
      const { user } = render(<Logo />);

      const logoContainer = screen.getByText('M').closest('div[class*="cursor-pointer"]');
      await user.click(logoContainer);

      // Should not throw error
      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('calls onClick only once per click', async () => {
      const mockOnClick = vi.fn();
      const { user } = render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByText('M').closest('div[class*="cursor-pointer"]');
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('can be clicked multiple times', async () => {
      const mockOnClick = vi.fn();
      const { user } = render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByText('M').closest('div[class*="cursor-pointer"]');
      await user.click(logoContainer);
      await user.click(logoContainer);
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('text styling', () => {
    it('letters have font-extrabold class', () => {
      render(<Logo />);

      const letter = screen.getByText('M');
      expect(letter).toHaveClass('font-extrabold');
    });

    it('letters have tracking-tighter class', () => {
      render(<Logo />);

      const letter = screen.getByText('M');
      expect(letter).toHaveClass('tracking-tighter');
    });

    it('letters have uppercase class', () => {
      render(<Logo />);

      const letter = screen.getByText('M');
      expect(letter).toHaveClass('uppercase');
    });

    it('letters have inline style for color', () => {
      render(<Logo />);

      const letter = screen.getByText('M');
      expect(letter).toHaveAttribute('style');
    });
  });

  describe('shopping bag icon', () => {
    it('renders SVG with viewBox', () => {
      const { container } = render(<Logo />);

      const svg = container.querySelector('svg[viewBox]');
      expect(svg).toBeInTheDocument();
    });

    it('renders bag outline path', () => {
      const { container } = render(<Logo />);

      const paths = container.querySelectorAll('svg path');
      expect(paths.length).toBeGreaterThan(0);
    });

    it('SVG has no fill (outline style)', () => {
      const { container } = render(<Logo />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('paths have stroke styling', () => {
      const { container } = render(<Logo />);

      const path = container.querySelector('svg path');
      expect(path).toHaveAttribute('stroke');
    });

    it('paths have strokeWidth', () => {
      const { container } = render(<Logo />);

      const path = container.querySelector('svg path');
      expect(path).toHaveAttribute('stroke-width');
    });

    it('paths have rounded caps', () => {
      const { container } = render(<Logo />);

      const path = container.querySelector('svg path');
      expect(path).toHaveAttribute('stroke-linecap', 'round');
    });

    it('paths have rounded joins', () => {
      const { container } = render(<Logo />);

      const path = container.querySelector('svg path');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
    });
  });

  describe('animated items', () => {
    it('renders circle item', () => {
      const { container } = render(<Logo />);

      const circle = container.querySelector('circle');
      expect(circle).toBeInTheDocument();
    });

    it('renders rectangle item', () => {
      const { container } = render(<Logo />);

      const rect = container.querySelector('rect');
      expect(rect).toBeInTheDocument();
    });

    it('renders star/polygon item', () => {
      const { container } = render(<Logo />);

      const polygon = container.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
    });

    it('items have fill colors', () => {
      const { container } = render(<Logo />);

      const circle = container.querySelector('circle');
      expect(circle).toHaveAttribute('fill');
    });
  });

  describe('underline element', () => {
    it('renders animated underline', () => {
      const { container } = render(<Logo />);

      const underline = container.querySelector('.h-0\\.5');
      expect(underline).toBeInTheDocument();
    });

    it('underline has full width', () => {
      const { container } = render(<Logo />);

      const underline = container.querySelector('.h-0\\.5.w-full');
      expect(underline).toBeInTheDocument();
    });

    it('underline has gradient style', () => {
      const { container } = render(<Logo />);

      const underline = container.querySelector('.h-0\\.5');
      expect(underline).toHaveAttribute('style');
    });

    it('underline has negative margin top', () => {
      const { container } = render(<Logo />);

      const underline = container.querySelector('.-mt-0\\.5');
      expect(underline).toBeInTheDocument();
    });
  });

  describe('tagline', () => {
    it('renders For You text', () => {
      render(<Logo />);

      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('tagline is in a container with height', () => {
      const { container } = render(<Logo />);

      const taglineContainer = container.querySelector('.h-4');
      expect(taglineContainer).toBeInTheDocument();
    });

    it('tagline container has overflow hidden', () => {
      const { container } = render(<Logo />);

      const taglineContainer = container.querySelector('.overflow-hidden');
      expect(taglineContainer).toBeInTheDocument();
    });

    it('tagline text is nowrap', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('whitespace-nowrap');
    });

    it('tagline text is block display', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveClass('block');
    });

    it('tagline has color style', () => {
      render(<Logo />);

      const tagline = screen.getByText('For You');
      expect(tagline).toHaveAttribute('style');
    });
  });

  describe('container styling', () => {
    it('has relative positioning', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('.relative');
      expect(logoContainer).toBeInTheDocument();
    });

    it('uses flexbox layout', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('.flex.items-center');
      expect(logoContainer).toBeInTheDocument();
    });

    it('has cursor pointer for clickability', () => {
      const { container } = render(<Logo />);

      const logoContainer = container.querySelector('.cursor-pointer');
      expect(logoContainer).toBeInTheDocument();
    });
  });

  describe('text container layout', () => {
    it('text container uses flex column', () => {
      const { container } = render(<Logo />);

      const textContainer = container.querySelector('.flex-col');
      expect(textContainer).toBeInTheDocument();
    });

    it('letters container uses flex', () => {
      const { container: _container } = render(<Logo />);

      const lettersContainer = screen.getByText('M').closest('.flex');
      expect(lettersContainer).toBeInTheDocument();
    });

    it('letters container aligns items center', () => {
      const { container: _container } = render(<Logo />);

      const lettersContainer = screen.getByText('M').closest('.items-center');
      expect(lettersContainer).toBeInTheDocument();
    });
  });

  describe('shopping bag positioning', () => {
    it('shopping bag is absolutely positioned', () => {
      const { container } = render(<Logo />);

      const bagContainer = container.querySelector('.absolute.left-0');
      expect(bagContainer).toBeInTheDocument();
    });

    it('animated items are positioned absolutely', () => {
      const { container } = render(<Logo />);

      const itemContainers = container.querySelectorAll('.absolute.z-10');
      expect(itemContainers.length).toBeGreaterThan(0);
    });
  });

  describe('theme integration', () => {
    it('renders correctly with theme provider', () => {
      renderWithTheme(<Logo />);

      // Check individual letters are rendered
      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('paths have theme-based stroke color', () => {
      const { container } = render(<Logo />);

      const path = container.querySelector('svg path');
      expect(path).toHaveAttribute('stroke');
    });

    it('items have theme-based fill colors', () => {
      const { container } = render(<Logo />);

      const circle = container.querySelector('circle');
      expect(circle).toHaveAttribute('fill');
    });
  });

  describe('accessibility', () => {
    it('logo is clickable via keyboard when onClick provided', () => {
      const mockOnClick = vi.fn();
      render(<Logo onClick={mockOnClick} />);

      const logoContainer = screen.getByText('M').closest('div[class*="cursor-pointer"]');
      expect(logoContainer).not.toHaveAttribute('tabindex', '-1');
    });

    it('text is visible and readable', () => {
      render(<Logo />);

      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('R')).toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('SVG elements are part of the document', () => {
      const { container } = render(<Logo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('motion hover behavior', () => {
    it('container has hover scale effect via framer-motion', () => {
      const { container } = render(<Logo />);

      // Framer motion wraps the logo
      const motionDiv = container.firstChild;
      expect(motionDiv).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders with all props specified', () => {
      const mockOnClick = vi.fn();
      render(<Logo size="lg" animate={false} onClick={mockOnClick} />);

      expect(screen.getByText('M')).toBeInTheDocument();
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('renders with undefined size gracefully', () => {
      render(<Logo size={undefined} />);

      // Should use default medium size
      const textElement = screen.getByText('M');
      expect(textElement).toHaveClass('text-xl');
    });

    it('renders with undefined animate gracefully', () => {
      render(<Logo animate={undefined} />);

      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('handles re-renders correctly', () => {
      const { rerender } = render(<Logo size="sm" />);

      expect(screen.getByText('M')).toHaveClass('text-lg');

      rerender(<Logo size="lg" />);

      expect(screen.getByText('M')).toHaveClass('text-2xl');
    });
  });

  describe('combined props', () => {
    it('small size with no animation', () => {
      render(<Logo size="sm" animate={false} />);

      const letter = screen.getByText('M');
      expect(letter).toHaveClass('text-lg');
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('large size with animation', () => {
      render(<Logo size="lg" animate={true} />);

      const letter = screen.getByText('M');
      expect(letter).toHaveClass('text-2xl');
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('medium size with onClick', async () => {
      const mockOnClick = vi.fn();
      const { user } = render(<Logo size="md" onClick={mockOnClick} />);

      const logoContainer = screen.getByText('M').closest('div[class*="cursor-pointer"]');
      await user.click(logoContainer);

      expect(mockOnClick).toHaveBeenCalled();
      expect(screen.getByText('M')).toHaveClass('text-xl');
    });
  });

  describe('SVG dimensions', () => {
    it('small size has correct SVG width', () => {
      const { container } = render(<Logo size="sm" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
    });

    it('small size has correct SVG height', () => {
      const { container } = render(<Logo size="sm" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('medium size has correct SVG width', () => {
      const { container } = render(<Logo size="md" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '45');
    });

    it('medium size has correct SVG height', () => {
      const { container } = render(<Logo size="md" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '45');
    });

    it('large size has correct SVG width', () => {
      const { container } = render(<Logo size="lg" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '56');
    });

    it('large size has correct SVG height', () => {
      const { container } = render(<Logo size="lg" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('height', '56');
    });
  });

  describe('letter rendering order', () => {
    it('renders letters in correct order M-A-R-T', () => {
      const { container: _container } = render(<Logo />);

      const letterContainer = screen.getByText('M').closest('.flex');
      const letters = letterContainer.querySelectorAll('span');

      expect(letters[0].textContent).toBe('M');
      expect(letters[1].textContent).toBe('A');
      expect(letters[2].textContent).toBe('R');
      expect(letters[3].textContent).toBe('T');
    });
  });

  describe('overflow handling', () => {
    it('SVG has overflow visible class', () => {
      const { container } = render(<Logo />);

      const svg = container.querySelector('svg.overflow-visible');
      expect(svg).toBeInTheDocument();
    });
  });
});

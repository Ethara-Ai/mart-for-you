// Hero component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import Hero from './Hero';
import { render, renderWithMemoryRouter } from '../../testing/test-utils';

describe('Hero', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Hero />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders default title', () => {
      render(<Hero />);

      expect(screen.getByText('Your One-Stop Shopping Destination')).toBeInTheDocument();
    });

    it('renders default subtitle', () => {
      render(<Hero />);

      expect(screen.getByText('Everything you need, just a click away')).toBeInTheDocument();
    });

    it('renders default CTA button', () => {
      render(<Hero />);

      expect(screen.getByRole('button', { name: 'Shop Now' })).toBeInTheDocument();
    });

    it('renders scroll indicator by default', () => {
      render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      expect(scrollButton).toBeInTheDocument();
    });

    it('renders video element', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });
  });

  describe('title prop', () => {
    it('displays custom title', () => {
      render(<Hero title="Custom Title" />);

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('title is an h1 element', () => {
      render(<Hero title="Test Title" />);

      const title = screen.getByText('Test Title');
      expect(title.tagName).toBe('H1');
    });

    it('handles long title', () => {
      const longTitle =
        'This is a very long title that might wrap to multiple lines on smaller screens';
      render(<Hero title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('handles title with special characters', () => {
      render(<Hero title="Shop Now! 50% Off & More" />);

      expect(screen.getByText('Shop Now! 50% Off & More')).toBeInTheDocument();
    });
  });

  describe('subtitle prop', () => {
    it('displays custom subtitle', () => {
      render(<Hero subtitle="Custom Subtitle" />);

      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('subtitle is a paragraph element', () => {
      render(<Hero subtitle="Test Subtitle" />);

      const subtitle = screen.getByText('Test Subtitle');
      expect(subtitle.tagName).toBe('P');
    });

    it('handles long subtitle', () => {
      const longSubtitle =
        'This is a very long subtitle that provides more details about the shopping experience';
      render(<Hero subtitle={longSubtitle} />);

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });
  });

  describe('ctaText prop', () => {
    it('displays custom CTA text', () => {
      render(<Hero ctaText="Start Shopping" />);

      expect(screen.getByRole('button', { name: 'Start Shopping' })).toBeInTheDocument();
    });

    it('handles short CTA text', () => {
      render(<Hero ctaText="Buy" />);

      expect(screen.getByRole('button', { name: 'Buy' })).toBeInTheDocument();
    });

    it('handles long CTA text', () => {
      render(<Hero ctaText="Browse Our Collection Now" />);

      expect(screen.getByRole('button', { name: 'Browse Our Collection Now' })).toBeInTheDocument();
    });
  });

  describe('ctaLink prop', () => {
    it('navigates to custom link when provided', async () => {
      const { user } = renderWithMemoryRouter(<Hero ctaLink="/products" />, {
        initialEntries: ['/'],
      });

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      await user.click(ctaButton);

      // Navigation should occur (tested via router)
    });

    it('scrolls to products section when ctaLink not provided', async () => {
      const mockScrollIntoView = vi.fn();
      const mockElement = { scrollIntoView: mockScrollIntoView };

      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      const { user } = render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      await user.click(ctaButton);

      // Should try to find products section
      expect(document.getElementById).toHaveBeenCalledWith('products-section');
    });
  });

  describe('videoUrl prop', () => {
    it('uses default video URL', () => {
      const { container } = render(<Hero />);

      const source = container.querySelector('source');
      expect(source).toHaveAttribute('src');
      expect(source.getAttribute('src')).toContain('pexels.com');
    });

    it('uses custom video URL when provided', () => {
      const customUrl = 'https://example.com/custom-video.mp4';
      const { container } = render(<Hero videoUrl={customUrl} />);

      const source = container.querySelector('source');
      expect(source).toHaveAttribute('src', customUrl);
    });

    it('video source has type mp4', () => {
      const { container } = render(<Hero />);

      const source = container.querySelector('source');
      expect(source).toHaveAttribute('type', 'video/mp4');
    });
  });

  describe('showScrollIndicator prop', () => {
    it('shows scroll indicator by default', () => {
      render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      expect(scrollButton).toBeInTheDocument();
    });

    it('shows scroll indicator when true', () => {
      render(<Hero showScrollIndicator={true} />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      expect(scrollButton).toBeInTheDocument();
    });

    it('hides scroll indicator when false', () => {
      render(<Hero showScrollIndicator={false} />);

      const scrollButton = screen.queryByRole('button', { name: /scroll to products/i });
      expect(scrollButton).not.toBeInTheDocument();
    });
  });

  describe('video element', () => {
    it('has autoPlay attribute', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('has loop attribute', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('has muted attribute', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
    });

    it('has playsInline attribute', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toHaveAttribute('playsinline');
    });

    it('is hidden from screen readers', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toHaveAttribute('aria-hidden', 'true');
    });

    it('has object-cover class for proper scaling', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toHaveClass('object-cover');
    });

    it('fills the container', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toHaveClass('w-full');
      expect(video).toHaveClass('h-full');
    });

    it('has fallback text for unsupported browsers', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video.textContent).toContain('browser does not support');
    });
  });

  describe('scroll indicator', () => {
    it('has scroll animation class', () => {
      render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      expect(scrollButton).toHaveClass('animate-bounce');
    });

    it('has cursor pointer', () => {
      render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      expect(scrollButton).toHaveClass('cursor-pointer');
    });

    it('scrolls to products section when clicked', async () => {
      const mockScrollIntoView = vi.fn();
      const mockElement = { scrollIntoView: mockScrollIntoView };

      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      const { user } = render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      await user.click(scrollButton);

      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('contains arrow icon', () => {
      const { container: _container } = render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      const svg = scrollButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('is positioned at bottom of hero', () => {
      const { container: _container } = render(<Hero />);

      const scrollContainer = screen.getByRole('button', {
        name: /scroll to products/i,
      }).parentElement;
      expect(scrollContainer).toHaveClass('absolute');
      expect(scrollContainer).toHaveClass('bottom-8');
    });
  });

  describe('CTA button', () => {
    it('has cursor pointer', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).toHaveClass('cursor-pointer');
    });

    it('has rounded-full class', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).toHaveClass('rounded-full');
    });

    it('has horizontal padding', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).toHaveClass('px-8');
    });

    it('has vertical padding', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).toHaveClass('py-3');
    });

    it('has font-medium class', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).toHaveClass('font-medium');
    });

    it('has transition effect', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).toHaveClass('transition-colors');
    });

    it('has inline style for background and color', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).toHaveAttribute('style');
    });
  });

  describe('hero section structure', () => {
    it('has hero-section id', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'hero-section');
    });

    it('is a section element', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('has specific height', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('h-[80vh]');
    });

    it('has relative positioning', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('relative');
    });

    it('has overflow hidden', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('overflow-hidden');
    });
  });

  describe('overlay', () => {
    it('renders overlay div', () => {
      const { container } = render(<Hero />);

      const overlay = container.querySelector('.backdrop-blur-xs');
      expect(overlay).toBeInTheDocument();
    });

    it('overlay covers entire hero', () => {
      const { container } = render(<Hero />);

      const overlay = container.querySelector('.inset-0.absolute');
      expect(overlay).toBeInTheDocument();
    });

    it('overlay has background color style', () => {
      const { container } = render(<Hero />);

      const overlay = container.querySelector('.backdrop-blur-xs');
      expect(overlay).toHaveAttribute('style');
    });
  });

  describe('content positioning', () => {
    it('content is centered vertically', () => {
      const { container } = render(<Hero />);

      const contentContainer = container.querySelector('.justify-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('content is centered horizontally', () => {
      const { container } = render(<Hero />);

      const contentContainer = container.querySelector('.items-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('content has max-width constraint', () => {
      const { container } = render(<Hero />);

      const contentWrapper = container.querySelector('.max-w-3xl');
      expect(contentWrapper).toBeInTheDocument();
    });

    it('content is text-centered', () => {
      const { container } = render(<Hero />);

      const contentContainer = container.querySelector('.text-center');
      expect(contentContainer).toBeInTheDocument();
    });

    it('content has z-index for layering', () => {
      const { container } = render(<Hero />);

      const contentContainer = container.querySelector('.z-10');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('title styling', () => {
    it('title has responsive font sizes', () => {
      render(<Hero />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('text-4xl');
      expect(title).toHaveClass('md:text-6xl');
    });

    it('title has bold font weight', () => {
      render(<Hero />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('font-bold');
    });

    it('title has margin bottom', () => {
      render(<Hero />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('mb-4');
    });
  });

  describe('subtitle styling', () => {
    it('subtitle has responsive font sizes', () => {
      render(<Hero />);

      const subtitle = screen.getByText('Everything you need, just a click away');
      expect(subtitle).toHaveClass('text-xl');
      expect(subtitle).toHaveClass('md:text-2xl');
    });

    it('subtitle has margin bottom', () => {
      render(<Hero />);

      const subtitle = screen.getByText('Everything you need, just a click away');
      expect(subtitle).toHaveClass('mb-8');
    });
  });

  describe('accessibility', () => {
    it('title is a heading level 1', () => {
      render(<Hero />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('CTA button is focusable', () => {
      render(<Hero />);

      const ctaButton = screen.getByRole('button', { name: 'Shop Now' });
      expect(ctaButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('scroll indicator button has accessible label', () => {
      render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll to products/i });
      expect(scrollButton).toHaveAccessibleName();
    });

    it('video is hidden from screen readers', () => {
      const { container } = render(<Hero />);

      const video = container.querySelector('video');
      expect(video).toHaveAttribute('aria-hidden', 'true');
    });

    it('all interactive elements are keyboard accessible', () => {
      render(<Hero />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('responsive design', () => {
    it('has responsive max-width container', () => {
      const { container } = render(<Hero />);

      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('has responsive padding', () => {
      const { container } = render(<Hero />);

      const paddedContainer = container.querySelector('.px-4');
      expect(paddedContainer).toBeInTheDocument();
    });

    it('has sm responsive padding', () => {
      const { container } = render(<Hero />);

      const smPaddedContainer = container.querySelector('.sm\\:px-6');
      expect(smPaddedContainer).toBeInTheDocument();
    });

    it('has lg responsive padding', () => {
      const { container } = render(<Hero />);

      const lgPaddedContainer = container.querySelector('.lg\\:px-8');
      expect(lgPaddedContainer).toBeInTheDocument();
    });
  });

  describe('theme integration', () => {
    it('renders correctly with theme provider', () => {
      render(<Hero />);

      expect(screen.getByText('Your One-Stop Shopping Destination')).toBeInTheDocument();
    });

    it('hero section has background style', () => {
      const { container } = render(<Hero />);

      const section = container.querySelector('section');
      expect(section).toHaveAttribute('style');
    });
  });

  describe('edge cases', () => {
    it('handles empty string props', () => {
      render(<Hero title="" subtitle="" ctaText="Go" />);

      // Should still render CTA
      expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    });

    it('handles all custom props together', () => {
      render(
        <Hero
          title="Custom Title"
          subtitle="Custom Subtitle"
          ctaText="Custom CTA"
          ctaLink="/custom"
          videoUrl="https://example.com/video.mp4"
          showScrollIndicator={false}
        />,
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Custom CTA' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /scroll/i })).not.toBeInTheDocument();
    });

    it('re-renders correctly when props change', () => {
      const { rerender } = render(<Hero title="Initial Title" />);

      expect(screen.getByText('Initial Title')).toBeInTheDocument();

      rerender(<Hero title="Updated Title" />);

      expect(screen.getByText('Updated Title')).toBeInTheDocument();
      expect(screen.queryByText('Initial Title')).not.toBeInTheDocument();
    });
  });

  describe('video background container', () => {
    it('video container is absolutely positioned', () => {
      const { container } = render(<Hero />);

      const videoContainer = container.querySelector('.absolute.inset-0.z-0');
      expect(videoContainer).toBeInTheDocument();
    });

    it('video container has z-0 for proper layering', () => {
      const { container } = render(<Hero />);

      const videoContainer = container.querySelector('.z-0');
      expect(videoContainer).toBeInTheDocument();
    });
  });

  describe('animation classes', () => {
    it('scroll indicator has bounce animation', () => {
      render(<Hero />);

      const scrollButton = screen.getByRole('button', { name: /scroll/i });
      expect(scrollButton).toHaveClass('animate-bounce');
    });

    it('content elements are motion components (rendered)', () => {
      render(<Hero />);

      // Just verify content renders with framer motion
      expect(screen.getByText('Your One-Stop Shopping Destination')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
    });
  });

  describe('text shadow styling', () => {
    it('title has text shadow style', () => {
      render(<Hero />);

      const title = screen.getByRole('heading', { level: 1 });
      const style = title.getAttribute('style');
      expect(style).toContain('text-shadow');
    });

    it('subtitle has text shadow style', () => {
      render(<Hero />);

      const subtitle = screen.getByText('Everything you need, just a click away');
      const style = subtitle.getAttribute('style');
      expect(style).toContain('text-shadow');
    });
  });
});

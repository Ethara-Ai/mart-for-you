// Loading component tests
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Loading from './Loading';
import { render, renderWithTheme } from '../../testing/test-utils';

describe('Loading', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders default loading message', () => {
      render(<Loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders spinner element', () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector('.rounded-full');
      expect(spinner).toBeInTheDocument();
    });

    it('renders animated dots', () => {
      const { container } = render(<Loading />);

      const dots = container.querySelectorAll('.w-2.h-2.rounded-full');
      expect(dots.length).toBe(3);
    });
  });

  describe('message prop', () => {
    it('displays custom message', () => {
      render(<Loading message="Please wait..." />);

      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('displays empty when message is empty string', () => {
      const { container } = render(<Loading message="" />);

      // Should not have the message paragraph when empty
      const messageElement = container.querySelector('p.mt-4');
      expect(messageElement).not.toBeInTheDocument();
    });

    it('displays long message correctly', () => {
      const longMessage = 'This is a very long loading message that should still display correctly';
      render(<Loading message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('displays message with special characters', () => {
      render(<Loading message="Loading... 50% complete!" />);

      expect(screen.getByText('Loading... 50% complete!')).toBeInTheDocument();
    });

    it('displays message with unicode characters', () => {
      render(<Loading message="Loading 🔄" />);

      expect(screen.getByText('Loading 🔄')).toBeInTheDocument();
    });
  });

  describe('fullScreen prop', () => {
    it('renders full screen by default', () => {
      const { container } = render(<Loading />);

      const fullScreenWrapper = container.querySelector('.fixed.inset-0');
      expect(fullScreenWrapper).toBeInTheDocument();
    });

    it('renders full screen when fullScreen is true', () => {
      const { container } = render(<Loading fullScreen={true} />);

      const fullScreenWrapper = container.querySelector('.fixed.inset-0');
      expect(fullScreenWrapper).toBeInTheDocument();
    });

    it('renders inline when fullScreen is false', () => {
      const { container } = render(<Loading fullScreen={false} />);

      const fullScreenWrapper = container.querySelector('.fixed.inset-0');
      expect(fullScreenWrapper).not.toBeInTheDocument();
    });

    it('full screen has z-50 for proper layering', () => {
      const { container } = render(<Loading fullScreen={true} />);

      const fullScreenWrapper = container.querySelector('.z-50');
      expect(fullScreenWrapper).toBeInTheDocument();
    });

    it('full screen centers content', () => {
      const { container } = render(<Loading fullScreen={true} />);

      const wrapper = container.querySelector('.flex.items-center.justify-center');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('renders medium size by default', () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector('.w-12.h-12');
      expect(spinner).toBeInTheDocument();
    });

    it('renders small size when size is sm', () => {
      const { container } = render(<Loading size="sm" />);

      const spinner = container.querySelector('.w-8.h-8');
      expect(spinner).toBeInTheDocument();
    });

    it('renders medium size when size is md', () => {
      const { container } = render(<Loading size="md" />);

      const spinner = container.querySelector('.w-12.h-12');
      expect(spinner).toBeInTheDocument();
    });

    it('renders large size when size is lg', () => {
      const { container } = render(<Loading size="lg" />);

      const spinner = container.querySelector('.w-16.h-16');
      expect(spinner).toBeInTheDocument();
    });

    it('applies small text size for sm', () => {
      const { container: _container } = render(<Loading size="sm" />);

      const message = screen.getByText('Loading...');
      expect(message).toHaveClass('text-sm');
    });

    it('applies base text size for md', () => {
      const { container: _container } = render(<Loading size="md" />);

      const message = screen.getByText('Loading...');
      expect(message).toHaveClass('text-base');
    });

    it('applies large text size for lg', () => {
      const { container: _container } = render(<Loading size="lg" />);

      const message = screen.getByText('Loading...');
      expect(message).toHaveClass('text-lg');
    });

    it('falls back to md for invalid size', () => {
      const { container } = render(<Loading size="invalid" />);

      const spinner = container.querySelector('.w-12.h-12');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional className', () => {
      const { container } = render(<Loading fullScreen={false} className="custom-class" />);

      const loadingContent = container.querySelector('.custom-class');
      expect(loadingContent).toBeInTheDocument();
    });

    it('works with empty className', () => {
      render(<Loading className="" />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('applies multiple custom classes', () => {
      const { container } = render(<Loading fullScreen={false} className="class-one class-two" />);

      const loadingContent = container.querySelector('.class-one.class-two');
      expect(loadingContent).toBeInTheDocument();
    });

    it('preserves default flex classes with custom className', () => {
      const { container } = render(<Loading fullScreen={false} className="custom" />);

      const loadingContent = container.querySelector('.flex.flex-col');
      expect(loadingContent).toBeInTheDocument();
    });
  });

  describe('spinner styling', () => {
    it('spinner has rounded-full class', () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector('.rounded-full');
      expect(spinner).toBeInTheDocument();
    });

    it('spinner has border styling', () => {
      const { container } = render(<Loading />);

      // Medium size has border-3 class
      const spinner = container.querySelector('.border-3');
      expect(spinner).toBeInTheDocument();
    });

    it('small spinner has border-2', () => {
      const { container } = render(<Loading size="sm" />);

      const spinner = container.querySelector('.border-2');
      expect(spinner).toBeInTheDocument();
    });

    it('large spinner has border-4', () => {
      const { container } = render(<Loading size="lg" />);

      const spinner = container.querySelector('.border-4');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('dots styling', () => {
    it('renders exactly 3 dots', () => {
      const { container } = render(<Loading />);

      const dots = container.querySelectorAll('.w-2.h-2.rounded-full');
      expect(dots).toHaveLength(3);
    });

    it('dots are in a flex container', () => {
      const { container } = render(<Loading />);

      const dotsContainer = container.querySelector('.flex.space-x-1');
      expect(dotsContainer).toBeInTheDocument();
    });

    it('dots have margin top', () => {
      const { container } = render(<Loading />);

      const dotsContainer = container.querySelector('.mt-2');
      expect(dotsContainer).toBeInTheDocument();
    });
  });

  describe('message styling', () => {
    it('message has font-medium class', () => {
      render(<Loading />);

      const message = screen.getByText('Loading...');
      expect(message).toHaveClass('font-medium');
    });

    it('message has top margin', () => {
      render(<Loading />);

      const message = screen.getByText('Loading...');
      expect(message).toHaveClass('mt-4');
    });
  });

  describe('layout', () => {
    it('content uses flex column layout', () => {
      const { container } = render(<Loading fullScreen={false} />);

      const content = container.querySelector('.flex.flex-col');
      expect(content).toBeInTheDocument();
    });

    it('content is centered', () => {
      const { container } = render(<Loading fullScreen={false} />);

      const content = container.querySelector('.items-center.justify-center');
      expect(content).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('loading message is visible to screen readers', () => {
      render(<Loading message="Loading content" />);

      expect(screen.getByText('Loading content')).toBeInTheDocument();
    });

    it('spinner is visible', () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector('.rounded-full');
      expect(spinner).toBeVisible();
    });
  });

  describe('theme integration', () => {
    it('works with theme provider', () => {
      renderWithTheme(<Loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('spinner has inline styles for colors', () => {
      const { container } = render(<Loading />);

      const spinner = container.querySelector('.rounded-full');
      expect(spinner).toHaveAttribute('style');
    });

    it('message has inline style for color', () => {
      render(<Loading />);

      const message = screen.getByText('Loading...');
      expect(message).toHaveAttribute('style');
    });

    it('dots have inline style for background color', () => {
      const { container } = render(<Loading />);

      const dots = container.querySelectorAll('.w-2.h-2.rounded-full');
      dots.forEach((dot) => {
        expect(dot).toHaveAttribute('style');
      });
    });
  });

  describe('full screen mode', () => {
    it('full screen wrapper has inset-0', () => {
      const { container } = render(<Loading fullScreen={true} />);

      const wrapper = container.querySelector('.inset-0');
      expect(wrapper).toBeInTheDocument();
    });

    it('full screen has background style', () => {
      const { container } = render(<Loading fullScreen={true} />);

      const wrapper = container.querySelector('.fixed');
      expect(wrapper).toHaveAttribute('style');
    });
  });

  describe('inline mode', () => {
    it('inline mode does not have fixed positioning', () => {
      const { container } = render(<Loading fullScreen={false} />);

      const fixedElement = container.querySelector('.fixed');
      expect(fixedElement).not.toBeInTheDocument();
    });

    it('inline mode renders content directly', () => {
      const { container } = render(<Loading fullScreen={false} />);

      // First child should be the flex container, not a fixed wrapper
      expect(container.firstChild).toHaveClass('flex');
    });
  });

  describe('combined props', () => {
    it('renders with all props specified', () => {
      const { container } = render(
        <Loading message="Custom loading" fullScreen={false} size="lg" className="test-class" />,
      );

      expect(screen.getByText('Custom loading')).toBeInTheDocument();
      expect(container.querySelector('.w-16.h-16')).toBeInTheDocument();
      expect(container.querySelector('.test-class')).toBeInTheDocument();
    });

    it('renders full screen with custom size and message', () => {
      const { container } = render(
        <Loading message="Loading data..." fullScreen={true} size="sm" />,
      );

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
      expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument();
      expect(container.querySelector('.w-8.h-8')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles undefined message gracefully', () => {
      render(<Loading message={undefined} />);

      // Should fall back to default message
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('handles null-ish fullScreen gracefully', () => {
      const { container } = render(<Loading fullScreen={undefined} />);

      // Should default to true
      expect(container.querySelector('.fixed.inset-0')).toBeInTheDocument();
    });

    it('renders correctly with minimal props', () => {
      render(<Loading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('animation elements', () => {
    it('spinner is a motion div', () => {
      const { container } = render(<Loading />);

      // Framer motion applies styles to the element
      const spinner = container.querySelector('.rounded-full');
      expect(spinner).toBeInTheDocument();
    });

    it('message element exists when provided', () => {
      render(<Loading message="Test message" />);

      const message = screen.getByText('Test message');
      expect(message).toBeInTheDocument();
      expect(message.tagName.toLowerCase()).toBe('p');
    });

    it('dots container contains animated spans', () => {
      const { container } = render(<Loading />);

      const dotsContainer = container.querySelector('.flex.space-x-1.mt-2');
      expect(dotsContainer).toBeInTheDocument();
      expect(dotsContainer.children).toHaveLength(3);
    });
  });

  describe('structural integrity', () => {
    it('has correct element hierarchy', () => {
      const { container } = render(<Loading fullScreen={false} />);

      // Root should be flex container
      const root = container.firstChild;
      expect(root).toHaveClass('flex');
      expect(root).toHaveClass('flex-col');
      expect(root).toHaveClass('items-center');
      expect(root).toHaveClass('justify-center');
    });

    it('spinner comes before message', () => {
      const { container } = render(<Loading fullScreen={false} />);

      const content = container.firstChild;
      const children = Array.from(content.children);

      // First child should be spinner
      expect(children[0]).toHaveClass('rounded-full');
    });

    it('dots come after message', () => {
      const { container } = render(<Loading fullScreen={false} />);

      const content = container.firstChild;
      const children = Array.from(content.children);

      // Last child should be dots container
      expect(children[children.length - 1]).toHaveClass('space-x-1');
    });
  });
});

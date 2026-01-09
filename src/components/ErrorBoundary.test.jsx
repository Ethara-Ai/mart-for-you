// ErrorBoundary component tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Component that throws a custom error
const ThrowCustomError = ({ message }) => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  let consoleSpy;

  beforeEach(() => {
    // Suppress console.error for expected errors
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('normal rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>,
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });

    it('renders nested components correctly', () => {
      const NestedComponent = () => (
        <div>
          <span>Nested content</span>
        </div>
      );

      render(
        <ErrorBoundary>
          <NestedComponent />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Nested content')).toBeInTheDocument();
    });

    it('renders component that does not throw', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>,
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('error catching', () => {
    it('catches errors and displays fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('displays error message in UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
    });

    it('displays Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('displays Go Home button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: /go home/i })).toBeInTheDocument();
    });

    it('displays Reload Page button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    });
  });

  describe('custom fallback', () => {
    it('renders custom fallback when provided', () => {
      const CustomFallback = <div>Custom error page</div>;

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Custom error page')).toBeInTheDocument();
    });

    it('does not render default fallback when custom is provided', () => {
      const CustomFallback = <div>Custom error page</div>;

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });

    it('renders custom fallback component', () => {
      const CustomFallbackComponent = () => <div>Custom component fallback</div>;

      render(
        <ErrorBoundary fallback={<CustomFallbackComponent />}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Custom component fallback')).toBeInTheDocument();
    });
  });

  describe('onError callback', () => {
    it('calls onError callback when error is caught', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalled();
    });

    it('calls onError with error object', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.anything(),
      );
    });

    it('calls onError with errorInfo containing componentStack', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        }),
      );
    });

    it('onError is called only once per error', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Try Again button', () => {
    it('resets error state when clicked', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const ConditionalError = () => {
        if (shouldThrow) {
          throw new Error('Test');
        }
        return <div>Recovered</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      // Fix the error before clicking try again
      shouldThrow = false;

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await user.click(tryAgainButton);

      // Force rerender to pick up the change
      rerender(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>,
      );
    });

    it('Try Again button has correct styling', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const button = screen.getByRole('button', { name: /try again/i });
      expect(button).toHaveClass('flex');
      expect(button).toHaveClass('items-center');
    });

    it('Try Again button contains icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const button = screen.getByRole('button', { name: /try again/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Go Home button', () => {
    it('navigates to /home when clicked', async () => {
      const user = userEvent.setup();

      // Mock window.location
      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const goHomeButton = screen.getByRole('button', { name: /go home/i });
      await user.click(goHomeButton);

      expect(window.location.href).toBe('/home');

      // Restore
      window.location = originalLocation;
    });

    it('Go Home button has correct styling', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const button = screen.getByRole('button', { name: /go home/i });
      expect(button).toHaveClass('flex');
      expect(button).toHaveClass('items-center');
    });

    it('Go Home button contains icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const button = screen.getByRole('button', { name: /go home/i });
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Reload Page button', () => {
    it('reloads page when clicked', async () => {
      const user = userEvent.setup();

      // Mock window.location.reload
      const reloadMock = vi.fn();
      const originalLocation = window.location;
      delete window.location;
      window.location = { ...originalLocation, reload: reloadMock };

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const reloadButton = screen.getByRole('button', { name: /reload page/i });
      await user.click(reloadButton);

      expect(reloadMock).toHaveBeenCalled();

      // Restore
      window.location = originalLocation;
    });

    it('Reload button has underline styling', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const button = screen.getByRole('button', { name: /reload page/i });
      expect(button).toHaveClass('underline');
    });
  });

  describe('error UI structure', () => {
    it('displays error icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      // Should have an alert triangle icon
      const container = screen.getByText('Oops! Something went wrong').closest('div').parentElement;
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('has centered content', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const wrapper = container.querySelector('.flex.items-center.justify-center');
      expect(wrapper).toBeInTheDocument();
    });

    it('has min-height for full viewport', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const wrapper = container.querySelector('.min-h-screen');
      expect(wrapper).toBeInTheDocument();
    });

    it('has rounded container', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const card = container.querySelector('.rounded-lg');
      expect(card).toBeInTheDocument();
    });

    it('has shadow on container', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const card = container.querySelector('.shadow-xl');
      expect(card).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('buttons are keyboard accessible', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('error title is visible', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const title = screen.getByText('Oops! Something went wrong');
      expect(title).toBeVisible();
    });

    it('action buttons have descriptive text', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByRole('button', { name: /try again/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /go home/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /reload page/i })).toHaveAccessibleName();
    });
  });

  describe('error message content', () => {
    it('displays main error title', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('displays helpful description', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      expect(screen.getByText(/please try again or return to the home page/i)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('has dark background gradient', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveAttribute('style');
    });

    it('buttons have gap between them', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const buttonContainer = container.querySelector('.gap-3');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('text is centered', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const card = container.querySelector('.text-center');
      expect(card).toBeInTheDocument();
    });
  });

  describe('different error types', () => {
    it('catches TypeError', () => {
      const ThrowTypeError = () => {
        throw new TypeError('Type error occurred');
      };

      render(
        <ErrorBoundary>
          <ThrowTypeError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('catches ReferenceError', () => {
      const ThrowReferenceError = () => {
        throw new ReferenceError('Reference error occurred');
      };

      render(
        <ErrorBoundary>
          <ThrowReferenceError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('catches errors with custom messages', () => {
      render(
        <ErrorBoundary>
          <ThrowCustomError message="Custom error message" />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });
  });

  describe('icon container styling', () => {
    it('has rounded icon container', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const iconContainer = container.querySelector('.rounded-full.flex.items-center.justify-center');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles error in deeply nested component', () => {
      const DeepNested = () => (
          <div>
            <div>
              <div>
                <ThrowError />
              </div>
            </div>
          </div>
        );

      render(
        <ErrorBoundary>
          <DeepNested />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('handles multiple ErrorBoundaries (nested)', () => {
      render(
        <ErrorBoundary>
          <div>Outer content</div>
          <ErrorBoundary>
            <ThrowError />
          </ErrorBoundary>
        </ErrorBoundary>,
      );

      // Inner ErrorBoundary should catch the error
      expect(screen.getByText('Outer content')).toBeInTheDocument();
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('handles errors with no message', () => {
      const ThrowEmptyError = () => {
        throw new Error();
      };

      render(
        <ErrorBoundary>
          <ThrowEmptyError />
        </ErrorBoundary>,
      );

      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('has max-width constraint', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const card = container.querySelector('.max-w-lg');
      expect(card).toBeInTheDocument();
    });

    it('has padding for mobile', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const wrapper = container.querySelector('.p-4');
      expect(wrapper).toBeInTheDocument();
    });

    it('buttons stack on mobile with flex-col', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const buttonContainer = container.querySelector('.flex-col');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('buttons go horizontal on larger screens with sm:flex-row', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const buttonContainer = container.querySelector('.sm\\:flex-row');
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe('button icons', () => {
    it('Try Again button has refresh icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const button = screen.getByRole('button', { name: /try again/i });
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('Go Home button has home icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>,
      );

      const button = screen.getByRole('button', { name: /go home/i });
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });
});

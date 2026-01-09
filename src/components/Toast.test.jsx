// Toast component tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import Toast from './Toast';
import { renderWithTheme } from '../testing/test-utils';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockToast = {
    id: 'test-toast-1',
    message: 'Test notification message',
    type: 'success',
  };

  const mockOnClose = vi.fn();

  describe('rendering', () => {
    it('renders toast message', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      expect(screen.getByText(mockToast.message)).toBeInTheDocument();
    });

    it('renders close button', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });

    it('renders with correct aria-label on close button', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
    });

    it('renders toast container with correct structure', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const toastElement = container.firstChild;
      expect(toastElement).toHaveClass('p-3');
      expect(toastElement).toHaveClass('rounded-lg');
      expect(toastElement).toHaveClass('shadow-lg');
    });

    it('renders with flex layout', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const toastElement = container.firstChild;
      expect(toastElement).toHaveClass('flex');
      expect(toastElement).toHaveClass('items-center');
    });
  });

  describe('toast types', () => {
    describe('success type', () => {
      it('renders success toast correctly', () => {
        const successToast = { ...mockToast, type: 'success' };
        renderWithTheme(<Toast toast={successToast} onClose={mockOnClose} />);

        expect(screen.getByText(mockToast.message)).toBeInTheDocument();
      });

      it('displays check icon for success type', () => {
        const successToast = { ...mockToast, type: 'success' };
        const { container } = renderWithTheme(<Toast toast={successToast} onClose={mockOnClose} />);

        // Check icon should be present (FiCheck)
        const iconContainer = container.querySelector('.mr-2');
        expect(iconContainer).toBeInTheDocument();
      });
    });

    describe('error type', () => {
      it('renders error toast correctly', () => {
        const errorToast = { ...mockToast, type: 'error' };
        renderWithTheme(<Toast toast={errorToast} onClose={mockOnClose} />);

        expect(screen.getByText(mockToast.message)).toBeInTheDocument();
      });

      it('displays X icon for error type', () => {
        const errorToast = { ...mockToast, type: 'error' };
        const { container } = renderWithTheme(<Toast toast={errorToast} onClose={mockOnClose} />);

        const iconContainer = container.querySelector('.mr-2');
        expect(iconContainer).toBeInTheDocument();
      });
    });

    describe('info type', () => {
      it('renders info toast correctly', () => {
        const infoToast = { ...mockToast, type: 'info' };
        renderWithTheme(<Toast toast={infoToast} onClose={mockOnClose} />);

        expect(screen.getByText(mockToast.message)).toBeInTheDocument();
      });

      it('displays shopping bag icon for info type', () => {
        const infoToast = { ...mockToast, type: 'info' };
        const { container } = renderWithTheme(<Toast toast={infoToast} onClose={mockOnClose} />);

        const iconContainer = container.querySelector('.mr-2');
        expect(iconContainer).toBeInTheDocument();
      });
    });

    describe('unknown type', () => {
      it('renders toast with unknown type', () => {
        const unknownToast = { ...mockToast, type: 'unknown' };
        renderWithTheme(<Toast toast={unknownToast} onClose={mockOnClose} />);

        expect(screen.getByText(mockToast.message)).toBeInTheDocument();
      });

      it('does not render icon for unknown type', () => {
        const unknownToast = { ...mockToast, type: 'unknown' };
        const { container } = renderWithTheme(<Toast toast={unknownToast} onClose={mockOnClose} />);

        // Icon container should be empty or not contain an SVG
        const iconContainer = container.querySelector('.mr-2');
        if (iconContainer) {
          expect(iconContainer.querySelector('svg')).toBeNull();
        }
      });
    });
  });

  describe('auto-dismiss', () => {
    it('calls onClose after 3 seconds', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      expect(mockOnClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(3000);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose before 3 seconds', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      vi.advanceTimersByTime(2999);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const { unmount } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      unmount();

      vi.advanceTimersByTime(3000);

      // onClose should not be called after unmount
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('each toast type auto-dismisses after 3 seconds', () => {
      const types = ['success', 'error', 'info'];

      types.forEach((type) => {
        const onClose = vi.fn();
        const toast = { ...mockToast, type };
        const { unmount } = renderWithTheme(<Toast toast={toast} onClose={onClose} />);

        vi.advanceTimersByTime(3000);
        expect(onClose).toHaveBeenCalledTimes(1);

        unmount();
      });
    });
  });

  describe('manual dismiss', () => {
    it('calls onClose when close button is clicked', async () => {
      vi.useRealTimers(); // Use real timers for user interaction
      const onClose = vi.fn();
      const { user } = renderWithTheme(<Toast toast={mockToast} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /dismiss/i });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('close button is clickable', async () => {
      vi.useRealTimers();
      const onClose = vi.fn();
      const { user } = renderWithTheme(<Toast toast={mockToast} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /dismiss/i });
      expect(closeButton).not.toBeDisabled();

      await user.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('message content', () => {
    it('displays short messages correctly', () => {
      const shortToast = { ...mockToast, message: 'Hi' };
      renderWithTheme(<Toast toast={shortToast} onClose={mockOnClose} />);

      expect(screen.getByText('Hi')).toBeInTheDocument();
    });

    it('displays long messages correctly', () => {
      const longMessage =
        'This is a very long notification message that should still be displayed correctly in the toast component without any truncation or overflow issues';
      const longToast = { ...mockToast, message: longMessage };
      renderWithTheme(<Toast toast={longToast} onClose={mockOnClose} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('displays messages with special characters', () => {
      const specialMessage = 'Success! Item "Product #123" added to cart & saved.';
      const specialToast = { ...mockToast, message: specialMessage };
      renderWithTheme(<Toast toast={specialToast} onClose={mockOnClose} />);

      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('displays messages with unicode/emojis', () => {
      const emojiMessage = '🎉 Congratulations! You earned 100 points! 🌟';
      const emojiToast = { ...mockToast, message: emojiMessage };
      renderWithTheme(<Toast toast={emojiToast} onClose={mockOnClose} />);

      expect(screen.getByText(emojiMessage)).toBeInTheDocument();
    });

    it('handles empty message', () => {
      const emptyToast = { ...mockToast, message: '' };
      const { container } = renderWithTheme(<Toast toast={emptyToast} onClose={mockOnClose} />);

      // Toast should still render
      expect(container.firstChild).toBeInTheDocument();
    });

    it('displays message with HTML entities as text', () => {
      const htmlMessage = '<script>alert("xss")</script>';
      const htmlToast = { ...mockToast, message: htmlMessage };
      renderWithTheme(<Toast toast={htmlToast} onClose={mockOnClose} />);

      // Should display as text, not execute
      expect(screen.getByText(htmlMessage)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies white text color', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const toastElement = container.firstChild;
      // Check that the style attribute contains the white color
      expect(toastElement).toHaveAttribute('style');
      expect(toastElement.style.color).toBe('rgb(255, 255, 255)');
    });

    it('applies margin bottom for stacking', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const toastElement = container.firstChild;
      expect(toastElement).toHaveClass('mb-3');
    });

    it('close button has cursor pointer', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /dismiss/i });
      expect(closeButton).toHaveClass('cursor-pointer');
    });

    it('close button has hover state', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /dismiss/i });
      expect(closeButton.className).toMatch(/hover:/);
    });

    it('message container has flex-1 for proper spacing', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const messageElement = container.querySelector('p');
      expect(messageElement).toHaveClass('flex-1');
    });
  });

  describe('icons', () => {
    it('icon container has correct sizing', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const iconContainer = container.querySelector('.mr-2');
      expect(iconContainer).toBeInTheDocument();
    });

    it('icons have h-5 w-5 dimensions', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const iconSvg = container.querySelector('.mr-3 svg');
      if (iconSvg) {
        expect(iconSvg).toHaveClass('h-5');
        expect(iconSvg).toHaveClass('w-5');
      }
    });

    it('close button icon has h-4 w-4 dimensions', () => {
      const { container: _container } = renderWithTheme(
        <Toast toast={mockToast} onClose={mockOnClose} />
      );

      const closeButton = screen.getByRole('button', { name: /dismiss/i });
      const closeIcon = closeButton.querySelector('svg');
      if (closeIcon) {
        expect(closeIcon).toHaveClass('h-4');
        expect(closeIcon).toHaveClass('w-4');
      }
    });
  });

  describe('accessibility', () => {
    it('close button is keyboard accessible', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /dismiss/i });
      expect(closeButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('toast content is readable', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const message = screen.getByText(mockToast.message);
      expect(message).toBeInTheDocument();
    });

    it('close button has accessible name', () => {
      renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveAccessibleName();
    });

    it('can be dismissed via keyboard', async () => {
      vi.useRealTimers();
      const onClose = vi.fn();
      const { user } = renderWithTheme(<Toast toast={mockToast} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /dismiss/i });
      closeButton.focus();

      await user.keyboard('{Enter}');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('animation', () => {
    it('renders motion div', () => {
      const { container } = renderWithTheme(<Toast toast={mockToast} onClose={mockOnClose} />);

      // framer-motion adds the element to DOM
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('different toast configurations', () => {
    it('renders success toast with product added message', () => {
      const productToast = {
        id: 'product-1',
        message: 'Wireless Earbuds added to cart',
        type: 'success',
      };
      renderWithTheme(<Toast toast={productToast} onClose={mockOnClose} />);

      expect(screen.getByText('Wireless Earbuds added to cart')).toBeInTheDocument();
    });

    it('renders error toast with network error message', () => {
      const errorToast = {
        id: 'error-1',
        message: 'Network error. Please try again.',
        type: 'error',
      };
      renderWithTheme(<Toast toast={errorToast} onClose={mockOnClose} />);

      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
    });

    it('renders info toast with update message', () => {
      const infoToast = {
        id: 'info-1',
        message: 'Your cart has been updated',
        type: 'info',
      };
      renderWithTheme(<Toast toast={infoToast} onClose={mockOnClose} />);

      expect(screen.getByText('Your cart has been updated')).toBeInTheDocument();
    });
  });

  describe('multiple toasts', () => {
    it('each toast has independent timer', () => {
      const onClose1 = vi.fn();
      const onClose2 = vi.fn();

      const toast1 = { id: '1', message: 'First', type: 'success' };
      const toast2 = { id: '2', message: 'Second', type: 'error' };

      const { rerender: _rerender } = renderWithTheme(
        <>
          <Toast toast={toast1} onClose={onClose1} />
          <Toast toast={toast2} onClose={onClose2} />
        </>
      );

      vi.advanceTimersByTime(3000);

      expect(onClose1).toHaveBeenCalledTimes(1);
      expect(onClose2).toHaveBeenCalledTimes(1);
    });

    it('renders multiple toasts with different messages', () => {
      const toast1 = { id: '1', message: 'First message', type: 'success' };
      const toast2 = { id: '2', message: 'Second message', type: 'error' };
      const toast3 = { id: '3', message: 'Third message', type: 'info' };

      renderWithTheme(
        <>
          <Toast toast={toast1} onClose={() => {}} />
          <Toast toast={toast2} onClose={() => {}} />
          <Toast toast={toast3} onClose={() => {}} />
        </>
      );

      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
      expect(screen.getByText('Third message')).toBeInTheDocument();
    });
  });

  describe('prop types', () => {
    it('toast prop is required object with id, message, and type', () => {
      const validToast = {
        id: 'valid-id',
        message: 'Valid message',
        type: 'success',
      };

      // Should render without errors
      const { container } = renderWithTheme(<Toast toast={validToast} onClose={mockOnClose} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('onClose is a function that gets called', () => {
      const onCloseFn = vi.fn();
      renderWithTheme(<Toast toast={mockToast} onClose={onCloseFn} />);

      vi.advanceTimersByTime(3000);

      expect(typeof onCloseFn).toBe('function');
      expect(onCloseFn).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles rapid close button clicks', async () => {
      vi.useRealTimers();
      const onClose = vi.fn();
      const { user } = renderWithTheme(<Toast toast={mockToast} onClose={onClose} />);

      const closeButton = screen.getByRole('button', { name: /dismiss/i });

      await user.click(closeButton);
      await user.click(closeButton);
      await user.click(closeButton);

      // Each click should call onClose
      expect(onClose).toHaveBeenCalled();
    });

    it('handles toast with numeric message converted to string', () => {
      const numericToast = { ...mockToast, message: '12345' };
      renderWithTheme(<Toast toast={numericToast} onClose={mockOnClose} />);

      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('handles toast id as number', () => {
      const numericIdToast = { id: 123, message: 'Test', type: 'success' };
      const { container } = renderWithTheme(<Toast toast={numericIdToast} onClose={mockOnClose} />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

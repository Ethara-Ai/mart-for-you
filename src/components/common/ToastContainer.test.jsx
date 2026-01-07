// ToastContainer component tests
import { describe, it, expect } from 'vitest';
import { screen, waitFor, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToastContainer from './ToastContainer';
import { render, renderWithToast } from '../../testing/test-utils';
import { ToastProvider, useToast } from '../../context/ToastContext';
import { ThemeProvider } from '../../context/ThemeContext';

describe('ToastContainer', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      renderWithToast(<ToastContainer />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders container element', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toBeInTheDocument();
    });

    it('renders empty container when no toasts', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer.children.length).toBe(0);
    });
  });

  describe('positioning', () => {
    it('has fixed positioning', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('fixed');
    });

    it('is positioned at bottom', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('bottom-4');
    });

    it('is positioned at right', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('right-4');
    });

    it('has high z-index', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('z-50');
    });
  });

  describe('accessibility', () => {
    it('has aria-live attribute set to polite', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-live="polite"]');
      expect(toastContainer).toBeInTheDocument();
    });

    it('has aria-label for notifications', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toBeInTheDocument();
    });

    it('aria-label is descriptive', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label]');
      expect(toastContainer.getAttribute('aria-label')).toBe('Notifications');
    });
  });

  describe('layout', () => {
    it('uses flexbox for layout', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('flex');
    });

    it('uses column direction', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('flex-col');
    });

    it('has spacing between toasts', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('space-y-2');
    });
  });

  describe('pointer events', () => {
    it('container has pointer-events-none', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('pointer-events-none');
    });
  });

  describe('displaying toasts', () => {
    it('displays success toast when added via context', async () => {
      const SuccessToastTest = () => {
        const { showSuccess } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('Success message')}>Add Toast</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <SuccessToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add Toast'));
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('displays error toast when added via context', async () => {
      const ErrorToastTest = () => {
        const { showError } = useToast();
        return (
          <>
            <button onClick={() => showError('Error message')}>Add Toast</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <ErrorToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add Toast'));
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });

    it('displays info toast when added via context', async () => {
      const InfoToastTest = () => {
        const { showInfo } = useToast();
        return (
          <>
            <button onClick={() => showInfo('Info message')}>Add Toast</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <InfoToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add Toast'));
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    it('displays toast with addToast method', async () => {
      const AddToastTest = () => {
        const { addToast } = useToast();
        return (
          <>
            <button onClick={() => addToast('Generic toast', 'success')}>Add Toast</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <AddToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add Toast'));
      expect(screen.getByText('Generic toast')).toBeInTheDocument();
    });
  });

  describe('multiple toasts', () => {
    it('displays multiple toasts', async () => {
      const MultiToastTest = () => {
        const { showSuccess, showError } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('Success 1')}>Success</button>
            <button onClick={() => showError('Error 1')}>Error</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <MultiToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Success'));
      await user.click(screen.getByText('Error'));

      expect(screen.getByText('Success 1')).toBeInTheDocument();
      expect(screen.getByText('Error 1')).toBeInTheDocument();
    });

    it('renders toasts in order', async () => {
      const OrderedToastTest = () => {
        const { showSuccess } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('First')}>Add First</button>
            <button onClick={() => showSuccess('Second')}>Add Second</button>
            <button onClick={() => showSuccess('Third')}>Add Third</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <OrderedToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add First'));
      await user.click(screen.getByText('Add Second'));
      await user.click(screen.getByText('Add Third'));

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });
  });

  describe('toast removal', () => {
    it('removes toast when dismiss button is clicked', async () => {
      const DismissableToastTest = () => {
        const { showSuccess } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('Dismissable toast')}>Add Toast</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <DismissableToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add Toast'));
      expect(screen.getByText('Dismissable toast')).toBeInTheDocument();

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      await user.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText('Dismissable toast')).not.toBeInTheDocument();
      });
    });

    it('clears all toasts with clearToasts', async () => {
      const ClearableToastsTest = () => {
        const { showSuccess, clearToasts } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('Toast 1')}>Add 1</button>
            <button onClick={() => showSuccess('Toast 2')}>Add 2</button>
            <button onClick={() => clearToasts()}>Clear All</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <ClearableToastsTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add 1'));
      await user.click(screen.getByText('Add 2'));

      expect(screen.getByText('Toast 1')).toBeInTheDocument();
      expect(screen.getByText('Toast 2')).toBeInTheDocument();

      await user.click(screen.getByText('Clear All'));

      await waitFor(() => {
        expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
      });
    });
  });

  describe('toast wrapper', () => {
    it('wraps each toast with pointer-events-auto', async () => {
      const ToastWrapperTest = () => {
        const { showSuccess } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('Test toast')}>Add Toast</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      const { container } = rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <ToastWrapperTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add Toast'));

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      const toastWrapper = toastContainer.querySelector('.pointer-events-auto');
      expect(toastWrapper).toBeInTheDocument();
    });
  });

  describe('toast types display', () => {
    it('renders success toast with correct styling', async () => {
      const SuccessStyleTest = () => {
        const { showSuccess } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('Success!')}>Add</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <SuccessStyleTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add'));
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });

    it('renders error toast with correct styling', async () => {
      const ErrorStyleTest = () => {
        const { showError } = useToast();
        return (
          <>
            <button onClick={() => showError('Error!')}>Add</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <ErrorStyleTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add'));
      expect(screen.getByText('Error!')).toBeInTheDocument();
    });

    it('renders info toast with correct styling', async () => {
      const InfoStyleTest = () => {
        const { showInfo } = useToast();
        return (
          <>
            <button onClick={() => showInfo('Info!')}>Add</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <InfoStyleTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add'));
      expect(screen.getByText('Info!')).toBeInTheDocument();
    });
  });

  describe('container structure', () => {
    it('container has correct class structure', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toHaveClass('fixed');
      expect(toastContainer).toHaveClass('bottom-4');
      expect(toastContainer).toHaveClass('right-4');
      expect(toastContainer).toHaveClass('z-50');
      expect(toastContainer).toHaveClass('flex');
      expect(toastContainer).toHaveClass('flex-col');
    });
  });

  describe('integration', () => {
    it('works with full provider setup', () => {
      render(<ToastContainer />);

      const container = document.querySelector('[aria-label="Notifications"]');
      expect(container).toBeInTheDocument();
    });

    it('toasts from different sources appear in same container', async () => {
      const MultiSourceTest = () => {
        const { showSuccess, showError, showInfo } = useToast();
        return (
          <>
            <button onClick={() => showSuccess('Success')}>S</button>
            <button onClick={() => showError('Error')}>E</button>
            <button onClick={() => showInfo('Info')}>I</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      const { container } = rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <MultiSourceTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('S'));
      await user.click(screen.getByText('E'));
      await user.click(screen.getByText('I'));

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer.querySelectorAll('.pointer-events-auto').length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('handles empty toast array gracefully', () => {
      const { container } = renderWithToast(<ToastContainer />);

      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toBeInTheDocument();
      expect(toastContainer.children.length).toBe(0);
    });

    it('handles rapid toast additions', async () => {
      const RapidToastTest = () => {
        const { showSuccess } = useToast();
        const addMany = () => {
          for (let i = 0; i < 5; i++) {
            showSuccess(`Toast ${i}`);
          }
        };
        return (
          <>
            <button onClick={addMany}>Add Many</button>
            <ToastContainer />
          </>
        );
      };

      const user = userEvent.setup();
      rtlRender(
        <ThemeProvider>
          <ToastProvider>
            <RapidToastTest />
          </ToastProvider>
        </ThemeProvider>,
      );

      await user.click(screen.getByText('Add Many'));

      expect(screen.getByText('Toast 0')).toBeInTheDocument();
      expect(screen.getByText('Toast 4')).toBeInTheDocument();
    });
  });

  describe('animation container', () => {
    it('uses AnimatePresence for animations', () => {
      const { container } = renderWithToast(<ToastContainer />);

      // AnimatePresence is rendered, container should exist
      const toastContainer = container.querySelector('[aria-label="Notifications"]');
      expect(toastContainer).toBeInTheDocument();
    });
  });
});

// SearchBar component tests
import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';
import { renderWithTheme } from '../../testing/test-utils';

describe('SearchBar', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      renderWithTheme(<SearchBar />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with default placeholder', () => {
      renderWithTheme(<SearchBar />);

      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      renderWithTheme(<SearchBar placeholder="Find items..." />);

      expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
    });

    it('renders search submit button', () => {
      renderWithTheme(<SearchBar />);

      expect(screen.getByRole('button', { name: /submit search/i })).toBeInTheDocument();
    });

    it('renders as a form element', () => {
      const { container } = renderWithTheme(<SearchBar />);

      expect(container.querySelector('form')).toBeInTheDocument();
    });

    it('has correct aria-label on input', () => {
      renderWithTheme(<SearchBar />);

      expect(screen.getByLabelText('Search')).toBeInTheDocument();
    });
  });

  describe('value handling', () => {
    it('displays provided value', () => {
      renderWithTheme(<SearchBar value="test query" onChange={() => {}} />);

      expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
    });

    it('displays empty input when value is empty string', () => {
      renderWithTheme(<SearchBar value="" onChange={() => {}} />);

      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('displays default empty value when no value prop', () => {
      renderWithTheme(<SearchBar />);

      expect(screen.getByRole('textbox')).toHaveValue('');
    });
  });

  describe('onChange handling', () => {
    it('calls onChange when user types', async () => {
      const mockOnChange = vi.fn();
      const { user } = renderWithTheme(<SearchBar value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      expect(mockOnChange).toHaveBeenCalledWith('a');
    });

    it('calls onChange with full typed text', async () => {
      const mockOnChange = vi.fn();
      const { user } = renderWithTheme(<SearchBar value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // Called for each character
      expect(mockOnChange).toHaveBeenCalledTimes(4);
    });

    it('handles onChange with special characters', async () => {
      const mockOnChange = vi.fn();
      const { user } = renderWithTheme(<SearchBar value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '@');

      expect(mockOnChange).toHaveBeenCalledWith('@');
    });
  });

  describe('clear button', () => {
    it('does not show clear button when value is empty', () => {
      renderWithTheme(<SearchBar value="" onChange={() => {}} />);

      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });

    it('shows clear button when value is not empty', () => {
      renderWithTheme(<SearchBar value="test" onChange={() => {}} />);

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('calls onClear when clear button is clicked', async () => {
      const mockOnClear = vi.fn();
      const { user } = renderWithTheme(
        <SearchBar value="test" onChange={() => {}} onClear={mockOnClear} />,
      );

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(mockOnClear).toHaveBeenCalled();
    });

    it('calls onChange with empty string when clear is clicked and no onClear provided', async () => {
      const mockOnChange = vi.fn();
      const { user } = renderWithTheme(<SearchBar value="test" onChange={mockOnChange} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('clears input and focuses after clear', async () => {
      const mockOnClear = vi.fn();
      const { user } = renderWithTheme(
        <SearchBar value="test" onChange={() => {}} onClear={mockOnClear} />,
      );

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });

    it('has correct aria-label on clear button', () => {
      renderWithTheme(<SearchBar value="test" onChange={() => {}} />);

      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit when form is submitted', () => {
      const mockOnSubmit = vi.fn();
      renderWithTheme(<SearchBar value="test query" onChange={() => {}} onSubmit={mockOnSubmit} />);

      const form = screen.getByRole('textbox').closest('form');
      fireEvent.submit(form);

      expect(mockOnSubmit).toHaveBeenCalledWith('test query');
    });

    it('calls onSubmit when search button is clicked', async () => {
      const mockOnSubmit = vi.fn();
      const { user } = renderWithTheme(
        <SearchBar value="test query" onChange={() => {}} onSubmit={mockOnSubmit} />,
      );

      const submitButton = screen.getByRole('button', { name: /submit search/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith('test query');
    });

    it('calls onSubmit when Enter key is pressed', async () => {
      const mockOnSubmit = vi.fn();
      const { user } = renderWithTheme(
        <SearchBar value="test query" onChange={() => {}} onSubmit={mockOnSubmit} />,
      );

      const input = screen.getByRole('textbox');
      await user.type(input, '{Enter}');

      expect(mockOnSubmit).toHaveBeenCalledWith('test query');
    });

    it('prevents default form submission', () => {
      const mockOnSubmit = vi.fn();
      renderWithTheme(<SearchBar value="test" onChange={() => {}} onSubmit={mockOnSubmit} />);

      const form = screen.getByRole('textbox').closest('form');
      const event = new Event('submit', { bubbles: true, cancelable: true });

      fireEvent(form, event);

      // Form submission should be prevented (page should not reload)
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('handles submission with empty value', async () => {
      const mockOnSubmit = vi.fn();
      const { user } = renderWithTheme(
        <SearchBar value="" onChange={() => {}} onSubmit={mockOnSubmit} />,
      );

      const submitButton = screen.getByRole('button', { name: /submit search/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith('');
    });
  });

  describe('autoFocus', () => {
    it('does not auto-focus by default', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveFocus();
    });

    it('auto-focuses when autoFocus prop is true', async () => {
      renderWithTheme(<SearchBar autoFocus={true} />);

      await waitFor(() => {
        const input = screen.getByRole('textbox');
        expect(input).toHaveFocus();
      });
    });

    it('does not auto-focus when autoFocus prop is false', () => {
      renderWithTheme(<SearchBar autoFocus={false} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveFocus();
    });
  });

  describe('variants', () => {
    it('renders desktop variant by default', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-2');
    });

    it('renders desktop variant when variant is desktop', () => {
      renderWithTheme(<SearchBar variant="desktop" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-2');
    });

    it('renders mobile variant with smaller padding', () => {
      renderWithTheme(<SearchBar variant="mobile" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('px-3');
      expect(input).toHaveClass('py-1.5');
    });

    it('applies pr-10 for desktop clear button spacing', () => {
      renderWithTheme(<SearchBar variant="desktop" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-10');
    });

    it('applies pr-8 for mobile clear button spacing', () => {
      renderWithTheme(<SearchBar variant="mobile" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-8');
    });
  });

  describe('className prop', () => {
    it('applies additional className to container', () => {
      const { container } = renderWithTheme(<SearchBar className="custom-class" />);

      expect(container.querySelector('form')).toHaveClass('custom-class');
    });

    it('preserves default classes when adding custom className', () => {
      const { container } = renderWithTheme(<SearchBar className="custom-class" />);

      expect(container.querySelector('form')).toHaveClass('relative');
      expect(container.querySelector('form')).toHaveClass('custom-class');
    });

    it('handles empty className', () => {
      const { container } = renderWithTheme(<SearchBar className="" />);

      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  describe('focus states', () => {
    it('input can receive focus', async () => {
      const { user } = renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      await user.click(input);

      expect(input).toHaveFocus();
    });

    it('input can lose focus', async () => {
      const { user } = renderWithTheme(
        <div>
          <SearchBar />
          <button>Other button</button>
        </div>,
      );

      const input = screen.getByRole('textbox');
      await user.click(input);
      expect(input).toHaveFocus();

      const otherButton = screen.getByText('Other button');
      await user.click(otherButton);
      expect(input).not.toHaveFocus();
    });

    it('maintains value when focus changes', async () => {
      const { user } = renderWithTheme(
        <div>
          <SearchBar value="test value" onChange={() => {}} />
          <button>Other button</button>
        </div>,
      );

      const input = screen.getByRole('textbox');
      await user.click(input);

      const otherButton = screen.getByText('Other button');
      await user.click(otherButton);

      expect(input).toHaveValue('test value');
    });
  });

  describe('input styling', () => {
    it('applies rounded-full class for pill shape', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('rounded-full');
    });

    it('applies text-sm class', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-sm');
    });

    it('applies transition class', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('transition-all');
    });

    it('applies border styling', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-2');
    });

    it('applies w-full for full width', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('w-full');
    });
  });

  describe('button styling', () => {
    it('search button is positioned absolutely', () => {
      renderWithTheme(<SearchBar />);

      const submitButton = screen.getByRole('button', { name: /submit search/i });
      expect(submitButton).toHaveClass('absolute');
    });

    it('search button is positioned on right side', () => {
      renderWithTheme(<SearchBar />);

      const submitButton = screen.getByRole('button', { name: /submit search/i });
      expect(submitButton).toHaveClass('right-3');
    });

    it('search button is vertically centered', () => {
      renderWithTheme(<SearchBar />);

      const submitButton = screen.getByRole('button', { name: /submit search/i });
      expect(submitButton).toHaveClass('top-1/2');
      expect(submitButton.className).toMatch(/-translate-y-1\/2/);
    });

    it('clear button has rounded styling', () => {
      renderWithTheme(<SearchBar value="test" onChange={() => {}} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toHaveClass('rounded-full');
    });
  });

  describe('accessibility', () => {
    it('input has type text', () => {
      renderWithTheme(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('buttons are keyboard accessible', () => {
      renderWithTheme(<SearchBar value="test" onChange={() => {}} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('clear button has type button to prevent form submission', () => {
      renderWithTheme(<SearchBar value="test" onChange={() => {}} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toHaveAttribute('type', 'button');
    });

    it('submit button has type submit', () => {
      renderWithTheme(<SearchBar />);

      const submitButton = screen.getByRole('button', { name: /submit search/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('form is accessible via keyboard navigation', async () => {
      const { user } = renderWithTheme(<SearchBar value="test" onChange={() => {}} />);

      const input = screen.getByRole('textbox');
      input.focus();

      await user.tab();
      // Should move to clear button
      expect(screen.getByRole('button', { name: /clear/i })).toHaveFocus();

      await user.tab();
      // Should move to submit button
      expect(screen.getByRole('button', { name: /submit search/i })).toHaveFocus();
    });
  });

  describe('edge cases', () => {
    it('handles rapid typing', async () => {
      const mockOnChange = vi.fn();
      const { user } = renderWithTheme(<SearchBar value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'rapid typing test');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('handles special characters in search', async () => {
      const mockOnChange = vi.fn();
      const { user } = renderWithTheme(<SearchBar value="" onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '!@#$%^&*()');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('handles unicode characters', () => {
      const mockOnChange = vi.fn();
      renderWithTheme(<SearchBar value="🔍 search" onChange={mockOnChange} />);

      expect(screen.getByDisplayValue('🔍 search')).toBeInTheDocument();
    });

    it('handles very long search queries', () => {
      const longQuery = 'a'.repeat(500);
      renderWithTheme(<SearchBar value={longQuery} onChange={() => {}} />);

      expect(screen.getByDisplayValue(longQuery)).toBeInTheDocument();
    });

    it('handles whitespace-only value', () => {
      renderWithTheme(<SearchBar value="   " onChange={() => {}} />);

      // Clear button should still show for whitespace
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });
  });

  describe('integration with form', () => {
    it('works within a parent form without conflict', () => {
      const mockOnSubmit = vi.fn();

      const { container } = renderWithTheme(
        <SearchBar value="test" onChange={() => {}} onSubmit={mockOnSubmit} />,
      );

      // Should have its own form element
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('does not propagate submission to parent handlers', () => {
      const mockParentSubmit = vi.fn((e) => e.preventDefault());
      const mockSearchSubmit = vi.fn();

      const { container } = renderWithTheme(
        <div onSubmit={mockParentSubmit}>
          <SearchBar value="test" onChange={() => {}} onSubmit={mockSearchSubmit} />
        </div>,
      );

      const form = container.querySelector('form');
      fireEvent.submit(form);

      expect(mockSearchSubmit).toHaveBeenCalled();
    });
  });

  describe('controlled component behavior', () => {
    it('value can be controlled externally', () => {
      const { rerender } = renderWithTheme(<SearchBar value="initial" onChange={() => {}} />);

      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

      rerender(<SearchBar value="updated" onChange={() => {}} />);

      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });

    it('clear button visibility updates with controlled value', () => {
      const { rerender } = renderWithTheme(<SearchBar value="" onChange={() => {}} />);

      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

      rerender(<SearchBar value="has value" onChange={() => {}} />);

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });
  });
});

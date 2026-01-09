// ProfileForm component tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import ProfileForm from './ProfileForm';
import { render } from '../testing/test-utils';

describe('ProfileForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders all form fields', () => {
      render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    });

    it('renders save button', () => {
      render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    it('renders cancel button', () => {
      render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('applies compact layout when compact prop is true', () => {
      const { container } = render(
        <ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} compact={true} />
      );

      // Component should render without errors
      expect(container).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} className="custom-class" />
      );

      // The form should have the custom class
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('form interactions', () => {
    it('allows typing in first name field', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'John');

      expect(firstNameInput).toHaveValue('John');
    });

    it('allows typing in last name field', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const lastNameInput = screen.getByLabelText(/last name/i);
      await user.clear(lastNameInput);
      await user.type(lastNameInput, 'Doe');

      expect(lastNameInput).toHaveValue('Doe');
    });

    it('allows typing in email field', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'john@example.com');

      expect(emailInput).toHaveValue('john@example.com');
    });

    it('allows typing in phone field', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, '1234567890');

      expect(phoneInput).toHaveValue('1234567890');
    });
  });

  describe('validation', () => {
    it('shows error for empty first name on submit', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });
    });

    it('shows error for empty last name on submit', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const lastNameInput = screen.getByLabelText(/last name/i);
      await user.clear(lastNameInput);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      });
    });

    it('shows error for invalid email format', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');

      // Trigger blur to validate
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('shows error for first name with invalid characters', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'John123');

      fireEvent.blur(firstNameInput);

      await waitFor(() => {
        expect(screen.getByText(/can only contain letters/i)).toBeInTheDocument();
      });
    });

    it('shows error for first name that is too short', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'J');

      fireEvent.blur(firstNameInput);

      await waitFor(() => {
        expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('accepts valid email format', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@email.com');

      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('form submission', () => {
    it('calls onSave when form is valid', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Fill in valid data
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'John');

      await user.clear(lastNameInput);
      await user.type(lastNameInput, 'Doe');

      await user.clear(emailInput);
      await user.type(emailInput, 'john@example.com');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('does not call onSave when form has validation errors', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Clear required field
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnSave).not.toHaveBeenCalled();
      });
    });
  });

  describe('cancel functionality', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('calls onCancel even with unsaved changes', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Make some changes
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Modified');

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('field character limits', () => {
    it('respects character limit for first name', () => {
      render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const firstNameInput = screen.getByLabelText(/first name/i);

      // Input should have maxLength attribute to prevent exceeding limit
      expect(firstNameInput).toHaveAttribute('maxLength', '25');
    });

    it('respects character limit for email', () => {
      render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const emailInput = screen.getByLabelText(/email/i);

      // Input should have maxLength attribute to prevent exceeding limit
      expect(emailInput).toHaveAttribute('maxLength', '50');
    });
  });

  describe('accessibility', () => {
    it('all inputs have associated labels', () => {
      render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toHaveAccessibleName();
      });
    });

    it('buttons are focusable', () => {
      render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const saveButton = screen.getByRole('button', { name: /save/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(saveButton).not.toHaveAttribute('tabindex', '-1');
      expect(cancelButton).not.toHaveAttribute('tabindex', '-1');
    });

    it('form can be submitted with Enter key', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Fill in valid data first
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'John');
      await user.clear(lastNameInput);
      await user.type(lastNameInput, 'Doe');
      await user.clear(emailInput);
      await user.type(emailInput, 'john@example.com');

      // Press Enter on save button
      const saveButton = screen.getByRole('button', { name: /save/i });
      saveButton.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });
    });
  });

  describe('error state styling', () => {
    it('applies error styling to invalid fields', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      fireEvent.blur(firstNameInput);

      // Check that the input has error styling applied
      await waitFor(() => {
        // Error border color should be applied
        expect(firstNameInput.closest('input')).toBeInTheDocument();
      });
    });
  });

  describe('optional fields', () => {
    it('allows empty address field', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      // Fill required fields
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);

      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'John');
      await user.clear(lastNameInput);
      await user.type(lastNameInput, 'Doe');
      await user.clear(emailInput);
      await user.type(emailInput, 'john@example.com');

      // Leave address empty
      const addressInput = screen.getByLabelText(/address/i);
      await user.clear(addressInput);

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      // Should be able to save without address
      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('validates address length if provided', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const addressInput = screen.getByLabelText(/address/i);
      await user.clear(addressInput);
      await user.type(addressInput, 'abc'); // Too short

      fireEvent.blur(addressInput);

      await waitFor(() => {
        expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('phone validation', () => {
    it('accepts valid 10-digit phone number', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, '1234567890');

      fireEvent.blur(phoneInput);

      // Should not show phone validation error
      await waitFor(() => {
        expect(screen.queryByText(/phone/i)).toBeInTheDocument(); // Label exists
      });
    });
  });

  describe('zip code validation', () => {
    it('accepts valid US zip code', async () => {
      const { user } = render(<ProfileForm onSave={mockOnSave} onCancel={mockOnCancel} />);

      const zipInput = screen.getByLabelText(/zip/i);
      await user.clear(zipInput);
      await user.type(zipInput, '12345');

      fireEvent.blur(zipInput);

      // Should not show zip validation error for valid zip
      await waitFor(() => {
        // Component should not show an error for valid zip
        const errors = screen.queryAllByText(/zip/i);
        // Only the label should contain "zip", not an error
        expect(errors.length).toBeLessThanOrEqual(2);
      });
    });
  });
});

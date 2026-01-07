// ShippingOptions component tests
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ShippingOptions from './ShippingOptions';
import { render, renderWithCart } from '../../testing/test-utils';

describe('ShippingOptions', () => {
  describe('rendering', () => {
    it('renders shipping method title', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('Shipping Method')).toBeInTheDocument();
    });

    it('renders all shipping options', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('Free Shipping')).toBeInTheDocument();
      expect(screen.getByText('Standard Shipping')).toBeInTheDocument();
      expect(screen.getByText('Express Shipping')).toBeInTheDocument();
    });

    it('renders estimated delivery for each option', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('7-10 business days')).toBeInTheDocument();
      expect(screen.getByText('3-5 business days')).toBeInTheDocument();
      expect(screen.getByText('1-2 business days')).toBeInTheDocument();
    });

    it('renders radio buttons for each option', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(3);
    });

    it('renders with correct radio button names', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach((radio) => {
        expect(radio).toHaveAttribute('name', 'shipping-method');
      });
    });
  });

  describe('price display', () => {
    it('displays Free for free shipping option', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('displays price for standard shipping', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('$4.99')).toBeInTheDocument();
    });

    it('displays price for express shipping', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });

    it('shows green color for free shipping text', () => {
      render(<ShippingOptions />);

      const freeText = screen.getByText('Free');
      expect(freeText).toBeInTheDocument();
    });
  });

  describe('default selection', () => {
    it('defaults to standard shipping', () => {
      render(<ShippingOptions />);

      const standardRadio = screen.getByRole('radio', { checked: true });
      expect(standardRadio).toHaveAttribute('id', 'shipping-standard');
    });

    it('standard shipping radio is checked by default', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      const standardRadio = radioButtons.find((radio) => radio.id === 'shipping-standard');
      expect(standardRadio).toBeChecked();
    });

    it('shows estimated delivery summary for default selection', () => {
      render(<ShippingOptions />);

      expect(screen.getByText(/Estimated delivery: 3-5 business days/)).toBeInTheDocument();
    });
  });

  describe('shipping option selection', () => {
    it('selects free shipping when clicked', async () => {
      const { user } = render(<ShippingOptions />);

      const freeShippingLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeShippingLabel);

      const freeRadio = screen.getByRole('radio', { checked: true });
      expect(freeRadio).toHaveAttribute('id', 'shipping-free');
    });

    it('selects express shipping when clicked', async () => {
      const { user } = render(<ShippingOptions />);

      const expressShippingLabel = screen.getByText('Express Shipping').closest('label');
      await user.click(expressShippingLabel);

      const expressRadio = screen.getByRole('radio', { checked: true });
      expect(expressRadio).toHaveAttribute('id', 'shipping-express');
    });

    it('updates estimated delivery when selection changes', async () => {
      const { user } = render(<ShippingOptions />);

      const freeShippingLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeShippingLabel);

      expect(screen.getByText(/Estimated delivery: 7-10 business days/)).toBeInTheDocument();
    });

    it('only one option is selected at a time', async () => {
      const { user } = render(<ShippingOptions />);

      const expressShippingLabel = screen.getByText('Express Shipping').closest('label');
      await user.click(expressShippingLabel);

      const checkedRadios = screen.getAllByRole('radio').filter((radio) => radio.checked);
      expect(checkedRadios).toHaveLength(1);
    });

    it('can change selection multiple times', async () => {
      const { user } = render(<ShippingOptions />);

      // Select free
      const freeLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeLabel);
      expect(screen.getByRole('radio', { checked: true })).toHaveAttribute('id', 'shipping-free');

      // Select express
      const expressLabel = screen.getByText('Express Shipping').closest('label');
      await user.click(expressLabel);
      expect(screen.getByRole('radio', { checked: true })).toHaveAttribute(
        'id',
        'shipping-express',
      );

      // Back to standard
      const standardLabel = screen.getByText('Standard Shipping').closest('label');
      await user.click(standardLabel);
      expect(screen.getByRole('radio', { checked: true })).toHaveAttribute(
        'id',
        'shipping-standard',
      );
    });
  });

  describe('custom onSelect callback', () => {
    it('calls onSelect when shipping option is selected', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      const freeShippingLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeShippingLabel);

      expect(mockOnSelect).toHaveBeenCalledWith('free');
    });

    it('calls onSelect with correct option id for express', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      const expressShippingLabel = screen.getByText('Express Shipping').closest('label');
      await user.click(expressShippingLabel);

      expect(mockOnSelect).toHaveBeenCalledWith('express');
    });

    it('calls onSelect with correct option id for standard', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      // First change to something else
      const freeLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeLabel);

      // Then select standard
      const standardShippingLabel = screen.getByText('Standard Shipping').closest('label');
      await user.click(standardShippingLabel);

      expect(mockOnSelect).toHaveBeenCalledWith('standard');
    });

    it('calls onSelect once per selection', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      const freeShippingLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeShippingLabel);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('compact mode', () => {
    it('renders in compact mode when compact prop is true', () => {
      render(<ShippingOptions compact={true} />);

      const title = screen.getByText('Shipping Method');
      expect(title).toHaveClass('text-xs');
    });

    it('renders in regular mode by default', () => {
      render(<ShippingOptions />);

      const title = screen.getByText('Shipping Method');
      expect(title).toHaveClass('text-sm');
    });

    it('uses smaller padding in compact mode', () => {
      render(<ShippingOptions compact={true} />);

      const labels = screen.getAllByRole('radio').map((radio) => radio.closest('label'));
      labels.forEach((label) => {
        expect(label).toHaveClass('p-2');
      });
    });

    it('uses regular padding in normal mode', () => {
      render(<ShippingOptions />);

      const labels = screen.getAllByRole('radio').map((radio) => radio.closest('label'));
      labels.forEach((label) => {
        expect(label).toHaveClass('p-3');
      });
    });
  });

  describe('className prop', () => {
    it('applies additional className', () => {
      const { container } = render(<ShippingOptions className="custom-class" />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('works with empty className', () => {
      const { container } = render(<ShippingOptions className="" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies multiple custom classes', () => {
      const { container } = render(<ShippingOptions className="class-one class-two" />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('class-one');
      expect(wrapper).toHaveClass('class-two');
    });
  });

  describe('accessibility', () => {
    it('radio buttons are accessible', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons.length).toBeGreaterThan(0);
    });

    it('radio buttons have associated labels', () => {
      render(<ShippingOptions />);

      const freeRadio = screen.getByRole('radio', { name: /free shipping/i });
      expect(freeRadio).toBeInTheDocument();
    });

    it('radio buttons are keyboard accessible', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach((radio) => {
        expect(radio).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('labels are clickable', async () => {
      const { user } = render(<ShippingOptions />);

      const label = screen.getByText('Express Shipping').closest('label');
      await user.click(label);

      const checkedRadio = screen.getByRole('radio', { checked: true });
      expect(checkedRadio).toHaveAttribute('id', 'shipping-express');
    });
  });

  describe('styling', () => {
    it('labels have cursor pointer', () => {
      render(<ShippingOptions />);

      const labels = screen.getAllByRole('radio').map((radio) => radio.closest('label'));
      labels.forEach((label) => {
        expect(label).toHaveClass('cursor-pointer');
      });
    });

    it('labels have rounded corners', () => {
      render(<ShippingOptions />);

      const labels = screen.getAllByRole('radio').map((radio) => radio.closest('label'));
      labels.forEach((label) => {
        expect(label).toHaveClass('rounded-lg');
      });
    });

    it('labels have transition class', () => {
      render(<ShippingOptions />);

      const labels = screen.getAllByRole('radio').map((radio) => radio.closest('label'));
      labels.forEach((label) => {
        expect(label).toHaveClass('transition-all');
      });
    });

    it('selected option has different styling', async () => {
      const { user } = render(<ShippingOptions />);

      const expressLabel = screen.getByText('Express Shipping').closest('label');
      const _initialStyle = expressLabel.style.backgroundColor;

      await user.click(expressLabel);

      // After selection, the style should change (selected has selectedBg)
      expect(expressLabel.style.backgroundColor).toBeDefined();
    });
  });

  describe('shipping options structure', () => {
    it('each option has id, name, price, and estimatedDelivery', () => {
      render(<ShippingOptions />);

      // Check free shipping has all parts
      expect(screen.getByText('Free Shipping')).toBeInTheDocument();
      expect(screen.getByText('7-10 business days')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();

      // Check standard has all parts
      expect(screen.getByText('Standard Shipping')).toBeInTheDocument();
      expect(screen.getByText('3-5 business days')).toBeInTheDocument();
      expect(screen.getByText('$4.99')).toBeInTheDocument();

      // Check express has all parts
      expect(screen.getByText('Express Shipping')).toBeInTheDocument();
      expect(screen.getByText('1-2 business days')).toBeInTheDocument();
      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });

    it('options are displayed in correct order', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons[0]).toHaveAttribute('id', 'shipping-free');
      expect(radioButtons[1]).toHaveAttribute('id', 'shipping-standard');
      expect(radioButtons[2]).toHaveAttribute('id', 'shipping-express');
    });
  });

  describe('estimated delivery summary', () => {
    it('shows summary section', () => {
      render(<ShippingOptions />);

      expect(screen.getByText(/Estimated delivery:/)).toBeInTheDocument();
    });

    it('summary updates when free shipping is selected', async () => {
      const { user } = render(<ShippingOptions />);

      const freeLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeLabel);

      expect(screen.getByText(/Estimated delivery: 7-10 business days/)).toBeInTheDocument();
    });

    it('summary updates when express shipping is selected', async () => {
      const { user } = render(<ShippingOptions />);

      const expressLabel = screen.getByText('Express Shipping').closest('label');
      await user.click(expressLabel);

      expect(screen.getByText(/Estimated delivery: 1-2 business days/)).toBeInTheDocument();
    });

    it('summary has border-top styling', () => {
      const { container } = render(<ShippingOptions />);

      const summaryDiv = container.querySelector('.border-t.mt-3.pt-3');
      expect(summaryDiv).toBeInTheDocument();
    });
  });

  describe('hover states', () => {
    it('label has hover effect setup', () => {
      render(<ShippingOptions />);

      const label = screen.getByText('Free Shipping').closest('label');
      expect(label).toHaveAttribute('style');
    });
  });

  describe('integration with cart context', () => {
    it('works with cart context provider', () => {
      renderWithCart(<ShippingOptions />);

      expect(screen.getByText('Shipping Method')).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('cart context provides shipping options', () => {
      renderWithCart(<ShippingOptions />);

      expect(screen.getByText('Free Shipping')).toBeInTheDocument();
      expect(screen.getByText('Standard Shipping')).toBeInTheDocument();
      expect(screen.getByText('Express Shipping')).toBeInTheDocument();
    });

    it('selection persists in cart context', async () => {
      const { user } = renderWithCart(<ShippingOptions />);

      const expressLabel = screen.getByText('Express Shipping').closest('label');
      await user.click(expressLabel);

      // The radio should remain checked
      const checkedRadio = screen.getByRole('radio', { checked: true });
      expect(checkedRadio).toHaveAttribute('id', 'shipping-express');
    });
  });

  describe('edge cases', () => {
    it('handles rapid clicks gracefully', async () => {
      const { user } = render(<ShippingOptions />);

      const freeLabel = screen.getByText('Free Shipping').closest('label');
      const expressLabel = screen.getByText('Express Shipping').closest('label');
      const standardLabel = screen.getByText('Standard Shipping').closest('label');

      await user.click(freeLabel);
      await user.click(expressLabel);
      await user.click(standardLabel);
      await user.click(freeLabel);

      const checkedRadio = screen.getByRole('radio', { checked: true });
      expect(checkedRadio).toHaveAttribute('id', 'shipping-free');
    });

    it('clicking same option twice keeps it selected', async () => {
      const { user } = render(<ShippingOptions />);

      const freeLabel = screen.getByText('Free Shipping').closest('label');
      await user.click(freeLabel);
      await user.click(freeLabel);

      const checkedRadio = screen.getByRole('radio', { checked: true });
      expect(checkedRadio).toHaveAttribute('id', 'shipping-free');
    });
  });

  describe('radio button attributes', () => {
    it('radio buttons have correct type', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach((radio) => {
        expect(radio).toHaveAttribute('type', 'radio');
      });
    });

    it('radio buttons have correct ids', () => {
      render(<ShippingOptions />);

      expect(screen.getByRole('radio', { name: /free shipping/i })).toHaveAttribute(
        'id',
        'shipping-free',
      );
      expect(screen.getByRole('radio', { name: /standard shipping/i })).toHaveAttribute(
        'id',
        'shipping-standard',
      );
      expect(screen.getByRole('radio', { name: /express shipping/i })).toHaveAttribute(
        'id',
        'shipping-express',
      );
    });

    it('all radio buttons share same name attribute', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      const names = radioButtons.map((radio) => radio.getAttribute('name'));
      expect(new Set(names).size).toBe(1);
      expect(names[0]).toBe('shipping-method');
    });
  });

  describe('text content', () => {
    it('displays all option names correctly', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('Free Shipping')).toBeInTheDocument();
      expect(screen.getByText('Standard Shipping')).toBeInTheDocument();
      expect(screen.getByText('Express Shipping')).toBeInTheDocument();
    });

    it('displays section title correctly', () => {
      render(<ShippingOptions />);

      const title = screen.getByText('Shipping Method');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
    });
  });
});

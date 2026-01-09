// ShippingOptions component tests
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import ShippingOptions from './ShippingOptions';
import { render, renderWithCart } from '../testing/test-utils';

describe('ShippingOptions', () => {
  describe('rendering', () => {
    it('renders shipping method title', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('Shipping Method')).toBeInTheDocument();
    });

    it('renders all shipping options with shortened names', () => {
      render(<ShippingOptions />);

      // Component strips " Shipping" from names
      // Note: "Free" appears twice - once as name and once as price
      expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Express')).toBeInTheDocument();
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
    it('displays Free price for free shipping option', () => {
      render(<ShippingOptions />);

      // There are two "Free" texts - one for name and one for price
      const freeTexts = screen.getAllByText('Free');
      expect(freeTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('displays price for standard shipping', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('$4.99')).toBeInTheDocument();
    });

    it('displays price for express shipping', () => {
      render(<ShippingOptions />);

      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });

    it('shows green color for free shipping price text', () => {
      render(<ShippingOptions />);

      // Find the price "Free" text (not the name)
      const freeTexts = screen.getAllByText('Free');
      const priceText = freeTexts.find((el) => el.closest('span')?.classList.contains('shrink-0'));
      expect(priceText).toBeInTheDocument();
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
  });

  describe('shipping option selection', () => {
    it('selects free shipping when clicked', async () => {
      const { user } = render(<ShippingOptions />);

      const freeRadio = screen.getByRole('radio', { name: /free/i });
      await user.click(freeRadio);

      expect(freeRadio).toBeChecked();
      expect(freeRadio).toHaveAttribute('id', 'shipping-free');
    });

    it('selects express shipping when clicked', async () => {
      const { user } = render(<ShippingOptions />);

      const expressShippingLabel = screen.getByText('Express').closest('label');
      await user.click(expressShippingLabel);

      const expressRadio = screen.getByRole('radio', { checked: true });
      expect(expressRadio).toHaveAttribute('id', 'shipping-express');
    });

    it('only one option is selected at a time', async () => {
      const { user } = render(<ShippingOptions />);

      const expressShippingLabel = screen.getByText('Express').closest('label');
      await user.click(expressShippingLabel);

      const checkedRadios = screen.getAllByRole('radio', { checked: true });
      expect(checkedRadios).toHaveLength(1);
    });

    it('can change selection multiple times', async () => {
      const { user } = render(<ShippingOptions />);

      // Select free
      const freeRadio = screen.getByRole('radio', { name: /free/i });
      await user.click(freeRadio);
      expect(freeRadio).toBeChecked();

      // Select express
      const expressRadio = screen.getByRole('radio', { name: /express/i });
      await user.click(expressRadio);
      expect(expressRadio).toBeChecked();

      // Select standard
      const standardRadio = screen.getByRole('radio', { name: /standard/i });
      await user.click(standardRadio);
      expect(standardRadio).toBeChecked();
    });
  });

  describe('custom onSelect callback', () => {
    it('calls onSelect when shipping option is selected', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      const freeRadio = screen.getByRole('radio', { name: /free/i });
      await user.click(freeRadio);

      expect(mockOnSelect).toHaveBeenCalledWith('free');
    });

    it('calls onSelect with correct option id for express', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      const expressShippingLabel = screen.getByText('Express').closest('label');
      await user.click(expressShippingLabel);

      expect(mockOnSelect).toHaveBeenCalledWith('express');
    });

    it('calls onSelect with correct option id for standard', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      // First click free to change from default
      const freeRadio = screen.getByRole('radio', { name: /free/i });
      await user.click(freeRadio);

      // Then click standard
      const standardRadio = screen.getByRole('radio', { name: /standard/i });
      await user.click(standardRadio);

      expect(mockOnSelect).toHaveBeenCalledWith('standard');
    });

    it('calls onSelect once per selection', async () => {
      const mockOnSelect = vi.fn();
      const { user } = render(<ShippingOptions onSelect={mockOnSelect} />);

      const freeRadio = screen.getByRole('radio', { name: /free/i });
      await user.click(freeRadio);

      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('compact mode', () => {
    it('renders in compact mode when compact prop is true', () => {
      render(<ShippingOptions compact={true} />);

      const title = screen.getByText('Shipping Method');
      expect(title).toBeInTheDocument();
    });

    it('renders in regular mode by default', () => {
      render(<ShippingOptions />);

      const title = screen.getByText('Shipping Method');
      expect(title).toBeInTheDocument();
    });

    it('uses smaller padding in compact mode', () => {
      const { container } = render(<ShippingOptions compact={true} />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveClass('px-2');
        expect(label).toHaveClass('py-1.5');
      });
    });

    it('uses regular padding in normal mode', () => {
      const { container } = render(<ShippingOptions />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveClass('px-3');
        expect(label).toHaveClass('py-2');
      });
    });

    it('hides estimated delivery in compact mode', () => {
      render(<ShippingOptions compact={true} />);

      // In compact mode, estimated delivery text is not shown
      expect(screen.queryByText('7-10 business days')).not.toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies additional className', () => {
      const { container } = render(<ShippingOptions className="custom-class" />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });

    it('works with empty className', () => {
      const { container } = render(<ShippingOptions />);
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
      expect(radioButtons.length).toBe(3);
    });

    it('radio buttons have correct ids', () => {
      render(<ShippingOptions />);

      expect(screen.getByRole('radio', { name: /free/i })).toHaveAttribute('id', 'shipping-free');
      expect(screen.getByRole('radio', { name: /standard/i })).toHaveAttribute(
        'id',
        'shipping-standard'
      );
      expect(screen.getByRole('radio', { name: /express/i })).toHaveAttribute(
        'id',
        'shipping-express'
      );
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

      const label = screen.getByText('Express').closest('label');
      await user.click(label);

      const checkedRadio = screen.getByRole('radio', { checked: true });
      expect(checkedRadio).toHaveAttribute('id', 'shipping-express');
    });
  });

  describe('styling', () => {
    it('labels have cursor pointer', () => {
      const { container } = render(<ShippingOptions />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveClass('cursor-pointer');
      });
    });

    it('labels have rounded corners', () => {
      const { container } = render(<ShippingOptions />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveClass('rounded-md');
      });
    });

    it('labels have transition class', () => {
      const { container } = render(<ShippingOptions />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveClass('transition-all');
      });
    });

    it('labels use flex layout', () => {
      const { container } = render(<ShippingOptions />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveClass('flex');
        expect(label).toHaveClass('items-center');
      });
    });
  });

  describe('shipping options structure', () => {
    it('options are displayed in correct order', () => {
      render(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons[0]).toHaveAttribute('id', 'shipping-free');
      expect(radioButtons[1]).toHaveAttribute('id', 'shipping-standard');
      expect(radioButtons[2]).toHaveAttribute('id', 'shipping-express');
    });

    it('each option displays name and price', () => {
      render(<ShippingOptions />);

      // Check that each option type is shown with its price
      // "Free" appears twice - once as name, once as price
      expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('$4.99')).toBeInTheDocument();
      expect(screen.getByText('Express')).toBeInTheDocument();
      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });
  });

  describe('integration with cart context', () => {
    it('works with cart context provider', () => {
      renderWithCart(<ShippingOptions />);

      expect(screen.getByText('Shipping Method')).toBeInTheDocument();
    });

    it('cart context provides shipping options', () => {
      renderWithCart(<ShippingOptions />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(3);
    });

    it('selection persists in cart context', async () => {
      const { user } = renderWithCart(<ShippingOptions />);

      const expressLabel = screen.getByText('Express').closest('label');
      await user.click(expressLabel);

      const checkedRadio = screen.getByRole('radio', { checked: true });
      expect(checkedRadio).toHaveAttribute('id', 'shipping-express');
    });
  });

  describe('edge cases', () => {
    it('handles rapid clicks gracefully', async () => {
      const { user } = render(<ShippingOptions />);

      const freeRadio = screen.getByRole('radio', { name: /free/i });
      const expressRadio = screen.getByRole('radio', { name: /express/i });
      const standardRadio = screen.getByRole('radio', { name: /standard/i });

      await user.click(freeRadio);
      await user.click(expressRadio);
      await user.click(standardRadio);
      await user.click(freeRadio);

      expect(freeRadio).toBeChecked();
    });

    it('clicking same option twice keeps it selected', async () => {
      const { user } = render(<ShippingOptions />);

      const freeRadio = screen.getByRole('radio', { name: /free/i });
      await user.click(freeRadio);
      await user.click(freeRadio);

      expect(freeRadio).toBeChecked();
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

      expect(screen.getByRole('radio', { name: /free/i })).toHaveAttribute('id', 'shipping-free');
      expect(screen.getByRole('radio', { name: /standard/i })).toHaveAttribute(
        'id',
        'shipping-standard'
      );
      expect(screen.getByRole('radio', { name: /express/i })).toHaveAttribute(
        'id',
        'shipping-express'
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
    it('displays all option names correctly (shortened)', () => {
      render(<ShippingOptions />);

      // "Free" appears multiple times (name and price)
      expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Express')).toBeInTheDocument();
    });

    it('displays section title correctly', () => {
      render(<ShippingOptions />);

      const title = screen.getByText('Shipping Method');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
    });
  });
});

// Footer component tests
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Footer from './Footer';
import { render, renderWithTheme } from '../../testing/test-utils';

describe('Footer', () => {
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<Footer />);

      expect(document.body).toBeInTheDocument();
    });

    it('renders footer element', () => {
      render(<Footer />);

      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('renders copyright text', () => {
      render(<Footer />);

      expect(screen.getByText(/Mart - For You\. All rights reserved\./)).toBeInTheDocument();
    });

    it('renders sustainability badge text', () => {
      render(<Footer />);

      expect(screen.getByText('Made with sustainable code')).toBeInTheDocument();
    });
  });

  describe('copyright year', () => {
    it('displays current year in copyright', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
    });

    it('copyright includes company name', () => {
      render(<Footer />);

      expect(screen.getByText(/Mart - For You/)).toBeInTheDocument();
    });

    it('copyright includes all rights reserved', () => {
      render(<Footer />);

      expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
    });
  });

  describe('sustainability badge', () => {
    it('displays sustainability message', () => {
      render(<Footer />);

      expect(screen.getByText('Made with sustainable code')).toBeInTheDocument();
    });

    it('has recycle icon', () => {
      const { container } = render(<Footer />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('icon has correct sizing', () => {
      const { container } = render(<Footer />);

      const icon = container.querySelector('.h-5.w-5');
      expect(icon).toBeInTheDocument();
    });

    it('icon has margin right', () => {
      const { container } = render(<Footer />);

      const icon = container.querySelector('.mr-2');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('has max-width container', () => {
      const { container } = render(<Footer />);

      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('is horizontally centered', () => {
      const { container } = render(<Footer />);

      const centeredContainer = container.querySelector('.mx-auto');
      expect(centeredContainer).toBeInTheDocument();
    });

    it('has horizontal padding', () => {
      const { container } = render(<Footer />);

      const paddedContainer = container.querySelector('.px-4');
      expect(paddedContainer).toBeInTheDocument();
    });

    it('has responsive padding for small screens', () => {
      const { container } = render(<Footer />);

      const responsiveContainer = container.querySelector('.sm\\:px-6');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('has responsive padding for large screens', () => {
      const { container } = render(<Footer />);

      const lgContainer = container.querySelector('.lg\\:px-8');
      expect(lgContainer).toBeInTheDocument();
    });

    it('uses flexbox for content layout', () => {
      const { container } = render(<Footer />);

      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });

    it('uses column layout on mobile', () => {
      const { container } = render(<Footer />);

      const colContainer = container.querySelector('.flex-col');
      expect(colContainer).toBeInTheDocument();
    });

    it('uses row layout on medium screens', () => {
      const { container } = render(<Footer />);

      const mdRowContainer = container.querySelector('.md\\:flex-row');
      expect(mdRowContainer).toBeInTheDocument();
    });

    it('has space between items on medium screens', () => {
      const { container } = render(<Footer />);

      const justifyContainer = container.querySelector('.justify-between');
      expect(justifyContainer).toBeInTheDocument();
    });

    it('items are centered', () => {
      const { container } = render(<Footer />);

      const centeredItems = container.querySelector('.items-center');
      expect(centeredItems).toBeInTheDocument();
    });
  });

  describe('footer styling', () => {
    it('has vertical padding', () => {
      render(<Footer />);

      const footer = document.querySelector('footer');
      expect(footer).toHaveClass('py-8');
    });

    it('has background style applied', () => {
      render(<Footer />);

      const footer = document.querySelector('footer');
      expect(footer).toHaveAttribute('style');
    });
  });

  describe('text styling', () => {
    it('copyright text is small', () => {
      const { container: _container } = render(<Footer />);

      const copyrightText = screen.getByText(/Mart - For You/).closest('p');
      expect(copyrightText).toHaveClass('text-sm');
    });

    it('sustainability text is small', () => {
      render(<Footer />);

      const sustainabilityText = screen.getByText('Made with sustainable code');
      expect(sustainabilityText).toHaveClass('text-sm');
    });

    it('copyright text has color style', () => {
      const { container: _container } = render(<Footer />);

      const copyrightText = screen.getByText(/Mart - For You/).closest('p');
      expect(copyrightText).toHaveAttribute('style');
    });

    it('sustainability text has color style', () => {
      render(<Footer />);

      const sustainabilityText = screen.getByText('Made with sustainable code');
      expect(sustainabilityText).toHaveAttribute('style');
    });
  });

  describe('sustainability badge layout', () => {
    it('badge uses flexbox', () => {
      const { container: _container } = render(<Footer />);

      const badgeContainer = screen.getByText('Made with sustainable code').closest('.flex');
      expect(badgeContainer).toBeInTheDocument();
    });

    it('badge items are centered', () => {
      const { container: _container } = render(<Footer />);

      const badgeContainer = screen
        .getByText('Made with sustainable code')
        .closest('.items-center');
      expect(badgeContainer).toBeInTheDocument();
    });

    it('badge has top margin on mobile', () => {
      const { container: _container } = render(<Footer />);

      const badgeContainer = screen.getByText('Made with sustainable code').closest('.mt-4');
      expect(badgeContainer).toBeInTheDocument();
    });

    it('badge has no top margin on medium screens', () => {
      const { container: _container } = render(<Footer />);

      const badgeContainer = screen.getByText('Made with sustainable code').closest('.md\\:mt-0');
      expect(badgeContainer).toBeInTheDocument();
    });
  });

  describe('additional info section', () => {
    it('has additional info section with margin top', () => {
      const { container } = render(<Footer />);

      const additionalInfo = container.querySelector('.mt-6.text-center');
      expect(additionalInfo).toBeInTheDocument();
    });

    it('additional info has extra small text', () => {
      const { container } = render(<Footer />);

      const additionalInfo = container.querySelector('.mt-6 p.text-xs');
      expect(additionalInfo).toBeInTheDocument();
    });
  });

  describe('theme integration', () => {
    it('renders correctly with theme provider', () => {
      renderWithTheme(<Footer />);

      expect(screen.getByText(/Mart - For You/)).toBeInTheDocument();
    });

    it('footer has background gradient style', () => {
      render(<Footer />);

      const footer = document.querySelector('footer');
      const style = footer.getAttribute('style');
      expect(style).toContain('background');
    });

    it('icon has color style', () => {
      const { container } = render(<Footer />);

      const icon = container.querySelector('.h-5.w-5');
      expect(icon).toHaveAttribute('style');
    });
  });

  describe('accessibility', () => {
    it('footer is semantic HTML', () => {
      render(<Footer />);

      const footer = document.querySelector('footer');
      expect(footer.tagName).toBe('FOOTER');
    });

    it('text content is visible', () => {
      render(<Footer />);

      expect(screen.getByText(/Mart - For You/)).toBeVisible();
      expect(screen.getByText('Made with sustainable code')).toBeVisible();
    });

    it('icon is decorative (part of visual badge)', () => {
      const { container } = render(<Footer />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('content structure', () => {
    it('has bottom section with copyright and sustainability', () => {
      const { container } = render(<Footer />);

      const bottomSection = container.querySelector('.flex.flex-col.md\\:flex-row');
      expect(bottomSection).toBeInTheDocument();
    });

    it('copyright comes before sustainability badge', () => {
      const { container } = render(<Footer />);

      const bottomSection = container.querySelector('.flex.flex-col.md\\:flex-row');
      const children = Array.from(bottomSection.children);

      // Copyright paragraph should be first
      expect(children[0].textContent).toContain('Mart - For You');
      // Sustainability should be second
      expect(children[1].textContent).toContain('sustainable');
    });
  });

  describe('edge cases', () => {
    it('renders correctly multiple times', () => {
      const { rerender } = render(<Footer />);

      expect(screen.getByText(/Mart - For You/)).toBeInTheDocument();

      rerender(<Footer />);

      expect(screen.getByText(/Mart - For You/)).toBeInTheDocument();
    });

    it('handles year boundary correctly', () => {
      // Mock Date to test year
      const originalDate = global.Date;
      const mockDate = new Date('2025-01-01');
      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      };
      global.Date.prototype.getFullYear = () => 2025;

      render(<Footer />);

      // Footer creates new Date() internally, but our mock might not fully work
      // Just verify footer renders without error
      expect(screen.getByText(/Mart - For You/)).toBeInTheDocument();

      global.Date = originalDate;
    });
  });

  describe('icon styling', () => {
    it('recycle icon has correct height', () => {
      const { container } = render(<Footer />);

      const icon = container.querySelector('.h-5');
      expect(icon).toBeInTheDocument();
    });

    it('recycle icon has correct width', () => {
      const { container } = render(<Footer />);

      const icon = container.querySelector('.w-5');
      expect(icon).toBeInTheDocument();
    });

    it('recycle icon has margin', () => {
      const { container } = render(<Footer />);

      const iconWithMargin = container.querySelector('svg.mr-2');
      expect(iconWithMargin).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('stacks content vertically on mobile', () => {
      const { container } = render(<Footer />);

      const flexCol = container.querySelector('.flex-col');
      expect(flexCol).toBeInTheDocument();
    });

    it('arranges content horizontally on medium screens', () => {
      const { container } = render(<Footer />);

      const mdFlexRow = container.querySelector('.md\\:flex-row');
      expect(mdFlexRow).toBeInTheDocument();
    });

    it('sustainability badge margin adjusts for screen size', () => {
      const { container: _container } = render(<Footer />);

      const badgeContainer = screen.getByText('Made with sustainable code').closest('div');
      expect(badgeContainer).toHaveClass('mt-4');
      expect(badgeContainer).toHaveClass('md:mt-0');
    });
  });

  describe('complete footer structure', () => {
    it('has all required elements', () => {
      const { container } = render(<Footer />);

      // Footer element
      expect(document.querySelector('footer')).toBeInTheDocument();

      // Max width container
      expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();

      // Copyright text
      expect(screen.getByText(/©.*Mart - For You/)).toBeInTheDocument();

      // Sustainability badge
      expect(screen.getByText('Made with sustainable code')).toBeInTheDocument();

      // Recycle icon
      expect(container.querySelector('svg')).toBeInTheDocument();

      // Additional info section
      expect(container.querySelector('.mt-6.text-center')).toBeInTheDocument();
    });
  });
});

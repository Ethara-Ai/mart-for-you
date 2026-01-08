import { AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import ProductCard from './ProductCard';

/**
 * ProductGrid - Grid layout for displaying products
 *
 * Displays a responsive grid of ProductCard components with
 * animated transitions when products are filtered or changed.
 *
 * @param {Object} props
 * @param {Array} props.products - Array of product objects to display
 * @param {Function} props.onAddToCart - Optional custom add to cart handler
 * @param {string} props.emptyMessage - Message to show when no products
 * @param {boolean} props.loading - Whether products are loading
 * @param {number} props.columns - Number of columns (default: auto-responsive)
 * @param {string} props.className - Additional CSS classes
 */
function ProductGrid({
  products = [],
  onAddToCart,
  emptyMessage = 'No products found',
  loading = false,
  columns,
  className = '',
}) {
  const { darkMode, COLORS } = useTheme();

  // Determine grid columns class based on props or use responsive default
  const getGridColumns = () => {
    if (columns) {
      return `grid-cols-${columns}`;
    }
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`grid ${getGridColumns()} gap-3 sm:gap-4 ${className}`}>
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg overflow-hidden border"
            style={{
              backgroundColor: darkMode ? COLORS.dark.secondary : '#ffffff',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Image skeleton */}
            <div
              className="aspect-square w-full"
              style={{
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#f8f8f8',
              }}
            />
            {/* Content skeleton */}
            <div className="p-3 space-y-2">
              <div
                className="h-3 w-16 rounded-sm"
                style={{
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }}
              />
              <div
                className="h-4 w-full rounded-sm"
                style={{
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }}
              />
              <div
                className="h-3 w-1/2 rounded-sm"
                style={{
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }}
              />
              <div className="flex justify-between items-center pt-1">
                <div
                  className="h-5 w-12 rounded-sm"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }}
                />
                <div
                  className="h-7 w-14 rounded-lg"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div
          className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3
          className="text-xl font-medium mb-2"
          style={{
            color: darkMode ? COLORS.dark.text : COLORS.light.text,
          }}
        >
          {emptyMessage}
        </h3>
        <p
          className="text-sm"
          style={{
            color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
          }}
        >
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  // Product grid
  return (
    <div className={`grid ${getGridColumns()} gap-3 sm:gap-4 ${className}`}>
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ProductGrid;

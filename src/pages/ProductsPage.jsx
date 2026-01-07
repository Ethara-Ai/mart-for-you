import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Navigation } from '../components/layout';
import { ProductGrid } from '../components/product';
import { products } from '../data/products';

/**
 * ProductsPage - Products listing page component
 *
 * Displays all products with category filtering, search functionality,
 * and optional offers filter. Supports URL query parameters for
 * pre-filtering (e.g., ?category=electronics)
 */
function ProductsPage() {
  const { darkMode, COLORS } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [viewingOffers, setViewingOffers] = useState(false);

  // Filter products based on category, search, and offers
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        // Category filter
        const categoryMatch = activeCategory === 'all' || product.category === activeCategory;

        // Offers filter
        const offersMatch = !viewingOffers || product.onSale === true;

        // Search filter
        const searchMatch =
          !searchTerm ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());

        return categoryMatch && searchMatch && offersMatch;
      }),
    [activeCategory, searchTerm, viewingOffers],
  );

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setViewingOffers(false);
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // Handle offers click
  const handleOffersClick = () => {
    setViewingOffers(true);
    setActiveCategory('all');
    // Clear category from URL
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    setSearchParams(newParams);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  // Get page title
  const getPageTitle = () => {
    if (viewingOffers) return 'Special Offers';
    if (activeCategory !== 'all') {
      return `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Products`;
    }
    return 'All Products';
  };

  // Get page description
  const getPageDescription = () => {
    if (viewingOffers) {
      return 'Limited time deals with amazing discounts on selected products.';
    }
    if (activeCategory !== 'all') {
      return `Browse our selection of ${activeCategory} products.`;
    }
    return 'Explore our complete collection of carefully curated products.';
  };

  return (
    <div>
      {/* Navigation with categories and search */}
      <Navigation
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        viewingOffers={viewingOffers}
        onOffersClick={handleOffersClick}
      />

      {/* Main Content */}
      <main
        id="products-section"
        className="grow py-12 min-h-screen"
        style={{
          background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h1
              className="text-3xl font-extrabold sm:text-4xl"
              style={{
                color: darkMode ? COLORS.dark.text : COLORS.light.text,
                fontFamily: "'Metropolis', sans-serif",
                letterSpacing: '-0.5px',
              }}
            >
              {getPageTitle()}
            </h1>
            <p
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{
                color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
              }}
            >
              {getPageDescription()}
            </p>

            {/* Product Count */}
            <p
              className="mt-2 text-sm"
              style={{
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              }}
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}{' '}
              found
            </p>
          </motion.div>

          {/* Offers Banner */}
          {viewingOffers && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 rounded-lg"
              style={{
                background: `linear-gradient(to right, ${
                  darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)'
                }, ${darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'})`,
                borderLeft: '4px solid rgba(239, 68, 68, 0.8)',
              }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: 'rgba(239, 68, 68, 0.9)' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3
                      className="font-bold"
                      style={{
                        color: darkMode ? COLORS.dark.text : COLORS.light.text,
                      }}
                    >
                      Limited Time Offers
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: darkMode ? 'rgba(224, 224, 224, 0.8)' : 'rgba(51, 51, 51, 0.8)',
                      }}
                    >
                      These deals won&apos;t last long! Up to 40% off selected items.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search Results Summary */}
          {searchTerm && (
            <div className="mb-8 text-center">
              <p
                className="text-sm mb-2"
                style={{
                  color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                }}
              >
                Search results for:{' '}
                <span
                  className="font-medium"
                  style={{
                    color: darkMode ? COLORS.dark.text : COLORS.light.text,
                  }}
                >
                  &quot;{searchTerm}&quot;
                </span>
              </p>
              {filteredProducts.length === 0 && (
                <button
                  onClick={handleClearSearch}
                  className="mt-2 text-sm underline cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            emptyMessage={
              searchTerm
                ? 'No products found matching your search'
                : viewingOffers
                  ? 'No offers available at the moment'
                  : 'No products available in this category'
            }
          />
        </div>
      </main>
    </div>
  );
}

export default ProductsPage;

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context';
import { Hero } from '../components/home';
import { Navigation } from '../components/layout';
import { ProductGrid } from '../components/product';
import { CartModal } from '../components/cart';
import { products } from '../data/products';

/**
 * OffersPage - Special offers/sales page component
 *
 * Displays all products that are currently on sale with
 * discounted prices. Includes hero section, search functionality,
 * and promotional banner.
 */
function OffersPage() {
  const { darkMode, COLORS } = useTheme();
  const { searchTerm, clearSearch } = useSearch();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Get only products on sale
  const saleProducts = useMemo(() => products.filter((product) => product.onSale === true), []);

  // Filter sale products based on search and category
  const filteredProducts = useMemo(
    () =>
      saleProducts.filter((product) => {
        // Category filter
        const categoryMatch = activeCategory === 'all' || product.category === activeCategory;

        // Search filter
        const searchMatch =
          !searchTerm ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());

        return categoryMatch && searchMatch;
      }),
    [saleProducts, activeCategory, searchTerm],
  );

  // Calculate total savings
  const totalSavings = useMemo(
    () =>
      saleProducts.reduce((total, product) => {
        if (product.salePrice) {
          return total + (product.price - product.salePrice);
        }
        return total;
      }, 0),
    [saleProducts],
  );

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle offers click (already on offers page)
  const handleOffersClick = () => {
    // Already viewing offers, reset filters
    setActiveCategory('all');
    clearSearch();
  };

  // Handle cart open
  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  // Handle cart close
  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  return (
    <div>
      {/* Hero and Navigation Section with shared gradient background */}
      <div
        style={{
          background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        }}
      >
        {/* Hero Section */}
        <Hero
          title="Exclusive Deals & Offers"
          subtitle="Save big on your favorite products with limited-time discounts"
          ctaText="View Deals"
          videoUrl="https://videos.pexels.com/video-files/29068393/12563855_1920_1080_30fps.mp4"
        />

        {/* Navigation with categories */}
        <Navigation
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewingOffers={true}
          onOffersClick={handleOffersClick}
          onCartClick={handleCartOpen}
        />
      </div>

      {/* Main Content */}
      <main
        id="products-section"
        className="grow py-12 min-h-screen"
        style={{
          background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h1
              className="text-3xl font-extrabold sm:text-4xl"
              style={{
                color: darkMode ? COLORS.dark.text : COLORS.light.text,
                fontFamily: "'Metropolis', sans-serif",
                letterSpacing: '-0.5px',
              }}
            >
              🔥 Special Offers
            </h1>
            <p
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{
                color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
              }}
            >
              Don&apos;t miss out on these amazing deals! Limited time only.
            </p>
          </motion.div>

          {/* Promotional Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 p-6 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${
                darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'
              }, ${darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)'})`,
              border: `1px solid ${darkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Left side - Info */}
              <div className="flex items-center mb-4 md:mb-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <svg
                    className="w-6 h-6"
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
                </div>
                <div>
                  <h3
                    className="font-bold text-lg"
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
                    Up to 40% off on selected items. These deals won&apos;t last long!
                  </p>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                    }}
                  >
                    {saleProducts.length}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: darkMode ? 'rgba(224, 224, 224, 0.6)' : 'rgba(51, 51, 51, 0.6)',
                    }}
                  >
                    Items on Sale
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color: 'rgb(239, 68, 68)',
                    }}
                  >
                    ${totalSavings.toFixed(0)}+
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: darkMode ? 'rgba(224, 224, 224, 0.6)' : 'rgba(51, 51, 51, 0.6)',
                    }}
                  >
                    Total Savings
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Results Summary */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center"
            >
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
              <p
                className="text-sm"
                style={{
                  color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                }}
              >
                Found {filteredProducts.length} {filteredProducts.length === 1 ? 'offer' : 'offers'}
              </p>
              {filteredProducts.length === 0 && (
                <button
                  onClick={clearSearch}
                  className="mt-2 text-sm underline cursor-pointer hover:opacity-80 transition-opacity"
                  style={{
                    color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  }}
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}

          {/* Product Grid */}
          <ProductGrid
            products={filteredProducts}
            emptyMessage={
              searchTerm
                ? 'No offers found matching your search'
                : 'No special offers available at the moment. Check back soon!'
            }
          />

          {/* Bottom CTA */}
          {filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <p
                className="text-sm mb-4"
                style={{
                  color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
                }}
              >
                * Offers valid while supplies last. Prices and availability subject to change.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={handleCartClose} />
    </div>
  );
}

export default OffersPage;

import { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Hero } from '../components/home';
import { Navigation } from '../components/layout';
import { ProductGrid } from '../components/product';
import { products } from '../data/products';
import { CartModal } from '../components/cart';

/**
 * HomePage - Main landing page component
 *
 * Displays the hero section with video background,
 * category navigation, search functionality, and
 * a grid of featured products.
 */
function HomePage() {
  const { darkMode, COLORS } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingOffers, setViewingOffers] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter products based on category, search, and offers
  const filteredProducts = useMemo(() => products.filter((product) => {
      // Category filter
      const categoryMatch =
        activeCategory === 'all' || product.category === activeCategory;

      // Offers filter
      const offersMatch = !viewingOffers || product.onSale === true;

      // Search filter
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch && offersMatch;
    }), [activeCategory, searchTerm, viewingOffers]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setViewingOffers(false);
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Handle offers click
  const handleOffersClick = () => {
    setViewingOffers(true);
    setActiveCategory('all');
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
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
      {/* Hero Section */}
      <Hero />

      {/* Navigation with categories and search */}
      <Navigation
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        viewingOffers={viewingOffers}
        onOffersClick={handleOffersClick}
        onCartClick={handleCartOpen}
      />

      {/* Main Content */}
      <main
        id="products-section"
        className="grow py-12"
        style={{
          background: darkMode
            ? COLORS.dark.backgroundGradient
            : COLORS.light.backgroundGradient,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-extrabold sm:text-4xl"
              style={{
                color: darkMode ? COLORS.dark.text : COLORS.light.text,
                fontFamily: "'Metropolis', sans-serif",
                letterSpacing: '-0.5px',
              }}
            >
              {viewingOffers ? 'Special Offers' : 'Our Products'}
            </h2>
            <p
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{
                color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
              }}
            >
              {viewingOffers
                ? 'Limited time deals with amazing discounts on selected products.'
                : 'Explore our collection of carefully curated products just for you.'}
            </p>
          </div>

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
                  {searchTerm}
                </span>
              </p>
              <p className="text-sm">
                Found {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              {filteredProducts.length === 0 && (
                <button
                  onClick={handleClearSearch}
                  className="mt-2 text-sm underline cursor-pointer"
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
                : 'No products available'
            }
          />
        </div>
      </main>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={handleCartClose} />
    </div>
  );
}

export default HomePage;

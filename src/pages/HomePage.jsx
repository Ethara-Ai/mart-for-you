import { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context';
import { Hero } from '../components/home';
import { Navigation } from '../components/layout';
import { ProductGrid, CategorySection } from '../components/product';
import { products, categories } from '../data/products';
import { CartModal } from '../components/cart';

// Category display names
const categoryDisplayNames = {
  electronics: 'Electronics',
  fashion: 'Fashion & Apparel',
  home: 'Home & Living',
  beauty: 'Beauty & Personal Care',
  sports: 'Sports & Fitness',
  food: 'Food & Beverages',
  books: 'Books & Stationery',
  toys: 'Toys & Games',
};

/**
 * HomePage - Main landing page component
 *
 * Displays the hero section with video background,
 * category navigation, and category-wise product scrolling sections.
 */
function HomePage() {
  const { darkMode, COLORS } = useTheme();
  const { searchTerm, clearSearch } = useSearch();
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewingOffers, setViewingOffers] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Get unique categories (excluding 'all')
  const productCategories = useMemo(() => categories.filter((cat) => cat !== 'all'), []);

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

  // Group products by category for scrolling sections
  const productsByCategory = useMemo(() => {
    const grouped = {};
    productCategories.forEach((category) => {
      grouped[category] = products.filter((p) => p.category === category);
    });
    return grouped;
  }, [productCategories]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setViewingOffers(false);
  };

  // Handle offers click
  const handleOffersClick = () => {
    setViewingOffers(true);
    setActiveCategory('all');
  };

  // Handle cart open
  const handleCartOpen = () => {
    setIsCartOpen(true);
  };

  // Handle cart close
  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  // Check if we should show category sections or filtered grid
  const showCategorySections = activeCategory === 'all' && !searchTerm && !viewingOffers;

  return (
    <div>
      {/* Hero and Navigation Section with shared gradient background */}
      <div
        style={{
          background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        }}
      >
        {/* Hero Section */}
        <Hero />

        {/* Navigation with categories */}
        <Navigation
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          viewingOffers={viewingOffers}
          onOffersClick={handleOffersClick}
          onCartClick={handleCartOpen}
        />
      </div>

      {/* Main Content */}
      <main
        id="products-section"
        className="grow py-8"
        style={{
          background: darkMode ? COLORS.dark.backgroundGradient : COLORS.light.backgroundGradient,
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
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
                  onClick={clearSearch}
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

          {/* Offers or Specific Category View */}
          {(viewingOffers || activeCategory !== 'all') && (
            <>
              <div className="text-center mb-8">
                <h2
                  className="text-2xl font-bold sm:text-3xl"
                  style={{
                    color: darkMode ? COLORS.dark.text : COLORS.light.text,
                    fontFamily: "'Metropolis', sans-serif",
                  }}
                >
                  {viewingOffers
                    ? 'Special Offers'
                    : categoryDisplayNames[activeCategory] || activeCategory}
                </h2>
                <p
                  className="mt-2 text-base max-w-2xl mx-auto"
                  style={{
                    color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  }}
                >
                  {viewingOffers
                    ? 'Limited time deals with amazing discounts'
                    : `Explore our ${categoryDisplayNames[activeCategory]?.toLowerCase() || activeCategory} collection`}
                </p>
              </div>
              <ProductGrid
                products={filteredProducts}
                emptyMessage={
                  viewingOffers
                    ? 'No offers available at the moment'
                    : 'No products available in this category'
                }
              />
            </>
          )}

          {/* Search Results Grid */}
          {searchTerm && !viewingOffers && activeCategory === 'all' && (
            <ProductGrid
              products={filteredProducts}
              emptyMessage="No products found matching your search"
            />
          )}

          {/* Category-wise Scrolling Sections (Home View) */}
          {showCategorySections && (
            <div className="space-y-6">
              {productCategories.map((category) => (
                <CategorySection
                  key={category}
                  title={categoryDisplayNames[category] || category}
                  categoryId={category}
                  products={productsByCategory[category]}
                  seeAllLink={`/products?category=${category}`}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={handleCartClose} />
    </div>
  );
}

export default HomePage;

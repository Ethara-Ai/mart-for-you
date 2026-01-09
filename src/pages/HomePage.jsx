import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSearch, useFilter } from '../context';
import { useCart } from '../context/CartContext';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import ProductGrid from '../components/ProductGrid';
import CategorySection from '../components/CategorySection';
import { products, categories } from '../data/products';
import { CATEGORY_DISPLAY_NAMES, CATEGORIES } from '../constants';

/**
 * HomePage - Main landing page component
 *
 * Displays the hero section with video background,
 * category navigation, and category-wise product scrolling sections.
 * Uses FilterContext for category and offers state management.
 *
 * Note: CartModal is now rendered once in AppLayout (via CartContext),
 * eliminating the need for duplicate modal instances.
 */
function HomePage() {
  const { darkMode, COLORS } = useTheme();
  const { searchTerm, clearSearch } = useSearch();
  const { activeCategory, viewingOffers, setActiveCategory, enableOffersView } = useFilter();
  const { openCart } = useCart();

  // Get unique categories (excluding 'all')
  const productCategories = useMemo(() => categories.filter((cat) => cat !== CATEGORIES.ALL), []);

  // Filter products based on category, search, and offers
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        // Category filter
        const categoryMatch =
          activeCategory === CATEGORIES.ALL || product.category === activeCategory;

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
    [activeCategory, searchTerm, viewingOffers]
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
  };

  // Handle offers click
  const handleOffersClick = () => {
    enableOffersView();
  };

  // Check if we should show category sections or filtered grid
  const showCategorySections = activeCategory === CATEGORIES.ALL && !searchTerm && !viewingOffers;

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
          onCartClick={openCart}
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
          {(viewingOffers || activeCategory !== CATEGORIES.ALL) && (
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
                    : CATEGORY_DISPLAY_NAMES[activeCategory] || activeCategory}
                </h2>
                <p
                  className="mt-2 text-base max-w-2xl mx-auto"
                  style={{
                    color: darkMode ? COLORS.dark.primary : COLORS.light.primary,
                  }}
                >
                  {viewingOffers
                    ? 'Limited time deals with amazing discounts'
                    : `Explore our ${CATEGORY_DISPLAY_NAMES[activeCategory]?.toLowerCase() || activeCategory} collection`}
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
          {searchTerm && !viewingOffers && activeCategory === CATEGORIES.ALL && (
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
                  title={CATEGORY_DISPLAY_NAMES[category] || category}
                  categoryId={category}
                  products={productsByCategory[category]}
                  seeAllLink={`/products?category=${category}`}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default HomePage;

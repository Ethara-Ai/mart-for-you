import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ProductCard from './ProductCard';

/**
 * CategorySection - Horizontal scrolling product section for a category
 *
 * Displays products in a horizontally scrollable row with navigation arrows
 * and a "see all" link to view all products in the category.
 *
 * @param {Object} props
 * @param {string} props.title - Category display title
 * @param {string} props.categoryId - Category identifier for filtering
 * @param {Array} props.products - Array of products to display
 * @param {string} props.seeAllLink - Link to view all products in category
 */
function CategorySection({ title, categoryId, products, seeAllLink }) {
  const { darkMode, COLORS } = useTheme();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position and update button states
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Initialize scroll check
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [products]);

  // Scroll left
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.querySelector('.product-card-wrapper')?.offsetWidth || 200;
      container.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
    }
  };

  // Scroll right
  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = container.querySelector('.product-card-wrapper')?.offsetWidth || 200;
      container.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
    }
  };

  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* Header with title and see all link */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-xl sm:text-2xl font-bold"
          style={{
            color: darkMode ? COLORS.dark.text : COLORS.light.text,
            fontFamily: "'Metropolis', sans-serif",
          }}
        >
          {title}
        </h2>
        <Link
          to={seeAllLink || `/products?category=${categoryId}`}
          className="text-sm font-medium hover:underline transition-opacity hover:opacity-80"
          style={{
            color: '#16a34a',
          }}
        >
          see all
        </Link>
      </div>

      {/* Scrollable products container */}
      <div className="relative group">
        {/* Left scroll button */}
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-lg cursor-pointer transform hover:scale-110 active:scale-95 transition-transform"
            style={{
              backgroundColor: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
              color: darkMode ? COLORS.dark.text : COLORS.light.text,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            aria-label="Scroll left"
          >
            <FiChevronLeft className="w-6 h-6" />
          </motion.button>
        )}

        {/* Right scroll button */}
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full shadow-lg cursor-pointer transform hover:scale-110 active:scale-95 transition-transform"
            style={{
              backgroundColor: darkMode ? COLORS.dark.modalBackground : COLORS.light.background,
              color: darkMode ? COLORS.dark.text : COLORS.light.text,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
            aria-label="Scroll right"
          >
            <FiChevronRight className="w-6 h-6" />
          </motion.button>
        )}

        {/* Products scroll container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card-wrapper shrink-0"
              style={{
                width: 'calc((100% - 12px) / 2)', // 2 cards on mobile
                minWidth: '160px',
                maxWidth: '200px',
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default CategorySection;

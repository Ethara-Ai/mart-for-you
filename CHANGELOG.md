# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- User authentication and registration
- Wishlist functionality
- Order history page
- Product reviews and ratings
- Payment gateway integration
- Backend API integration

---

## [1.1.0] - 2026-01-08

### Added

#### Product Catalog Expansion
- **Expanded product catalog from 32 to 96 products** (12 products per category)
- **Category-specific specifications** for all products:
  - Electronics: Bluetooth version, battery life, resolution, connectivity
  - Fashion & Apparel: Sizes (S-XL), dimensions, "One Size"
  - Home & Living: Capacity, dimensions, piece counts
  - Beauty: Volume (ml), piece counts
  - Sports & Fitness: Dimensions, capacity, resistance levels
  - Food & Beverages: Weight (g/kg), volume (ml)
  - Books & Stationery: Page counts, hardcover/paperback format
  - Toys & Games: Age recommendations, piece counts

#### User Experience Improvements
- **Maximum quantity toast notifications**: "Maximum quantity reached" toast appears when stock limit is reached
- **Product Detail Modal**: Click on any product card to view full specifications and details
- **Expandable specifications panel** in product modal with category-specific details

### Fixed

#### Modal Scroll Lock
- **Fixed background scrolling issue** when product detail modal or cart modal is open
- Added `overscrollBehavior: 'contain'` to prevent scroll chaining
- Locked both `html` and `body` elements for complete scroll prevention
- Added scrollbar width compensation to prevent layout shift

#### Mobile Responsiveness
- **Improved product card layout** on small mobile screens (320px+)
- Reduced ADD button padding on mobile: `px-3` vs `px-5` on larger screens
- Smaller quantity selector buttons on mobile: `w-7 h-7` vs `w-8 h-8`
- Responsive text sizing for prices and buttons
- Added `shrink-0` to prevent button overflow

#### Navigation
- **Reduced category spacing** in navigation bar for better fit
- Changed spacing from `space-x-4 xl:space-x-8` to `space-x-1 xl:space-x-3`

### Changed
- Product weight field now displays category-appropriate specifications
- Improved toast notification messages for quantity limits

---

## [1.0.0] - 2024-01-15

### Added

#### Core Features
- **Landing Page**: Animated welcome page with MART branding and theme toggle
- **Home Page**: Hero section with video background and featured products
- **Products Page**: Full product catalog with URL query parameter support
- **Offers Page**: Dedicated page for products on sale with promotional banners
- **Cart Page**: Full-page shopping cart with checkout functionality
- **Profile Page**: User profile management with edit capabilities

#### Shopping Cart
- Add/remove items functionality
- Quantity adjustment controls
- Three shipping options (Free, Standard, Express)
- Real-time total calculation with tax estimation
- Cart modal for quick access
- Persistent cart state during session

#### Product Features
- 32 products across 8 categories
- Category-based filtering
- Search functionality with real-time results
- Sale price support with discount badges
- Responsive product grid layout
- Animated product cards with hover effects

#### User Interface
- Dark/Light mode toggle with localStorage persistence
- System preference detection for initial theme
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations powered by Framer Motion
- Toast notifications for user feedback
- Sticky navigation bar
- Mobile-friendly hamburger menu

#### User Profile
- View personal information
- Edit profile form with validation
- Profile dropdown in header
- Address management

#### Components
- Reusable `ProductCard` component
- Animated `Logo` component with SVG graphics
- `SearchBar` component with clear functionality
- `Toast` and `ToastContainer` for notifications
- `CartItem` with quantity controls
- `ShippingOptions` selector
- `Hero` component with video background
- `Navigation` with category filters
- `ProfileForm` with comprehensive validation

#### State Management
- `ThemeContext` for dark/light mode
- `CartContext` for shopping cart state
- `ProfileContext` for user profile data
- `ToastContext` for notification management
- Combined `AppProvider` for clean context hierarchy

### Technical
- React 18.3.1 with functional components and hooks
- Vite 6.0.7 for fast development and optimized builds
- React Router DOM 6.30.2 for client-side routing
- Tailwind CSS 3.4.17 for utility-first styling
- Framer Motion 12.24.0 for animations
- React Icons and Lucide React for iconography

### Documentation
- Comprehensive README.md
- Component JSDoc documentation
- Project structure documentation

---

## [0.2.0] - 2024-01-10

### Added
- Multi-page architecture with React Router
- Profile page and editing functionality
- Offers page with sale products filter
- Cart page as full-page alternative to modal
- Form validation for profile editing

### Changed
- Refactored from single-page to multi-page application
- Improved component organization by feature
- Enhanced mobile responsiveness

### Fixed
- Cart modal scroll locking on body
- Profile card click-outside detection
- Navigation active state on route changes

---

## [0.1.0] - 2024-01-05

### Added
- Initial project setup with Vite and React
- Basic product grid with sample data
- Shopping cart modal
- Dark/Light mode toggle
- Category filtering
- Search functionality
- Basic responsive design

### Technical
- Tailwind CSS integration
- Framer Motion for animations
- Context API for state management

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.1.0 | 2026-01-08 | Expanded catalog (96 products), modal scroll fix, mobile responsiveness |
| 1.0.0 | 2024-01-15 | Production release with all core features |
| 0.2.0 | 2024-01-10 | Multi-page architecture, profile management |
| 0.1.0 | 2024-01-05 | Initial release with basic functionality |

---

## Upgrade Guide

### Upgrading to 1.0.0

No breaking changes from 0.2.0. Simply update dependencies:

```bash
npm install
```

### Upgrading from 0.1.0 to 0.2.0

The application was refactored to use React Router. If you had any custom navigation logic, update it to use React Router's `useNavigate` hook and `Link` components.

---

## Contributors

Thanks to all contributors who helped make this project possible!

---

[Unreleased]: https://github.com/yourusername/mart-for-you/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/yourusername/mart-for-you/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yourusername/mart-for-you/compare/v0.2.0...v1.0.0
[0.2.0]: https://github.com/yourusername/mart-for-you/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yourusername/mart-for-you/releases/tag/v0.1.0

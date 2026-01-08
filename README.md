# Mart - For You

A modern, full-featured e-commerce web application built with React and Tailwind CSS. MART provides a seamless shopping experience with advanced product browsing, intelligent cart management, dynamic quantity controls, and user profile features.

![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Components Reference](#components-reference)
- [Context Providers](#context-providers)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Theming](#theming)
- [Routes](#routes)
- [Product Categories](#product-categories)
- [Responsive Design](#responsive-design)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

### Product Management
- Browse 96 products across 8 categories (12 per category)
- Advanced search functionality with real-time filtering
- Category-based filtering with URL parameter support
- Special offers and discounts section with dedicated page
- Responsive product grid with smooth animations
- Dynamic product cards with hover effects
- Category-specific product specifications (dimensions, capacity, page counts, age ratings)

### Advanced Shopping Cart
- **Dynamic Add to Cart Button**: Switches between "Add to Cart" and quantity selector based on cart state
- **Inline Quantity Management**: Adjust quantities directly on product cards without opening cart
- **Smart Quantity Controls**: Reduce quantity to zero to automatically remove items
- **Stock Limit Enforcement**: Maximum quantity limits per product with toast notifications
- **Real-time cart updates**: Instant synchronization across all components
- **Cart Badge**: Visual indicator showing total items in cart
- Multiple shipping options (Free, Standard $4.99, Express $9.99)
- Automatic tax calculation (8% estimation)
- Quick cart modal for fast checkout (with scroll lock to prevent background scrolling)
- Dedicated cart page with full order summary
- Remove items from cart or product cards

### Intelligent Navigation
- **Responsive Navigation Bar**: Adapts seamlessly from mobile to desktop
- **Cart in Navigation**: Quick access to cart button beside search field
- **Mobile-Optimized**: Hamburger menu with smooth animations
- **Tablet Support**: Compact category display with "More" button
- **Desktop**: Full category bar with all options visible
- **Sticky Behavior**: Navigation stays accessible while scrolling
- Real-time search with instant results

### User Profile
- View and edit personal information
- Comprehensive form validation
- Profile dropdown with quick actions in header
- Address management with formatted display
- Profile photo display
- Save/Cancel workflows with confirmation

### User Interface
- **Dark/Light Mode**: System preference detection with manual toggle
- **Smooth Animations**: Powered by Framer Motion for professional feel
- **Toast Notifications**:
  - Success, error, and info message types
  - Auto-dismiss after 3 seconds
  - Mobile-centered, desktop right-aligned
  - Responsive positioning
- **Fully Responsive Design**:
  - Mobile (320px+)
  - Tablet/iPad Mini (768px+)
  - Desktop (1024px+)
  - Large Desktop (1280px+)
- **Video Hero Backgrounds**: Engaging homepage with video content
- **Error Boundaries**: Graceful error handling prevents app crashes
- **Loading States**: Skeleton loaders and spinners for better UX

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mart-for-you.git
   cd mart-for-you
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5173 with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code linting |
| `npm run lint:fix` | Automatically fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without changes |
| `npm run test` | Run test suite with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run clean` | Remove dist and cache folders |

## Project Structure

```
mart-for-you/
├── public/                 # Static assets
│   ├── robots.txt         # SEO crawler rules
│   ├── sitemap.xml        # XML sitemap
│   └── mart-favicon.svg   # Favicon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── cart/         # Cart-related components
│   │   │   ├── CartItem.jsx        # Individual cart item with quantity controls
│   │   │   ├── CartModal.jsx       # Quick cart overlay modal
│   │   │   └── ShippingOptions.jsx # Shipping method selector
│   │   ├── common/       # Shared utility components
│   │   │   ├── ErrorBoundary.jsx   # Error handling wrapper
│   │   │   ├── Loading.jsx         # Loading spinner
│   │   │   ├── SearchBar.jsx       # Search input with debounce
│   │   │   ├── Toast.jsx           # Notification toast
│   │   │   └── ToastContainer.jsx  # Toast manager
│   │   ├── home/         # Homepage-specific components
│   │   │   └── Hero.jsx            # Video hero section
│   │   ├── layout/       # Layout structure components
│   │   │   ├── Header.jsx          # App header with logo and profile
│   │   │   ├── Footer.jsx          # App footer
│   │   │   ├── Logo.jsx            # Brand logo component
│   │   │   └── Navigation.jsx      # Responsive navigation bar with cart
│   │   ├── product/      # Product display components
│   │   │   ├── ProductCard.jsx     # Product card with dynamic cart controls
│   │   │   └── ProductGrid.jsx     # Responsive product grid layout
│   │   └── profile/      # Profile-related components
│   │       └── ProfileForm.jsx     # Profile edit form
│   ├── context/          # React Context providers for state management
│   │   ├── AppProvider.jsx         # Root provider wrapper
│   │   ├── CartContext.jsx         # Shopping cart state
│   │   ├── ProfileContext.jsx      # User profile state
│   │   ├── ThemeContext.jsx        # Theme (dark/light) state
│   │   └── ToastContext.jsx        # Notification state
│   ├── data/             # Static data and constants
│   │   ├── products.js             # Product catalog (96 items across 8 categories)
│   │   └── colors.js               # Theme color palette
│   ├── hooks/            # Custom React hooks (reserved for future use)
│   ├── pages/            # Route-level page components
│   │   ├── LandingPage.jsx         # Welcome/splash page
│   │   ├── HomePage.jsx            # Main homepage with hero and products
│   │   ├── ProductsPage.jsx        # Full catalog with filters
│   │   ├── OffersPage.jsx          # Sale items page
│   │   ├── CartPage.jsx            # Full cart view
│   │   ├── ProfilePage.jsx         # Profile management
│   │   └── NotFoundPage.jsx        # 404 error page
│   ├── testing/          # Test utilities and setup
│   │   ├── setup.js                # Vitest configuration
│   │   └── test-utils.jsx          # Testing library utilities
│   ├── App.jsx           # Main application component with routing
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles and Tailwind imports
├── coverage/             # Test coverage reports
├── dist/                 # Production build output
├── .gitignore           # Git ignore rules
├── eslint.config.js     # ESLint configuration (modern flat config)
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.js       # Vite build configuration with optimizations
├── vitest.config.js     # Vitest test configuration
├── CHANGELOG.md         # Version history and release notes
├── CONTRIBUTING.md      # Contribution guidelines
├── LICENSE              # MIT License
├── PROMPT.md            # Original project requirements
├── SECURITY.md          # Security policy
└── README.md            # This file
```

## Components Reference

### Cart Components

Located in `src/components/cart/`

| Component | File | Description |
|-----------|------|-------------|
| `CartItem` | `CartItem.jsx` | Individual cart item display with inline quantity controls (+ / -), price calculation, and remove button. Supports reducing quantity to zero for automatic removal. Works in both cart modal and cart page. |
| `CartModal` | `CartModal.jsx` | Modal overlay for quick cart access. Displays cart items, shipping options, order summary, and checkout button. Includes empty cart state and order confirmation animations. |
| `ShippingOptions` | `ShippingOptions.jsx` | Radio button selector for shipping methods with pricing and delivery estimates. Options: Free (7-10 days), Standard $4.99 (3-5 days), Express $9.99 (1-2 days). |

### Common Components

Located in `src/components/common/`

| Component | File | Description |
|-----------|------|-------------|
| `ErrorBoundary` | `ErrorBoundary.jsx` | React error boundary that catches JavaScript errors in child component tree. Displays fallback UI with "Try Again" and "Go Home" options. Shows stack trace in development mode. |
| `Loading` | `Loading.jsx` | Configurable loading spinner with optional message and size variants. Supports full-screen overlay mode. |
| `SearchBar` | `SearchBar.jsx` | Search input with real-time filtering and clear button. Supports desktop and mobile variants with different styling. |
| `Toast` | `Toast.jsx` | Individual toast notification with auto-dismiss (3 seconds), close button, and type-based styling (success/error/info). Includes icon indicators and smooth animations. |
| `ToastContainer` | `ToastContainer.jsx` | Container managing toast notifications with responsive positioning. Mobile: bottom-center, Desktop: bottom-right. Supports stacking multiple toasts. |

### Home Components

Located in `src/components/home/`

| Component | File | Description |
|-----------|------|-------------|
| `Hero` | `Hero.jsx` | Full-height hero section with video background, overlay, animated heading, subtitle, CTA button, and scroll indicator. Includes theme-aware styling. |

### Layout Components

Located in `src/components/layout/`

| Component | File | Description |
|-----------|------|-------------|
| `Header` | `Header.jsx` | Main application header with logo, dark mode toggle, and user profile dropdown. Profile dropdown shows user info with quick edit access. Sticky positioned at top. |
| `Footer` | `Footer.jsx` | Application footer with copyright notice and sustainability badge. Theme-aware styling. |
| `Logo` | `Logo.jsx` | Clickable brand logo component with consistent styling. Navigates to home page on click. |
| `Navigation` | `Navigation.jsx` | Fully responsive navigation bar with category filters, search bar, and cart button. Features: mobile hamburger menu, tablet compact view, desktop full bar, sticky scroll behavior, and real-time cart count badge. |

### Product Components

Located in `src/components/product/`

| Component | File | Description |
|-----------|------|-------------|
| `ProductCard` | `ProductCard.jsx` | Product display card with image, category badge, sale indicator, name, description, and price. Features dynamic cart controls: shows "Add to Cart" button when not in cart, switches to quantity selector (- / +) when in cart. Supports reducing to zero for removal. Fully responsive for mobile, tablet, and desktop with optimized button sizes. |
| `ProductDetailModal` | `ProductDetailModal.jsx` | Full product details modal with large image, specifications, price, quantity controls, and product benefits. Features scroll lock to prevent background scrolling and expandable specifications panel. |
| `ProductGrid` | `ProductGrid.jsx` | Responsive grid container (1-4 columns based on screen size) with AnimatePresence for smooth product transitions. Includes loading skeleton states and empty state messaging. |
| `CategorySection` | `CategorySection.jsx` | Horizontal scrolling product section for a category with navigation arrows and "see all" link. |

### Profile Components

Located in `src/components/profile/`

| Component | File | Description |
|-----------|------|-------------|
| `ProfileForm` | `ProfileForm.jsx` | Comprehensive form for editing user profile with fields for name, email, phone, and address. Includes validation and save/cancel workflows. |

## Context Providers

Located in `src/context/`

| Context | File | Description |
|---------|------|-------------|
| `AppProvider` | `AppProvider.jsx` | Root provider component that wraps and combines all context providers (Theme, Toast, Profile, Cart) in correct dependency order. |
| `CartContext` | `CartContext.jsx` | Manages complete shopping cart state including items array, quantities, selected shipping option, order status. Provides methods: addToCart, removeFromCart, updateQuantity, clearCart, handleCheckout. Calculates totals, shipping costs, and tracks order numbers. |
| `ProfileContext` | `ProfileContext.jsx` | Handles user profile data including personal info and address. Provides methods for editing (startEditing, saveProfile, cancelEditing), field updates (updateField, updateProfile), and formatted data getters (getFullName, getFormattedAddress). Includes profile card visibility state. |
| `ThemeContext` | `ThemeContext.jsx` | Controls theme state (dark/light mode) with system preference detection and localStorage persistence. Provides toggleDarkMode function and COLORS object with complete theme palette. |
| `ToastContext` | `ToastContext.jsx` | Manages toast notification queue with methods: addToast, removeToast, clearToasts, showSuccess, showError, showInfo. Auto-generates unique IDs and handles notification lifecycle. |

## Pages

Located in `src/pages/`

| Page | File | Description |
|------|------|-------------|
| `LandingPage` | `LandingPage.jsx` | Animated welcome page with logo animation, brand name, tagline, theme toggle, and CTA button. Features decorative blur elements and gradient background. |
| `HomePage` | `HomePage.jsx` | Main homepage with video hero section, navigation bar, product grid, search functionality, and category filters. Supports viewing offers and includes cart modal. |
| `ProductsPage` | `ProductsPage.jsx` | Complete product catalog with URL parameter support for filters. Features search, category selection, offers view, product count display, and promotional banners for sales. |
| `OffersPage` | `OffersPage.jsx` | Dedicated sale items page with custom hero, promotional banner showing savings and item count, category filters for sale items, and enhanced styling for deals. |
| `CartPage` | `CartPage.jsx` | Full-page cart view with item list, shipping options, order summary with tax calculation, checkout button, clear cart option, and order confirmation state with animated success message. |
| `ProfilePage` | `ProfilePage.jsx` | Profile management page with two modes: view (displays info in cards) and edit (shows ProfileForm). Includes profile stats (orders, wishlist), member since date, and avatar display. |
| `NotFoundPage` | `NotFoundPage.jsx` | 404 error page with animated icon, helpful message, and navigation options back to home or products page. |

## Tech Stack

### Core
- **React 19.2.3** - Latest UI library with concurrent features and improved hooks
- **Vite 7.3.1** - Next-generation build tool with fast HMR and optimized builds
- **React Router DOM 7.11.0** - Client-side routing with URL parameter support

### Styling
- **Tailwind CSS 4.1.18** - Utility-first CSS framework with modern flat config
- **PostCSS 8.5.6** - CSS transformations and processing
- **Framer Motion 12.24.8** - Production-ready animation library

### Icons
- **React Icons 5.5.0** - Popular icon library (FiX, FiMenu, FiPlus, FiMinus, etc.)
- **Lucide React 0.562.0** - Beautiful consistent icon set

### Development & Testing
- **ESLint 9.39.2** - Code linting with modern flat config
- **Prettier 3.7.4** - Code formatting
- **Vitest 4.0.16** - Fast unit test framework
- **React Testing Library 16.3.1** - Component testing utilities
- **@vitest/coverage-v8** - Code coverage reporting

### Build Optimizations
- Code splitting with manual chunks (vendor-react, vendor-router, vendor-motion, vendor-icons)
- Tree shaking for unused code elimination
- Source maps for debugging (hidden in production)
- Asset optimization (images, fonts, CSS)
- esbuild minification for fast builds

## Theming

The application supports both light and dark modes with automatic system preference detection and manual toggle.

### Light Mode

| Element | Color | Usage |
|---------|-------|-------|
| Primary | `#2563EB` | Buttons, links, active states |
| Secondary | `#DBEAFE` | Backgrounds, badges |
| Background | `#FFFFFF` with gradient to `#F0F7FF` | Page backgrounds |
| Text | `#333333` | Primary text content |
| Modal Background | `#FFFFFF` | Overlays and cards |

### Dark Mode

| Element | Color | Usage |
|---------|-------|-------|
| Primary | `#60A5FA` | Buttons, links, active states |
| Secondary | `#1E293B` | Backgrounds, badges |
| Background | Gradient from `#0F172A` to `#1E293B` | Page backgrounds |
| Text | `#E0E0E0` | Primary text content |
| Modal Background | `#1E293B` | Overlays and cards |
| Nav Background | `#212121` | Navigation bar |

### Theme Features
- System preference detection via `prefers-color-scheme`
- localStorage persistence across sessions
- Smooth transitions between modes
- Custom scrollbar styling for each theme
- Focus states for accessibility

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | LandingPage | Animated welcome screen with theme toggle and brand introduction |
| `/home` | HomePage | Main shopping experience with hero, products, and navigation |
| `/products` | ProductsPage | Complete catalog with filters, search, and URL parameter support |
| `/offers` | OffersPage | Sale items with promotional banners and savings calculator |
| `/cart` | CartPage | Full cart view with shipping, tax calculation, and checkout |
| `/profile` | ProfilePage | User profile view and edit interface |
| `/*` | NotFoundPage | 404 error page with navigation back to valid routes |

All pages support lazy loading for optimal performance and include page-level cart modals where applicable.

## Product Categories

The application includes 96 products organized across 8 categories:

- **Electronics** (12 products) - Earbuds, Smart Watch, Bluetooth Speaker, Action Camera, Wireless Keyboard, Gaming Mouse, USB-C Hub, Headphones, Power Bank, Webcam, Tablet Stand, Smart LED Bulb
  - *Specs: Bluetooth version, battery life, resolution, ports*
- **Fashion & Apparel** (12 products) - Sneakers, Denim Jacket, Leather Bag, Sunglasses, Wool Scarf, Canvas Backpack, Leather Belt, Baseball Cap, Silk Tie, Leather Wallet, Running Shoes, Winter Beanie
  - *Specs: Sizes (S-XL), dimensions (cm), "One Size"*
- **Home & Living** (12 products) - Coffee Maker, Throw Blanket, Scented Candles, Wall Clock, Plant Pot, Table Lamp, Decorative Vase, Kitchen Knife Set, Cotton Towels, Picture Frames, Blender, Bedside Organizer
  - *Specs: Capacity, dimensions, piece counts*
- **Beauty** (12 products) - Skincare Set, Hair Tools, Makeup Palette, Perfume Collection, Facial Cleanser, Lip Gloss Set, Face Masks, Makeup Brushes, Body Lotion, Nail Polish, Hair Serum, Sunscreen
  - *Specs: Volume (ml), piece counts*
- **Sports & Fitness** (12 products) - Yoga Mat, Fitness Tracker, Resistance Bands, Water Bottle, Dumbbells, Jump Rope, Gym Bag, Foam Roller, Sports Headband, Tennis Racket, Yoga Blocks, Cycling Gloves
  - *Specs: Dimensions, capacity, resistance levels, sizes*
- **Food & Beverages** (12 products) - Gourmet Coffee, Artisan Chocolate, Tea Collection, Spice Set, Olive Oil, Honey Jars, Granola Mix, Pasta Variety, Nut Butter, Dried Fruit, Matcha Powder, Hot Sauce
  - *Specs: Weight (g/kg), volume (ml)*
- **Books & Stationery** (12 products) - Bestselling Novel, Cookbook, Self-Help Book, Journal Set, Photography Book, History Book, Science Fiction, Business Guide, Art Book, Poetry Collection, Travel Guide, Fitness Book
  - *Specs: Page counts, hardcover/paperback*
- **Toys & Games** (12 products) - Building Blocks, Plush Animal, Board Game, Art Supply Kit, Remote Control Car, Puzzle, Play-Doh Set, Dollhouse, Science Kit, Train Set, Toy Robot, Card Games
  - *Specs: Age recommendations, piece counts*

### Product Features
- Multiple products on sale with visible discount badges
- Price range: $12.99 - $249.99
- High-quality product images from Unsplash
- Detailed descriptions with category-appropriate specifications
- Category-based filtering
- Search across name, description, and category
- Stock limits with maximum quantity notifications

## Responsive Design

### Mobile (< 640px)
- Full-width "Add to Cart" buttons for easy tapping
- Centered quantity selectors
- Stacked price and button layout
- Hamburger menu for navigation
- Full-screen category menu
- Bottom-center toast notifications
- Touch-optimized button sizes (minimum 36px)

### Tablet (640px - 1023px)
- Compact navigation with "More" button
- Side-by-side price and button layout
- Optimized button padding and font sizes
- Responsive search bar width
- 2-3 column product grid

### Desktop (>= 1024px)
- Full category navigation bar
- Spacious layouts with comfortable spacing
- 4 column product grid
- Hover effects on interactive elements
- Bottom-right toast notifications
- Full-width search capabilities

### iPad Mini Optimization
- Responsive button text sizing (text-sm to text-base)
- Adaptive button padding (px-3 to px-4)
- Proper gap spacing for quantity controls
- No text wrapping or overflow issues
- Comfortable touch targets

### Responsive Features
- Fluid typography (text-sm to text-lg based on viewport)
- Adaptive spacing (gap-2 to gap-4)
- Flexible layouts (flex-col to flex-row)
- Responsive images with object-cover
- Smooth breakpoint transitions

## Deployment

### Deploy to GitHub Pages

1. **Update `vite.config.js`** - Set the base path to your repository name:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   });
   ```

2. **Deploy** (gh-pages is already configured):
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages** in repository settings:
   - Navigate to Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

Your app will be live at `https://yourusername.github.io/your-repo-name/`

### Deploy to Other Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Build for Production:**
```bash
npm run build
```
Output will be in the `dist/` directory.

## Testing

### Run Tests
```bash
npm run test           # Run all tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm run test:ui        # Open Vitest UI
```

### Test Coverage
Coverage reports are generated in the `coverage/` directory and include:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### Test Files
All components have corresponding `.test.jsx` files:
- `CartContext.test.jsx`
- `ThemeContext.test.jsx`
- `ProfileContext.test.jsx`
- `ToastContext.test.jsx`
- Component test files in each component directory

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed
4. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   npm run format
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Product images from [Unsplash](https://unsplash.com/)
- Video backgrounds from [Pexels](https://www.pexels.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/) and [Lucide](https://lucide.dev/)
- Fonts: Metropolis and Raleway
- Color palette inspired by modern e-commerce design trends

## Support

If you encounter any issues or have questions:
- Open an [issue](https://github.com/yourusername/mart-for-you/issues)
- Check [existing discussions](https://github.com/yourusername/mart-for-you/discussions)
- Review the [SECURITY.md](SECURITY.md) for security concerns

---

Built with React, Vite, and Tailwind CSS | Developed by the Mart - For You Team

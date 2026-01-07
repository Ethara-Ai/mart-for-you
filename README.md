# Mart - For You

A modern, full-featured e-commerce web application built with React and Tailwind CSS. MART provides a seamless shopping experience with product browsing, filtering, cart management, and user profile features.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)
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
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Product Management
- Browse 32+ products across 8 categories
- Advanced search functionality
- Category-based filtering
- Special offers and discounts section
- Responsive product grid with animations

### Shopping Cart
- Add/remove items with quantity controls
- Real-time cart total calculation
- Multiple shipping options (Free, Standard, Express)
- Tax estimation
- Persistent cart state
- Quick cart modal and dedicated cart page

### User Profile
- View and edit personal information
- Comprehensive form validation
- Profile dropdown with quick actions
- Address management

### User Interface
- Dark/Light mode with system preference detection
- Smooth animations powered by Framer Motion
- Toast notifications for user feedback
- Fully responsive design
- Mobile-friendly navigation
- Video hero backgrounds
- Sticky navigation bar

## Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher (or yarn/pnpm)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mart-for-you.git
   cd mart-for-you/react-app
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
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code linting |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## Project Structure

```
react-app/
├── public/                 # Static assets
│   ├── robots.txt         # SEO crawler rules
│   ├── sitemap.xml        # XML sitemap
│   └── vite.svg           # Favicon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── cart/         # Cart-related components
│   │   ├── common/       # Shared components
│   │   ├── home/         # Homepage components
│   │   ├── layout/       # Layout components
│   │   ├── product/      # Product components
│   │   └── profile/      # Profile components
│   ├── context/          # React Context providers
│   ├── data/             # Static data (products, colors)
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier configuration
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
├── CHANGELOG.md          # Version history
├── CONTRIBUTING.md       # Contribution guidelines
├── LICENSE               # MIT License
└── README.md             # Project documentation
```

## Components Reference

### Cart Components

Located in `src/components/cart/`

| Component | File | Description |
|-----------|------|-------------|
| `CartItem` | `CartItem.jsx` | Renders individual cart items with quantity controls, price display, and remove functionality. Supports increment/decrement actions. |
| `CartModal` | `CartModal.jsx` | A modal overlay displaying a quick view of the shopping cart. Allows users to review items without navigating away from the current page. |
| `ShippingOptions` | `ShippingOptions.jsx` | Displays available shipping methods (Free, Standard, Express) with associated costs and delivery timeframes. |

### Common Components

Located in `src/components/common/`

| Component | File | Description |
|-----------|------|-------------|
| `ErrorBoundary` | `ErrorBoundary.jsx` | React error boundary component that catches JavaScript errors in child components and displays a fallback UI. |
| `Loading` | `Loading.jsx` | A loading spinner/indicator component displayed during asynchronous operations or data fetching. |
| `SearchBar` | `SearchBar.jsx` | A reusable search input component with debounced input handling for filtering products. |
| `Toast` | `Toast.jsx` | Individual toast notification component supporting success, error, warning, and info variants. |
| `ToastContainer` | `ToastContainer.jsx` | Container component that manages the positioning and stacking of multiple toast notifications. |

### Home Components

Located in `src/components/home/`

| Component | File | Description |
|-----------|------|-------------|
| `Hero` | `Hero.jsx` | Hero section component featuring video backgrounds, animated text, and call-to-action buttons for the homepage. |

### Layout Components

Located in `src/components/layout/`

| Component | File | Description |
|-----------|------|-------------|
| `Header` | `Header.jsx` | Main application header containing the logo, navigation, search bar, cart icon, and user profile dropdown. |
| `Footer` | `Footer.jsx` | Application footer with links, contact information, and copyright notice. |
| `Logo` | `Logo.jsx` | Brand logo component used throughout the application with consistent styling. |
| `Navigation` | `Navigation.jsx` | Main navigation component with responsive menu items and mobile hamburger menu support. |

### Product Components

Located in `src/components/product/`

| Component | File | Description |
|-----------|------|-------------|
| `ProductCard` | `ProductCard.jsx` | Card component displaying product information including image, name, price, discount badge, and add-to-cart button. |
| `ProductGrid` | `ProductGrid.jsx` | Responsive grid layout component for displaying multiple ProductCard components with animation effects. |

### Profile Components

Located in `src/components/profile/`

| Component | File | Description |
|-----------|------|-------------|
| `ProfileForm` | `ProfileForm.jsx` | Form component for viewing and editing user profile information with validation and error handling. |

## Context Providers

Located in `src/context/`

| Context | File | Description |
|---------|------|-------------|
| `AppProvider` | `AppProvider.jsx` | Root provider component that wraps all other context providers for centralized state management. |
| `CartContext` | `CartContext.jsx` | Manages shopping cart state including items, quantities, totals, and cart operations (add, remove, update). |
| `ProfileContext` | `ProfileContext.jsx` | Handles user profile data and provides methods for updating user information. |
| `ThemeContext` | `ThemeContext.jsx` | Controls theme switching between light and dark modes with system preference detection. |
| `ToastContext` | `ToastContext.jsx` | Manages toast notification state and provides methods for showing/dismissing notifications. |

## Pages

Located in `src/pages/`

| Page | File | Description |
|------|------|-------------|
| `LandingPage` | `LandingPage.jsx` | Animated welcome page with branding and entry animation. |
| `HomePage` | `HomePage.jsx` | Main homepage featuring the hero section, featured products, and category highlights. |
| `ProductsPage` | `ProductsPage.jsx` | Full product catalog with search, category filtering, and sorting capabilities. |
| `OffersPage` | `OffersPage.jsx` | Dedicated page displaying products currently on sale or with special discounts. |
| `CartPage` | `CartPage.jsx` | Complete shopping cart view with item management, shipping selection, and order summary. |
| `ProfilePage` | `ProfilePage.jsx` | User profile management page with editable personal information. |
| `NotFoundPage` | `NotFoundPage.jsx` | 404 error page displayed when users navigate to non-existent routes. |

## Tech Stack

### Core
- **[React 18](https://react.dev/)** - UI library with hooks and concurrent features
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[React Router DOM](https://reactrouter.com/)** - Client-side routing

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** - CSS transformations
- **[Autoprefixer](https://autoprefixer.github.io/)** - Automatic vendor prefixes

### Animations and Icons
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[React Icons](https://react-icons.github.io/react-icons/)** - Popular icon packs
- **[Lucide React](https://lucide.dev/)** - Beautiful consistent icons

## Theming

The application supports both light and dark modes with a carefully crafted color palette:

### Light Mode

| Element | Color |
|---------|-------|
| Primary | `#2563EB` (Blue) |
| Secondary | `#DBEAFE` (Light Blue) |
| Background | `#FFFFFF` (White) |
| Text | `#333333` (Dark Gray) |

### Dark Mode

| Element | Color |
|---------|-------|
| Primary | `#60A5FA` (Light Blue) |
| Secondary | `#1E293B` (Dark Slate) |
| Background | `#121213` (Near Black) |
| Text | `#E0E0E0` (Light Gray) |

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Animated welcome page with branding |
| `/home` | Home | Hero section with featured products |
| `/products` | Products | Full product catalog with filters |
| `/offers` | Offers | Products on sale |
| `/cart` | Cart | Shopping cart and checkout |
| `/profile` | Profile | User profile management |
| `/*` | 404 | Not found page |

## Product Categories

The application includes products across the following categories:

- Electronics
- Fashion
- Home
- Beauty
- Sports
- Food
- Books
- Toys

## Deployment

### Deploy to GitHub Pages

1. **Update `vite.config.js`** - Add your repository name as the base path:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... other config
   });
   ```

2. **Install gh-pages** (if not already installed):
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deployment scripts** to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages** in your repository:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

Your app will be live at `https://yourusername.github.io/your-repo-name/`

## Contributing

Contributions are welcome. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Product images from [Unsplash](https://unsplash.com/)
- Video backgrounds from [Pexels](https://www.pexels.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/) and [Lucide](https://lucide.dev/)

## Support

If you have any questions or need help, please:
- Open an [issue](https://github.com/yourusername/mart-for-you/issues)
- Check existing [discussions](https://github.com/yourusername/mart-for-you/discussions)

---

Developed by the Mart - For You Team
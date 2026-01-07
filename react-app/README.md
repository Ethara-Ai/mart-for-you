# 🛒 Mart - For You

A modern, full-featured e-commerce web application built with React and Tailwind CSS. MART provides a seamless shopping experience with product browsing, filtering, cart management, and user profile features.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 🛍️ Product Management
- Browse 32+ products across 8 categories
- Advanced search functionality
- Category-based filtering
- Special offers and discounts section
- Responsive product grid with animations

### 🛒 Shopping Cart
- Add/remove items with quantity controls
- Real-time cart total calculation
- Multiple shipping options (Free, Standard, Express)
- Tax estimation
- Persistent cart state
- Quick cart modal and dedicated cart page

### 👤 User Profile
- View and edit personal information
- Comprehensive form validation
- Profile dropdown with quick actions
- Address management

### 🎨 UI/UX
- Dark/Light mode with system preference detection
- Smooth animations powered by Framer Motion
- Toast notifications for user feedback
- Fully responsive design
- Mobile-friendly navigation
- Video hero backgrounds
- Sticky navigation bar

## 🚀 Quick Start

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
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code linting |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 🌐 Deployment

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
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

Your app will be live at `https://yourusername.github.io/your-repo-name/`

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will auto-detect Vite and deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

## 🏗️ Project Structure

```
react-app/
├── public/                 # Static assets
│   ├── robots.txt         # SEO crawler rules
│   ├── sitemap.xml        # XML sitemap
│   └── vite.svg           # Favicon
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── cart/         # Cart-related components
│   │   ├── common/       # Shared components (ErrorBoundary, Loading, etc.)
│   │   ├── home/         # Homepage components
│   │   ├── layout/       # Layout components (Header, Footer, etc.)
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

## 🛠️ Tech Stack

### Core
- **[React 18](https://react.dev/)** - UI library with hooks and concurrent features
- **[Vite](https://vitejs.dev/)** - Next-generation frontend build tool
- **[React Router DOM](https://reactrouter.com/)** - Client-side routing

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** - CSS transformations
- **[Autoprefixer](https://autoprefixer.github.io/)** - Automatic vendor prefixes

### Animations & Icons
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[React Icons](https://react-icons.github.io/react-icons/)** - Popular icon packs
- **[Lucide React](https://lucide.dev/)** - Beautiful consistent icons

## 🎨 Theming

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

## 📱 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Animated welcome page with branding |
| `/home` | Home | Hero section with featured products |
| `/products` | Products | Full product catalog with filters |
| `/offers` | Offers | Products on sale |
| `/cart` | Cart | Shopping cart and checkout |
| `/profile` | Profile | User profile management |
| `/*` | 404 | Not found page |

## 📝 Product Categories

- 🔌 Electronics
- 👗 Fashion
- 🏠 Home
- 💄 Beauty
- ⚽ Sports
- 🍕 Food
- 📚 Books
- 🧸 Toys

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Product images from [Unsplash](https://unsplash.com/)
- Video backgrounds from [Pexels](https://www.pexels.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/) and [Lucide](https://lucide.dev/)

## 📞 Support

If you have any questions or need help, please:
- Open an [issue](https://github.com/yourusername/mart-for-you/issues)
- Check existing [discussions](https://github.com/yourusername/mart-for-you/discussions)

---

<p align="center">
  Made with ❤️ by the Mart - For You Team
</p>
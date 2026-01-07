# Contributing to Mart - For You

Thank you for considering contributing to Mart - For You! We welcome contributions from the community and are grateful for any help you can provide.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be respectful and considerate in all interactions
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for your mistakes and learn from them
- Prioritize the community's best interests

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/mart-for-you.git
   cd mart-for-you/react-app
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/mart-for-you.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug Fixes**: Fix issues reported in the issue tracker
- **Features**: Implement new features (please discuss first)
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code
- **Accessibility**: Improve accessibility features
- **UI/UX**: Enhance user interface and experience

### Branch Naming Convention

Use descriptive branch names following this pattern:

- `feature/` - New features (e.g., `feature/wishlist-page`)
- `fix/` - Bug fixes (e.g., `fix/cart-quantity-bug`)
- `docs/` - Documentation updates (e.g., `docs/api-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/cart-context`)
- `style/` - Style/UI changes (e.g., `style/button-hover-states`)
- `test/` - Test additions/updates (e.g., `test/product-card`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

## Pull Request Process

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes** using conventional commits

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** with:
   - Clear title describing the change
   - Description of what was changed and why
   - Reference to related issues (if any)
   - Screenshots for UI changes

### PR Review Checklist

- [ ] Code follows project coding standards
- [ ] No linting errors or warnings
- [ ] Build completes successfully
- [ ] Changes are tested manually
- [ ] Documentation is updated (if needed)
- [ ] Responsive design is maintained
- [ ] Dark/light mode works correctly

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the existing code style and patterns
- Keep components small and focused
- Use meaningful variable and function names
- Add comments for complex logic

### React/JSX Guidelines

```jsx
// ✅ Good: Functional component with clear structure
function ProductCard({ product, onAddToCart }) {
  const { darkMode } = useTheme();
  
  const handleClick = () => {
    onAddToCart(product);
  };

  return (
    <div className="product-card">
      {/* Component content */}
    </div>
  );
}

// ✅ Good: Destructure props
function Button({ children, onClick, variant = 'primary' }) { ... }

// ❌ Bad: Using props.children everywhere
function Button(props) { return <button>{props.children}</button>; }
```

### File Organization

```
components/
├── feature-name/
│   ├── FeatureComponent.jsx   # Main component
│   ├── SubComponent.jsx       # Sub-components
│   └── index.js               # Exports
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Support both dark and light modes
- Use theme colors from `COLORS` constant

```jsx
// ✅ Good: Using theme context
const { darkMode, COLORS } = useTheme();
const bgColor = darkMode ? COLORS.dark.background : COLORS.light.background;

// ✅ Good: Responsive classes
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

### Component Documentation

Add JSDoc comments to components:

```jsx
/**
 * ProductCard - Individual product display component
 *
 * @param {Object} props
 * @param {Object} props.product - Product data object
 * @param {Function} props.onAddToCart - Callback when add to cart is clicked
 */
function ProductCard({ product, onAddToCart }) { ... }
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat(cart): add quantity validation before checkout
fix(profile): resolve form validation on blur
docs(readme): update installation instructions
style(header): improve mobile menu animations
refactor(context): simplify cart state management
```

## Issue Reporting

### Before Submitting an Issue

1. Check if the issue already exists
2. Try to reproduce the issue
3. Gather relevant information

### Bug Report Template

```markdown
## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Screen Size: [e.g., 1920x1080]
```

### Feature Request Template

```markdown
## Feature Description
A clear description of the feature.

## Problem it Solves
What problem does this feature address?

## Proposed Solution
How do you envision this working?

## Alternatives Considered
Any alternative solutions you've considered.

## Additional Context
Any other context or screenshots.
```

## Questions?

If you have questions about contributing, feel free to:

- Open a discussion on GitHub
- Reach out to the maintainers

Thank you for contributing to Mart - For You! 🛒
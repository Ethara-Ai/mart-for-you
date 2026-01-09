/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Metropolis', 'Helvetica', 'Arial', 'sans-serif'],
        metropolis: ['Metropolis', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#2563EB',
          dark: '#60A5FA',
        },
        secondary: {
          light: '#DBEAFE',
          dark: '#1E293B',
        },
      },
      // Custom spacing/sizing for consistent widths
      spacing: {
        25: '6.25rem', // 100px - w-25
        30: '7.5rem', // 120px - w-30
        35: '8.75rem', // 140px - w-35
        50: '12.5rem', // 200px - w-50
        105: '26.25rem', // 420px - for cart modal sm
        120: '30rem', // 480px - for cart modal md
      },
      // Custom max-widths
      maxWidth: {
        25: '6.25rem',
        30: '7.5rem',
        35: '8.75rem',
        50: '12.5rem',
        105: '26.25rem',
        120: '30rem',
      },
      // Custom min-widths
      minWidth: {
        25: '6.25rem',
        30: '7.5rem',
        35: '8.75rem',
        50: '12.5rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      // Custom z-index values matching constants.js
      zIndex: {
        60: '60', // sticky header
        100: '100', // modal backdrop
        101: '101', // modal content
        110: '110', // toast
        120: '120', // tooltip
      },
      // Box shadow presets
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        modal: '0 10px 40px rgba(0, 0, 0, 0.15)',
        'modal-dark': '0 10px 40px rgba(0, 0, 0, 0.5)',
      },
      // Border radius presets
      borderRadius: {
        card: '0.5rem',
        button: '0.5rem',
        modal: '0.75rem',
      },
      // Transition timing
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [],
};

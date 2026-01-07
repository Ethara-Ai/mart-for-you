/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}

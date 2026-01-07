import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Mart - For You
 * Main Application Entry Point
 *
 * This file bootstraps the React application and mounts it to the DOM.
 * Uses React 18's createRoot API for concurrent features support.
 */

// Get the root element
const rootElement = document.getElementById('root');

// Ensure root element exists
if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Make sure there is a <div id="root"></div> in your HTML.',
  );
}

// Create React root and render the application
const root = ReactDOM.createRoot(rootElement);

// Render the app with StrictMode in development for additional checks
// StrictMode helps identify potential problems by:
// - Detecting unexpected side effects
// - Warning about deprecated lifecycle methods
// - Detecting legacy string ref API usage
// - Detecting unexpected side effects in render phase
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Performance measurement (optional - uncomment to enable)
// This can be used with web-vitals library for Core Web Vitals reporting
// import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
// const reportWebVitals = (onPerfEntry) => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     onCLS(onPerfEntry);
//     onFID(onPerfEntry);
//     onFCP(onPerfEntry);
//     onLCP(onPerfEntry);
//     onTTFB(onPerfEntry);
//   }
// };
// reportWebVitals(console.log);

// Hot Module Replacement (HMR) - Vite handles this automatically
// This improves the development experience by preserving state during updates
if (import.meta.hot) {
  import.meta.hot.accept();
}

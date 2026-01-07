import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  // Base path for deployment
  // For GitHub Pages: set to '/<repository-name>/' (e.g., '/mart-for-you/')
  // For custom domain or root deployment: set to '/'
  // Can also be set via VITE_BASE_URL environment variable
  const base = env.VITE_BASE_URL || '/';

  return {
    // Base public path for GitHub Pages or custom deployment
    base,

    // Plugins
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
      }),
    ],

    // Resolve aliases for cleaner imports
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@pages': resolve(__dirname, './src/pages'),
        '@context': resolve(__dirname, './src/context'),
        '@data': resolve(__dirname, './src/data'),
        '@hooks': resolve(__dirname, './src/hooks'),
      },
    },

    // Development server configuration
    server: {
      port: 3000,
      open: true,
      cors: true,
      strictPort: true,
    },

    // Preview server (for production build testing)
    preview: {
      port: 3001,
      open: true,
      cors: true,
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? 'hidden' : true,
      minify: isProduction ? 'esbuild' : false,
      target: 'es2020',

      // Chunk size warnings
      chunkSizeWarningLimit: 500,

      // Rollup options for production optimization
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-icons': ['react-icons', 'lucide-react'],
          },
          // Asset file naming
          chunkFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          entryFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            if (/\.css$/i.test(assetInfo.name)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
        },
      },
    },

    // CSS configuration
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCase',
      },
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'react-icons',
        'lucide-react',
      ],
      exclude: [],
    },

    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __DEV__: !isProduction,
    },

    // Enable JSON imports
    json: {
      namedExports: true,
      stringify: false,
    },

    // esbuild configuration
    esbuild: {
      // Remove console.log in production
      drop: isProduction ? ['console', 'debugger'] : [],
      // JSX optimization
      jsxInject: undefined,
      legalComments: 'none',
    },
  };
});

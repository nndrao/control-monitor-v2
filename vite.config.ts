import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Optimize for cross-platform compatibility
  build: {
    // Ensure consistent output across platforms
    rollupOptions: {
      output: {
        // Use forward slashes for consistency across Windows/Unix
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  // Windows-specific optimizations
  server: {
    // Use polling for file watching on Windows (can be disabled if not needed)
    watch: {
      usePolling: false, // Set to true if you experience file watching issues on Windows
    },
  },
})

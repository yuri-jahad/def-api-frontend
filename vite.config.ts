import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/def/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~styled-system': path.resolve(__dirname, './styled-system')
    }
  },
  
  build: {
    target: 'esnext',           
    minify: 'esbuild',         
    sourcemap: false,           
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'styled-vendor': [/@pandacss/]
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server:{
    https: true,
    host: true,
    proxy: {
      '/api':{
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
        
      }
    }
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      include: [
        'src/App.jsx',
        'src/VetDashboard.jsx',
        'src/AddPet.jsx',
        'src/DeletePet.jsx'
      ]
    }
  }
})

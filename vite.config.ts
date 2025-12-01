import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['gymtracker.holzies.de'],
    hmr: {
      clientPort: 443,
    },
  },
})

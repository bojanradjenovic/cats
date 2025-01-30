import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  server: {
    allowedHosts: ['4431-93-86-49-236.ngrok-free.app']
  },
  plugins: [react()],
})

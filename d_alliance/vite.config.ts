import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/backend/**'],
    },
    port: 5173,
    proxy:{
      '/api': 'http://localhost:8000'
    }
  },
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
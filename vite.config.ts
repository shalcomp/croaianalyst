import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all environment variables from .env files and the process environment.
  // The third parameter '' ensures that all variables are loaded, not just those prefixed with VITE_.
  const env = loadEnv(mode, '', '');

  return {
    plugins: [react()],
    // This makes environment variables available in your client-side code.
    // Vite will perform a direct string replacement during the build process.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
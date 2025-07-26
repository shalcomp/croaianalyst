import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as process from 'process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This makes the environment variable available in the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})

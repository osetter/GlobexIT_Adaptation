import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({mode}: {mode: string}) => {
  const isProduction = mode === 'production'

  return defineConfig({
    plugins: [react()],
    base: isProduction ? '/adaptation/api_task1/frontend/dist' : '/',
    server: {
      proxy: {
        '/custom_web_template.html': {
          target: 'http://localhost',
          changeOrigin: true
        }
      }
    }
  });
};

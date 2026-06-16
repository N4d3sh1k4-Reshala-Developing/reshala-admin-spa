import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:8180',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        }
      }
    },
    define: {
      'import.meta.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || ''),
      'import.meta.env.MINIO_URL': JSON.stringify(env.MINIO_URL || ''),
      'import.meta.env.RABBIT_URL': JSON.stringify(env.RABBIT_URL || ''),
      'import.meta.env.SWAGGER_URL': JSON.stringify(env.SWAGGER_URL || ''),
      'import.meta.env.LOGIN_URL': JSON.stringify(env.LOGIN_URL || ''),
      'import.meta.env.DOZZLE_URL': JSON.stringify(env.DOZZLE_URL || ''),
      
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.API_BASE_URL || ''),
      'import.meta.env.VITE_MINIO_URL': JSON.stringify(env.MINIO_URL || ''),
      'import.meta.env.VITE_RABBIT_URL': JSON.stringify(env.RABBIT_URL || ''),
      'import.meta.env.VITE_SWAGGER_URL': JSON.stringify(env.SWAGGER_URL || ''),
      'import.meta.env.VITE_LOGIN_URL': JSON.stringify(env.LOGIN_URL || ''),
      'import.meta.env.VITE_DOZZLE_URL': JSON.stringify(env.DOZZLE_URL || ''),
    }
  }
})


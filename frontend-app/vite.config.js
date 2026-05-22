import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 1. Import plugin Tailwind v4

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Kích hoạt plugin Tailwind tại đây
  ],
  server: {
    port: 5173, // Ép chạy đúng cổng này
  },
  resolve: {
    alias: {
      '@': '/src', // Cấu hình đường dẫn tuyệt đối (khớp với jsconfig.json)
    },
  },
});
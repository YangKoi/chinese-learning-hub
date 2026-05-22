import { defineConfig } from 'vite';

export default defineConfig({
  // Tự động định hình đường dẫn tương đối khi triển khai trên GitHub Pages
  base: process.env.NODE_ENV === 'production' ? '/chinese-learning-hub/' : '/'
});

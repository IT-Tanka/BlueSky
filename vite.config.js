// import { fileURLToPath, URL } from 'node:url'

// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })
// vite.config.js
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern', // Use modern Sass API
        additionalData: `
          @use "@/assets/stylesheets/utils/variables" as *;
          @use "@/assets/stylesheets/utils/mixins" as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
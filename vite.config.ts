import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/ 
export default defineConfig({
  base: './',
  server: {
    //使用IP能访问
    host: '0.0.0.0',
    port: 8088
  },
  resolve: {
    alias: {
      '@': '/package',
      '@/utils/': '/package/'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`
      }
    }
  },
  plugins: [
    vue(),
    vueJsx({})
  ],
  // build: {
  //   assetsDir
  // }
})
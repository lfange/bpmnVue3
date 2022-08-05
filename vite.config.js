import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/ 
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    //使用IP能访问
    host: '0.0.0.0',
    port: '8088'
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`
      }
    }
  },
  // build: {
  //   assetsDir
  // }
})
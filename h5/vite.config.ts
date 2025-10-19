import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

// Vite 配置：
// - base: GitHub Pages 子路径，确保静态资源引用为 /whattoeat/
// - legacy: 生成兼容旧浏览器的产物（含 nomodule 与 polyfills）
// https://vite.dev/config/
export default defineConfig({
  base: '/whattoeat/',
  plugins: [
    vue(),
    legacy({ targets: ['defaults', 'not IE 11'] })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})

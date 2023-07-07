import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue';
import vitePluginMarkdown from './plugins/vite-plugin-markdownit'
const vuePlugin = createVuePlugin({ include: [/\.vue$/, /\.md$/] }); // 配置可编译 .vue 与 .md 文件

export default defineConfig({
  plugins: [vitePluginMarkdown(), vuePlugin],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        // additionalData: '@import "./src/assets/base.less";',
        additionalData:
          '@import "./src/yike-design/assets/style/yk-index.less";',
      },
    },
  },
  build: {
    minify: 'terser',
    // 清除console等多余代码
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})

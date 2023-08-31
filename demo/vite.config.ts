import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vitePluginMarkdown from './plugins/vite-plugin-md';
import Components from 'unplugin-vue-components/vite';
import { YikeDevResolver } from './plugins/resolver';
const vuePlugin = createVuePlugin({
  include: [/\.vue$/, /\.md$/],
  script: {
    defineModel: true,
  },
}); // 配置可编译 .vue 与 .md 文件

const aliasDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: aliasDir,
      },
    ],
  },
  plugins: [
    vitePluginMarkdown(),
    vuePlugin,
    vueJsx() as any,
    Components({
      resolvers: [YikeDevResolver],
    }),
  ],
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData:
          '@import (reference) "@yike-design/ui/es/components/styles/index.less";',
      },
    },
  },
});

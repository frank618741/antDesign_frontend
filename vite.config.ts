import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from "unplugin-auto-import/vite"
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite';
//ant-design-vue
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      //安装两行后你会发现在组件中不用再导入ref，reactive等
      imports: ['vue', 'vue-router'],
      dts: "src/auto-import.d.ts",
      //ant-design-vue
      resolvers: [AntDesignVueResolver()]
    }),
    Components({
      //ant-design-vue   importStyle = false 样式就没了
      resolvers: [AntDesignVueResolver({ importStyle: true, resolveIcons: true })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    proxy: {
      '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          
      }
  }
  }
})

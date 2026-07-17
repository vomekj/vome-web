import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createEpsVitePlugin } from 'vome-core/client/vite-plugin-eps'
import { proxy } from './src/config/proxy'

const root = fileURLToPath(new URL('.', import.meta.url))
const coreClient = path.resolve(root, 'node_modules/vome-core/dist/client')
const corePkg = path.resolve(root, 'node_modules/vome-core')

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
    tailwindcss(),
    AutoImport({
      imports: ['vue', 'pinia', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/stores/app.ts',
        'src/stores/user.ts',
        'src/stores/theme.ts',
        'src/utils/**',
        'src/types/**',
      ],
      vueTemplate: true,
    }),
    createEpsVitePlugin({
      side: 'app',
      dtsSide: 'app',
      apiBase: proxy['/dev/'].target,
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: /^\/@\/(.*)$/, replacement: `${coreClient}/$1` },
      { find: '/@', replacement: coreClient },
      { find: /^\/#\/typings\/(.*)$/, replacement: `${corePkg}/typings/admin/$1` },
      { find: /^\/#\/(.*)$/, replacement: `${corePkg}/dist/$1` },
      { find: '/#', replacement: path.join(corePkg, 'dist/index.js') },
    ],
  },
  server: {
    port: 9900,
    strictPort: true,
    proxy: { ...proxy },
  },
})

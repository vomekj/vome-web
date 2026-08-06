import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createEpsVitePlugin } from 'vome-core/client/vite-plugin-eps'
import { coreAlias, ensureMicroAppProxy } from 'vome-core/client/vite-micro-proxy'
import { proxy } from './src/config/proxy'
import { exposeSrcLocales } from './lib/expose-src-locales'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    exposeSrcLocales(),
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
      ...coreAlias(root),
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 9900,
    strictPort: true,
    proxy: ensureMicroAppProxy(proxy),
  },
})

import { copyFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig, type Plugin } from 'vite'
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
const localesDir = path.resolve(root, 'src/locales')

/** 单一源包 src/locales → 对外仍提供 /locales/*.json（供 service HTTP 同步） */
function exposeSrcLocales(): Plugin {
  return {
    name: 'expose-src-locales',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (!url.startsWith('/locales/')) return next()
        const name = path.basename(url)
        if (!name.endsWith('.json')) return next()
        const file = path.resolve(localesDir, name)
        if (!file.startsWith(localesDir + path.sep)) return next()
        try {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(readFileSync(file))
        } catch {
          next()
        }
      })
    },
    closeBundle() {
      const outDir = path.resolve(root, 'dist/locales')
      mkdirSync(outDir, { recursive: true })
      for (const name of readdirSync(localesDir)) {
        if (!name.endsWith('.json')) continue
        copyFileSync(path.join(localesDir, name), path.join(outDir, name))
      }
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(),
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
      { find: /^\/@\/(.*)$/, replacement: `${coreClient}/$1` },
      { find: '/@', replacement: coreClient },
      { find: /^\/#\/typings\/(.*)$/, replacement: `${corePkg}/typings/admin/$1` },
      { find: /^\/#\/(.*)$/, replacement: `${corePkg}/dist/$1` },
      { find: '/#', replacement: path.join(corePkg, 'dist/index.js') },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 9900,
    strictPort: true,
    proxy: { ...proxy },
  },
})

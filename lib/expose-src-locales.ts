import { copyFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const localesDir = path.resolve(root, 'src/locales')

/** 单一源包 src/locales → 对外仍提供 /locales/*.json（供 service HTTP 同步） */
export function exposeSrcLocales(): Plugin {
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

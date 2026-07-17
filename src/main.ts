import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { bootEps } from './api/client'
import { config } from '@/config'
import logoDark from '@/static/image/logo-dark.png'
import { setSquareFavicon, syncDocumentTitle } from '@/utils/favicon'
import '@/styles/theme.css'

setSquareFavicon(logoDark)
syncDocumentTitle(config.app.name)

async function main() {
  try {
    await bootEps()
  } catch (e) {
    console.warn('[boot] createEps failed', e)
  }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')

  const { connectWs } = await import('@/lib/socket')
  connectWs()
}

void main()

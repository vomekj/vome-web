import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken } from '@/api/client'
import { config } from '@/config'
import { TAB_LIST, type TabName, useAppStore } from '@/stores/app'

// 自动路由：扫描 src/pages 下全部 .vue
// - pages/index.vue → /
// - pages/home/index.vue → /home
// - 文件名以 _ 开头的跳过（局部组件）
const pageModules = import.meta.glob('../pages/**/*.vue')

function routePathFromKey(key: string): string | null {
  const m = key.match(/^\.\.\/pages\/(.+)\.vue$/)
  if (!m?.[1]) return null
  let rel = m[1].replace(/\\/g, '/')
  const base = rel.split('/').pop() || ''
  if (base.startsWith('_')) return null
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length)
  if (rel === 'index' || rel === '') return '/'
  return `/${rel}`
}

function buildRoutes(): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  for (const [key, loader] of Object.entries(pageModules)) {
    const path = routePathFromKey(key)
    if (!path) continue
    const name = path === '/' ? 'index' : path.slice(1).replace(/\//g, '-')
    routes.push({
      path,
      name,
      component: loader,
    })
  }
  routes.sort((a, b) => String(a.path).localeCompare(String(b.path)))
  return routes
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    ...buildRoutes().filter((r) => r.path !== '/'),
  ],
})

const publicPaths = new Set(
  (config.ignore?.token ?? ['/login']).map((p) => p.replace(/\/$/, '') || '/'),
)

function tabFromPath(path: string): TabName | null {
  const normalized = path.replace(/\/$/, '') || '/'
  const hit = TAB_LIST.find((t) => t.path === normalized)
  return hit?.name ?? null
}

router.beforeEach((to) => {
  const path = to.path.replace(/\/$/, '') || '/'
  if (publicPaths.has(path)) return true
  if (!getAccessToken()) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
  return true
})

router.afterEach((to) => {
  const tab = tabFromPath(to.path)
  if (tab) {
    try {
      useAppStore().setActive(tab)
    } catch {
      // Pinia 未就绪时忽略
    }
  }
})

export default router

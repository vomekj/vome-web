import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken } from '@/api/client'
import { config } from '@/config'
import { TAB_LIST, type TabName, useAppStore } from '@/stores/app'

/**
 * 自动路由：扫 pages + pages-sub（与 uniapp 路径对齐）
 * - pages/home/index.vue → /pages/home/index
 * - pages-sub/foo/index.vue → /pages-sub/foo/index
 * - 文件名以 _ 开头的跳过（局部组件）
 */
const pageModules = import.meta.glob([
  '../pages/**/*.vue',
  '../pages-sub/**/*.vue',
])

function routePathFromKey(key: string): string | null {
  const m = key.match(/^\.\.\/((?:pages|pages-sub)\/.+)\.vue$/)
  if (!m?.[1]) return null
  const rel = m[1].replace(/\\/g, '/')
  const base = rel.split('/').pop() || ''
  if (base.startsWith('_')) return null
  return `/${rel}`
}

function buildRoutes(): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []
  for (const [key, loader] of Object.entries(pageModules)) {
    const path = routePathFromKey(key)
    if (!path) continue
    const name = path.slice(1).replace(/\//g, '-')
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
    { path: '/', redirect: '/pages/home/index' },
    ...buildRoutes(),
  ],
})

const publicPaths = new Set(
  (config.ignore?.token ?? ['/pages/login/index']).map(
    (p) => p.replace(/\/$/, '') || '/',
  ),
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
      path: '/pages/login/index',
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

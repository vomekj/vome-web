import router from '@/router'
import { TAB_LIST } from '@/stores/app'

const TAB_PATHS = new Set(TAB_LIST.map((t) => t.path))

/** 是否 Tab 页（与 uniapp switchTab 集合对齐，不含移动壳） */
export function isTabPath(url: string): boolean {
  const path = String(url || '').split('?')[0].replace(/\/$/, '') || '/'
  return TAB_PATHS.has(path)
}

/**
 * 统一跳转（与 uniapp `openPage` 同签名）。
 * Web 无 switchTab：Tab / 非 Tab 均 push/replace 完整 path。
 */
export function openPage(
  url: string,
  opts?: { replace?: boolean },
): Promise<void> | void {
  const path = String(url || '').trim()
  if (!path) return
  if (opts?.replace) return router.replace(path).then(() => undefined)
  return router.push(path).then(() => undefined)
}

export function openBack(): void {
  if (window.history.length > 1) {
    router.back()
    return
  }
  void openPage('/pages/home/index', { replace: true })
}

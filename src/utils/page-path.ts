/**
 * 页面 path 约定（web / uniapp 同构）
 * - 主包：/pages/<seg>/index
 * - 分包：/pages-sub/<seg>/index（uni 进 subPackages；web 仍为普通路由）
 */

export const MAIN_PAGES_PREFIX = '/pages'
export const SUB_PAGES_PREFIX = '/pages-sub'

/** 是否分包路径 */
export function isSubPackagePath(path: string): boolean {
  const p = String(path || '').split('?')[0]
  return p === SUB_PAGES_PREFIX || p.startsWith(`${SUB_PAGES_PREFIX}/`)
}

/**
 * 逻辑业务段 → 完整页面 path。
 * @param segments 如 'home' 或 'order/detail'
 * @param subPackage 为 true 时走 pages-sub
 */
export function buildPagePath(
  segments: string,
  subPackage = false,
): string {
  const seg = String(segments || '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/\/index$/i, '')
  const prefix = subPackage ? SUB_PAGES_PREFIX : MAIN_PAGES_PREFIX
  if (!seg) return `${prefix}/index`
  return `${prefix}/${seg}/index`
}

/** 完整 path → 写入相对文件（相对项目 src） */
export function pagePathToSrcFile(routePath: string): string {
  let p = String(routePath || '').trim()
  if (!p.startsWith('/')) p = `/${p}`
  p = p.replace(/\/+/g, '/').replace(/\/$/, '') || ''
  const body = p.replace(/^\//, '')
  if (!body) return 'pages/index.vue'
  if (body.endsWith('.vue')) return body
  if (body.endsWith('/index')) return `${body}.vue`
  return `${body}/index.vue`
}

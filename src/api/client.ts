import { config } from '@/config'
import {
  bindEpsHotReload,
  configureClient,
  createEps,
  getService,
} from '/@'
import type { RequestOptions } from '/#/typings/comm/request'

export type { RequestOptions }

const TOKEN_KEY = 'vome_web_access'
const REFRESH_KEY = 'vome_web_refresh'

export function apiUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  const base = config.baseUrl.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

/** 启动时尽量保证有可用 access token（有 refresh 则换新） */
export async function ensureFreshToken(): Promise<string> {
  const access = getAccessToken()
  if (access) return access
  const refresh = getRefreshToken()
  if (!refresh) return ''
  try {
    const res = await request<{
      token: string
      refreshToken: string
    }>('/app/user/login/refreshToken', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: refresh }),
      skipRefresh: true,
      toast: false,
    })
    setTokens(res.token, res.refreshToken || refresh)
    return res.token
  } catch {
    clearTokens()
    return ''
  }
}

function redirectLogin() {
  if (typeof window === 'undefined') return
  if (location.pathname.startsWith('/login')) return
  location.href = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`
}

/** App 端通用请求 → /app/... */
export async function request<T>(
  path: string,
  init?: RequestOptions,
): Promise<T> {
  const { toast: showToast = true, skipRefresh, ...rest } = init || {}
  const headers = new Headers(rest.headers)
  if (!headers.has('content-type') && rest.body) {
    headers.set('content-type', 'application/json')
  }
  const token = getAccessToken()
  if (token) headers.set('authorization', `Bearer ${token}`)

  const res = await fetch(apiUrl(path), { ...rest, headers })
  const raw = await res.text()
  let json: { code?: number; message?: string; data?: T } | null = null
  try {
    json = raw ? JSON.parse(raw) : null
  } catch {
    /* ignore */
  }

  if (json?.code === 1000) return json.data as T

  const message = json?.message || raw || `请求失败 (${res.status})`
  const needAuth =
    !skipRefresh &&
    (res.status === 401 ||
      /token|登录|未授权|鉴权|Unauthorized|unauthorized/i.test(message))

  if (needAuth) {
    clearTokens()
    redirectLogin()
    throw new Error('登录已失效，请重新登录')
  }

  if (showToast && import.meta.env.DEV) {
    console.warn('[api]', message)
  }
  throw new Error(message)
}

configureClient({ request })
bindEpsHotReload('app')

/** App 侧链式 service：service.user.xxx */
export const service = getService('app')

export async function bootEps(force = false) {
  return createEps({ force, side: 'app', requireRoot: false })
}

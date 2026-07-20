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

function redirectLogin() {
  if (typeof window === 'undefined') return
  if (location.pathname.startsWith('/login')) return
  location.href = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`
}

let refreshPromise: Promise<string> | null = null

async function sharedRefresh(): Promise<string> {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    const refresh = getRefreshToken()
    if (!refresh) throw new Error('no refresh')
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
  })().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

/** 启动时尽量保证有可用 access token（有 refresh 则换新） */
export async function ensureFreshToken(): Promise<string> {
  const access = getAccessToken()
  if (access) return access
  const refresh = getRefreshToken()
  if (!refresh) return ''
  try {
    return await sharedRefresh()
  } catch {
    clearTokens()
    return ''
  }
}

function isAuthFailure(
  status: number,
  message: string,
  skipRefresh?: boolean,
  path?: string,
) {
  if (skipRefresh || path?.includes('refreshToken')) return false
  if (status === 401) return true
  return /登录已失效|登录失效|未授权|鉴权失败|Unauthorized|unauthorized|invalid.?token|token.?expired|jwt.?expired/i.test(
    message,
  )
}

async function parseJson(raw: string) {
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** App 端通用请求 → /app/... */
export async function request<T>(
  path: string,
  init?: RequestOptions,
): Promise<T> {
  const { toast: showToast = true, skipRefresh, ...rest } = init || {}

  const buildHeaders = (token?: string | null) => {
    const headers = new Headers(rest.headers)
    if (!headers.has('content-type') && rest.body) {
      headers.set('content-type', 'application/json')
    }
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  }

  const doFetch = async (token?: string | null) => {
    const res = await fetch(apiUrl(path), {
      ...rest,
      headers: buildHeaders(token),
    })
    const raw = await res.text()
    const json = (await parseJson(raw)) as {
      code?: number
      message?: string
      data?: T
    } | null
    return { res, raw, json }
  }

  const failAuth = () => {
    clearTokens()
    redirectLogin()
    throw new Error('登录已失效，请重新登录')
  }

  const failBiz = (msg: string) => {
    if (showToast && import.meta.env.DEV) {
      console.warn('[api]', msg)
    }
    throw new Error(msg)
  }

  const first = await doFetch(getAccessToken())
  if (first.json?.code === 1000) return first.json.data as T

  const firstMsg =
    first.json?.message || first.raw || `请求失败 (${first.res.status})`
  if (!isAuthFailure(first.res.status, firstMsg, skipRefresh, path)) {
    failBiz(firstMsg)
  }

  if (!getRefreshToken()) failAuth()

  let next = ''
  try {
    next = await sharedRefresh()
  } catch {
    failAuth()
  }

  const retry = await doFetch(next)
  if (retry.json?.code === 1000) return retry.json.data as T

  const retryMsg =
    retry.json?.message || retry.raw || `请求失败 (${retry.res.status})`
  if (
    retry.res.status === 401 ||
    isAuthFailure(retry.res.status, retryMsg, false, path)
  ) {
    failAuth()
  }
  failBiz(retryMsg)
}

configureClient({ request })
bindEpsHotReload('app')

/** App 侧链式 service：service.user.xxx */
export const service = getService('app')

export async function bootEps(force = false) {
  return createEps({ force, side: 'app', requireRoot: false })
}

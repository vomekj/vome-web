import { createAuthClient } from 'better-auth/vue'
import { genericOAuthClient, jwtClient } from 'better-auth/client/plugins'
import { config } from '@/config'

/**
 * Better Auth 要求绝对 baseURL。
 * 用当前页 origin + baseUrl（/dev|/prod），仍走同源代理 / Nginx 前缀。
 */
function resolveAuthBaseURL() {
  const prefix = config.baseUrl.replace(/\/$/, '') || ''
  if (/^https?:\/\//.test(prefix)) return prefix
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${prefix}`
  }
  return config.host.replace(/\/$/, '')
}

const authBaseURL = resolveAuthBaseURL()

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [jwtClient(), genericOAuthClient()],
})

/** SSO 回调后：用 session 换 JWT 并写入本地 Bearer */
export async function syncBetterAuthJwt(): Promise<string | null> {
  const session = await authClient.getSession()
  if (!session.data) return null

  const res = await fetch(`${authBaseURL}/api/auth/token`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!res.ok) return null
  const json = (await res.json()) as { token?: string }
  return json.token || null
}

export const SOCIAL_LABELS: Record<string, string> = {
  github: 'GitHub',
  google: 'Google',
  wechat: '微信',
  gitee: 'Gitee',
  steam: 'Steam',
}

export const SOCIAL_ICONS: Record<string, string> = {
  github: 'ri-github-fill',
  google: 'ri-google-fill',
  wechat: 'ri-wechat-fill',
  gitee: 'ri-git-repository-fill',
  steam: 'ri-steam-fill',
}

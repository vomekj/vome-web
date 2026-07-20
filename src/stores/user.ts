import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  request,
  service,
  setTokens,
} from '@/api/client'
import type { AppUser, UserTokenPayload } from '@/typings/user'

export type { AppUser, UserTokenPayload }

const USER_INFO_KEY = 'vome_web_user'

function readCachedUser(): AppUser | undefined {
  try {
    const raw = localStorage.getItem(USER_INFO_KEY)
    if (!raw) return undefined
    return JSON.parse(raw) as AppUser
  } catch {
    return undefined
  }
}

/**
 * 用户会话（与 uniapp user store 一致）
 */
export const useUserStore = defineStore('user', () => {
  const token = ref(String(getAccessToken() || ''))
  const info = ref<AppUser | undefined>(readCachedUser())
  const loaded = ref(false)

  const displayName = computed(
    () =>
      info.value?.name ||
      info.value?.phone ||
      info.value?.email ||
      '用户',
  )

  function setToken(data: UserTokenPayload | { token: string; refreshToken: string }) {
    token.value = data.token
    setTokens(data.token, data.refreshToken)
  }

  async function refreshToken(): Promise<string> {
    const rt = getRefreshToken()
    if (!rt) throw new Error('无 refreshToken')

    const res =
      (await service.user?.login?.refreshToken?.({ refreshToken: rt })) ??
      (await request<UserTokenPayload>('/app/user/login/refreshToken', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: rt }),
        skipRefresh: true,
        toast: false,
      }))

    setToken(res)
    return res.token
  }

  function set(value: AppUser) {
    info.value = value
    try {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(value))
    } catch {
      // ignore
    }
  }

  async function update(data: AppUser & Record<string, unknown>) {
    const merged = { ...(info.value || {}), ...data }
    set(merged)
    return (
      (await service.user?.info?.updatePerson?.(data)) ??
      (await request('/app/user/info/updatePerson', {
        method: 'POST',
        body: JSON.stringify(data),
      }))
    )
  }

  function clear() {
    clearTokens()
    try {
      localStorage.removeItem(USER_INFO_KEY)
    } catch {
      // ignore
    }
    token.value = ''
    info.value = undefined
    loaded.value = false
    void import('@/lib/socket').then(({ disconnectWs }) => disconnectWs())
  }

  async function logout() {
    try {
      await service.user?.info?.logout?.({})
    } catch {
      // 本地清 token 即可
    }
    clear()
  }

  async function get() {
    if (!getAccessToken()) {
      info.value = undefined
      loaded.value = true
      return null
    }
    try {
      const person =
        (await service.user?.info?.person?.()) ??
        (await request<AppUser>('/app/user/info/person', { toast: false }))
      if (person) set(person)
      token.value = String(getAccessToken() || '')
      return person
    } catch {
      clear()
      return null
    } finally {
      loaded.value = true
    }
  }

  return {
    token,
    info,
    loaded,
    displayName,
    setToken,
    refreshToken,
    get,
    set,
    update,
    clear,
    logout,
  }
})

/** 全局代理（auto-import）；等价 useUserStore() */
export const userStore = new Proxy({} as ReturnType<typeof useUserStore>, {
  get(_t, prop) {
    const store = useUserStore()
    const value = Reflect.get(store, prop, store)
    return typeof value === 'function' ? value.bind(store) : value
  },
  set(_t, prop, value) {
    const store = useUserStore() as unknown as Record<string | symbol, unknown>
    store[prop] = value
    return true
  },
})

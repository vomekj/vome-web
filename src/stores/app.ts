import { defineStore } from 'pinia'

export type TabName = 'home' | 'discover' | 'message' | 'mine'

const MOBILE_MAX = 767

export const TAB_LIST: Array<{
  name: TabName
  text: string
  icon: string
  path: string
}> = [
  { name: 'home', text: '首页', icon: 'ri-home-5-line', path: '/home' },
  {
    name: 'discover',
    text: '发现',
    icon: 'ri-compass-3-line',
    path: '/discover',
  },
  {
    name: 'message',
    text: '消息',
    icon: 'ri-notification-3-line',
    path: '/message',
  },
  { name: 'mine', text: '我的', icon: 'ri-user-3-line', path: '/mine' },
]

/** 应用壳：断点 / Tab 激活（对齐 uniapp / vome-ai） */
export const useAppStore = defineStore('app', {
  state: () => ({
    active: 'home' as TabName,
    windowWidth:
      typeof window !== 'undefined' ? window.innerWidth : MOBILE_MAX + 1,
  }),
  getters: {
    isMobile(state): boolean {
      return state.windowWidth > 0
        ? state.windowWidth <= MOBILE_MAX
        : true
    },
  },
  actions: {
    setActive(name: TabName) {
      this.active = name
      try {
        localStorage.setItem('vome_web_active', name)
      } catch {
        // ignore
      }
    },
    goHome() {
      this.setActive('home')
    },
    initSystemInfo() {
      if (typeof window === 'undefined') return
      this.windowWidth = window.innerWidth
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth
      })
      try {
        const cached = localStorage.getItem('vome_web_active') as TabName | null
        if (cached && TAB_LIST.some((t) => t.name === cached)) {
          this.active = cached
        }
      } catch {
        // ignore
      }
    },
  },
})

/** 全局代理（auto-import）；等价 useAppStore() */
export const appStore = new Proxy({} as ReturnType<typeof useAppStore>, {
  get(_t, prop) {
    const store = useAppStore()
    const value = Reflect.get(store, prop, store)
    return typeof value === 'function' ? value.bind(store) : value
  },
  set(_t, prop, value) {
    const store = useAppStore() as unknown as Record<string | symbol, unknown>
    store[prop] = value
    return true
  },
})

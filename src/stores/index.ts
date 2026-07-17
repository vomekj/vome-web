import { useAppStore } from './app'
import { useUserStore } from './user'
import { useThemeStore } from './theme'

/**
 * 聚合入口（与 uniapp 一致）
 */
export function useStore() {
  return {
    app: useAppStore(),
    user: useUserStore(),
    theme: useThemeStore(),
  }
}

export { useAppStore, TAB_LIST, type TabName, appStore } from './app'
export { useUserStore, userStore } from './user'
export type { AppUser, UserTokenPayload } from '@/typings/user'
export {
  useThemeStore,
  bootTheme,
  isDark,
  resolvedTheme,
  setTheme,
  toggleTheme,
  themeMode,
} from './theme'

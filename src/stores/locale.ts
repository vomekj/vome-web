import { service } from '@/api/client'
import { createLocaleStore } from 'vome-core/client'
import zhCN from '@/locales/zh-CN.json'

export type { I18nLangItem } from 'vome-core/client'

/** web 宿主语言包 store（逻辑在 vome-core） */
export const useLocaleStore = createLocaleStore({
  storageKey: 'vome_web_locale',
  scopeKey: 'web',
  langMode: 'app',
  cachePacks: true,
  defaultPack: zhCN as Record<string, unknown>,
  persist: {
    get: (k) => localStorage.getItem(k),
    set: (k, v) => localStorage.setItem(k, v),
  },
  getPackApi: () =>
    (service as { i18n?: { pack?: any } }).i18n?.pack as
      | undefined,
})

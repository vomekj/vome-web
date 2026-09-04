/**
 * 切语种后重拉本页数据（与 uniapp 同约定，走 core）。
 */
import { watch } from 'vue'
import { useOnLocaleChange } from 'vome-core/client'
import { useLocaleStore } from '@/stores/locale'

export function useLocaleDataReload(load: () => void | Promise<void>) {
  const locale = useLocaleStore()
  const reload = () => {
    void load()
  }
  useOnLocaleChange(() => reload())
  watch(
    () => locale.localeEpoch,
    (n, o) => {
      if (o != null && n !== o) reload()
    },
  )
  return { reload, localeEpoch: () => locale.localeEpoch }
}

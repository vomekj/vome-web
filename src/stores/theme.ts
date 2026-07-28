import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'vome_web_theme'
const PAGE_BG = { light: '#f4f6fc', dark: '#141625' } as const

const themeMode = ref<ThemeMode>('system')
const systemDark = ref(false)

/** 弧形扫瞄过渡中，避免连点叠两次 View Transition */
let themeTransitioning = false

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void) => {
    finished: Promise<void>
  }
}

function resolveDark(mode: ThemeMode, prefersDark: boolean) {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return prefersDark
}

const isDark = computed(() => resolveDark(themeMode.value, systemDark.value))
const resolvedTheme = computed<'dark' | 'light'>(() =>
  isDark.value ? 'dark' : 'light',
)

function syncDomAttr(el: Element | null | undefined, dark: boolean) {
  if (!el) return
  const theme = dark ? 'dark' : 'light'
  el.setAttribute('data-theme', theme)
  el.classList.toggle('theme-dark', dark)
  el.classList.toggle('theme-light', !dark)
  el.classList.toggle('dark', dark)
}

/** 同步 html/body 主题标记（对齐 uni applyThemeDom） */
export function applyThemeDom(dark: boolean) {
  if (typeof document === 'undefined') return
  syncDomAttr(document.documentElement, dark)
  syncDomAttr(document.body, dark)
  document.documentElement.style.backgroundColor = dark
    ? PAGE_BG.dark
    : PAGE_BG.light
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 亮暗视觉变化时走 View Transition；启动 / 降级 / 减少动效则即时应用 */
function runThemeUpdate(apply: () => void, animate: boolean) {
  const doc =
    typeof document !== 'undefined'
      ? (document as ViewTransitionDoc)
      : null
  if (
    !animate ||
    !doc?.startViewTransition ||
    prefersReducedMotion() ||
    themeTransitioning
  ) {
    apply()
    return
  }

  themeTransitioning = true
  const transition = doc.startViewTransition(apply)
  void transition.finished.finally(() => {
    themeTransitioning = false
  })
}

export function setTheme(
  mode: ThemeMode | boolean,
  options?: { animate?: boolean },
) {
  const next: ThemeMode =
    typeof mode === 'boolean' ? (mode ? 'dark' : 'light') : mode
  const nextDark = resolveDark(next, systemDark.value)
  const visualChange = nextDark !== isDark.value
  const animate = options?.animate !== false && visualChange

  runThemeUpdate(() => {
    themeMode.value = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
    applyThemeDom(isDark.value)
  }, animate)
}

export function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark')
}

function initTheme() {
  if (typeof window === 'undefined') return
  try {
    const cached = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (cached === 'light' || cached === 'dark' || cached === 'system') {
      themeMode.value = cached
    }
  } catch {
    // ignore
  }
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = mq.matches
  mq.addEventListener('change', (e) => {
    systemDark.value = e.matches
  })
}

let watching = false

/** App 启动：读 storage + 首次应用 + 持续 watch */
export function bootTheme() {
  initTheme()
  applyThemeDom(isDark.value)
  if (!watching) {
    watching = true
    watch(isDark, (dark) => applyThemeDom(dark))
  }
}

export const useThemeStore = defineStore('theme', () => {
  const themeClass = computed<'dark' | 'light'>(() => resolvedTheme.value)

  return {
    themeMode,
    resolvedTheme,
    isDark,
    themeClass,
    setTheme,
    toggleTheme,
    initTheme,
    boot: bootTheme,
    applyThemeDom,
  }
})

export { themeMode, resolvedTheme, isDark, initTheme }

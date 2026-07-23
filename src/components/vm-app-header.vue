<template>
  <header class="header" :class="{ 'is-dark': isDark }">
    <div class="logo" @click="goHome">
      <img class="logo__img" :src="logoSrc" alt="" />
      <span class="logo__title">{{ config.app.name }}</span>
    </div>

    <nav class="nav">
      <button
        v-for="(item, index) in tabList"
        :key="item.name"
        type="button"
        class="nav-item"
        :class="{ active: current === index }"
        @click="switchTab(index)"
      >
        <vm-ri-icon class="nav-item__icon" :name="item.icon" />
        <span class="nav-item__text">{{
          locale.t(`header.${item.name}`, item.text)
        }}</span>
      </button>
    </nav>

    <div class="actions">
      <button
        type="button"
        class="actions__icon"
        :title="
          isDark
            ? locale.t('header.themeLight', '浅色')
            : locale.t('header.themeDark', '深色')
        "
        @click="onToggleTheme"
      >
        <vm-ri-icon :name="isDark ? 'ri-sun-line' : 'ri-moon-line'" />
      </button>

      <div ref="localeWrapRef" class="actions__locale">
        <button
          type="button"
          class="actions__icon actions__locale-btn"
          :title="locale.currentLang?.name || locale.locale"
          :disabled="localeSwitching"
          @click="localeOpen = !localeOpen"
        >
          <span class="actions__flag" aria-hidden="true">
            {{ locale.currentLang?.flag || '🏳️' }}
          </span>
        </button>
        <!-- 锚定切换按钮下方，与 admin align=start 一致 -->
        <div v-if="localeOpen" class="actions__locale-menu" role="menu">
          <button
            v-for="lang in locale.langs"
            :key="lang.code"
            type="button"
            class="actions__locale-item"
            :class="{ 'is-active': locale.locale === lang.code }"
            :disabled="localeSwitching"
            role="menuitem"
            @click="switchLocale(lang.code)"
          >
            <span class="actions__flag" aria-hidden="true">
              {{ lang.flag || '🏳️' }}
            </span>
            <span class="actions__locale-label">{{ lang.name }}</span>
          </button>
        </div>
      </div>

      <button type="button" class="actions__user" @click="onUserClick">
        <span class="actions__avatar">{{ avatarLetter }}</span>
        <span class="actions__name">{{ displayName }}</span>
        <vm-ri-icon name="ri-arrow-down-s-line" class="actions__chevron" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getAccessToken } from '@/api/client'
import { config } from '@/config'
import VmRiIcon from '@/components/vm-ri-icon.vue'
import { useLocaleStore } from '@/stores/locale'
import { useUserStore } from '@/stores/user'
import logoLight from '@/static/image/logo-light.png'
import logoDark from '@/static/image/logo-dark.png'

/**
 * 桌面顶栏：左品牌 / 中导航 / 右主题+语言+头像（对齐 uni header，Vue3 挂载）
 */
const router = useRouter()
const locale = useLocaleStore()
const user = useUserStore()
const tabList = TAB_LIST

const localeOpen = ref(false)
const localeSwitching = ref(false)
const localeWrapRef = ref<HTMLElement | null>(null)

const current = computed(() =>
  tabList.findIndex((item) => item.name === appStore.active),
)

/** 须读 pinia token，getAccessToken 非响应式 */
const authed = computed(() => Boolean(user.token || getAccessToken()))

const displayName = computed(() =>
  authed.value
    ? user.displayName
    : locale.t('header.login', '登录'),
)

const avatarLetter = computed(() =>
  String(displayName.value || 'V').slice(0, 1).toUpperCase(),
)

const logoSrc = computed(() => (isDark.value ? logoLight : logoDark))

function goHome() {
  appStore.goHome()
  void router.push('/home')
}

function switchTab(index: number) {
  const item = tabList[index]
  if (!item) return
  appStore.setActive(item.name)
  void router.push(item.path)
}

function onToggleTheme() {
  toggleTheme()
}

async function switchLocale(code: string) {
  if (localeSwitching.value) return
  localeSwitching.value = true
  localeOpen.value = false
  try {
    await locale.setLocale(code)
  } finally {
    localeSwitching.value = false
  }
}

function onDocPointerDown(e: PointerEvent) {
  const el = localeWrapRef.value
  if (!el || !localeOpen.value) return
  if (!el.contains(e.target as Node)) localeOpen.value = false
}

function onUserClick() {
  if (!authed.value) {
    void router.push('/login')
    return
  }
  appStore.setActive('mine')
  void router.push('/mine')
}

onMounted(() => {
  void user.get()
  document.addEventListener('pointerdown', onDocPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
})
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  z-index: 20;
  height: 60px;
  padding: 0 28px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid var(--vm-header-border, #eef0f5);
  background: var(--vm-header-bg, #ffffff);
  box-shadow: 0 1px 0 rgba(78, 93, 255, 0.04);
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.logo {
  z-index: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  flex-shrink: 0;
  height: 60px;
  cursor: pointer;
}

.logo__img {
  height: 24px;
  width: auto;
  flex-shrink: 0;
}

.logo__title {
  margin-left: 10px;
  font-size: 26px;
  font-weight: 1000;
  letter-spacing: 0.06em;
  line-height: 1;
  white-space: nowrap;
  color: var(--vm-brand-text, #3b4456);
}

.nav {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  transform: translateX(-50%);
}

.nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border: none;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &__icon {
    font-size: 18px;
    line-height: 1;
    color: var(--vm-muted-text, #9aa0b0);
    transition: color 0.15s ease;
  }

  &__text {
    font-size: 15px;
    font-weight: 500;
    line-height: 1;
    color: var(--vm-muted-text, #9aa0b0);
    transition: color 0.15s ease;
  }

  &:hover,
  &:active {
    background: var(--vm-soft-bg, #f4f6fc);
  }

  &.active {
    background: var(--vm-soft-active, rgba(78, 93, 255, 0.12));

    .nav-item__icon,
    .nav-item__text {
      color: #4e5dff;
    }

    .nav-item__text {
      font-weight: 650;
    }
  }
}

.actions {
  z-index: 1;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
}

.actions__locale {
  position: relative;
}

.actions__locale-btn {
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.actions__flag {
  font-size: 18px;
  line-height: 1;
}

.actions__locale-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: auto;
  z-index: 50;
  min-width: 120px;
  max-width: 160px;
  width: max-content;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--vm-header-border, #eef0f5);
  background: var(--vm-header-bg, #ffffff);
  box-shadow: 0 8px 24px rgba(20, 22, 37, 0.12);
}

.actions__locale-item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--vm-brand-text, #3b4456);
  font-size: 12px;
  cursor: pointer;
  box-sizing: border-box;

  &:hover,
  &:active {
    background: var(--vm-soft-bg, #f4f6fc);
  }

  &.is-active {
    background: var(--vm-soft-active, rgba(78, 93, 255, 0.12));
    color: #4e5dff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.actions__locale-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.actions__icon {
  display: flex;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  background: var(--vm-soft-bg, #f4f6fc);
  color: var(--vm-brand-text, #3b4456);
  font-size: 18px;
  cursor: pointer;
  box-sizing: border-box;

  &:active {
    opacity: 0.85;
  }
}

.actions__user {
  display: flex;
  flex-direction: row;
  height: 36px;
  align-items: center;
  gap: 8px;
  padding: 0 6px 0 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  box-sizing: border-box;

  &:hover,
  &:active {
    background: var(--vm-soft-bg, #f4f6fc);
  }
}

.actions__avatar {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--vm-soft-active, rgba(78, 93, 255, 0.12));
  color: #4e5dff;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.actions__name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--vm-brand-text, #3b4456);
}

.actions__chevron {
  font-size: 14px;
  color: var(--vm-muted-text, #9aa0b0);
  opacity: 0.7;
}

.header.is-dark {
  --vm-header-bg: #141625;
  --vm-header-border: #252836;
  --vm-brand-text: #f0f2fa;
  --vm-muted-text: #9aa0b0;
  --vm-soft-bg: #1c1f33;
  --vm-soft-active: rgba(78, 93, 255, 0.22);
}
</style>

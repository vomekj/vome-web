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
      <vm-locale-toggle />

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
import VmLocaleToggle from '@/components/vm-locale-toggle.vue'
import VmRiIcon from '@/components/vm-ri-icon.vue'
import { useLocaleStore } from '@/stores/locale'
import { useUserStore } from '@/stores/user'
import logoLight from '@/static/image/logo-light.png'
import logoDark from '@/static/image/logo-dark.png'

/**
 * 桌面顶栏（零代码原生；路径对齐 uni `components/vm-header.vue`）
 */
const locale = useLocaleStore()
const user = useUserStore()
const tabList = TAB_LIST

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
  void openPage('/pages/home/index')
}

function switchTab(index: number) {
  const item = tabList[index]
  if (!item) return
  appStore.setActive(item.name)
  void openPage(item.path)
}

function onUserClick() {
  if (!authed.value) {
    void openPage('/pages/login/index')
    return
  }
  appStore.setActive('mine')
  void openPage('/pages/mine/index')
}
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

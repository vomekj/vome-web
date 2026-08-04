<template>
  <div class="page">
    <h1 class="title">我的</h1>

    <div class="card">
      <div class="profile">
        <p class="name">{{ helloName }}</p>
        <p class="meta">{{ userStore.info?.phone || '未绑定手机号' }}</p>
      </div>
      <button
        v-if="!authed"
        type="button"
        class="btn"
        :disabled="loading"
        @click="goLogin"
      >
        去登录
      </button>
      <button
        v-else
        type="button"
        class="btn btn-ghost"
        :disabled="loading"
        @click="onLogout"
      >
        {{ loading ? '退出中…' : '退出登录' }}
      </button>
    </div>

    <div class="section">
      <div class="cell">
        <span>深色模式</span>
        <vm-theme-toggle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAccessToken } from '@/api/client'

const loading = ref(false)

const authed = computed(() => Boolean(getAccessToken()))
const helloName = computed(() =>
  authed.value ? userStore.displayName : '未登录',
)

onMounted(() => {
  appStore.setActive('mine')
})

function onDarkToggle() {
  setTheme(!isDark.value)
}

function goLogin() {
  void openPage('/pages/login/index')
}

async function onLogout() {
  if (loading.value) return
  loading.value = true
  try {
    await userStore.logout()
    await openPage('/pages/login/index', { replace: true })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background: var(--vm-page-bg, #f4f6fc);
  color: var(--vm-brand-text, #2c3142);
}

.title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 700;
}

.card {
  padding: 18px;
  border-radius: 16px;
  background: var(--vm-card, #fff);
  border: 1px solid var(--vm-card-border, #e8ebf5);
  box-shadow: var(--vm-card-shadow);
}

.profile {
  margin-bottom: 14px;
}

.name {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
}

.meta {
  margin: 0;
  font-size: 13px;
  color: var(--vm-muted-text, #9aa0b0);
}

.btn {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #4e5dff;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-ghost {
  background: var(--vm-soft-bg, #f4f6fc);
  color: var(--vm-brand-text, #2c3142);
}

.section {
  margin-top: 14px;
  border-radius: 16px;
  background: var(--vm-card, #fff);
  border: 1px solid var(--vm-card-border, #e8ebf5);
  overflow: hidden;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 14px;
}
</style>

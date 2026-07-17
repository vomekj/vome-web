<template>
  <div
    class="vm-app"
    :class="{
      'is-mobile': appStore.isMobile,
      'has-header': showShell && !appStore.isMobile,
      'has-tabbar': showShell && appStore.isMobile,
    }"
  >
    <VmAppHeader v-if="showShell && !appStore.isMobile" />
    <main class="vm-app__main">
      <RouterView />
    </main>
    <VmAppTabbar
      v-if="showShell && appStore.isMobile"
      :model-value="appStore.active"
    />
  </div>
</template>

<script setup lang="ts">
import VmAppHeader from '@/components/vm-app-header.vue'
import VmAppTabbar from '@/components/vm-app-tabbar.vue'
import { ensureFreshToken, getAccessToken } from '@/api/client'

const route = useRoute()

const showShell = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return path !== '/login'
})

onMounted(() => {
  bootTheme()
  appStore.initSystemInfo()
  void (async () => {
    await ensureFreshToken()
    if (getAccessToken()) await userStore.get()
  })()
})
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

.vm-app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: var(--vm-page-bg, #f4f6fc);
  color: var(--vm-brand-text, #2c3142);
}

.vm-app__main {
  flex: 1;
  min-height: 0;
  width: 100%;
  box-sizing: border-box;
}

.vm-app.has-header .vm-app__main {
  /* 顶栏占位已由文档流完成，无需额外 padding */
}

.vm-app.has-tabbar .vm-app__main {
  padding-bottom: calc(54px + env(safe-area-inset-bottom, 0px));
}
</style>

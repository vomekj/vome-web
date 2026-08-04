<template>
  <div
    class="vm-app"
    :class="{
      'is-mobile': appStore.isMobile,
      'has-header': showShell && !appStore.isMobile,
      'has-tabbar': showShell && appStore.isMobile,
    }"
  >
    <VmHeader v-if="showShell && !appStore.isMobile" />
    <!-- 侧栏占位：与 uni `vm-aside` / leftWindow 对齐，默认关闭
    <VmAside v-if="showShell && !appStore.isMobile" />
    -->
    <main class="vm-app__main">
      <RouterView />
    </main>
    <VmTabbar
      v-if="showShell && appStore.isMobile"
      :model-value="appStore.active"
    />
  </div>
</template>

<script setup lang="ts">
import VmHeader from '@/components/vm-header.vue'
// import VmAside from '@/components/vm-aside.vue'
import VmTabbar from '@/components/vm-tabbar.vue'
import { ensureFreshToken, getAccessToken } from '@/api/client'

const route = useRoute()

const showShell = computed(() => {
  const path = route.path.replace(/\/$/, '') || '/'
  return path !== '/pages/login/index'
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

.vm-app.has-tabbar .vm-app__main {
  padding-bottom: calc(54px + env(safe-area-inset-bottom, 0px));
}
</style>

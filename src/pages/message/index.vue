<template>
  <div class="page">
    <h1 class="title">消息</h1>
  </div>
</template>

<script setup lang="ts">
onMounted(() => appStore.setActive('message'))
</script>

<style lang="scss" scoped>
.page {
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;
  background: var(--vm-page-bg, #f4f6fc);
}
.title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vm-brand-text, #2c3142);
}
</style>

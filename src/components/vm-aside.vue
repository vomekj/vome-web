<template>
  <aside class="vm-aside">
    <div class="vm-aside__brand">
      <span class="vm-aside__label">当前应用</span>
      <span class="vm-aside__name">{{ config.app.name }}</span>
    </div>
    <nav class="vm-aside__menu">
      <button
        v-for="item in menus"
        :key="item.name"
        type="button"
        class="vm-aside__item"
        :class="{ 'is-active': appStore.active === item.name }"
        @click="goTab(item)"
      >
        {{ item.text }}
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
/**
 * 侧栏（零代码原生；路径对齐 uni `components/vm-aside.vue`）
 */
import { config } from '@/config'

const menus = TAB_LIST

function goTab(item: (typeof menus)[number]) {
  appStore.setActive(item.name)
  void openPage(item.path)
}
</script>

<style lang="scss" scoped>
.vm-aside {
  width: 240px;
  height: 100%;
  box-sizing: border-box;
  background: var(--vm-card, #f7f8fc);
  border-right: 1px solid var(--vm-card-border, #eef0f5);
}

.vm-aside__brand {
  padding: 20px 18px 16px;
  border-bottom: 1px solid var(--vm-card-border, #eef0f5);
}

.vm-aside__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vm-muted-text, #9aa0b0);
}

.vm-aside__name {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #4e5dff;
}

.vm-aside__menu {
  padding: 8px 0;
}

.vm-aside__item {
  display: flex;
  width: calc(100% - 20px);
  margin: 0 10px;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--vm-brand-text, #50566b);
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;

  &.is-active {
    background: rgba(78, 93, 255, 0.1);
    color: #4e5dff;
    font-weight: 650;
  }
}
</style>

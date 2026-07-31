<template>
  <nav class="vm-tabbar" aria-label="主导航">
    <button
      v-for="item in TAB_LIST"
      :key="item.name"
      type="button"
      class="vm-tabbar__item"
      :class="{ 'is-active': active === item.name }"
      @click="onSelect(item.name)"
    >
      <vm-ri-icon class="vm-tabbar__icon" :name="item.icon" />
      <span class="vm-tabbar__label">{{ item.text }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
/**
 * 移动端底栏（零代码原生；路径对齐 uni `components/vm-tabbar.vue`；走 openPage）
 */
import VmRiIcon from '@/components/vm-ri-icon.vue'

type ShellTab = TabName

const props = withDefaults(
  defineProps<{ modelValue?: ShellTab }>(),
  { modelValue: 'home' },
)

const emit = defineEmits<{
  'update:modelValue': [name: ShellTab]
  change: [name: ShellTab]
}>()

const active = computed(() => props.modelValue || appStore.active)

function onSelect(name: ShellTab) {
  if (active.value === name) return
  emit('update:modelValue', name)
  emit('change', name)
  appStore.setActive(name)
  const item = TAB_LIST.find((t) => t.name === name)
  if (item) void openPage(item.path)
}
</script>

<style lang="scss" scoped>
.vm-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 54px;
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom, 0px));
  background: var(--vm-card, #ffffff);
  border-top: 1px solid var(--vm-card-border, #e8ebf5);
  box-sizing: border-box;
}

.vm-tabbar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 0 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--vm-muted-text, #9aa0b0);
  transition: color 0.15s ease;
}

.vm-tabbar__item.is-active {
  color: #4e5dff;
}

.vm-tabbar__icon {
  font-size: 22px;
  line-height: 1;
}

.vm-tabbar__label {
  font-size: 11px;
  font-weight: 500;
  line-height: 15px;
}

.vm-tabbar__item.is-active .vm-tabbar__label {
  font-weight: 650;
}
</style>

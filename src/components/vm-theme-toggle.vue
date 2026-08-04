<template>
  <button
    type="button"
    class="vm-theme-toggle"
    :title="
      isDark
        ? locale.t('header.themeLight', '浅色')
        : locale.t('header.themeDark', '深色')
    "
    :aria-label="
      isDark
        ? locale.t('header.themeLight', '浅色')
        : locale.t('header.themeDark', '深色')
    "
    @click="onToggle"
  >
    <vm-ri-icon :name="isDark ? 'ri-sun-line' : 'ri-moon-line'" />
  </button>
</template>

<script setup lang="ts">
/**
 * 亮暗切换（与 vome-code theme-toggle / vm-theme-toggle.vue 同名同职责）
 */
import VmRiIcon from '@/components/vm-ri-icon.vue'
import { useLocaleStore } from '@/stores/locale'

defineOptions({ name: 'VmThemeToggle' })

const locale = useLocaleStore()

function onToggle() {
  toggleTheme()
}
</script>

<style lang="scss" scoped>
.vm-theme-toggle {
  display: inline-flex;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--vm-card-border, #e8ebf5);
  border-radius: 8px;
  background: var(--vm-card, #fff);
  color: var(--vm-brand-text, #2c3142);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  box-sizing: border-box;

  &:active {
    opacity: 0.85;
  }
}
</style>

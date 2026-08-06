<template>
  <div ref="wrapRef" class="vm-locale-toggle">
    <button
      type="button"
      class="vm-locale-toggle__btn"
      :title="locale.currentLang?.name || locale.locale"
      :aria-label="locale.t('header.locale', '语言')"
      :disabled="switching"
      @click="open = !open"
    >
      <span class="vm-locale-toggle__flag" aria-hidden="true">
        {{ locale.currentLang?.flag || '🏳️' }}
      </span>
    </button>
    <div v-if="open" class="vm-locale-toggle__menu" role="menu">
      <button
        v-for="lang in locale.langs"
        :key="lang.code"
        type="button"
        class="vm-locale-toggle__item"
        :class="{ 'is-active': locale.locale === lang.code }"
        :disabled="switching"
        role="menuitem"
        @click="switchLocale(lang.code)"
      >
        <span class="vm-locale-toggle__flag" aria-hidden="true">
          {{ lang.flag || '🏳️' }}
        </span>
        <span class="vm-locale-toggle__label">{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 语言切换（与 vome-code locale-toggle / vm-locale-toggle.vue 同名同职责）
 */
import { useLocaleStore } from '@/stores/locale'

defineOptions({ name: 'VmLocaleToggle' })

const locale = useLocaleStore()
const open = ref(false)
const switching = ref(false)
const wrapRef = ref<HTMLElement | null>(null)

async function switchLocale(code: string) {
  if (switching.value) return
  switching.value = true
  open.value = false
  try {
    await locale.setLocale(code)
  } finally {
    switching.value = false
  }
}

function onDocPointerDown(e: PointerEvent) {
  const el = wrapRef.value
  if (!el || !open.value) return
  if (!el.contains(e.target as Node)) open.value = false
}

onMounted(() => {
  if (!locale.langs.length) void locale.loadLangs()
  document.addEventListener('pointerdown', onDocPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
})
</script>

<style lang="scss" scoped>
.vm-locale-toggle {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.vm-locale-toggle__btn {
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
  cursor: pointer;
  box-sizing: border-box;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active {
    opacity: 0.85;
  }
}

.vm-locale-toggle__flag {
  font-size: 18px;
  line-height: 1;
}

.vm-locale-toggle__menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 50;
  min-width: 120px;
  max-width: 160px;
  width: max-content;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--vm-card-border, #e8ebf5);
  background: var(--vm-card, #fff);
  box-shadow: 0 8px 24px rgba(20, 22, 37, 0.12);
  box-sizing: border-box;
}

.vm-locale-toggle__item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--vm-brand-text, #2c3142);
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

.vm-locale-toggle__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
</style>

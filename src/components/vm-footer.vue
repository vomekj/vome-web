<template>
  <footer class="vm-footer">
    <span class="vm-footer__text">{{ text }}</span>
  </footer>
</template>

<script setup lang="ts">
/**
 * 页脚壳（零代码原生；路径对齐 uni `components/vm-footer.vue`）
 */
withDefaults(
  defineProps<{ text?: string }>(),
  { text: '© VOME' },
)
</script>

<style lang="scss" scoped>
.vm-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 8px 16px;
  box-sizing: border-box;
  border-top: 1px solid var(--vm-card-border, #e8ebf5);
  background: var(--vm-card, #ffffff);
}

.vm-footer__text {
  font-size: 12px;
  color: var(--vm-muted-text, #9aa0b0);
}
</style>

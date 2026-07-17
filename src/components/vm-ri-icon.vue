<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'vm-ri-icon' })

const props = defineProps<{
  /** remixicon 名，如 ri-home-line；可省略 ri- 前缀 */
  name: string
  class?: string
}>()

const cls = computed(() => {
  const n = props.name.startsWith('ri-') ? props.name : `ri-${props.name}`
  return cn(n, props.class)
})
</script>

<template>
  <i :class="cls" aria-hidden="true" />
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

defineProps<Props>()
</script>

<template>
  <div v-if="!modelValue" class="fixed inset-0 bg-slate-800/[0.5] flex justify-center items-center" style="z-index: 1000">
    <n-spin size="large" />
    <span class="ml-4 text-gray-300/[0.9] font-bold text-xl">Reconnecting...</span>
  </div>
</template>

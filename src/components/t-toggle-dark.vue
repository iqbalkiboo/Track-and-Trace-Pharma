<script setup lang="ts">
  import { Moon, Sunny } from '@vicons/ionicons5'
  const isDark = inject<boolean>('isDark')
  const toggleDark = inject<() => void>('toggleDark')

  defineProps<{
    icon?: boolean
  }>()

  function handleToggleDark() {
    if (toggleDark != undefined) toggleDark()
  }
</script>

<template>
  <n-button type="primary" v-if="icon" @click="handleToggleDark()" circle>
    <n-icon :component="isDark ? Moon : Sunny"></n-icon>
  </n-button>
  <n-button v-else @click="handleToggleDark()">
    Dark mode: {{ isDark ? 'on' : 'off' }}
  </n-button>
</template>

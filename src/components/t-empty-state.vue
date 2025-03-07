<script setup lang="ts">
  import { NIcon } from 'naive-ui'
  import { AlertCircleOutline } from '@vicons/ionicons5'

  const props = withDefaults(
  defineProps<{
    words: any
  }>(),
  {
    words: () => (''),
  }
)

</script>

<template>
  <div style="padding: .8rem; border-radius: 8px; background-color: #ffffff; text-align: center; margin-top: 14px;">
    <n-icon color="#333639" :size="35"><AlertCircleOutline /></n-icon>
    <div style="font-size: 14px;">{{ props.words }}</div>
  </div>
</template>
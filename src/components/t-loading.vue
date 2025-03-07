<script setup lang="ts">
  import { NIcon } from 'naive-ui'
  import { HourglassOutline } from '@vicons/ionicons5'
</script>

<template>
  <div style="padding-top: 10px; padding-bottom: 10px; text-align: center">
    <n-icon color="#0b8f9d" :size="35"><hourglass-outline /></n-icon>
    <div style="font-size: 14px;">Data sedang dimuat . . .</div>
  </div>
</template>
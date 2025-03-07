<script setup lang="ts">
  import { NIcon } from 'naive-ui'
  import { AlertCircleOutline } from '@vicons/ionicons5'
</script>

<template>
  <div style="padding: .8rem; border-radius: 8px; background-color: #fff3da; text-align: center; margin-top: 14px;">
    <n-icon color="#333639" :size="35"><AlertCircleOutline /></n-icon>
    <div style="font-size: 14px;">Anda tidak memiliki hak akses untuk melihat list data</div>
  </div>
</template>
<script setup lang="ts">
  defineProps<{
    options: object
    type: string
    series: Array<any>
    height?: string | number
    width?: string | number
  }>()
</script>

<template>
  <apexchart
    :type="type"
    :options="options"
    :series="series"
    :height="height"
    :width="width"
  />
</template>
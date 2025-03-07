<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import type { THeader } from './components'

  const defaultStyle: CSSProperties = {
    backgroundColor: '#f2994a',
    color: 'white',
  }

  withDefaults(
    defineProps<{
      headers: THeader[]
    }>(),
    { headers: () => [] }
  )

  function mergeStyle(style: CSSProperties) {
    return Object.assign({}, defaultStyle, style)
  }
</script>

<template>
  <n-scrollbar>
    <n-table :bottom-bordered="false" :bordered="false" :single-line="true">
      <n-thead>
        <n-tr style="border-radius: 20px">
          <n-th
            v-for="header in headers"
            :key="header.label"
            :style="mergeStyle(header.style ?? {})"
            >{{ header.label }}</n-th
          >
        </n-tr>
      </n-thead>

      <n-tbody>
        <slot />
      </n-tbody>
    </n-table>
  </n-scrollbar>
</template>

<style scoped>
  table tr th:first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }
  table tr th:last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
</style>

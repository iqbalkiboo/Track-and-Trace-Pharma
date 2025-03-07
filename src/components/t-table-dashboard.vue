<script setup lang="ts">
  import type { CSSProperties } from 'vue'
  import type { THeader } from './components'

  const defaultStyle: CSSProperties = {
    backgroundColor: '#f3f6f9',
    color: '#7a808d',
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
  
  const slots = defineSlots<{
    default(): any
  }>()
  
  const hasData = computed(() => slots.default()[0].children.length)
</script>

<template>
  <n-scrollbar>
    <n-table :bottom-bordered="false" :bordered="false" :single-line="true">
      <n-thead>
        <n-tr style="border-radius: 20px">
          <n-th
            v-for="(header, key) in headers"
            :key="header.label"
            :style="[
              mergeStyle(header.style ?? {}),
              header.label === 'STATUS' && 'text-align:center;',
              key === 0 && 'padding-left:18px;'
            ]"
            >{{ header.label }}</n-th
          >
        </n-tr>
      </n-thead>

      <n-tbody>
        <slot v-if="hasData"/>
        <n-tr v-else>
          <n-td class="text-center font-semibold" :colspan="headers.length">Tidak Ada Data</n-td>
        </n-tr>
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

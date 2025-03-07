<script setup lang="ts">
import { useMessage } from "naive-ui"

const tMessage = useMessage()
const dataRes = ref<any>({})
const isLoading = ref(false)

const props = withDefaults(
  defineProps<{
    show: boolean
    data: any
  }>(),
  {
    show: false,
    data: {},
  }
)
defineEmits<{
  (e: "update:show", value: boolean): void
}>()
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 800px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('update:show', $event)"
  >
    <div style="overflow-x: scroll; max-width: 800px">
      <pre>{{ data }}</pre>
    </div>
  </n-modal>
</template>

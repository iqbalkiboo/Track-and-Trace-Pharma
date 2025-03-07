<script setup lang="ts">
import { useMessage } from "naive-ui"

import { dakotaModel } from "@/models/external/dakota"

const tMessage = useMessage()
const dataRes = ref<any>({})
const isLoading = ref(false)

const props = withDefaults(
  defineProps<{
    show: boolean
    dakota: any
    do_code: string
  }>(),
  {
    show: false,
  }
)
defineEmits<{
  (e: "click:close", value: boolean): void
}>()
async function getDakota() {
  isLoading.value = true
  try {
    const res = await dakotaModel.getHistoriyDakota(props.do_code)
    dataRes.value = res.data
    isLoading.value = false
  } catch (e: any) {
    if (e.response) {
      const data = e.response.data.message
      tMessage.error(data)
      isLoading.value = false
    }
  }
}

watchEffect(() => {
  if (props.show) {
    getDakota()
  }
})
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
    @update:show="$emit('click:close', $event)"
  >
    <template v-if="isLoading">
      <t-loading />
    </template>
    <template v-else>
      <n-steps
        vertical
        style="
          width: 1300px;
          max-width: 100%;
          position: relative;
          margin-top: 2.5rem;
        "
        status="process"
      >
        <n-step
          v-for="(list, i) in dataRes.list"
          :key="i"
        >
          <t-lacak-dakota-history :list="list" />
        </n-step>
      </n-steps>
    </template>
  </n-modal>
</template>

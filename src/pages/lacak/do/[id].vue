<script setup lang="ts">
import { useMessage } from "naive-ui"
import { lacakDO } from "@/models/lacak/do"

const route = useRoute()
const dataRes = ref<any>({})
const tMessage = useMessage()
const isLoading = ref(true)
const isBtnLoading = ref(false)
const params = ref({
  limit: 1000,
  page: 1,
  do_id: route.params.id,
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await lacakDO
    .getLacakDO(params.value)
    .then((res: any) => {
      dataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

onMounted(() => {
  getData()
})
</script>

<template>
  <t-loading v-if="isLoading"></t-loading>
  <template v-else>
    <div class="body-tnt">
      <n-space justify="space-between">
        <n-space vertical>
          <n-h3 style="margin-bottom: 0px"
            >Lacak DO : {{ dataRes.list[0]?.do?.code }}</n-h3
          >
          <n-text style="opacity: 0.7"
            >Qty Manifest : {{ dataRes.list.length }}</n-text
          >
        </n-space>
      </n-space>
      <n-tabs type="segment">
        <n-tab-pane
          v-for="item in dataRes.list"
          :name="item.code"
          :tab="item.code"
          :key="item.id"
        >
          <div class="card-tnt">
            <template v-if="dataRes.total_data > 0">
              <n-space justify="center">
                <n-steps
                  vertical
                  style="
                    width: 1300px;
                    max-width: 100%;
                    position: relative;
                    margin-top: 0.5rem;
                  "
                  status="process"
                >
                  <t-lacak-do :manifest="item" />
                </n-steps>
              </n-space>
            </template>
            <template v-else>
              <n-space
                align="center"
                justify="center"
              >
                <n-h4>Log Ini Kosong</n-h4>
              </n-space>
            </template>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </template>
</template>

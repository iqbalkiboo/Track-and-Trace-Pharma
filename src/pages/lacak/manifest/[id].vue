<script setup lang="ts">
import { useMessage } from "naive-ui"
import { lacakManifestModel } from "@/models/lacak/manifest"
const route = useRoute()
const dataRes = ref<any>({})
const params = ref({
  sort: "desc",
  limit: 1000,
  page: 1,
  manifest_id: route.params.id,
})
const tMessage = useMessage()
const isLoading = ref(true)
const isBtnLoading = ref(false)

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await lacakManifestModel
    .getLacakManifest(params.value)
    .then(async (res: any) => {
      dataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      if (err.response) {
        const data = err.response.data
        tMessage.error(data.message)
      }
    })
}
const checkTypeDelivered = computed(() => {
  return dataRes.value.list?.some(
    (item: any) => item.status === "delivered" || item.status === "picked"
  )
})

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
            >Lacak Manifest: {{ dataRes.list[0]?.manifest?.code }}</n-h3
          >
          <n-text style="opacity: 0.7"
            >ID DO: {{ dataRes.list[0]?.do?.code }}</n-text
          >
          <n-text style="opacity: 0.7"
            >Tipe Pengiriman:
            {{ dataRes.list[0]?.attributes?.delivery_type || "-" }}</n-text
          >
        </n-space>
      </n-space>

      <div class="card-tnt">
        <template v-if="dataRes.total_data > 0">
          <n-space justify="center">
            <n-steps
              vertical
              style="width: 1300px; max-width: 100%; position: relative; margin-top: .5rem;"
              status="process"
            >
              <!-- <n-button
                v-if="checkTypeDelivered"
                type="primary"
                style="position: absolute; top: -45px; left: -24px"
                round
                strong
                secondary
                >Selesai</n-button
              > -->
              <n-step
                v-for="(item, i) in dataRes.list"
                :key="i"
              >
                <t-lacak-manifest :list="item" />
              </n-step>
              <!-- <n-button
                type="info"
                style="align-self: flex-start; position: absolute; bottom: -25px; left: -19px;"
                strong
                secondary
                round
              >
                Mulai
              </n-button> -->
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
    </div>
  </template>
</template>

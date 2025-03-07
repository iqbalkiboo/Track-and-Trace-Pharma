<script setup lang="ts">
import { useMessage } from "naive-ui"
import { lacakManifestModel } from "@/models/lacak/manifest"

const props = defineProps<{
  manifest: any
}>()

const dataRes = ref<any>({})
const tMessage = useMessage()
const isLoading = ref(true)
const isBtnLoading = ref(false)
// const currentRef = ref<number | null>(1)
// const current = currentRef
const params = ref({
  limit: 1000,
  page: 1,
  manifest_id: props.manifest.id,
})

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
onMounted(() => {
  getData()
})
</script>

<template>
  <template v-if="isLoading">
    <t-loading />
  </template>
  <template v-else>
    <n-space
      vertical
      :size="0"
    >
      <n-space align="center">
        <n-text>ID Manifest : </n-text>
        <n-text>{{ manifest.code }}</n-text>
      </n-space>
      <n-space align="center">
        <n-text>Tipe Pengiriman : </n-text>
        <n-text>{{ manifest.delivery_type }}</n-text>
      </n-space>
    </n-space>
    <div class="card-tnt">
      <template v-if="dataRes.total_data > 0">
        <n-space justify="center">
          <n-steps
            vertical
            style="
              width: 1300px;
              max-width: 100%;
              position: relative;
              margin-top: 2.5rem;
            "
          >
            <n-button
              type="primary"
              style="position: absolute; top: -45px; left: -24px"
              round
              strong
              secondary
              >Selesai</n-button
            >
            <n-step
              v-for="(item, i) in dataRes.list"
              :key="i"
            >
              <t-lacak-manifest :list="item" />
            </n-step>
            <n-button
              type="info"
              style="
                align-self: flex-start;
                position: absolute;
                bottom: -25px;
                left: -19px;
              "
              strong
              secondary
              round
            >
              Mulai
            </n-button>
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
  </template>
</template>

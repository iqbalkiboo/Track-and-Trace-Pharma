<script lang="ts" setup>
import type { NInput } from "naive-ui"
import { agregasiModel } from "@/models/pengiriman/agregasi"
import { useMessage } from "naive-ui"
import { onMounted } from "vue"

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    packing_id?: any
    detailDO?: any
  }>(),
  {
    show: false,
  }
)

// const tMessage = useMessage()
const isLoading = ref(false)
const isBtnLoading = ref(false)
const router = useRouter()
const dataRes = ref<any>({})
const tMessage = useMessage()
const route = useRoute()
const emits = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
}>()
async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await agregasiModel
    .getDetailPacking(props.packing_id)
    .then(async (res: any) => {
      dataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((e) => {
      isLoading.value = false
      isBtnLoading.value = false
      tMessage.error(e)
    })
}

onUpdated(() => {
  input.value?.focus()
})

onMounted(() => {
  getData()
})
const input = ref<typeof NInput | null>(null)

async function handlePrintLabel() {
  localStorage.setItem("is_label_open", "0")
  localStorage.setItem("label-detail", JSON.stringify(dataRes.value))
  localStorage.setItem("label-do", JSON.stringify(props.detailDO))
  localStorage.setItem("label-type", route.params.type.toString())
  const a = document.createElement("a")
  a.target = "_blank"
  a.href = router.resolve({ name: "print-labels-agregasi" }).href
  a.click()
  a.remove()

  const payload = {
    is_printed: true,
  }
  try {
    await agregasiModel.printLabel(payload, props.packing_id as string)
  } catch (e: any) {
    if (e.response) {
      const data = e.response.data.message()
      tMessage.error(data)
    }
  }
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    auto-focus
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 550px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space
      vertical
      :size="14"
    >
      <n-space
        align="center"
        justify="space-between"
      >
        <div style="font-size: 16px; font-weight: 500">Pratinjau</div>
        <n-button
          @click="handlePrintLabel"
          type="primary"
          class="button-tnt"
          >Cetak Label</n-button
        >
      </n-space>
      <n-row>
        <n-col :span="12">
          <n-space
            :size="0"
            vertical
            justify="center"
            class="card-tnt"
            style="margin-top: 1rem;"
          >
            <n-space :size="0">
              <n-text style="display: inline-block; width: 75px">Kode {{ route.params.type === 'crossdocking' ? 'DO' : 'Invoice' }}</n-text>
              <n-space>
                <n-text>:</n-text>
                <n-text>{{ dataRes?.do?.code }}</n-text>
              </n-space>
            </n-space>
            <n-space :size="0">
              <n-text style="display: inline-block; width: 75px">ID Packing</n-text>
              <n-space>
                <n-text>:</n-text>
                <n-text>{{ dataRes.code }}</n-text>
              </n-space>
            </n-space>
            <n-space :size="0">
              <n-text style="display: inline-block; width: 75px">Tujuan</n-text>
              <n-space>
                <n-text>:</n-text>
                <n-text>{{ $props.detailDO?.customer?.name }}</n-text>
              </n-space>
            </n-space>
            <n-space :size="0">
              <n-text style="display: inline-block; width: 75px">Alamat</n-text>
              <n-space>
                <n-text>:</n-text>
                <n-text>{{ $filters.isEmpty($props.detailDO?.destination?.address?.province?.name) }}</n-text>
              </n-space>
            </n-space>
          </n-space>
        </n-col>
        <n-col :span="12">
          <n-space justify="center">
            <vue-qrcode
              :value="dataRes.code"
              :options="{
                errorCorrectionLevel: 'Q',
                width: 200,
              }"
            ></vue-qrcode>
          </n-space>
        </n-col>
      </n-row>
    </n-space>
  </n-modal>
</template>

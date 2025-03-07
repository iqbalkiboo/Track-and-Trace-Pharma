<script setup lang="ts">
import { useMessage } from "naive-ui"
import { serializeModel } from "@/models/produksi/serialisasi"
import moment from "moment"

const props = withDefaults(
  defineProps<{
    show: boolean
    afterSend: boolean
    serializeLevelDataRes: any
    printerDriverDataRes: any
    detailProductDataRes: any
    detailDataRes: any
    levelData: number
  }>(),
  { show: false }
)

const emits = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close"): void
  (e: "click:see-data"): void
  (e: "click:send-data"): void
  (e: "click:print"): void
  (e: "click:reset-insert"): void
  (e: "click:log-print"): void
}>()

const route = useRoute()
const tMessage = useMessage()
const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailStatusDataRes = ref<any>({})
const dataSns = ref<any>([{}])
const levelParams: any = {
  level: 1,
  page: 1,
  limit: -1,
  reception_id: route.params.id
}


// watch(
//   () => props.show,
//   (value) => {
//     if (value) {
//       getStatusPrinterDriver()
//     }
//   }
// )

onMounted(() => {
  getSns()
})

async function getSns() {
  
  levelParams.level = route.query.level

  await serializeModel.getSerializeLevel(levelParams)
    .then((res) => {
      isLoading.value = false
      dataSns.value = res?.data?.list.map((value : any) => 
        value.code
      )
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}


async function getStatusPrinterDriver() {
  const printer_key = localStorage.getItem("select-printer") || 0
  const payload: any = {
    printer_key,
    data : {
      nie : props.detailProductDataRes.nie.number,
      batch : props.detailDataRes.batch_number,
      mfg : moment(props.detailDataRes?.date?.manufacture_date).format("D MMM yyyy"),
      ed : moment(props.detailDataRes?.date?.expired_date).format("D MMM yyyy"),
      het : props.detailDataRes.product?.highest_retail_price.toString(),
      sns : dataSns.value,
      qty : props.serializeLevelDataRes.list[0].serialize.maximum.toString(),
      printer_id: props.printerDriverDataRes[printer_key]?.id
    }
  }

  isLoading.value = true
  await serializeModel
    .postDriverPrinters(payload)
    .then((res) => {
      isLoading.value = false
      detailStatusDataRes.value = res.data
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
        tMessage.error(data.message)
      }
      isLoading.value = false
    })
}

const statusPrinter = computed(() => {
  if (detailStatusDataRes.value?.message) {
    return detailStatusDataRes.value?.message[0]?.status
  }
})



const handleClickClose = () => {
  setTimeout(() => {
    emits("click:close")
  }, 100)
}

const handleClickSeeData = () => {
  emits("click:see-data")
}

const handleClickSendData = () => {
  emits("click:send-data")
}

const handleClickShowPrint = () => {
  emits("click:print")
  getStatusPrinterDriver()
}

const handleClickResetInsert = () => {
  emits("click:reset-insert")
}

const handleClickShowLogPrint = () => {
  emits("click:log-print")
}

</script>

<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
  >
    <n-card
      style="width: 620px; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space
        vertical
        :size="24"
      >
        <n-space
          vertical
          :align="'start'"
        >
          <n-h3 style="margin-bottom: 0">Cetak QR Code Level {{ levelData }} s</n-h3>
        </n-space>
        <n-space justify="space-between">
          <n-text>Total {{ serializeLevelDataRes.list.length }}</n-text>
<!--
          <n-tag
            :bordered="false"
            round
          >
            Status Print : {{ statusPrinter }}
          </n-tag>
-->
        </n-space>
        <n-space
          v-if="!$props.afterSend"
          justify="center"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            @click.prevent="handleClickClose"
            >Batalkan</n-button
          >
          <n-button
            type="primary"
            class="button-tnt"
            @click.prevent="handleClickSeeData"
            >Lihat Data</n-button
          >
          <n-button
            :loading="isBtnLoading"
            color="#219653"
            class="button-tnt"
            @click.prevent="handleClickShowPrint"
            >Cetak</n-button
          >
          <n-button
            :loading="isBtnLoading"
            type="warning"
            class="button-tnt"
            @click.prevent="handleClickResetInsert"
            >Alur Ulang</n-button
          >
        </n-space>
        <n-space
          v-else
          justify="center"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            @click.prevent="handleClickClose"
            >Batalkan</n-button
          >
          <n-button
            :loading="isBtnLoading"
            color="#219653"
            class="button-tnt"
            @click.prevent="handleClickShowPrint"
            >Cetak</n-button
          >
        </n-space>
        <n-space>
          <n-button
            text
            color="#828282"
            @click.prevent="handleClickShowLogPrint"
            >Report Print</n-button
          >
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

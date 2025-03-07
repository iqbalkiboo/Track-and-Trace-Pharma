<script setup lang="ts">
import { serializeModel } from "@/models/produksi/serialisasi"
import moment from "moment";
import { useMessage } from "naive-ui"
import { useAuthStore } from "@/models/auth"

const props = withDefaults(
  defineProps<{
    show: boolean
    serializeLevelDataRes: any
    serialArr: any
    detailProductDataRes: any
    printerDriverDataRes: any
    detailDataRes: any
    levelData: number
  }>(),
  { show: false }
)

const authStore = useAuthStore()
const tMessage = useMessage()
const route = useRoute()

const emits = defineEmits<{
  (e: "cancelClick"): void
  (e: "confirmClick"): void
  (e: "update:show", type: boolean): void
}>()

const percentage = ref(0)
const btnLoading = ref(false)
const intervalId = ref<any>(null)
const printerStatus = ref<"stop" | "resume" | null>("stop")

const dataSns = ref<any>([{}])
const levelParams: any = {
  level: 1,
  page: 1,
  limit: -1,
  reception_id: route.params.id
}

onMounted(() => {
  getSns()
})

watch(
  () => props.show,
  (value) => {
    if (value) {
      handlePrintDriverPrinter()

      intervalId.value = setInterval(() => {
        authStore.resetTimeout()
        const printer_key = localStorage.getItem("select-printer") || 0
        const payload: any = {
          printer_key,
          product: props.detailProductDataRes.item_code,
          serializes: props.serialArr,
          data : {
            nie : props.detailProductDataRes.nie.number,
            batch : props.detailDataRes.batch_number,
            mfg : moment(props.detailDataRes?.date?.manufacture_date).format("DD/MM/YYYY"),
            ed : moment(props.detailDataRes?.date?.expired_date).format("DD/MM/YYYY"),
            het : props.detailDataRes.product?.highest_retail_price.toString(),
            sns : dataSns.value,
            serializes: props.serialArr,
            qty : props.serializeLevelDataRes.list[0].serialize.maximum.toString(),
            printer_id: props.printerDriverDataRes[printer_key]?.id
          },
          format_date: "Date",
        }
        serializeModel.postReportDriverPrinter(payload, "void").then((res: any) => {
          const countReportPrinterDriver = res.data.message.length
          const countSerializeLevel = props.serialArr.length
          percentage.value =
            (countReportPrinterDriver / countSerializeLevel) * 100
          if (countReportPrinterDriver === countSerializeLevel) {
            clearInterval(intervalId.value)
          }
        })
      }, 6000)
    } else {
      if (intervalId.value) {
        clearInterval(intervalId.value)
      }
    }
  }
)

async function getSns() {
  
  levelParams.level = route.query.level

  await serializeModel.getSerializeLevel(levelParams)
    .then((res) => {
      dataSns.value = res?.data?.list.map((value : any) => 
        value.id
      )
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

const onUploadProgress = (progressEvent: any) => {
  const { loaded, total } = progressEvent
  let percent = Math.floor((loaded * 100) / total)
  percentage.value = percent
  console.log(`${loaded} bytes of ${total} bytes. ${percent}%`)
}

const handlePrintDriverPrinter = async () => {
  const printer_key = localStorage.getItem("select-printer") || 0
  // const printer_detail = props.detailProductDataRes.serialize.print
  const payload: any = {
    printer_key,
    product: props.detailProductDataRes.item_code,
    serializes: props.serialArr,
    data : {
      nie : props.detailProductDataRes.nie.number,
      batch : props.detailDataRes.batch_number,
      mfg : moment(props.detailDataRes?.date?.manufacture_date).format("DD/MM/YYYY"),
      ed : moment(props.detailDataRes?.date?.expired_date).format("DD/MM/YYYY"),
      het : props.detailDataRes.product?.highest_retail_price.toString(),
      sns : dataSns.value,
      qty : props.serializeLevelDataRes.list[0].serialize.maximum.toString(),
      printer_id: printer_key
    },
    format_date: "Date",
  }
  await serializeModel.postPrintDriverPrinter(payload).catch((e) => {
    if (e.response) {
      const data = e.response.data
      tMessage.error(data.message)
    }
  })
}

const confirmClick = async () => {
  const printer_key = localStorage.getItem("select-printer")
  const payload: any = {
    printer_key,
  }
  await serializeModel
    .postPauseDriverPrinter(payload)
    .then(() => {
      emits("confirmClick")
      emits("update:show", false)
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
        emits("update:show", false)
        tMessage.error(data.message)
      }
    })
    .finally(() => {
      btnLoading.value = false
    })
}

async function handlePausePrint() {
  const printer_key = localStorage.getItem("select-printer")
  const payload: any = {
    printer_key,
  }
  btnLoading.value = true
  await serializeModel
    .postPauseDriverPrinter(payload)
    .then(() => {
      tMessage.success("Berhasil Menjeda")
      printerStatus.value = "resume"
      emits("update:show", false)
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
        emits("update:show", false)
        tMessage.error(data.message)
      }
    })
    .finally(() => {
      btnLoading.value = false
    })
}

function handlePauseOrResume() {
  if (printerStatus.value === "stop") {
    handlePausePrint()
  }
  if (printerStatus.value === "resume") {
    handleResumePrint()
  }
}

async function handleResumePrint() {
  const printer_key = localStorage.getItem("select-printer")
  const payload: any = {
    printer_key,
  }
  btnLoading.value = true
  await serializeModel
    .postResumeDriverPrinter(payload)
    .then(() => {
      tMessage.success("Berhasil Lanjutkan")
      printerStatus.value = "stop"
      emits("update:show", false)
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
        emits("update:show", false)
        tMessage.error(data.message)
      }
    })
    .finally(() => {
      btnLoading.value = false
    })
}
</script>

<template>
  <n-modal
    :show="show"
    @update-show="$emit('update:show', $event)"
  >
    <n-card
      style="width: 790px; --n-border-radius: 10px"
      content-style="padding: 10px 28px 28px 28px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical>
        <h3 style="display: block; font-weight: 500; margin-bottom: 8px">
          Cetak QR Code Level {{ levelData }}
        </h3>
        <n-text style="display: block; font-size: 12px; margin-bottom: 5px">
          {{
            `Cetak ${serialArr.length} dari ${serializeLevelDataRes.list.length}`
          }}
        </n-text>
        <n-progress
          type="line"
          :color="'#2D9CDB'"
          :percentage="percentage"
          :indicator-placement="'inside'"
          processing
        />

        <n-space
          justify="center"
          style="margin-top: 24px"
        >
<!--
          <n-button
            color="#828282"
            class="button-tnt"
            @click.prevent="handlePauseOrResume"
            :loading="btnLoading"
            :disabled="percentage >= 100"
            >{{ printerStatus === "stop" ? "Menjeda" : "Lanjutkan" }}
          </n-button>
-->
          <n-button
            :type="percentage >= 100 ? 'primary' : 'error'"
            class="button-tnt"
            :loading="btnLoading"
            @click.prevent="confirmClick"
            >{{ percentage >= 100 ? "Selesai" : "Batalkan Cetak" }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>
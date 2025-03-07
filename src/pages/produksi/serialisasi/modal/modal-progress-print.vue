<script setup lang="ts">
import { serializeModel } from "@/models/produksi/serialisasi"
import moment from "moment";
import { useMessage } from "naive-ui"
import { useAuthStore } from "@/models/auth"
import { toRaw } from "vue"

const props = withDefaults(
  defineProps<{
    show: boolean
    serializeLevelDataRes: any
    serialArr: any
    detailProductDataRes: any
    printerDriverDataRes: any
    detailDataRes: any
    dataSerial: any
    printTypeChecked: string
  }>(),
  { show: false }
)

const authStore = useAuthStore()
const tMessage = useMessage()
const route = useRoute()
const arrIdSerialize = ref<any>([])

const emits = defineEmits<{
  (e: "cancelClick"): void
  (e: "confirmClick"): void
  (e: "update:show", type: boolean): void
  (e: "update:serial", value: any): void
}>()

const totalPrinted = ref(0)
const percentage = ref(0)
const btnLoading = ref(false)
const intervalId = ref<any>(null)
const printerStatus = ref<"stop" | "resume" | null>("stop")

const dataSns = ref<any>([{}])
const levelParams: any = {
  level: 1,
  page: 1,
  limit: -1,
  reception_id: route.params.id,
  is_printed: 0,
  status: 'packing_done,ready_to_print,pending'
}

onMounted(() => {
  getSns()
})

watch(
  () => props.show,
  (value) => {
    if (value) {
      handlePrintDriverPrinter()
      const level = route.query.level
      const from = props.dataSerial.from - 1
      const to = props.dataSerial.to - from
      intervalId.value = setInterval(() => {
        authStore.resetTimeout()
        const printer_key = localStorage.getItem("select-printer") || 0
        const payload: any = {
          printer_key,
          product: props.detailProductDataRes.item_code,
          serializes: level === "1" ? [] : (props.printTypeChecked === "all" ? props.serialArr : props.serialArr.slice(props.dataSerial.from, props.dataSerial.to)),
          data : {
            nie : props.detailProductDataRes.nie.number,
            batch : props.detailDataRes.batch_number,
            lot_number: props.serializeLevelDataRes.list[0].lot_number,
            mfg : moment(props.detailDataRes?.date?.manufacture_date).format("DD/MM/YYYY"),
            ed : moment(props.detailDataRes?.date?.expired_date).format("DD/MM/YYYY"),
            het : props.detailDataRes.product?.highest_retail_price.toString(),
            sns : props.printTypeChecked === "all" ? dataSns.value : dataSns.value.slice(props.dataSerial.from, props.dataSerial.to),
            serializes: level === "1" ? [] : (props.printTypeChecked === "all" ? props.serialArr : props.serialArr.slice(props.dataSerial.from, props.dataSerial.to)),
            qty : props.serializeLevelDataRes.list[0].serialize.maximum.toString(),
            printer_id: props.printerDriverDataRes[printer_key]?.id
          },
          format_date: "Date",
        }

        let status = "main"
        if (level === "1") status = "summary"
        
        const length = 
          level === "1" ? 
            props.serialArr.length : 
            props.printTypeChecked === "all" ? 
              props.serialArr.length : 
              props.serialArr.slice(props.dataSerial.from, props.dataSerial.to).length
        serializeModel.postReportDriverPrinter(payload, status).then((res: any) => {
          const countReportPrinterDriver = res.data.message.printed || res.data.message['length'] || 0
          totalPrinted.value = countReportPrinterDriver
          const countSerializeLevel = length
          percentage.value =
            (countReportPrinterDriver / countSerializeLevel) * 100
          if (countReportPrinterDriver === countSerializeLevel) {
            clearInterval(intervalId.value)
          }
        })
      }, 5000)
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
  const level = route.query.level
  const from = props.dataSerial.from - 1
  const to = props.dataSerial.to - from
  // const printer_detail = props.detailProductDataRes.serialize.print
  await getSns()
  const payload: any = {
    printer_key,
    product: props.detailProductDataRes.item_code,
    serializes: level === "1" ? props.serialArr : props.printTypeChecked === "all" ? props.serialArr : props.serialArr.slice(props.dataSerial.from, props.dataSerial.to),
    data : {
      nie : props.detailProductDataRes.nie.number,
      batch : props.detailDataRes.batch_number,
      lot_number: props.serializeLevelDataRes.list[0].lot_number,
      mfg : moment(props.detailDataRes?.date?.manufacture_date).format("DD/MM/YYYY"),
      ed : moment(props.detailDataRes?.date?.expired_date).format("DD/MM/YYYY"),
      het : props.detailDataRes.product?.highest_retail_price.toString(),
      sns : props.printTypeChecked === "all" ? dataSns.value : dataSns.value.slice(props.dataSerial.from, props.dataSerial.to),
      serializes: level === "1" ? props.serialArr : props.printTypeChecked === "all" ? props.serialArr : props.serialArr.slice(props.dataSerial.from, props.dataSerial.to),
      qty : props.serializeLevelDataRes.list[0].serialize.maximum.toString(),
      printer_id: props.printerDriverDataRes[printer_key]?.id
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
  const printer_key = localStorage.getItem("select-printer") || 0
  const payload: any = {
    printer_key,
  }
  const formPrint = new FormData()
  formPrint.append("reception_id", levelParams.reception_id)
  formPrint.append("level", levelParams.level)
  const formData = new FormData()
  formData.append("kind", "1")
  formData.append("type", "code")

  const from = props.dataSerial.from - 1
  const to = props.dataSerial.to - from
  
  const payloadReport: any = {
    printer_key,
    product: props.detailProductDataRes.item_code,
    serializes: props.printTypeChecked === "all" ? props.serialArr : props.serialArr.slice(from, to),
    data : {
      nie : props.detailProductDataRes.nie.number,
      batch : props.detailDataRes.batch_number,
      mfg : moment(props.detailDataRes?.date?.manufacture_date).format("DD/MM/YYYY"),
      ed : moment(props.detailDataRes?.date?.expired_date).format("DD/MM/YYYY"),
      het : props.detailDataRes.product?.highest_retail_price.toString(),
      sns : props.printTypeChecked === "all" ? dataSns.value : dataSns.value.slice(from, to),
      serializes: props.printTypeChecked === "all" ? props.serialArr : props.serialArr.slice(from, to),
      qty : props.serializeLevelDataRes.list[0].serialize.maximum.toString(),
      printer_id: props.printerDriverDataRes[printer_key]?.id
    },
    format_date: "Date",
  }
  
  let totalVoid = 0
  await serializeModel.postReportDriverPrinter(payloadReport, "void").then((res: any) => {
    totalVoid = res.data.length
    if (totalVoid) {
      res.data.forEach((code: string) => {
        formData.append("ids[]", code)
      });
    }
  })

  if (totalVoid) {
    await serializeModel
      .voidSerialize(formData)
      .then(() => {
        emits("confirmClick")
      })
      .catch((err: any) => {
        console.log('error voiding', err)
      })
  }
 
  if (props.printTypeChecked !== "all") {
    await getSns()
    dataSns.value.slice(props.dataSerial.from, props.dataSerial.to).forEach((code: string) => {
      formPrint.append("ids[]", code)
    });
  }

  await serializeModel
    .printSerialize(formPrint)
    .then(() => {
      emits("confirmClick")
      percentage.value = 0
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
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
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
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
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
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
          Cetak QR Code Level {{ levelParams.level }}
        </h3>
        <n-text v-if="props.printTypeChecked === 'all'" style="display: block; font-size: 12px; margin-bottom: 5px">
          {{
            `Cetak ${totalPrinted} dari ${serialArr.length}`
          }}
        </n-text>
        <n-text v-else style="display: block; font-size: 12px; margin-bottom: 5px">
          {{
            `Cetak ${totalPrinted} dari ${props.dataSerial.to}`
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
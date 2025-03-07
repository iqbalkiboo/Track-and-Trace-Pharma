<script setup lang="ts">
import axios from "axios"
import { useMessage } from "naive-ui"
import { AlertCircleOutline, CheckmarkCircleOutline } from "@vicons/ionicons5"
import { serializeModel } from "@/models/produksi/serialisasi"
import moment from "moment"
import "moment/dist/locale/id"
import { auth } from "@/models/auth"
import ModalPrinterList from "../modal/modal-printer-list.vue"
import ModalIntegrasi from "../modal/modal-integrasi.vue"
import ModalProgressPrint from "@/pages/produksi/serialisasi/modal/modal-progress-print.vue"
import ModalSettingPrint from "../modal/modal-setting-print.vue"
import ModalDataIntegrasii from "@/pages/produksi/serialisasi/modal/modal-data-integrasi.vue"
import ModalSeeDataPrint from "../modal/moda-see-data-print.vue"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const isQrLoading = ref(false)
const detailDataRes = ref<any>({})
const detailProductDataRes = ref<any>({})
const serializeLevelDataRes = ref<any>({})
const printerDriverDataRes = ref<any>({})
const indexSerializeLevel = ref(0)
const printType = ref('all')
const tempData = ref<any>({})
const serialArr = ref<any>([])
const totalSerialPrinterDriver = computed(() => serialArr.value.length)
const levelParams = ref({
  level: 1,
  page: 1,
  limit: 10,
  reception_id: route.params.id,
  is_printed: 0,
  status: 'packing_done,ready_to_print,pending'
})
const printerDriverParams = ref({
  level: route.query.level,
})

const printValue = ref<any>({
  level: 0,
  qty: 0
})
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: ""
})
const modalPrinterList = ref({
  show: false
})
const modalIntegrasi = ref({
  show: false,
  isAfterSend: false
})
const modalSeeData = ref({
  show: false
})
const modalDataIntegrasi = ref({
  show: false,
  isLog: false
})
const modalSettingPrint = ref({
  show: false
})
const modalProgressBarPrint = ref({
  show: false
})

onMounted(async () => {
  authData.value = auth.getAuth()

  await getData()
  if (!route?.query?.level)
    return router.push({ query: { level: detailDataRes.value?.serialize[0].level } })
  indexSerializeLevel.value = parseInt(route.query.level as string ?? detailDataRes.value?.serialize[0].level)
})

async function getData() {
  getDetailSerializeProduct()
  await getDetailSerialize()
  getPrinterDriver()
}

async function getDetailSerialize() {
  isLoading.value = true
  const id = route.params.id as string
  await serializeModel
    .getDetailSerialize(id)
    .then((res) => {
      detailDataRes.value = res.data
      getSerializeLevel(
        parseInt(route.query.level as string) ??
        detailDataRes.value.serialize[0].level
      )
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDetailSerializeProduct() {
  const id = route.params.id as string
  await serializeModel
    .getDetailSerializeProduct(id)
    .then((res) => {
      detailProductDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getSerializeLevel(level: number) {
  isQrLoading.value = true
  isBtnLoading.value = true
  levelParams.value.level = level
  return await serializeModel
    .getSerializeLevel(levelParams.value)
    .then((res) => {
      serializeLevelDataRes.value = res.data
      isLoading.value = false
      isQrLoading.value = false
      isBtnLoading.value = false
      return res.data
    })
    .catch((err: any) => {
      isLoading.value = false
      isQrLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function updatePageSizeSerializeLevel(pageSize: number) {
  levelParams.value.page = 1
  levelParams.value.limit = pageSize
  getSerializeLevel(levelParams.value.level)
}

function handleClickLevel(index: number, level: number) {
  indexSerializeLevel.value = index
  levelParams.value.limit = 10
  router.push({ query: { level } })
  getSerializeLevel(level)
}

function setPrintValue(level: any, qty: any) {
  printValue.value.level = level
  printValue.value.qty = qty
  showConfirmFeedback()
}

async function printSerialize() {
  isBtnLoading.value = true
  const id = String(route.params.id)

  const formData = new FormData()
  formData.append("reception_id", id)
  formData.append("level", printValue.value.level)
  
  const data = await getSerializeLevel(levelParams.value.level)
  serializeModel
    .printSerialize(formData)
    .then(async () => {
      isBtnLoading.value = false
      hideFeedback()

      if (indexSerializeLevel.value === 0) {
        setTimeout(() => {
          showSuccessFeedback()
        }, 300)
      } else {
        levelParams.value.limit =
          serializeLevelDataRes.value?.total_data ?? 1000

        localStorage.setItem("is_label_open", "0")
        localStorage.setItem("is_level_print", JSON.stringify(levelParams.value.level))
        localStorage.setItem(
          "config",
          JSON.stringify(detailProductDataRes.value?.serialize)
        )
        localStorage.setItem(
          "data",
          JSON.stringify(detailProductDataRes.value)
        )
        localStorage.setItem(
          "detail",
          JSON.stringify(detailDataRes.value)
        )
        localStorage.setItem("labels", JSON.stringify(data.list))

        const a = document.createElement("a")
        a.target = "_blank"
        a.href = router.resolve({ name: "print-labels" }).href
        a.click()
        a.remove()
      }
    })
    .catch((err: any) => {
      const msg = err.message
      if (err.response?.data) {
        const data = err.response.data
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showFailedFeedback(data)
        }, 300)
      } else tMessage.error(msg)
    })
}

function getPrinterDriver() {
  isLoading.value = true
  serializeModel
    .getDriverPrinters(printerDriverParams.value)
    .then((res: any) => {
      printerDriverDataRes.value = res
      isLoading.value = false
    })
    .catch((e) => {
      if (e.response) {
        const data = e.response.data
        tMessage.error(data.message)
      }
      isLoading.value = false
    })
}


function handleToggleModalPrinter(show: boolean) {
  modalPrinterList.value.show = show
}

function handleToggleModalPrinterList(show: boolean) {
  modalPrinterList.value.show = show
}

function handleToggleModalIntegrasi(show: boolean) {
  modalIntegrasi.value.show = show
  modalIntegrasi.value.isAfterSend = false
}

function handleToggleModalDataIntegrasi(show: boolean) {
  modalDataIntegrasi.value.show = show
  modalDataIntegrasi.value.isLog = true
}

function handleToggleModalSeeDataPrint(show: boolean) {
  modalDataIntegrasi.value.show = show
  modalSeeData.value.show = true
}

function handleClickSendData() {
  tFeedbackRef.value.type = "send-data"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Kirim Data Berhasil"
  tFeedbackRef.value.subtitle = `Selamat ${serializeLevelDataRes.value.list.length} QR Code berhasil dikirimkan`
  tFeedbackRef.value.show = true
  setTimeout(() => {
    tFeedbackRef.value.show = false
    modalIntegrasi.value.isAfterSend = true
  }, 3000)
}

function handleToggleModalSettingPrint(show: boolean) {
  modalSettingPrint.value.show = show
}

async function handleupdateSerialTotal(value: any) {
  tempData.value = value
  if (value.form !== 0 && value.to !== 0) {

    const paramsLevel = {
      page: 1,
      limit: -1,
      level: levelParams.value.level,
      reception_id: route.params.id,
      is_print: 1,
      is_printed: 0,
      status: 'packing_done,ready_to_print,pending'
    }
    isLoading.value = true
    isQrLoading.value = true
    isBtnLoading.value = true
    await serializeModel
      .getSerializeLevel(paramsLevel)
      .then((res) => {
        isLoading.value = false
        isQrLoading.value = false
        isBtnLoading.value = false
        serialArr.value = res.data.list
      })
      .catch((err: any) => {
        isLoading.value = false
        isQrLoading.value = false
        isBtnLoading.value = false
        const data = err.response.data
        tMessage.error(data.message)
      })
  }
}

function handleShowConfirmPrint(value: string) {
  printType.value = value
  if (totalSerialPrinterDriver) {
    tFeedbackRef.value.type = "confirm-print"
    tFeedbackRef.value.hideIcon = true
    tFeedbackRef.value.title = "Konfirmasi Cetak Label"
    // tFeedbackRef.value.subtitle = `Anda akan mencetak ${totalSerialPrinterDriver.value} QR Code`
    tFeedbackRef.value.subtitle = `Apakah Anda yakin akan mencetak QR Code?`
    tFeedbackRef.value.show = true
  }
}

function handlePrintSerializeLowest() {
  tFeedbackRef.value.show = false
  handleToggleModalSettingPrint(false)
  handleToggleModalIntegrasi(false)
  modalProgressBarPrint.value.show = true
}

function handleShowResetInsert() {
  tFeedbackRef.value.type = "reset-insert"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi Reset Insert Code"
  tFeedbackRef.value.subtitle = `Anda akan melakukan reset insert code`
  tFeedbackRef.value.show = true
}

function handleConfirmResetInsert() {
  tFeedbackRef.value.show = false

  const printer_key = localStorage.getItem("select-printer")
  const payload: any = {
    printer_key
  }
  isLoading.value = true
  serializeModel.postResetDriverPrinter(payload).then(() => {
    tFeedbackRef.value.type = "success"
    tFeedbackRef.value.hideIcon = true
    tFeedbackRef.value.title = "Code Telah Direset"
    tFeedbackRef.value.subtitle = `${serializeLevelDataRes.value.list.length} QR Code telah direset`
    tFeedbackRef.value.show = true
    isLoading.value = false
  }).catch((e) => {
    if (e.response) {
      const data = e.response.data
      tMessage.error(data.message)
    }
  })
}

function handleShowLogPrint() {
  modalDataIntegrasi.value.show = true
  modalDataIntegrasi.value.isLog = true
}

async function handleConfirmClick() {
  getSerializeLevel(levelParams.value.level)
  await getData()
  modalPrinterList.value.show = false
  modalIntegrasi.value.show = false
  modalProgressBarPrint.value.show = false
}

function tesAxios() {
  const params = {
    user: "demo",
    pass: "12345678"
  }
  axios.post("https://code.iotaroundyou.my.id/api/login", params)
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi Cetak"
  tFeedbackRef.value.subtitle = `Anda akan mencetak ${printValue.value.qty} kode`
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.title = "Berhasil Cetak"
  tFeedbackRef.value.subtitle = "Proses cetak telah selesai dilakukan"
  tFeedbackRef.value.show = true
}

function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = "failed"
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = "#EB5757"
  tFeedbackRef.value.icon = AlertCircleOutline
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-h2 style="margin-bottom: 16px">{{
          detailDataRes.product?.long_name
        }}
      </n-h2>
      <n-grid cols="3" item-responsive responsive="screen" x-gap="16" y-gap="16">
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Perintah Kemas : </span>
                <span style="font-weight: 500">{{ detailDataRes.pk_id }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Kode Produk : </span>
                <span style="font-weight: 500">{{
                    detailDataRes.product?.item_code
                  }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>UOM : </span>
                <span style="font-weight: 500">{{
                    detailProductDataRes.uom?.name
                  }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Batch Produksi : </span>
                <span style="font-weight: 500">{{
                    detailDataRes.batch_number
                  }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Qty : </span>
                <span style="font-weight: 500">{{
                    detailDataRes.serialize ? detailDataRes.serialize[0].qty : 0
                  }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
      </n-grid>
      <div style="margin-top: 34px">
        <n-grid cols="6" item-responsive responsive="screen" x-gap="26" y-gap="16">
          <n-grid-item span="3 s:2 m:1" v-for="(serialize, i) in detailDataRes.serialize" :key="i">
            <n-button :loading="isBtnLoading" block color="#219653"
                      :ghost="levelParams.level !== (serialize as any).level"
                      class="button-tnt" @click="handleClickLevel(i, (serialize as any).level)">
              {{ (serialize as any).name }} ({{ (serialize as any).generated > 0 ? (serialize as any).generated - (serialize as any).total_printed - (serialize as any).total_print_void : 0 }})
            </n-button>
          </n-grid-item>
        </n-grid>
      </div>
      <div class="card-tnt">
        <template v-if="isQrLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <n-space vertical :size="20">
            <n-grid cols="2" item-responsive responsive="screen">
              <n-grid-item span="2 s:1">
                <n-h6 style="margin-bottom: 0; margin-top: 0">Level {{ levelParams.level }}</n-h6>
                <n-text style="margin-bottom: 0; margin-top: 0">Total {{ serializeLevelDataRes.list?.length }}</n-text>
              </n-grid-item>
              <n-grid-item span="2 s:1">
                <n-space justify="end">
                  <!-- v-if="levelParams.level === (detailDataRes?.serialize ? detailDataRes.serialize[0].level : 0)" -->
                  <n-button
                    type="primary"
                    class="button-tnt"
                    @click.prevent="handleToggleModalPrinterList(true)"
                  >
                    Cetak Label
                  </n-button>
                  <!-- <n-button color="#F2C94C" text-color="#1E1E1E" class="button-tnt" @click.prevent="
                    setPrintValue(
                      levelParams.level,
                      serializeLevelDataRes.total_data
                    )
                  ">
                    Cetak Label
                  </n-button> -->
                </n-space>
              </n-grid-item>
            </n-grid>
            <div id="section-to-print">
              <n-grid cols="20" item-responsive responsive="screen" :x-gap="16" :y-gap="16">
                <n-grid-item span="20 m:4 s:10" v-for="(serialize, i) in serializeLevelDataRes.list" :key="i">
                  <n-card style="border-radius: 12px; margin-top: 0" content-style="padding: 8px">
                    <div class="qr-box">
                      <div style="width: 100%; margin: auto">
                        <template v-if="
                          detailProductDataRes.serialize?.kind.value !==
                          'authentication_gtin' && (indexSerializeLevel - 1) !== 0
                        ">
                          <div>
                            <div class="qr-label">
                              <p v-if="
                                detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .nie === true
                              "
                                 style="width: 54px; display: flex; justify-content: space-between;"
                                 class="qr-text">
                                <div>
                                  {{ detailProductDataRes?.serialize?.kind?.value === "authentication_gtin" ? "GTIN" : "NIE"
                                  }}
                                </div>
                                <div>:</div>
                              </p>
                              <p v-if="
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  false) ||
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.attributes
                                    .nie === true)
                              "
                                 style="width: 60%"
                                 class="qr-text"
                              >
                                <template v-if="
                                  detailProductDataRes.serialize?.kind.value ===
                                  'authentication_gtin'
                                ">
                                  {{
                                    detailProductDataRes.serialize?.kind[
                                    "level" + levelParams.level
                                      ]
                                  }}
                                </template>
                                <template v-else>
                                  {{ detailProductDataRes.nie?.number }}
                                </template>
                              </p>
                            </div>
                            <div class="qr-label">
                              <p v-if="
                                detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .batch === true
                              "
                                 style="width: 54px; display: flex; justify-content: space-between;"
                                 class="qr-text"
                              >
                                <div>BATCH</div>
                                <div>:</div>
                              </p>
                              <p v-if="
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  false) ||
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.attributes
                                    .batch === true)
                              " class="qr-text">
                                {{ detailDataRes.batch_number }}
                                <span v-if="serialize.lot_number">
                                  -{{ serialize.lot_number }}
                                </span>
                              </p>
                            </div>
                            <div class="qr-label">
                              <p v-if="
                                detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .mfg_date === true
                              "
                                 style="width: 54px; display: flex; justify-content: space-between;"
                                 class="qr-text"
                              >
                                <div>MFG DATE</div>
                                <div>:</div>
                              </p>
                              <p v-if="
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  false) ||
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.attributes
                                    .mfg_date === true)
                              " class="qr-text">
                                {{
                                  detailProductDataRes.serialize?.print?.format_date === "date" ?
                                    moment(detailDataRes?.date?.manufacture_date).format(
                                      "D MMM yyyy"
                                    ) :
                                    moment(detailDataRes?.date?.manufacture_date).format(
                                      "MMM yyyy"
                                    )
                                }}
                              </p>
                            </div>
                            <div class="qr-label">
                              <p v-if="
                                detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .expired_date === true
                              "
                                 style="width: 54px; display: flex; justify-content: space-between;"
                                 class="qr-text">
                                <div>ED</div>
                                <div>:</div>
                              </p>
                              <p v-if="
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  false) ||
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.attributes
                                    .expired_date === true)
                              " class="qr-text">
                                {{
                                  detailProductDataRes.serialize?.print?.format_date === "date" ?
                                    moment(detailDataRes?.date?.expired_date).format(
                                      "D MMM yyyy"
                                    ) :
                                    moment(detailDataRes?.date?.expired_date).format(
                                      "MMM yyyy"
                                    )
                                }}
                              </p>
                            </div>
                            <div class="qr-label">
                              <p v-if="
                                detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .het === true
                              "
                                 style="width: 54px; display: flex; justify-content: space-between;"
                                 class="qr-text"
                              >
                                <div>HET</div>
                                <div>:</div>
                              </p>
                              <p v-if="
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  false) ||
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.attributes
                                    .het === true)
                              " class="qr-text">
                                {{ $filters.toRupiah(serialize.reception.product.highest_retail_price || detailDataRes.product?.highest_retail_price) }}
                              </p>
                            </div>
                            <div class="qr-label">
                              <p v-if="
                                detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .serial_number === true
                              "
                                 style="width: 54px; display: flex; justify-content: space-between;"
                                 class="qr-text"
                              >
                                <div>SN</div>
                                <div>:</div>
                              </p>
                              <p v-if="
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  false) ||
                                (detailProductDataRes.serialize?.print
                                  .show_field_name_in_qr_code === true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.status ===
                                  true &&
                                  detailProductDataRes.serialize?.print
                                    .show_content_label_in_qr_code.attributes
                                    .serial_number === true)
                              "
                                 style="width: 60%"
                                 class="qr-text"
                              >
                                {{ (serialize as any).code ? (serialize as any).code : "-" }}
                              </p>
                            </div>
                            <div class="qr-label">
                              <p
                                style="width: 54px; display: flex; justify-content: space-between;"
                                class="qr-text"
                              >
                                <div>QTY MAX</div>
                                <div>:</div>
                              </p>
                              <p
                                style="width: 60%"
                                class="qr-text"
                              >
                                {{ $filters.isEmpty((serialize as any).serialize.maximum) }}
                              </p>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="qr-label">
                            <p v-if="
                              detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.status ===
                              true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.attributes
                                .nie === true
                            "
                               style="width: 54px; display: flex; justify-content: space-between;"
                               class="qr-text"
                            >
                              <div>
                                {{ detailProductDataRes?.serialize?.kind?.value === "authentication_gtin" ? "GTIN" : "NIE"
                                }}
                              </div>
                              <div>:</div>
                            </p>
                            <p v-if="
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                false) ||
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .nie === true)
                            "
                               style="width: 60%"
                               class="qr-text"
                            >
                              <template v-if="
                                detailProductDataRes.serialize?.kind.value ===
                                'authentication_gtin'
                              ">
                                {{
                                  detailProductDataRes.serialize?.kind[
                                  "level" + levelParams.level
                                    ]
                                }}
                              </template>
                              <template v-else>
                                {{ detailProductDataRes.nie?.number }}
                              </template>
                            </p>
                          </div>
                          <div class="qr-label">
                            <p v-if="
                              detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.status ===
                              true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.attributes
                                .batch === true
                            "
                               style="width: 54px; display: flex; justify-content: space-between;"
                               class="qr-text"
                            >
                              <div>BATCH</div>
                              <div>:</div>
                            </p>
                            <p v-if="
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                false) ||
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .batch === true)
                            " class="qr-text">
                              {{ detailDataRes.batch_number }}
                              <span v-if="serialize.lot_number">
                                -{{ serialize.lot_number }}
                              </span>
                            </p>
                          </div>
                          <div class="qr-label">
                            <p v-if="
                              detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.status ===
                              true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.attributes
                                .mfg_date === true
                            "
                               style="width: 54px; display: flex; justify-content: space-between;"
                               class="qr-text"
                            >
                              <div>MFG DATE</div>
                              <div>:</div>
                            </p>
                            <p v-if="
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                false) ||
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .mfg_date === true)
                            " class="qr-text">
                              {{
                                detailProductDataRes.serialize?.print?.format_date === "date" ?
                                  moment(detailDataRes?.date?.manufacture_date).format(
                                    "D MMM yyyy"
                                  ) :
                                  moment(detailDataRes?.date?.manufacture_date).format(
                                    "MMM yyyy"
                                  )
                              }}
                            </p>
                          </div>
                          <div class="qr-label">
                            <p v-if="
                              detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.status ===
                              true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.attributes
                                .expired_date === true
                            "
                               style="width: 54px; display: flex; justify-content: space-between;"
                               class="qr-text"
                            >
                              <div>ED</div>
                              <div>:</div>
                            </p>
                            <p v-if="
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                false) ||
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .expired_date === true)
                            " class="qr-text">
                              {{
                                detailProductDataRes.serialize?.print?.format_date === "date" ?
                                  moment(detailDataRes?.date?.expired_date).format(
                                    "D MMM yyyy"
                                  ) :
                                  moment(detailDataRes?.date?.expired_date).format(
                                    "MMM yyyy"
                                  )
                              }}
                            </p>
                          </div>
                          <div class="qr-label">
                            <p v-if="
                              detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.status ===
                              true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.attributes
                                .het === true
                            "
                               style="width: 54px; display: flex; justify-content: space-between;"
                               class="qr-text"
                            >
                              <div>HET</div>
                              <div>:</div>
                            </p>
                            <p v-if="
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                false) ||
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .het === true)
                            " class="qr-text">
                              {{ $filters.toRupiah(serialize.reception.product.highest_retail_price || detailDataRes.product?.highest_retail_price) }}
                            </p>
                          </div>
                          <div class="qr-label">
                            <p v-if="
                              detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.status ===
                              true &&
                              detailProductDataRes.serialize?.print
                                .show_content_label_in_qr_code.attributes
                                .serial_number === true
                            "
                               style="width: 54px; display: flex; justify-content: space-between;"
                               class="qr-text"
                            >
                              <div>SN</div>
                              <div>:</div>
                            </p>
                            <p v-if="
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                false) ||
                              (detailProductDataRes.serialize?.print
                                .show_field_name_in_qr_code === true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.status ===
                                true &&
                                detailProductDataRes.serialize?.print
                                  .show_content_label_in_qr_code.attributes
                                  .serial_number === true)
                            "
                               style="width: 60%"
                               class="qr-text"
                            >
                              {{ (serialize as any).sn ? (serialize as any).sn : "-" }}
                            </p>
                          </div>
                        </template>
                      </div>
                      <div style="margin: auto">
                        <vue-qrcode :options="{ width: 75 }" :value="(serialize as any).code" />
                      </div>
                    </div>
                  </n-card>
                </n-grid-item>
              </n-grid>
            </div>
          </n-space>
        </template>
        <div style="display: flex; justify-content: center; margin-top: 16px">
          <n-pagination v-model:page="levelParams.page" :page-count="serializeLevelDataRes.total_page" :page-slot="7"
                        :show-size-picker="serializeLevelDataRes.total_data > 10" :page-sizes="[10, 20, 30, 40, 50]"
                        @update:page="getSerializeLevel(levelParams.level)"
                        @update:page-size="updatePageSizeSerializeLevel" />
        </div>
      </div>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'produksi-serialisasi-id-print' }" class="text-decoration-none">
          <n-button :loading="isBtnLoading" color="#828282" class="button-tnt">
            Kembali
          </n-button>
        </router-link>
      </div>
    </div>
  </div>
  <modal-printer-list
    v-model:show="modalPrinterList.show"
    :data="printerDriverDataRes"
    :isLoading="isBtnLoading"
    :levelData="levelParams.level"
    @click:close="handleToggleModalPrinterList(false)"
    @click:select-printer="handleToggleModalIntegrasi(true)"
  >
  </modal-printer-list>

  <modal-integrasi
    :show="modalIntegrasi.show"
    :after-send="modalIntegrasi.isAfterSend"
    :serializeLevelDataRes="serializeLevelDataRes"
    :printerDriverDataRes="printerDriverDataRes"
    :detailProductDataRes="detailProductDataRes"
    :detailDataRes="detailDataRes"
    :levelData="levelParams.level"
    @click:close="handleToggleModalIntegrasi(false)"
    @click:see-data="handleToggleModalSeeDataPrint(true)"
    @click:send-data="handleClickSendData"
    @click:print="handleToggleModalSettingPrint(true)"
    @click:reset-insert="handleShowResetInsert"
    @click:log-print="handleShowLogPrint"
  >
  </modal-integrasi>

  <modal-data-integrasii
    v-model:show="modalDataIntegrasi.isLog"
    :is-log="modalDataIntegrasi.isLog"
    :serializeLevelDataRes="serializeLevelDataRes"
    :serializeDetailDataRes="detailDataRes"
    :levelData="levelParams.level"
    @click:close="handleToggleModalDataIntegrasi(false)"
  >
  </modal-data-integrasii>

  <modal-setting-print
    :show="modalSettingPrint.show"
    :serializeLevelDataRes="serializeLevelDataRes"
    :detailDataRes="detailDataRes"
    :levelData="levelParams.level"
    @click:close="handleToggleModalSettingPrint(false)"
    @click:next="handleShowConfirmPrint"
    @update:serial="handleupdateSerialTotal"
  >
  </modal-setting-print>

  <modal-progress-print
    :show="modalProgressBarPrint.show"
    :printerDriverDataRes="printerDriverDataRes"
    :serializeLevelDataRes="serializeLevelDataRes"
    :serialArr="serialArr"
    :dataSerial="tempData"
    :detailProductDataRes="detailProductDataRes"
    :detailDataRes="detailDataRes"
    :levelData="levelParams.level"
    :printTypeChecked="printType"
    @confirm-click="handleConfirmClick"
  >
  </modal-progress-print>
  <modal-see-data-print v-model:show="modalSeeData.show" :serializeDetailDataRes="detailDataRes" />

  <t-feedback v-model:show="tFeedbackRef.show" :icon="tFeedbackRef.icon" :icon-color="tFeedbackRef.iconColor"
              :hide-icon="tFeedbackRef.hideIcon" :title="tFeedbackRef.title" :subtitle="tFeedbackRef.subtitle">
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt"
                  style="padding-left: 25px; padding-right: 25px" @click.prevent="printSerialize">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'confirm-print'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt"
                  style="padding-left: 25px; padding-right: 25px" @click.prevent="handlePrintSerializeLowest">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'reset-insert'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button type="error" class="button-tnt" @click="handleConfirmResetInsert">
          Reset
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

<style lang="scss">
.qr-box {
  display: flex;
  justify-content: space-between;

  .qr-label {
    display: flex;
    width: 100%;
    margin: auto;
    gap: 5px;

    .qr-text {
      display: block;
      font-size: 10px;
      font-weight: 500;
      margin-top: 0;
      margin-bottom: 0;
    }
  }
}
</style>

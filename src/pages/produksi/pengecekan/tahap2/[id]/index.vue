<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ArrowBackOutline, CheckmarkCircleOutline } from "@vicons/ionicons5"
import moment from "moment"
import { auth } from "@/models/auth"
import { checkingModel } from '@/models/produksi/pengecekan'

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()
const authData = auth.getAuth()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const isOpen = ref(false)
const allDownload = ref(false)
const detailDataRes = ref<any>({})
const detailProductDataRes = ref<any>({})
const bonDataRes = ref<any>({})
const selectedData = ref<any>([])
const detailId = ref<any>("")
const resultDataGenerated = ref<any>([])
const valueCountQty = ref<any>(0)
const valueCountAdditional = ref<any>(0)
const valueCountQtyGenerated = ref<any>(0)
const valueCountQtyVoid = ref<any>(0)

const modalReject = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  form: {},
})
const modalPending = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  form: {},
})
const modalReception = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  form: {},
})
const modalConfirm = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  type: '',
})

onMounted(() => {
  getData()
  detailId.value = 0
})

async function handleCollapse( iSerial: number ) {
  isOpen.value = !isOpen.value
  detailId.value = iSerial === detailId.value ? '' : iSerial
}

async function getData() {
  isLoading.value = true
  getBonList()
  await getDetailCheckingProduct()
  await getDetailChecking()
  isLoading.value = false
}

async function getDetailChecking() {
  const id = route.params.id
  await checkingModel.getDetailChecking(id).then((res) => {
    detailDataRes.value = res.data
    groupingSerialize(res.data.serialize)
    groupingCountSerialize(res.data.serialize)
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getDetailCheckingProduct() {
  const id = route.params.id
  await checkingModel.getDetailCheckingProduct(id)
  .then((res) => {
    detailProductDataRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getBonList() {
  const params = {
    limit: 5,
    parent_id: route.params.id
  }
  await checkingModel.getBonList(params).then((res) => {
    bonDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

// function setQtyItem(value: any) {
//   let qty_item = 0
//   value.forEach((el: any) => {
//     qty_item += el.qty
//   })
//   return qty_item
// }
// function setQtyPass(value: any) {
//   let qty_pass = 0
//   value.forEach((el: any) => {
//     qty_pass += el.checking.total_qty_passed
//   })
//   return qty_pass
// }
// function setQtyVoid(value: any) {
//   let qty_void = 0
//   value.forEach((el: any) => {
//     qty_void += el.total_void
//   })
//   return qty_void

  // if (type === 'print') {
  //   let qty_void = 0
  //   value.forEach((el: any) => {
  //     qty_void += el.total_print_void
  //   })
  //   return qty_void
  // } else if (type === 'pack') {
  //   let qty_void = 0
  //   value.forEach((el: any) => {
  //     qty_void += el.total_package_void
  //   })
  //   return qty_void
  // } else {
  //   let qty_void = 0
  //   value.forEach((el: any) => {
  //     qty_void += el.total_check_void
  //   })
  //   return qty_void
  // }
// }

function handleShowReject() {
  modalReject.value.show = true
}
function handleCloseReject() {
  modalReject.value.show = false
}
function handleConfirmReject() {
  isBtnLoading.value = true
  const id = route.params.id as string
  const formData = new FormData()

  modalReject.value.form.imageList.forEach((el: any) => {
    formData.append('media_id[]', el.id)
  })
  formData.append('reason', modalReject.value.form.reason)

  checkingModel.rejectChecking(id, formData).then(() => {
    isBtnLoading.value = false
    handleCloseConfirm()
    handleCloseReject()
    getData()
    modalReject.value.form = {}
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Reject'
      tFeedbackRef.value.subtitle = detailDataRes.value.pk_id + ' berhasil direject'
      showSuccessFeedback('success-reject')
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleShowPending() {
  modalPending.value.show = true
}

function handleClosePending() {
  modalPending.value.show = false
}
function handleConfirmPending() {
  isBtnLoading.value = true
  const id = route.params.id as string
  const formData = new FormData()
  
  modalPending.value.form.imageList.forEach((el: any) => {
    formData.append('media_id[]', el.id)
  })
  formData.append('reason', modalPending.value.form.reason)
  formData.append('release_date', modalPending.value.form.release_date)

  checkingModel.pendingChecking(id, formData).then(() => {
    isBtnLoading.value = false
    handleCloseConfirm()
    handleClosePending()
    getData()
    modalPending.value.form = {}
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Melakukan Pending'
      tFeedbackRef.value.subtitle = detailDataRes.value.pk_id + ' berhasil pending rilis'
      showSuccessFeedback('success-pending')
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleShowConfirm(type: string) {
  if (type === 'reject') {
    modalConfirm.value.type = type
    modalConfirm.value.title = "Konfirmasi Reject"
    modalConfirm.value.subtitle = `Apakah Anda yakin untuk melakukan reject ${detailDataRes.value.pk_id}`
    modalConfirm.value.show = true
  } else if (type === 'pending') {
    modalConfirm.value.type = type
    modalConfirm.value.title = "Konfirmasi Pending"
    modalConfirm.value.subtitle = `Apakah Anda yakin untuk melakukan pending ${detailDataRes.value.pk_id}`
    modalConfirm.value.show = true
  } else if (type === 'reception') {
    modalConfirm.value.type = type
    modalConfirm.value.title = "Konfirmasi Rilis"
    modalConfirm.value.subtitle = `Apakah Anda yakin untuk melakukan rilis ${detailDataRes.value.pk_id}`
    modalConfirm.value.show = true
  }
}

function handleShowReception() {
  modalReception.value.show = true
}
function handleCloseReception() {
  modalReception.value.show = false
}
function handleConfirmReception() {
  isBtnLoading.value = true
  const id = detailDataRes.value.id
  const formData = new FormData()

  formData.append('warehouse_building_id', modalReception.value.form.building)

  checkingModel.releaseChecking(id, formData).then(async() => {
    await receptionPKChecking()
    isBtnLoading.value = false
    handleCloseConfirm()
    handleCloseReception()
    getData()
    modalReception.value.form = {}
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Rilis'
      tFeedbackRef.value.subtitle = detailDataRes.value.pk_id + ' berhasil dirilis'
      showSuccessFeedback('success')
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}
async function receptionPKChecking() {
  const id = detailDataRes.value.id
  const formData = new FormData()

  formData.append('warehouse_building_id', modalReception.value.form.building)

  checkingModel.receptionPKChecking(id, formData)
  .catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleCloseConfirm() {
  modalConfirm.value.show = false
}

const tFeedbackRef = ref({
  show: ref(false),
  type: "",
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  align: "center",
})

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showSuccessFeedback(feedbackType: string) {
  tFeedbackRef.value.type = feedbackType
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.show = true
}

function countValue(serialize: any) {
  if(serialize?.length < 1 || !serialize) {
    return 0
  }
  const total = serialize?.reduce((acc: number, obj: any) => acc + obj.generated, 0)
  return total
}

function groupingSerialize(serial: any) {
  const findGenerates = serial?.map((item: any) => item.generates)

  let resultData: any = []

  for (const item of findGenerates) {
    for (const [indexChild, itemChild] of item.entries()) {
      if (itemChild.packed_at || itemChild.released_at) {
        if (!resultData[indexChild]) {
          resultData = [...resultData, []]
        }
        resultData[indexChild].push(itemChild)
      }
    }
  }
  const reverseResultData = resultData.reverse()
  return resultDataGenerated.value = reverseResultData
}

function groupingCountSerialize(serial: any) {
  const findCountQty = serial?.map((item: any) => item?.qty)
  const findCountAdditional = serial?.map((item: any) => item?.total_additional)
  const findCountQtyGenerated = serial?.map((item: any) => item?.generated)
  const findCountQtyVoid = serial?.map((item: any) => item?.total_print_void)
  // qty
  const resultCountQty : number = findCountQty?.reduce((acc: number, curr: number) => acc + curr)
  // // total_additional
  const resultCountAdditional : number = findCountAdditional?.reduce((acc: number, curr: number) => acc + curr)
  // // generated 
  const resultCountQtyGenerated : number = findCountQtyGenerated?.reduce((acc: number, curr: number) => acc + curr)
  // // total_print_void
  const resultCountQtyVoid : number = findCountQtyVoid?.reduce((acc: number, curr: number) => acc + curr)

  valueCountQty.value = resultCountQty
  valueCountAdditional.value = resultCountAdditional
  valueCountQtyGenerated.value = resultCountQtyGenerated
  valueCountQtyVoid.value = resultCountQtyVoid
}

const actionOptions = [
  { 
    label: "xlsx", 
    key: "xlsx" 
  },
  {
    label: "csv",
    key: "csv"
  },
]

async function handleSelectDropdown(key: string | number, item: any, typePartial: any, index: number) {
  const id: string = route.params.id.toString()
  if ( typePartial === true ) {
    const params = {
      type: key,
      generate_id: item
    }
    checkingModel.downloadChecking(id, params).then((res) => {
    const fileURL = window.URL.createObjectURL(new Blob([res]))
    const fileLink = document.createElement('a')

    fileLink.href = fileURL
    fileLink.setAttribute('download', `Release ${index + 1} ${item}.${key}`)
    document.body.appendChild(fileLink)
    fileLink.click()
  })
  } else {
      const params = {
        type: key,
      }
      checkingModel.downloadChecking(id, params).then((res) => {
      const fileURL = window.URL.createObjectURL(new Blob([res]))
      const fileLink = document.createElement('a')

      fileLink.href = fileURL
      fileLink.setAttribute('download', `${item}.${key}`)
      document.body.appendChild(fileLink)
      fileLink.click()
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  }
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
      <n-space vertical :size="0">
        <div class="card-tnt">
          <n-space>
            <n-h2 style="margin-bottom: 16px">{{ detailDataRes.product?.long_name }}</n-h2>
          </n-space>
          <n-grid cols="4" item-responsive responsive="screen" x-gap="16" y-gap="16">
            <n-grid-item span="3 m:1">
              <n-space vertical :size="15">
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    ID Perintah Kemas : {{ detailDataRes.pk_id }}
                  </n-text>
                </n-space>
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Kode Produk : {{ detailDataRes.product?.item_code }}
                  </n-text>
                </n-space>
                <!-- <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    No. Kemasan Induk : 
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ authData.xxtype == "ju5tU53r" ? authData.users.name : authData.user.name }}
                  </n-text>
                </n-space> -->
              </n-space>
            </n-grid-item>
            <n-grid-item span="3 m:1">
              <n-space vertical :size="15">
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    ID Batch Produksi : {{ detailDataRes.batch_number }}
                  </n-text>
                </n-space>
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Expired Date : {{ moment(detailDataRes.date?.expired_date).format("DD/MM/yyyy") }}
                  </n-text>
                </n-space>
                <!-- <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Qty Item PK : 
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ detailDataRes.serialize ? detailDataRes.serialize[detailDataRes.serialize.length - 1].name : [] }}
                  </n-text>
                </n-space> -->
              </n-space>
            </n-grid-item>
            <n-grid-item span="3 m:1">
              <n-space vertical :size="15">
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Status : 
                    <n-tag
                      type="success"
                      :bordered="false"
                      round
                    >
                      {{ $filters.toStatus(detailDataRes.status?.global?.value) }}
                    </n-tag>
                  </n-text>
                </n-space>
              </n-space>
            </n-grid-item>
            <n-grid-item span="3 m:1">
              <div v-if="detailDataRes.status?.global?.value !== 'pre_release'" style="display: flex; justify-content: flex-end">
              <n-space vertical :size="15">
                  <n-dropdown
                    placement="bottom-end"
                    show-arrow
                    :options="actionOptions"
                    @select="handleSelectDropdown($event, detailDataRes?.product?.item_code, false, 0)"
                  >
                    <n-button
                      placement="bottom-end"
                      type="info"
                      class="button-tnt"
                      style="width: 120px; margin-right: 12px;"
                    >
                      Download
                    </n-button>
                  </n-dropdown>
              </n-space>
              </div>
            </n-grid-item>
          </n-grid>

          <div class="table-tnt" style="margin-top: 1.5rem">
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th style="text-align: center; width: 16%">Qty Item PK</th>
                  <th style="text-align: center; width: 16%">Qty Generated</th>
                  <th style="text-align: center; width: 16%">Qty Packed</th>
                  <th style="text-align: center; width: 16%">Qty Pass</th>
                  <th style="text-align: center; width: 16%">Qty Void</th>
                  <th style="text-align: center; width: 16%">Qty Rilis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? detailDataRes.serialize[0]?.qty : 0 }}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? detailDataRes?.serialize[0]?.generated : 0}}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? (detailDataRes?.serialize[0]?.generates[0]?.qty_packed) : 0}}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? detailDataRes?.serialize[0]?.generates[0]?.qty_check_pass : 0}}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? detailDataRes?.serialize[0]?.total_check_void : 0}}
                  </td>
                  <td style="text-align: center;">
                    {{
                      detailDataRes.serialize ? detailDataRes.serialize[0]?.total_release : 0
                    }}
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>

          <n-space vertical :size="0">
            <div v-if="detailDataRes.status?.global?.value === 'pre_release'" class="table-tnt">
              <n-space justify="space-between">
                <div>
                  
                </div>
                <div>
                  <n-button
                    type="error"
                    class="button-tnt"
                    style="width: 120px; margin-right: 12px;"
                    @click="handleShowReject"
                  >
                    Reject
                  </n-button>
                  <n-button
                    type="warning"
                    class="button-tnt"
                    style="width: 120px; margin-right: 12px;"
                    @click="handleShowPending"
                  >
                    Pending
                  </n-button>
                  <n-button
                    type="primary"
                    class="button-tnt"
                    style="width: 120px; margin-right: 12px;"
                    @click="handleShowReception"
                  >
                    Rilis
                  </n-button>
                </div>
              </n-space>
            </div>
          </n-space>

          <div style="margin-top: 1.5rem">
            <n-scrollbar x-scrollable>
              <n-space vertical :size="10" :wrap="false">
                <template v-if="isLoading">
                  <t-loading></t-loading>
                </template>
                <template v-else>
                  <div
                    v-for="serial, iSerial in resultDataGenerated"
                    :key="iSerial"
                    class="card-tnt"
                    style="padding: 1.2rem; margin-top: 0; border-radius: 12px; background-color:#F1F3F3;"
                    @click.prevent="handleCollapse(iSerial)"
                  >
                    <n-space
                      :wrap="false"
                      justify="space-between"
                      align="center"
                      style="position: relative"
                    >
                      <n-space :wrap="false" :size="0">
                        <n-text style="margin-right: 10px;">
                          #{{ iSerial + 1 }} Release <strong>{{ serial[0].id }}</strong><br>
                          Batch Lot : <strong>{{ serial[0].lot_number ? detailDataRes.batch_number + '-' +  serial[0].lot_number : '-' }}</strong><br>
                          Dicetak : <strong>{{ moment(serial[0].generated_at).format("DD/MM/yyyy HH:mm:ss") }}</strong> | Dikemas : <strong>{{ moment(serial[0].packed_at).format("DD/MM/yyyy HH:mm:ss") }}</strong>
                          
                        </n-text>
                      </n-space>
                      <n-space :wrap="false" :size="0">
                        <n-text style="margin-right: 10px;">
                          <n-tag
                            v-if="serial[0].is_released"
                            type="success"
                            :bordered="false"
                            round
                          >
                            Released
                          </n-tag>
                          <n-tag
                            v-else
                            type="success"
                            :bordered="false"
                            round
                          >
                            Pre Release
                          </n-tag>
                        </n-text>
                      </n-space>
                    </n-space>
                    <n-collapse-transition v-show="iSerial === detailId">
                      <div class="table-tnt" v-if="iSerial === detailId">
                        <n-scrollbar x-scrollable>
                          <div style="cursor: pointer;">
                            <n-table style="margin-bottom: 10px" :single-line="false">
                              <thead>
                                  <tr>
                                    <th style="text-align: center; width: 16%">Qty Generated Lv 1</th>
                                    <th style="text-align: center; width: 16%">Qty Inspeksi Akhir Lv 1 (a)</th>
                                    <th style="text-align: center; width: 16%">Qty Check Void Lv 1 (b)</th>
                                    <th style="text-align: center; width: 16%">Qty Rilis Lv 1 (a-b)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr >
                                    <td style="text-align: center;">
                                      {{ serial[0].qty }}
                                    </td>
                                    <td style="text-align: center;">
                                      {{ serial[0].qty_check_void + serial[0].qty_check_pass }}
                                    </td>
                                    <td style="text-align: center;">
                                      {{ serial[0].qty_check_void ?? 0 }}
                                    </td>
                                    <td style="text-align: center;">
                                      {{
                                        serial[0].is_released ? serial[0].qty_check_void ? ((serial[0].qty_check_void + serial[0].qty_check_pass) - serial[0].qty_check_void) : serial[0].qty_check_pass : 0
                                      }}
                                    </td>
                                  </tr>
                                </tbody>
                            </n-table>
                          </div>
                          <div style="margin-top: 1.5rem; display: flex; justify-content: center;">
                            <n-space>
                              <div
                                v-for="serial, xSerial in detailDataRes.serialize"
                                :key="xSerial"
                                class="card-tnt"
                                style="width: 12rem; border: 1px solid #E5E5E5; margin-top: 0; padding: 8px;"
                              >
                                <n-space vertical :size="0" style="text-align: left;">
                                  <n-text style="font-size: 18px">Level {{ serial.level }}</n-text>
                                  <n-text>
                                    Qty Generated :
                                    <span style="font-weight: 500">{{ serial.generates[resultDataGenerated.length-1-iSerial].qty }}</span>
                                  </n-text>
                                  <n-text>
                                    Qty Pengemasan :
                                    <span style="font-weight: 500">
                                      {{ 
                                        serial.generates[resultDataGenerated.length-1-iSerial].qty_packed ?? 0
                                      }}
                                    </span>
                                  </n-text>
                                  <n-text>
                                    Qty Void Pengemasan :
                                    <span style="font-weight: 500">
                                      {{ 
                                        serial.generates[resultDataGenerated.length-1-iSerial].qty_pack_void ?? 0
                                      }}
                                    </span>
                                  </n-text>
                                  <n-text>
                                    Qty Void Inspeksi Akhir :
                                    <span style="font-weight: 500">
                                      {{ 
                                        serial.generates[resultDataGenerated.length-1-iSerial].qty_check_void ?? 0
                                      }}
                                    </span>
                                  </n-text>
                                  <n-text>
                                    Qty Rilis :
                                    <span style="font-weight: 500">
                                    {{ 
                                      serial.total_release
                                    }}</span>
                                  </n-text>
                                  <n-text v-if="serial.generates[resultDataGenerated.length-1-iSerial]?.warehouse">
                                    Warehouse :
                                    <span style="font-weight: 500">{{ serial.generates[resultDataGenerated.length-1-iSerial].warehouse?.name }}</span>
                                  </n-text>
                                  <n-text v-if="serial.generates[resultDataGenerated.length-1-iSerial]?.building">
                                    Building :
                                    <span style="font-weight: 500">{{ serial.generates[resultDataGenerated.length-1-iSerial].building?.name }}</span>
                                  </n-text>
                                  <!-- <n-text>
                                    Qty Tambahan : 
                                    <span style="font-weight: 500">{{ serial?.total_additional }}</span>
                                  </n-text>
                                  <n-text>
                                    Qty Pass :  
                                    <span style="font-weight: 500">{{ serial?.checking?.total_qty_passed }}</span>
                                  </n-text>
                                  <n-text>
                                    Qty Void Print:  
                                    <span style="font-weight: 500">{{ serial?.total_print_void }}</span>
                                  </n-text>
                                  <n-text>
                                    Qty Void Pengemasan:  
                                    <span style="font-weight: 500">{{ serial?.total_package_void }}</span>
                                  </n-text>
                                  <n-text>
                                    Qty Void Pengecekan:  
                                    <span style="font-weight: 500">{{ serial?.total_check_void }}</span>
                                  </n-text> -->
                                </n-space>
                              </div>
                            </n-space>
                          </div>
                          <div v-if="detailDataRes.status?.global?.value !== 'pre_release'" style="margin-top: 1.5rem; display: flex; justify-content: center;">
                            <n-dropdown
                              placement="bottom-end"
                              show-arrow
                              :options="actionOptions"
                              @select="handleSelectDropdown($event, serial[iSerial].id, true, iSerial)"
                            >
                              <n-button
                                placement="bottom-end"
                                type="info"
                                class="button-tnt"
                                style="width: 120px; margin-right: 12px;"
                              >
                                Download
                              </n-button>
                            </n-dropdown>
                          </div>
                        </n-scrollbar>
                      </div>
                    </n-collapse-transition>
                  </div>
                </template>
              </n-space>
            </n-scrollbar>
          </div>
          <div
            v-if="bonDataRes?.list?.length > 0"
            class="table-tnt"
            style="margin-top: 1.5rem"
          >
            <n-text style="font-weight: 600">Bon List</n-text>
            <n-table :single-line="false" style="margin-top: 5px;">
              <thead>
                <tr>
                  <th>No PK</th>
                  <th>Tanggal</th>
                  <th>Kode Produk</th>
                  <th>Nama Produk</th>
                  <th>No. Batch</th>
                  <th style="text-align: center">Qty Level Terendah</th>
                  <th style="text-align: center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(list, i) in bonDataRes.list" :key="i">
                  <td>{{ list.pk_id }}</td>
                  <td>{{ moment(list.created_at).format("yyyy-MM-DD") }}</td>
                  <td>{{ list.product.item_code }}</td>
                  <td>{{ list.product.short_name }}</td>
                  <td>{{ list.batch_number }}</td>
                  <td style="text-align: center">{{ list.serialize ? list.serialize[0].qty : 0 }}</td>
                  <td style="text-align: center">
                    <n-tag type="success" :bordered="false" round>
                      {{ list.status.global?.value ? list.status.global?.value : "-" }}
                    </n-tag>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>

          <n-space v-if="false" vertical style="margin-top: 1rem">
            <div style="font-weight: bold">Keterangan Void</div>
            <n-text>Tidak Terpakai</n-text>
          </n-space>
          <div style="margin-top: 1rem">
            <div v-if="false" style="margin-bottom: 1rem">Bukti</div>
            <n-upload v-if="false" list-type="image-card" />
            <n-button
              type="primary"
              style="margin-top: 1rem;"
              class="button-tnt"
              @click="$router.push({ name: 'produksi-pengecekan-tahap2-id-preview' })"
              ghost
            >
              Preview
            </n-button>
          </div>
        </div>

      </n-space>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'produksi-pengecekan-tahap2' }" class="text-decoration-none">
          <n-button
            color="#828282"
            class="button-tnt"
            style="width: 120px"
          >
            <n-icon :component="ArrowBackOutline" />
            <span style="margin-left: 5px;">Kembali</span>
          </n-button>
        </router-link>
      </div>
    </div>
  </div>

  <t-reject-modal
    :show="modalReject.show"
    v-model:value="modalReject.form"
    :detail-data="detailDataRes"
    v-model:selected-data="selectedData"
    :title="modalReject.title"
    @click:close="handleCloseReject"
    @click:confirm="handleShowConfirm('reject')"
  ></t-reject-modal>

  <t-pending-modal
    :show="modalPending.show"
    v-model:value="modalPending.form"
    :detail-data="detailDataRes"
    v-model:selected-data="selectedData"
    :title="modalPending.title"
    @click:close="handleClosePending"
    @click:confirm="handleShowConfirm('pending')"
  ></t-pending-modal>

  <t-reception-modal
    :show="modalReception.show"
    v-model:value="modalReception.form"
    :detail-data="detailDataRes"
    v-model:selected-data="selectedData[0]"
    :title="modalReception.title"
    @click:close="handleCloseReception"
    @click:confirm="handleShowConfirm('reception')"
  ></t-reception-modal>

  <t-feedback
    v-model:show="modalConfirm.show"
    :title="modalConfirm.title"
    :subtitle="modalConfirm.subtitle"
    hideIcon
  >
    <n-space justify="center">
      <template v-if="modalConfirm.type === 'reject'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleCloseConfirm">Batalkan</n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleConfirmReject"
        >Yakin</n-button>
      </template>
      <template v-if="modalConfirm.type === 'pending'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleCloseConfirm">Batalkan</n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleConfirmPending"
        >Yakin</n-button>
      </template>
      <template v-if="modalConfirm.type === 'reception'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleCloseConfirm">Batalkan</n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleConfirmReception"
        >Yakin</n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
    :align="tFeedbackRef.align"
  >
    <template v-if="tFeedbackRef.type == 'success'">
      <n-button color="#828282" class="button-tnt" @click="hideFeedback">
        Tutup
      </n-button>
    </template>
    <template v-if="tFeedbackRef.type == 'success-pending'">
      <router-link :to="{ name: 'produksi-pengecekan-tahap1' }" class="text-decoration-none">
        <n-button color="#219653" class="button-tnt">
          Kembali Ke Tahap 1
        </n-button>
      </router-link>
    </template>
    <template v-if="tFeedbackRef.type == 'success-reject'">
      <router-link :to="{ name: 'produksi-pengecekan-tahap2' }" class="text-decoration-none">
        <n-button color="#219653" class="button-tnt">
          Kembali Ke Beranda
        </n-button>
      </router-link>
    </template>
  </t-feedback>
</template>

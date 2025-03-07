<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ArrowBackOutline, CheckmarkCircleOutline } from "@vicons/ionicons5"
import moment from "moment"
import { auth } from "@/models/auth"
import { checkingModel } from '@/models/produksi/pengecekan'

const route = useRoute()
const tMessage = useMessage()
const authData = auth.getAuth()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const detailProductDataRes = ref<any>({})
const bonDataRes = ref<any>({})
const selectedData = ref<any>([])

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
})

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

function setQtyItem(value: any) {
  let qty_item = 0
  value.forEach((el: any) => {
    qty_item += el.qty
  })
  return qty_item
}
function setQtyPass(value: any) {
  let qty_pass = 0
  value.forEach((el: any) => {
    qty_pass += el.checking.total_qty_passed
  })
  return qty_pass
}
function setQtyVoid(value: any) {
  let qty_void = 0
  value.forEach((el: any) => {
    qty_void += el.total_void
  })
  return qty_void

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
}

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
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="font-size: 22px; margin-bottom: 0"> Rilis </n-h2>
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-space vertical :size="0">
        <div class="card-tnt">
          <n-space justify="space-between">
            <n-h2 style="margin-bottom: 16px">No PK : {{ detailDataRes.pk_id }}</n-h2>
            <n-tag
              type="success"
              :bordered="false"
              round
            >
              {{ $filters.toStatus(detailDataRes.status?.global?.value) }}
            </n-tag>
          </n-space>
          <n-grid cols="4" item-responsive responsive="screen" x-gap="16" y-gap="16">
            <n-grid-item span="3 m:1">
              <n-space vertical :size="15">
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Kode Produk
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ detailDataRes.product?.item_code }}
                  </n-text>
                </n-space>
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Tanggal Manufaktur
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ moment(detailDataRes.date?.manufacture_date).format("yyyy-MM-DD") }}
                  </n-text>
                </n-space>
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    User QA
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ authData.xxtype == "ju5tU53r" ? authData.users.name : authData.user.name }}
                  </n-text>
                </n-space>
              </n-space>
            </n-grid-item>
            <n-grid-item span="3 m:1">
              <n-space vertical :size="15">
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Nama Produk
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ detailDataRes.product?.long_name }}
                  </n-text>
                </n-space>
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Exp. Date
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ moment(detailDataRes.date?.expired_date).format("yyyy-MM-DD") }}
                  </n-text>
                </n-space>
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Outer Packaging
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ detailDataRes.serialize ? detailDataRes.serialize[detailDataRes.serialize.length - 1].name : [] }}
                  </n-text>
                </n-space>
              </n-space>
            </n-grid-item>
            <n-grid-item span="3 m:1">
              <n-space vertical :size="15">
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    No Batch Produksi
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ detailDataRes.batch_number }}
                  </n-text>
                </n-space>
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    HET (Harga Eceran Tertinggi)
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ $filters.toRupiah(detailProductDataRes.highest_retail_price) }}
                  </n-text>
                </n-space>
                <n-space
                  v-if="detailDataRes?.status ? detailDataRes?.status?.global?.value === 'released' : false"
                  vertical
                  :size="0"
                >
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Tempat Penyimpanan
                  </n-text>
                  <n-text v-bind:key="i" v-for="(list, i) in detailDataRes.allocation?.warehouses">
                    <n-text style="margin-bottom: 0;">
                      {{  ' - ' + list.name + ' / ' + detailDataRes.allocation?.building?.name }}
                    </n-text>
                  </n-text>
                </n-space>
              </n-space>
            </n-grid-item>
            <n-grid-item span="3 m:1">
              <n-space vertical :size="15">
                <n-space vertical :size="0">
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    UOM
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ detailProductDataRes.uom?.name }}
                  </n-text>
                </n-space>
                <n-space
                  v-if="detailDataRes?.status ? detailDataRes?.status?.global?.value === 'released' : false"
                  vertical
                  :size="0"
                >
                  <n-text style="margin-bottom: 0; font-weight: 600">
                    Tanggal Rilis
                  </n-text>
                  <n-text style="margin-bottom: 0;">
                    {{ moment(detailDataRes.date?.released_at).format("yyyy-MM-DD") }}
                  </n-text>
                </n-space>
              </n-space>
            </n-grid-item>
          </n-grid>

          <div class="table-tnt" style="margin-top: 1.5rem">
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th style="text-align: center; width: 16%">Qty Item PK (a)</th>
                  <th style="text-align: center; width: 16%">Qty Tambahan (b)</th>
                  <th style="text-align: center; width: 16%">Qty Void (c)</th>
                  <th style="text-align: center; width: 16%">Qty Rilis (a + b - c)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? detailDataRes.serialize[0]?.qty : 0 }}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? detailDataRes.serialize[0]?.total_additional : 0 }}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? detailDataRes.serialize[0]?.total_void : 0 }}
                  </td>
                  <td style="text-align: center;">
                    {{
                      detailDataRes.serialize ? (detailDataRes.serialize[0]?.qty +
                      detailDataRes.serialize[0]?.total_additional -
                      detailDataRes.serialize[0]?.total_void) : 0
                    }}
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>

          <div class="table-tnt" style="margin-top: 1.5rem">
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th style="text-align: center; width: 20%">Total Semua</th>
                  <th style="text-align: center; width: 20%">Total Pass</th>
                  <th style="text-align: center; width: 20%">Total Void</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? setQtyItem(detailDataRes.serialize) : 0 }}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? setQtyPass(detailDataRes.serialize) : 0 }}
                  </td>
                  <td style="text-align: center;">
                    {{ detailDataRes.serialize ? setQtyVoid(detailDataRes.serialize) : 0 }}
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>

          <div style="margin-top: 1.5rem">
            <n-space>
              <div
                v-for="serial, iSerial in detailDataRes.serialize"
                :key="iSerial"
                class="card-tnt"
                style="width: 12rem; border: 1px solid #E5E5E5; margin-top: 0; padding: 8px;"
              >
                <n-space vertical :size="0" style="text-align: left;">
                  <n-text style="font-size: 18px">Level {{ serial.level }}</n-text>
                  <n-text>
                    Qty Generate : 
                    <span style="font-weight: 500">{{ serial?.qty }}</span>
                  </n-text>
                  <n-text>
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
                  </n-text>
                </n-space>
              </div>
            </n-space>
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
        <n-button
          v-if="detailDataRes?.status ? detailDataRes?.status?.global?.value === 'pre_release' : false"
          type="error"
          class="button-tnt"
          style="width: 120px"
          @click="handleShowReject"
        >
          Reject
        </n-button>
        <n-button
          v-if="detailDataRes?.status ? detailDataRes?.status?.global?.value === 'pre_release' : false"
          type="warning"
          class="button-tnt"
          style="width: 120px"
          @click="handleShowPending"
        >
          Pending
        </n-button>
        <n-button
          v-if="detailDataRes?.status ? detailDataRes?.status?.global?.value=== 'pre_release' : false"
          type="primary"
          class="button-tnt"
          style="width: 120px"
          @click="handleShowReception"
        >
          Rilis
        </n-button>
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

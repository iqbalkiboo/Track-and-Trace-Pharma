<script setup lang="ts">
import { useMessage, NInput } from 'naive-ui'
import { CheckmarkCircleOutline } from "@vicons/ionicons5"
import moment from "moment"
import { transferOrderModel } from "@/models/penyimpanan/transfer-order"

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const productDataRes = ref<any>({})
const listDetailDataRes = ref<any>({})
const scanDataRes = ref<any>([])
const codeScan = ref('')
const selectedCode = ref<any>('')
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: 'Alasan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
}
const input = ref<typeof NInput | null>(null)
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

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  getDetailTO()
  await getDetailProduct()
  await getListDetailTO()
  isLoading.value = false
}

async function getDetailTO() {
  const id = route.params.id
  await transferOrderModel.getDetailTO(id)
  .then((res) => {
    detailDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getDetailProduct() {
  const productId = localStorage.getItem("product_id")
  await transferOrderModel.getDetailProduct(productId).then(async(res) => {
    productDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getListDetailTO() {
  const productId = localStorage.getItem("product_id")
  const params = {
    to_id: route.params.id,
    to_product_id: productId,
    limit: 1000
  }
  await transferOrderModel.getListDetailTO(params).then(async(res) => {
    listDetailDataRes.value = res.data
    setTimeout(() => {
      input.value?.focus()
    }, 100)
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function handleClickScan() {
  isBtnLoading.value = true
  input.value?.blur()

  const productId = localStorage.getItem("product_id")
  const code = codeScan.value
  const to_product_id = productId
  await transferOrderModel.getDetailByCodeTO(code, to_product_id)
    .then((res) => {
      if (scanDataRes.value.length > 0) {
        if (parseInt(res?.data?.serialize?.first_level_qty) + setQtyConfirm(listDetailDataRes.value.list) + setQtyConfirm(scanDataRes.value) > productDataRes.value.qty) {
          tMessage.error('Qty serialisasi tidak dapat melebihi Qty TO')
        } else {
          scanDataRes.value.forEach((el: any) => {
            if (el.code === res.data.code) {
              tMessage.error('Kode serialisasi sudah ada di list')
            } else {
              const filterData = scanDataRes.value.filter((scan: any) => scan.code !== res.data.code)
              scanDataRes.value = filterData
              scanDataRes.value.push(res.data)
              input.value?.focus()
            }
          })
        }
      } else {
        if (parseInt(res?.data?.serialize?.first_level_qty) + setQtyConfirm(listDetailDataRes.value.list) > productDataRes.value.qty) {
          tMessage.error('Qty serialisasi tidak dapat melebihi Qty TO')
        } else {
          scanDataRes.value.push(res.data)
          input.value?.focus()
        }
      }
      codeScan.value = ''
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      codeScan.value = ''
      isBtnLoading.value = false
      input.value?.focus()
      const data = err.response.data
      tMessage.error(data.message)
    })
    .finally(() => {
      input.value?.focus()
    })
}

function handleShowDelete(code: string) {
  selectedCode.value = code
  tFeedbackRef.value.type = 'delete'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Hapus'
  tFeedbackRef.value.subtitle = `Apakah Anda yakin untuk menghapus ${ selectedCode.value } ?`
  tFeedbackRef.value.show = true
}

async function handleClickDelete() {
  isBtnLoading.value = true

  const productId = localStorage.getItem("product_id")
  const formData = new FormData()
  formData.append("to_product_id", productId as string)
  formData.append("codes[]", selectedCode.value)

  transferOrderModel.deleteItem(formData).then(() => {
    isBtnLoading.value = false
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Hapus Serialisasi'
      tFeedbackRef.value.subtitle = `${ selectedCode.value } berhasil dihapus`
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function setQtyConfirm(data: any) {
  let qty = 0
  data.forEach((el: any) => {
    qty += el.serialize.first_level_qty
  })
  return qty
}

function handleShowConfirm() {
  showConfirmFeedback()
}

function handleClickConfirm() {
  isBtnLoading.value = true

  const id = localStorage.getItem("product_id")
  const formData = new FormData()

  formData.append('to_product_id', id as string)

  scanDataRes.value.forEach((el: any) => {
    formData.append('codes[]', el.code)
  })

  transferOrderModel.updateTO(formData).then(() => {
    isBtnLoading.value = false
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Transfer Order'
      tFeedbackRef.value.subtitle = `${setQtyConfirm(scanDataRes.value)} kode serialisai berhasil dikonfirmasi`
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function hideSuccessFeedback() {
  scanDataRes.value = []
  getData()
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk melakukan transfer order?'
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
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
      <n-space vertical :size="24">
        <n-space justify="space-between">
          <n-space align="center">
            <n-h1 style="font-weight: 600; font-size: 18px; margin: auto;">
              Kode Transfer Order : {{ detailDataRes.to_number }}
            </n-h1>
            <n-button strong secondary round :type="detailDataRes.status === 'complete' ? 'success' : 'warning'" style="cursor: default">{{ $filters.toStatus(detailDataRes.status) }}</n-button>
          </n-space>
        </n-space>
    
        <n-row :cols="12">
          <n-col :span="6">
            <n-space vertical>
              <n-text>Tanggal TO : {{ moment(productDataRes.created_at).format("yyyy-MM-DD") }}</n-text>
              <n-text>Kode Produk : {{ productDataRes.product?.item_code }}</n-text>
              <n-text>Produk : {{ productDataRes.product?.short_name }}</n-text>
              <n-text>Batch : {{ productDataRes.batch }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical>
              <n-text>Plant/Cabang Asal : {{ $filters.isEmpty(productDataRes.from?.warehouse?.name) }}</n-text>
              <n-text>Building Asal : {{ $filters.isEmpty(productDataRes.from?.building?.name) }}</n-text>
              <n-text>Room Asal : {{ $filters.isEmpty(productDataRes.from?.room?.name) }}</n-text>
              <n-text>Rack Asal : {{ $filters.isEmpty(productDataRes.from?.rack_pallete?.name) }}</n-text>
              <n-text>Bin Asal : {{ $filters.isEmpty(productDataRes.from?.bin?.name) }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical>
              <n-text>Plant/Cabang Tujuan : {{ $filters.isEmpty(productDataRes.to?.warehouse?.name) }}</n-text>
              <n-text>Building Tujuan : {{ $filters.isEmpty(productDataRes.to?.building?.name) }}</n-text>
              <n-text>Room Tujuan : {{ $filters.isEmpty(productDataRes.to?.room?.name) }}</n-text>
              <n-text>Rack Tujuan : {{ $filters.isEmpty(productDataRes.to?.rack_pallete?.name) }}</n-text>
              <n-text>Bin Tujuan : {{ $filters.isEmpty(productDataRes.to?.bin?.name) }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-card
              style="width: 250px; text-align: center; border-radius: 15px; background: #eee;"
            >
              <n-p style="font-size: 14px">Qty Terkonfirmasi/Qyt TO :</n-p>
              <n-h4
                v-if="listDetailDataRes?.list"
                style="margin-top: 0px"
              >
                {{ setQtyConfirm(listDetailDataRes.list) + '/' + productDataRes.qty }}
              </n-h4>
            </n-card>
          </n-col>
        </n-row>

        <template v-if="listDetailDataRes?.list && detailDataRes.status !== 'cancel'">
          <div
            v-if="setQtyConfirm(listDetailDataRes.list) !== detailDataRes.qty"
            class="card-tnt"
            style="margin-top: 0; background-color: #eeeeee;"
          >
            <n-space vertical align="center">
              <n-text>Silakan masukkan Kode Serialisasi</n-text>
              <n-space>
                <n-input
                  ref="input"
                  v-model:value="codeScan"
                  :disabled="isBtnLoading"
                  placeholder=""
                  clearable
                  @keyup.enter="handleClickScan"
                  style="width: 35rem"
                ></n-input>
                <n-button
                  v-if="false"
                  :loading="isBtnLoading"
                  :disabled="codeScan == ''"
                  strong
                  secondary
                  type="primary"
                  class="button-tnt"
                  @click="handleClickScan"
                  >Cari</n-button
                >
              </n-space>
              <n-p v-if="false" style="font-size: 0.8rem">Atau Scan Kode</n-p>
              <n-button
                :loading="isBtnLoading"
                :disabled="codeScan == ''"
                type="primary"
                class="button-tnt"
                @click="handleClickScan"
              >
                Scan Kode
              </n-button>
            </n-space>
          </div>
        </template>

        <div
          v-if="scanDataRes.length > 0"
          class="card-tnt"
          style="margin-top: 0"
        >
          <n-text>Serialisasi Terscan</n-text>
          <div
            class="table-tnt"
            style="margin-top: 10px"
          >
            <n-table :single-line="false" :bottom-bordered="false" :bordered="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th>Expired Date</th>
                  <th style="text-align: center">Level</th>
                  <th>Batch</th>
                  <th style="text-align: center">Qty</th>
                  <th style="text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="list, i in scanDataRes" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ (list as any).code }}</td>
                  <td>{{ moment((list as any).expired_date).format("yyyy-MM-DD") }}</td>
                  <td style="text-align: center">{{ (list as any).serialize?.level }}</td>
                  <td>{{ (list as any).reception?.batch_number }}</td>
                  <td style="text-align: center">{{ (list as any).serialize?.first_level_qty }}</td>
                  <td style="text-align: center">
                    <n-button
                      text
                      type="error"
                      @click="scanDataRes.splice(i, 1)"
                    >
                      Hapus
                    </n-button>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </div>

        <div
          v-if="listDetailDataRes.list?.length > 0"
          class="card-tnt"
          style="margin-top: 0"
        >
          <n-text>Serialisasi Terkonfirmasi</n-text>
          <div
            class="table-tnt"
            style="margin-top: 10px"
          >
            <n-table :single-line="false" :bottom-bordered="false" :bordered="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th>Expired Date</th>
                  <th>Batch</th>
                  <th style="text-align: center">Level</th>
                  <th style="text-align: center">Qty</th>
                  <th
                    v-if="detailDataRes.status === 'pending'"
                    style="text-align: center"
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="list, i in listDetailDataRes.list" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ (list as any).serialize?.code }}</td>
                  <td>{{ moment((list as any).expired_date).format("yyyy-MM-DD") }}</td>
                  <td>{{ (list as any).serialize?.batch }}</td>
                  <td style="text-align: center">{{ (list as any).serialize?.level }}</td>
                  <td style="text-align: center">{{ (list as any).serialize?.first_level_qty }}</td>
                  <td
                    v-if="detailDataRes.status === 'pending'"
                    style="text-align: center"
                  >
                    <n-button
                      text
                      type="error"
                      @click="handleShowDelete(list.serialize?.code)"
                    >
                      Hapus
                    </n-button>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </div>

      </n-space>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'penyimpanan-transfer-id' }" class="text-decoration-none">
          <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
        <template v-if="detailDataRes.status === 'pending'">
          <n-button
            :loading="isBtnLoading"
            :disabled="scanDataRes.length === 0"
            type="primary"
            class="button-tnt"
            style="width: 120px"
            @click="handleShowConfirm"
          >
            Konfirmasi
          </n-button>
        </template>
      </div>
    </div>
  </div>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
    :align="tFeedbackRef.align"
  >
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'delete'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleClickDelete">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleClickConfirm">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button color="#828282" class="button-tnt" @click="hideSuccessFeedback">
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>

</template>

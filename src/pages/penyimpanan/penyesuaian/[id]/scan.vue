<script setup lang="ts">
import { useMessage, NInput } from 'naive-ui'
import { CheckmarkCircleOutline } from "@vicons/ionicons5"
import { adjustmentModel } from "@/models/penyimpanan/adjustment"
import ModalProdukHilang from "../modal/modal-produk-hilang.vue"

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const productDataRes = ref<any>({})
const listDetailDataRes = ref<any>({})
const scanDataRes = ref<any>([])
const codeScan = ref('')
const input = ref<typeof NInput | null>(null)

const modalMissingProduct = ref<any>({
  show: false,
})

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  getDetailAdjustment()
  await getDetailProduct()
  await getListDetailAdjustment()
  isLoading.value = false
}

async function getDetailAdjustment() {
  const id = route.params.id
  await adjustmentModel.getDetailAdjustment(id)
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
  await adjustmentModel.getDetailProduct(productId).then(async(res) => {
    productDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getListDetailAdjustment() {
  const productId = localStorage.getItem("product_id")
  const params = {
    adjustment_id: route.params.id,
    adjustment_product_id: productId,
    limit: 1000
  }
  await adjustmentModel.getListDetailAdjustment(params).then(async(res) => {
    listDetailDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleShowMissingProduct() {
  modalMissingProduct.value.show = true
}
function handleCloseMissingProduct() {
  modalMissingProduct.value.show = false
}
function handleInputMissingProduct(listItems: any) {
  listItems.forEach((elone: any) => {
    if (scanDataRes.value.length > 0) {
      scanDataRes.value.forEach((eltwo: any) => {
        if (elone.id !== eltwo.id) {
          const filterData = scanDataRes.value.filter((scan: any) => scan.id !== elone.id)
          scanDataRes.value = filterData
          scanDataRes.value.push({
            id: elone.id,
            code: elone.code,
            serialize: {
              level: elone.level,
              first_level_qty: elone.qty,
            },
            reception: {
              batch_number: elone.batch_number,
            }
          })
        }
      })
    } else {
      scanDataRes.value.push({
        id: elone.id,
        code: elone.code,
        serialize: {
          level: elone.level,
          first_level_qty: elone.qty,
        },
        reception: {
          batch_number: elone.batch_number,
        }
      })
    }
  })
}

async function handleClickScan() {
  isBtnLoading.value = true

  const code = codeScan.value
  const adjustment_product_id = localStorage.getItem("product_id")
  await adjustmentModel.getDetailByCodeAdjustment(code, adjustment_product_id)
    .then((res) => {
      if (scanDataRes.value.length > 0) {
        if (parseInt(res?.data?.serialize?.first_level_qty) + setQtyConfirm(listDetailDataRes.value.list) + setQtyConfirm(scanDataRes.value) > productDataRes.value.qty) {
          tMessage.error('Qty serialisasi tidak dapat melebihi Qty Adjustment')
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
          tMessage.error('Qty serialisasi tidak dapat melebihi Qty Adjustment')
        } else {
          if (listDetailDataRes.value.list.length > 0) {
            listDetailDataRes.value.list.forEach((el: any) => {
              if (el.serialize.code === res.data.code) {
                tMessage.error('Kode serialisasi sudah ada di list')
              } else {
                const filterData = scanDataRes.value.filter((scan: any) => scan.code !== res.data.code)
                scanDataRes.value = filterData
                scanDataRes.value.push(res.data)
                input.value?.focus()
              }
            })
          } else {
            scanDataRes.value.push(res.data)
          }
        }
      }
      codeScan.value = ''
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      codeScan.value = ''
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
    .finally(() => {
      input.value?.focus()
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
  formData.append('adjustment_product_id', id as string)

  scanDataRes.value.forEach((el: any) => {
    formData.append('codes[]', el.code)
  })

  adjustmentModel.updateAdjustment(formData).then(() => {
    isBtnLoading.value = false
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil'
      tFeedbackRef.value.subtitle = `${setQtyConfirm(scanDataRes.value)} kode serialisasi berhasil dikonfirmasi`
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
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
function hideSuccessFeedback() {
  scanDataRes.value = []
  getData()
  tFeedbackRef.value.show = false
}
function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk melakukan adjustment?'
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
            <n-h1 style="font-weight: 500; font-size: 16px; margin: auto;">
              Kode Produk : {{ productDataRes.product?.item_code }}
            </n-h1>
            <n-tag
              round
              :bordered="false"
              strong
              :type="detailDataRes.status === 'complete' ? 'success' : 'warning'"
              size="large"
            >
              {{ detailDataRes.status }}
            </n-tag>
          </n-space>
        </n-space>
    
        <n-row :cols="12">
          <n-col :span="6">
            <n-space vertical>
              <n-text>Nama Produk : {{ productDataRes.product?.short_name }}</n-text>
              <n-text>Batch : {{ productDataRes.batch }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical>
              <n-text>Building : {{ productDataRes.from?.building?.name }}</n-text>
              <n-text>Room : {{ productDataRes.from?.room?.name }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical>
              <n-text>Rack : {{ productDataRes.from?.rack_pallete?.name }}</n-text>
              <n-text>Bin : {{ productDataRes.from?.bin?.name }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-card
              style="width: 300px; text-align: center; border-radius: 15px; background: #eee;"
            >
              <n-p style="font-size: 14px">Qty Terkonfirmasi/Qty Adjust</n-p>
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
            v-if="setQtyConfirm(listDetailDataRes.list) !== detailDataRes.total_qty"
            class="card-tnt"
            style="margin-top: 0; background-color: #eeeeee;"
          >
            <n-space vertical align="center">
              <n-text>Silakan masukkan Kode Serialisasi</n-text>
              <n-space>
                <n-input
                  ref="input"
                  v-model:value="codeScan"
                  placeholder=""
                  clearable
                  @keyup.enter="handleClickScan"
                  style="width: 35rem"
                ></n-input>
                <n-button
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
              <n-button
                type="primary"
                text
                @click.prevent="handleShowMissingProduct"
              >
                Ambil Kode dari Warehouse Produk Hilang
              </n-button>
              <n-p style="font-size: 0.8rem">Atau Scan Kode</n-p>
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
          <n-text>Serialisasi Terscan / Warehouse Hilang</n-text>
          <div
            class="table-tnt"
            style="margin-top: 10px"
          >
            <n-table :single-line="false" :bottom-bordered="false" :bordered="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
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
                  <th style="text-align: center">Level</th>
                  <th>Batch</th>
                  <th style="text-align: center">Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="list, i in listDetailDataRes.list" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ (list as any).serialize?.code }}</td>
                  <td style="text-align: center">{{ (list as any).serialize?.level }}</td>
                  <td>{{ (list as any).serialize?.batch }}</td>
                  <td style="text-align: center">{{ (list as any).serialize?.first_level_qty }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </div>

      </n-space>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'penyimpanan-penyesuaian-id' }" class="text-decoration-none">
          <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
        <template v-if="detailDataRes.status === 'pending'">
          <n-button
            :disabled="scanDataRes.length === 0"
            :loading="isBtnLoading"
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

  <modal-produk-hilang
    :show="modalMissingProduct.show"
    :product="productDataRes"
    @click:close="handleCloseMissingProduct"
    @click:input="handleInputMissingProduct"
  />

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
    :align="tFeedbackRef.align"
  >
    <n-space justify="center">
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

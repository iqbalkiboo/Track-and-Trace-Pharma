<script setup lang="ts">
import { useMessage, NInput } from "naive-ui"
import { CheckmarkCircleOutline } from "@vicons/ionicons5"
import moment from "moment"
import { auth } from "@/models/auth"
import { serialisasiExternalModel } from "@/models/penerimaan/serialisasi-external"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const productDataRes = ref<any>({})
const listDetailDataRes = ref<any>({})
const scanDataRes = ref<any>([])
const codeScan = ref("")
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: "Alasan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}
const input = ref<typeof NInput | null>(null)

onMounted(() => {
  authData.value = auth.getAuth()
  getData()
})

async function getData() {
  isLoading.value = true
  getDetailSerialize()
  await getDetailSerializeProduct()
  await getSerializeDetailList()
  isLoading.value = false
}

async function getDetailSerialize() {
  const id = route.params.id
  await serialisasiExternalModel
    .getDetailSerialize(id)
    .then((res) => {
      detailDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDetailSerializeProduct() {
  const productId = route.query.product_id
  await serialisasiExternalModel
    .getDetailSerializeProduct(productId)
    .then(async (res) => {
      productDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getSerializeDetailList() {
  const productId = route.query.product_id
  const params = {
    import_serialization_id: route.params.id,
    import_serialization_product_id: productId,
    is_scan: true,
    limit: 1000,
  }
  await serialisasiExternalModel
    .getSerializeDetailList(params)
    .then(async (res) => {
      listDetailDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function handleClickScan() {
  isBtnLoading.value = true

  const productId = route.query.product_id
  const params = {
    code: codeScan.value,
    import_serialization_product_id: productId,
  }
  await serialisasiExternalModel
    .scanSerializeExternal(params)
    .then((res) => {
      if (scanDataRes.value.length > 0) {
        if (
          parseInt(res?.data?.serialize?.first_level_qty) +
            setQtyConfirm(listDetailDataRes.value.list) +
            setQtyConfirm(scanDataRes.value) >
          productDataRes.value.qty
        ) {
          tMessage.error("Qty serialisasi tidak dapat melebihi Qty DO")
        } else {
          scanDataRes.value.forEach((el: any) => {
            if (el.id === res.data.id) {
              tMessage.error("Kode serialisasi sudah ada di list")
            } else {
              const filterData = scanDataRes.value.filter(
                (scan: any) => scan.id !== res.data.id
              )
              scanDataRes.value = filterData
              scanDataRes.value.push(res.data)
              input.value?.focus()
            }
          })
        }
      } else {
        if (
          parseInt(res?.data?.serialize?.first_level_qty) +
            setQtyConfirm(listDetailDataRes.value.list) >
          productDataRes.value.qty
        ) {
          tMessage.error("Qty serialisasi tidak dapat melebihi Qty TO")
        } else {
          if (listDetailDataRes.value.list.length > 0) {
            listDetailDataRes.value.list.forEach((el: any) => {
              if (el.serialize.id === res.data.id) {
                tMessage.error("Kode serialisasi sudah ada di list")
              } else {
                scanDataRes.value.push(res.data)
                input.value?.focus()
              }
            })
          } else {
            scanDataRes.value.push(res.data)
            input.value?.focus()
          }
        }
      }
      codeScan.value = ""
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      codeScan.value = ""
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function setQtyConfirm(data: any) {
  if (data) {
    let qty = 0
    data.forEach((el: any) => {
      qty += el.serialize.first_level_qty
    })
    return qty
  } else {
    return 0
  }
}

function handleShowConfirm() {
  showConfirmFeedback()
}

function handleClickConfirm() {
  isBtnLoading.value = true

  let code: string[] = []
  scanDataRes.value.forEach((el: any) => {
    code.push(el.serialize?.code)
  })

  const productId = route.query.product_id
  serialisasiExternalModel
    .confirmSerializeExternal({
      code,
      import_serialization_id: route.params.id,
      import_serialization_product_id: productId,
    })
    .then(() => {
      isBtnLoading.value = false
      setTimeout(() => {
        tFeedbackRef.value.title = "Berhasil Konfirmasi"
        tFeedbackRef.value.subtitle = `${setQtyConfirm(
          scanDataRes.value
        )} kode serialisai berhasil dikonfirmasi`
        showSuccessFeedback()
      }, 300)
    })
    .catch((err: any) => {
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
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk melakukan konfirmasi serialisasi?"
  tFeedbackRef.value.show = true
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
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
      <n-space justify="space-between">
        <n-h2 style="margin-bottom: 10px; margin-top: 5px; margin-bottom: 0"
          >No DO Vendor : {{ detailDataRes.vendor_no }}</n-h2
        >
        <n-tag
          round
          :bordered="false"
          strong
          :type="
            detailDataRes.status === 'complete'
              ? 'success'
              : detailDataRes.status === 'pending'
              ? 'warning'
              : detailDataRes.status === 'cancel'
              ? 'error'
              : 'default'
          "
          size="large"
        >
          {{ $filters.toStatus(detailDataRes.status) }}
        </n-tag>
      </n-space>
      <n-row
        gutter="16"
        style="margin-top: 14px"
      >
        <n-col :span="8">
          <n-space
            vertical
            :size="0"
          >
            <n-text
              >Tanggal DO :
              {{
                moment(detailDataRes.created_at).format("yyyy-MM-DD")
              }}</n-text
            >
            <n-text
              >Kode Produk : {{ productDataRes?.product?.item_code }}</n-text
            >
            <n-text
              >Nama Produk : {{ productDataRes?.product?.short_name }}</n-text
            >
          </n-space>
        </n-col>
        <n-col :span="8">
          <n-space
            vertical
            :size="0"
          >
            <n-text
              >Batch : {{ $filters.isEmpty(productDataRes.batch) }}</n-text
            >
            <n-text
              >Exp Date :
              {{
                moment(productDataRes.expired_date).format("yyyy-MM-DD")
              }}</n-text
            >
          </n-space>
        </n-col>
        <n-col :span="8">
          <n-space
            vertical
            :size="10"
            align="end"
          >
            <n-card
              style="
                width: 250px;
                text-align: center;
                border-radius: 15px;
                background: #eee;
              "
            >
              <n-p style="font-size: 14px">Qty Terkonfirmasi/Qty DO :</n-p>
              <n-h4 style="margin-top: 0; margin-bottom: 0">
                {{
                  productDataRes?.current_qty +
                  "/" +
                  $filters.toNumber(productDataRes?.qty)
                }}
              </n-h4>
            </n-card>
          </n-space>
        </n-col>
      </n-row>

      <n-space
        vertical
        :size="24"
        style="margin-top: 24px"
      >
        <template
          v-if="listDetailDataRes?.list && detailDataRes.status !== 'cancel'"
        >
          <div
            v-if="setQtyConfirm(listDetailDataRes.list) !== productDataRes?.qty"
            class="card-tnt"
            style="margin-top: 0; background-color: #eeeeee"
          >
            <n-space
              vertical
              align="center"
            >
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
            <n-table
              :single-line="false"
              :bottom-bordered="false"
              :bordered="false"
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th>Batch</th>
                  <th style="text-align: center">Level</th>
                  <th style="text-align: center">Qty</th>
                  <th style="text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(list, i) in scanDataRes"
                  :key="i"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ (list as any).serialize?.code }}</td>
                  <td>{{ (list as any).serialize?.batch }}</td>
                  <td style="text-align: center">
                    {{ (list as any).serialize?.level }}
                  </td>
                  <td style="text-align: center">
                    {{ (list as any).serialize?.first_level_qty }}
                  </td>
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
            <n-table
              :single-line="false"
              :bottom-bordered="false"
              :bordered="false"
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th>Batch</th>
                  <th style="text-align: center">Level</th>
                  <th style="text-align: center">Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(list, i) in listDetailDataRes.list"
                  :key="i"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ (list as any).serialize?.code }}</td>
                  <td>{{ (list as any).serialize?.batch }}</td>
                  <td style="text-align: center">
                    {{ (list as any).serialize?.level }}
                  </td>
                  <td style="text-align: center">
                    {{ (list as any).serialize?.first_level_qty }}
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
        <router-link
          :to="{ name: 'penerimaan-serialisasi-external-id' }"
          class="text-decoration-none"
        >
          <n-button
            :loading="isBtnLoading"
            color="#828282"
            class="button-tnt"
            style="width: 120px"
            >Kembali</n-button
          >
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
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          type="primary"
          class="button-tnt"
          @click="handleClickConfirm"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideSuccessFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

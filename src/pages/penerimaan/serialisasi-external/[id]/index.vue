<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import {
  CheckmarkCircleOutline,
  EllipsisVertical,
  SearchOutline,
} from "@vicons/ionicons5"
import moment from "moment"
import { serialisasiExternalModel } from "@/models/penerimaan/serialisasi-external"
import ModalInputBuilding from "../modal/modal-input-building.vue"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const productDataRes = ref<any>({})
const params = ref<any>({
  search: "",
  status: "",
  sort: "desc",
  dir: "created_at",
  page: 1,
  limit: 10000,
})
const formValue = ref<any>({})
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: "Alasan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}
const modalInputBuilding = ref<any>({
  show: false,
  form: {},
  loading: isBtnLoading,
})
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
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}
const actionOptions = [
  { label: "Scan", key: "scan", icon: renderIcon(SearchOutline) },
]
const actionFullOptions = [
  { label: "Detail", key: "detail", icon: renderIcon(SearchOutline) },
]

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  await getDetailSerialize()
  await getSerializeProduct()
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

async function getSerializeProduct() {
  params.value.import_serialization_id = route.params.id
  await serialisasiExternalModel
    .getSerializeProduct(params.value)
    .then((res) => {
      productDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

const timerSearch = ref<any>(0)
function searchData() {
  //reset param page
  params.value.page = 1
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getData()
  }, 600 || 0)
}
function goToDetailProduct(id: string) {
  router.push({
    name: "penerimaan-serialisasi-external-id-detail-produk",
    query: {
      product_id: id,
    },
  })
}

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "scan":
      router.push({
        name: "penerimaan-serialisasi-external-id-scan",
        query: {
          product_id: id,
        },
      })
      break
    case "detail":
      router.push({
        name: "penerimaan-serialisasi-external-id-scan",
        query: {
          product_id: id,
        },
      })
      break

    default:
      break
  }
}

function handleShowConfirm() {
  if (detailDataRes?.value.total_current_qty < detailDataRes?.value.total_qty) {
    showConfirmFeedback()
  } else {
    handleShowInputBuilding()
  }
}

function handleShowInputBuilding() {
  modalInputBuilding.value.show = true
  hideFeedback()
}

function handleCloseInputBuilding() {
  modalInputBuilding.value.show = false
}

function handleConfirmInputBuilding() {
  isBtnLoading.value = true
  const params = {
    import_serialization_id: route.params.id,
    warehouse_building_id: modalInputBuilding.value.form.building,
  }

  serialisasiExternalModel
    .approveSerializeExternal(params)
    .then(() => {
      isBtnLoading.value = false
      handleCloseInputBuilding()
      getData()
      modalInputBuilding.value.form = {}
      setTimeout(() => {
        tFeedbackRef.value.title = "Berhasil Approve"
        tFeedbackRef.value.subtitle =
          detailDataRes.value.vendor_no + " berhasil diapprove"
        showSuccessFeedback()
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle = `Anda belum melakukan scan pada semua serialisasi. Terima ${detailDataRes?.value.total_current_qty} serialisasi saja?`
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.show = true
}

function hideFeedback() {
  tFeedbackRef.value.show = false
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
        <n-col :span="12">
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
            <n-text>No PO : {{ detailDataRes.code }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="12">
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
                  $filters.toNumber(detailDataRes?.total_current_qty) +
                  "/" +
                  $filters.toNumber(detailDataRes?.total_qty)
                }}
              </n-h4>
            </n-card>
          </n-space>
        </n-col>
      </n-row>

      <div class="card-tnt">
        <n-row
          v-if="false"
          gutter="16"
        >
          <n-col :span="6">
            <n-input
              v-model:value="params.search"
              @update:value="searchData"
              clearable
              type="text"
              placeholder="Cari Kode Transfer Order"
            />
          </n-col>
        </n-row>
        <div
          class="table-tnt"
          style="margin-top: 0"
        >
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>Batch</th>
                    <th>Exp Date</th>
                    <th style="text-align: center">Qty DO</th>
                    <th style="text-align: center">Qty Terkonfirmasi</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="productDataRes.list.length > 0">
                    <tr
                      v-for="(list, i) in productDataRes.list"
                      :key="i"
                    >
                      <td data-label="No">
                        {{ params.limit * (params.page - 1) + (i + 1) }}
                      </td>
                      <td data-label="Kode Produk">
                        <n-text
                          type="primary"
                          strong
                          style="cursor: pointer; text-decoration: underline"
                          @click.prevent="goToDetailProduct(list?.id)"
                        >
                          {{ list?.product?.item_code }}
                        </n-text>
                      </td>
                      <td data-label="Nama Produk">
                        {{ list?.product?.short_name }}
                      </td>
                      <td data-label="Batch">
                        {{ $filters.isEmpty(list?.batch) }}
                      </td>
                      <td data-label="Exp Date">
                        {{ moment(list?.expired_date).format("yyyy-MM-DD") }}
                      </td>
                      <td
                        data-label="Qty DO"
                        style="text-align: center"
                      >
                        {{ $filters.toNumber(list?.qty) }}
                      </td>
                      <td
                        data-label="Qty Terkonfirmasi"
                        style="text-align: center"
                      >
                        {{ $filters.toNumber(list?.current_qty) }}
                      </td>
                      <td
                        data-label="Aksi"
                        style="text-align: center"
                      >
                        <n-dropdown
                          placement="bottom-end"
                          :options="
                            list.is_full ? actionFullOptions : actionOptions
                          "
                          @select="handleSelectDropdown($event, list?.id)"
                        >
                          <n-button tertiary>
                            <template #icon>
                              <n-icon><ellipsis-vertical /></n-icon>
                            </template>
                          </n-button>
                        </n-dropdown>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td
                        colspan="8"
                        style="text-align: center"
                      >
                        Belum ada data tersedia
                      </td>
                    </tr>
                  </template>
                </tbody>
              </n-table>
            </n-scrollbar>
          </template>
        </div>
      </div>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'penerimaan-serialisasi-external' }"
          class="text-decoration-none"
        >
          <n-button
            :loading="isBtnLoading"
            color="#828282"
            class="button-tnt"
            >Kembali</n-button
          >
        </router-link>
        <n-button
          v-if="
            detailDataRes.status
              ? detailDataRes.status !== 'cancel' &&
                detailDataRes.status !== 'complete'
              : false
          "
          :disabled="detailDataRes?.total_current_qty < 1"
          :loading="isBtnLoading"
          type="primary"
          class="button-tnt"
          @click="handleShowConfirm"
        >
          Approve
        </n-button>
      </div>
    </div>
  </div>

  <modal-input-building
    :show="modalInputBuilding.show"
    :value="modalInputBuilding.form"
    :loading="isBtnLoading"
    @click:close="handleCloseInputBuilding"
    @click:confirm="handleConfirmInputBuilding"
  ></modal-input-building>

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
          @click="handleShowInputBuilding"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

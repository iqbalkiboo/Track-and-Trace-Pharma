<script setup lang="ts">
import { useMessage } from "naive-ui"
import {
  CheckmarkCircleOutline,
  EllipsisVertical,
  PencilOutline,
} from "@vicons/ionicons5"
import moment from "moment"
import { auth } from "@/models/auth"
import { serialisasiExternalModel } from "@/models/penerimaan/serialisasi-external"
import ModalEditSerialisasi from "../modal/modal-edit-serialisasi.vue"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const isTableLoading = ref(false)
const detailDataRes = ref<any>({})
const productDataRes = ref<any>({})
const listDetailDataRes = ref<any>({})
const params = ref({
  sort: "desc",
  dir: "serialize.level",
  import_serialization_id: route.params.id,
  import_serialization_product_id: route.query.product_id,
  is_scan: null,
  limit: 10000,
})
const options = ref<any>([
  {
    label: "Semua",
    value: null,
  },
  {
    label: "Sudah discan",
    value: true,
  },
  {
    label: "Belum discan",
    value: false,
  },
])
const optionsSortLevel = ref<any>([
  {
    label: "Level Tertinggi",
    value: "desc",
  },
  {
    label: "Level Terendah",
    value: "asc",
  },
])
const actionOptions = [
  { label: "Edit Serialisasi", key: "edit", icon: renderIcon(PencilOutline) },
]
const modalEditSerialisasi = ref<any>({
  show: false,
  form: {},
  data: {},
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
  isTableLoading.value = true
  await serialisasiExternalModel
    .getSerializeDetailList(params.value)
    .then(async (res) => {
      listDetailDataRes.value = res.data
      isTableLoading.value = false
    })
    .catch((err: any) => {
      isTableLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function handleSelectDropdown(key: string | number, data: any) {
  switch (key) {
    case "edit":
      modalEditSerialisasi.value.show = true
      modalEditSerialisasi.value.data = data
      break

    default:
      break
  }
}

function handleCloseEditSerialisasi() {
  modalEditSerialisasi.value.show = false
}

function handleConfirmEditSerialisasi() {
  isBtnLoading.value = true
  const id = modalEditSerialisasi.value.data.id
  const params = {
    serialize_code: modalEditSerialisasi.value.form.serialize_code,
  }

  serialisasiExternalModel
    .updateSerializeCode(id, params)
    .then(() => {
      isBtnLoading.value = false
      handleCloseEditSerialisasi()
      getSerializeDetailList()
      modalEditSerialisasi.value.form = {}
      setTimeout(() => {
        tFeedbackRef.value.title = "Berhasil Edit"
        tFeedbackRef.value.subtitle = "Anda berhasil mengubah kode serialisasi"
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
  tFeedbackRef.value.show = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle = `Anda akan mengedit Serialisasi Level ${modalEditSerialisasi.value.data.serialize.level} "${modalEditSerialisasi.value.data.serialize.code}" menjadi "${modalEditSerialisasi.value.form.serialize_code}"`
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = "#219653"
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
      <n-space justify="space-between">
        <n-h2 style="margin-bottom: 10px; margin-top: 5px; margin-bottom: 0"
          >Nama Produk : {{ productDataRes?.product?.short_name }}</n-h2
        >
        <n-tag
          round
          :bordered="false"
          strong
          :type="detailDataRes.status === 'complete' ? 'success' : 'warning'"
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
              >Kode Produk : {{ productDataRes?.product?.item_code }}</n-text
            >
            <n-text>No DO Vendor : {{ detailDataRes.vendor_no }}</n-text>
          </n-space>
        </n-col>
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
            <n-text>No PO : {{ detailDataRes.code }}</n-text>
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
              <n-p style="font-size: 14px">Qty Terkonfirmasi/Qyt DO :</n-p>
              <n-h4 style="margin-top: 0; margin-bottom: 0">
                {{
                  $filters.toNumber(productDataRes.current_qty) +
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
        <div
          class="card-tnt"
          style="margin-top: 0"
        >
          <n-row gutter="16">
            <n-col :span="6">
              <n-select
                placeholder="Pilih Status Scan"
                v-model:value="params.is_scan"
                :options="options"
                @update:value="getSerializeDetailList"
              />
            </n-col>
            <n-col :span="6">
              <n-select
                placeholder="Pilih Urutan Level"
                v-model:value="params.sort"
                :options="optionsSortLevel"
                @update:value="getSerializeDetailList"
              />
            </n-col>
          </n-row>
          <div class="table-tnt">
            <template v-if="isTableLoading">
              <t-loading></t-loading>
            </template>
            <template v-else>
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
                    <th style="text-align: center; width: 3rem">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="listDetailDataRes?.list?.length > 0">
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
                      <td
                        data-label="Aksi"
                        style="text-align: center"
                      >
                        <n-dropdown
                          placement="bottom-end"
                          :options="actionOptions"
                          @select="handleSelectDropdown($event, list)"
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
                        colspan="6"
                        style="text-align: center"
                      >
                        Belum ada data tersedia
                      </td>
                    </tr>
                  </template>
                </tbody>
              </n-table>
            </template>
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
            color="#828282"
            class="button-tnt"
            style="width: 120px"
            >Kembali</n-button
          >
        </router-link>
      </div>
    </div>
  </div>

  <modal-edit-serialisasi
    :show="modalEditSerialisasi.show"
    :value="modalEditSerialisasi.form"
    :data="modalEditSerialisasi.data"
    :loading="isBtnLoading"
    @click:close="handleCloseEditSerialisasi"
    @click:confirm="showConfirmFeedback"
  ></modal-edit-serialisasi>

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
          @click="handleConfirmEditSerialisasi"
        >
          Konfirmasi
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

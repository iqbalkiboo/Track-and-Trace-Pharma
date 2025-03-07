<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
import {
  EllipsisVertical,
  CheckmarkDoneOutline,
  CheckmarkCircleOutline,
  SearchOutline,
} from "@vicons/ionicons5"
import moment from "moment"
import { fakturKembaliModel } from "@/models/pengiriman/faktur-kembali"
// import { SetLanguageStatusToIndonesian } from "@/helpers/setStatus"
import ModalTerima from "./modal/modal-terima.vue"
import constants from "@/helpers/constant"
import { ref } from "vue"
import { scanReception } from "@/models/penerimaan/reception"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  code: "",
  sort: "created_at",
  dir: "desc",
  status: "finish",
  page: 1,
  limit: 10,
})
const modalAccept = ref<any>({
  show: false,
  data: {},
  form: {},
})
const tFeedbackRef = ref({
  show: ref(false),
  type: "",
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
})

// const status = new SetLanguageStatusToIndonesian()

const optionsDropdown = ref([
  {
    label: "Detail",
    key: "detail",
    icon: renderIcon(SearchOutline),
    disabled: false,
  },
  {
    label: "Terima",
    key: "terima",
    icon: renderIcon(CheckmarkDoneOutline),
    disabled: false,
  },
  // {
  //   label: "Lacak Manifest",
  //   key: "lacak",
  //   icon: renderIcon(LocationOutline),
  //   disabled: false,
  // },
])

const optionsCompleteDropdown = ref([
  {
    label: "Detail",
    key: "detail",
    icon: renderIcon(SearchOutline),
    disabled: false,
  },
])

function handleSelectDropdown(key: string | number, id: string, data: any) {
  switch (key) {
    case "detail":
      router.push({
        path: `/pengiriman/faktur-kembali/${id}/detail`,
      })
      break
    case "terima":
      modalAccept.value.show = true
      modalAccept.value.data = data
      code.value = data.code
      break
    case "lacak":
      router.push({
        path: `/lacak/manifest/${id}`,
      })
      break

    default:
      break
  }
}

onMounted(() => {
  if (!filters.checkPermission(constants.accessDelivery.pengirimanFakturKembali + ".list")) {
    return router.push('/')
  }
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await fakturKembaliModel
    .getDO(params.value)
    .then((res) => {
      dataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      tFeedbackRef.value.show = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
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
function handleCloseModalAccept() {
  modalAccept.value.show = false
  modalAccept.value.form = {}
}

function handleConfirmModalAccept() {
  isBtnLoading.value = true

  fakturKembaliModel
    .updateFakturKembali(code.value)
    .then(() => {
      isShowModalScan.value = false
      getData()
      setTimeout(() => {
        modalAccept.value.show = false
        showSuccessFeedback()
        isBtnLoading.value = false
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Dokumen Serah Terima telah diterima"
  tFeedbackRef.value.show = true
}

const code = ref("")
const loadingScan = ref(false)

const isShowModalScan = ref(false)
function showModalScan() {
  code.value = ''
  isShowModalScan.value = true
}
async function handleScanned() {
  handleConfirmModalAccept()
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Faktur Kembali</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Faktur Kembali</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <n-space
        align="center"
        justify="space-between"
      >
        <n-space align="center">
          <n-input
            placeholder="Cari No Invoice"
            v-model:value="params.code"
            @keyup="searchData"
          />
        </n-space>
        <n-button
          @click.prevent="showModalScan"
          class="button-tnt"
          type="primary"
        >Scan Invoice</n-button
        >
      </n-space>
      <div class="table-tnt">
        <template v-if="isLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <n-scrollbar x-scrollable>
            <n-table :single-line="true">
              <n-thead>
                <n-tr style="border-radius: 20px">
                  <n-th>No</n-th>
                  <n-th>No. Invoice</n-th>
                  <n-th>Tanggal</n-th>
                  <n-th>No. Quotation</n-th>
                  <n-th>Tujuan</n-th>
                  <n-th v-if="false">Jenis Kendaraan</n-th>
                  <n-th>SLA Faktur Kembali</n-th>
                  <n-th>Status Faktur</n-th>
                  <n-th>Driver</n-th>
                  <n-th style="text-align: center">Aksi</n-th>
                </n-tr>
              </n-thead>

              <n-tbody>
                <template v-if="dataRes.list.length > 0">
                  <n-tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <n-td data-label="No">{{
                      params.limit * (params.page - 1) + (i + 1)
                    }}</n-td>
                    <n-td data-label="No. Invoice">{{ list?.code }}</n-td>
                    <n-td data-label="Tanggal">{{
                      moment(list?.do_date).format("yyyy-MM-DD")
                    }}</n-td>
                    <n-td data-label="No. Invoice">{{
                      $filters.isEmpty(list?.no_invoice)
                    }}</n-td>
                    <n-td data-label="Tujuan">{{
                      list?.destination?.name
                    }}</n-td>
                    <n-td
                      v-if="false"
                      data-label="Jenis Kendaraan"
                      >{{ "?" }}</n-td
                    >
                    <n-td data-label="SLA Faktur Kembali">{{
                      $filters.isEmpty(list.sla?.invoice_return.days) + " Hari"
                    }}</n-td>
                    <n-td data-label="Status Faktur">
                      {{ $filters.isEmpty(list?.faktur?.status_faktur) }}
                    </n-td>
                    <n-td data-label="Driver">
                      {{ list?.manifest?.driver_info?.drivers[0]?.name }}
                    </n-td>
                    <n-td
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        trigger="click"
                        placement="bottom-end"
                        :options="
                          list?.faktur?.tanggal_terima_invoice
                            ? optionsCompleteDropdown
                            : optionsDropdown
                        "
                        :show-arrow="true"
                        @select="handleSelectDropdown($event, list.id, list)"
                      >
                        <n-button tertiary>
                          <template #icon>
                            <n-icon><ellipsis-vertical /></n-icon>
                          </template>
                        </n-button>
                      </n-dropdown>
                    </n-td>
                  </n-tr>
                </template>
                <template v-else>
                  <tr>
                    <td
                      colspan="10"
                      style="text-align: center"
                    >
                      Belum ada data tersedia
                    </td>
                  </tr>
                </template>
              </n-tbody>
            </n-table>
          </n-scrollbar>
        </template>
        <div class="table-footer">
          <n-pagination
            v-model:page="params.page"
            v-model:page-size="params.limit"
            :page-count="dataRes.total_page"
            :page-slot="7"
            :show-size-picker="dataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getData"
            @update:page-size="updatePageSize"
          />
        </div>
      </div>
    </div>
  </div>

  <modal-terima
    v-model:show="modalAccept.show"
    v-model:data="modalAccept.data"
    v-model:form="modalAccept.form"
    :loading="isBtnLoading"
    @click:close="handleCloseModalAccept"
    @click:confirm="handleConfirmModalAccept"
  >
  </modal-terima>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-scan-modal
    v-model:code="code"
    v-model:show="isShowModalScan"
    :loading="loadingScan"
    title="Scan Invoice"
    @scanned="handleScanned"
  />
</template>

<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
import {
  CheckmarkCircleOutline,
  CheckmarkOutline,
  EllipsisVertical,
  LocationOutline,
  SearchOutline,
} from "@vicons/ionicons5"
import { loadingModel } from "@/models/pengiriman/loading"
import { SetLanguageStatusToIndonesian } from "@/helpers/setStatus"
import ModalReject from "./modal/modal-reject.vue"
import constants from "@/helpers/constant"

const router = useRouter()
const tMessage = useMessage()

const status = new SetLanguageStatusToIndonesian()
const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const timerSearch = ref<any>(0)
const params = ref({
  code: "",
  sort: "desc",
  delivery_type: "direct_kendaraan",
  status: "driver_assigned,reject_submit,shipping",
  page: 1,
  limit: 10,
})
const selectedValue = ref<any>({
  code: "",
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
const modalReject = ref<any>({
  show: false,
  data: {},
})

function optionsDropdown(data: any) {
  let options: any = []
  if (data.status === "reject_submit") {
    options = []
    options.push(
      {
        label: "Terima Reject",
        key: "reject",
        icon: renderIcon(CheckmarkOutline),
        disabled: false,
      },
      {
        label: "Detail",
        key: "detail",
        icon: renderIcon(SearchOutline),
        disabled: false,
      },
      {
        label: "Lacak Manifest",
        key: "lacak",
        icon: renderIcon(LocationOutline),
        disabled: false,
      }
    )
  } else {
    options = []
    options.push(
      {
        label: "Detail",
        key: "detail",
        icon: renderIcon(SearchOutline),
        disabled: false,
      },
      {
        label: "Lacak Manifest",
        key: "lacak",
        icon: renderIcon(LocationOutline),
        disabled: false,
      }
    )
  }
  return options
}

function handleSelectDropdown(key: string | number, id: string, data: any) {
  switch (key) {
    case "detail":
      router.push({
        path: `/pengiriman/loading-driver/${id}/detail`,
      })
      break
    case "lacak":
      router.push({
        path: `/lacak/manifest/${id}`,
      })
      break
    case "reject":
      selectedValue.value.code = data.code
      handleShowModalReject()
      break

    default:
      break
  }
}

onMounted(() => {
  if (!filters.checkPermission(constants.accessDelivery.pengirimanLoadingDriver + ".list")) {
    return router.push('/')
  }
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  tFeedbackRef.value.show = false
  await loadingModel
    .getManifest(params.value)
    .then((res) => {
      dataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function searchData() {
  //reset param page
  params.value.page = 1
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getData()
  }, 600 || 0)
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

function handleShowModalReject() {
  modalReject.value.show = true
  modalReject.value.data.code = selectedValue.value.code
}

function handleCloseModalReject() {
  modalReject.value.show = false
}

function rejectAccept() {
  isBtnLoading.value = true
  const params = {
    manifest_code: selectedValue.value.code,
  }
  loadingModel
    .rejectAccept(params)
    .then(() => {
      handleCloseModalReject()
      setTimeout(() => {
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

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = `Reject Manifest ${selectedValue.value.code} telah berhasil. Assign Driver lainnya?`
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Loading Driver</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Loading Driver</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-row gutter="16">
        <n-col :span="6">
          <n-input
            v-model:value="params.code"
            @update:value="searchData"
            clearable
            placeholder="Cari Kode Manifest"
          />
        </n-col>
      </n-row>

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
                  <n-th>Kode Manifest</n-th>
                  <n-th>Kode DO</n-th>
                  <n-th>Tujuan</n-th>
                  <n-th style="text-align: right">Qty Packing</n-th>
                  <n-th style="text-align: right">Qty Load</n-th>
                  <n-th style="text-align: right">Volume(cm<sup>3</sup>)</n-th>
                  <n-th>Tipe Pengiriman</n-th>
                  <n-th style="text-align: center">Status</n-th>
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
                    <n-td data-label="No"
                      >{{ params.limit * (params.page - 1) + (i + 1) }}
                    </n-td>
                    <n-td data-label="Kode Manifest">{{ list.code }}</n-td>
                    <n-td data-label="No. DO">{{ list.do?.code }}</n-td>
                    <n-td data-label="Tujuan"
                      >{{ list.do?.destination?.name }}
                    </n-td>
                    <n-td
                      data-label="Qty Packing"
                      style="text-align: right"
                      >{{ $filters.toNumber(list.total?.packing) }}
                    </n-td>
                    <n-td
                      data-label="Qty Load"
                      style="text-align: right"
                      >{{ $filters.toNumber(list.total?.qty) }}
                    </n-td>
                    <n-td
                      data-label="Volume (cm3)"
                      style="text-align: right"
                      >{{ $filters.toNumber(list.volume) }}
                    </n-td>
                    <n-td data-label="Tipe Pengiriman">
                      {{ list.delivery_type }}
                    </n-td>
                    <n-td
                      data-label="Status"
                      style="text-align: center"
                    >
                      <n-tag
                        round
                        :bordered="false"
                        :type="
                          list.status == 'siap_dikirim'
                            ? 'warning'
                            : list.status == 'agregasi'
                            ? 'error'
                            : list.status == 'Loaded'
                            ? 'info'
                            : 'success'
                        "
                      >
                        <span style="text-transform: capitalize">{{
                          status.LoadingDriver(list.status)
                        }}</span>
                      </n-tag>
                    </n-td>
                    <n-td data-label="Driver">
                      <div
                        v-for="(driver, iD) in list.driver_info?.drivers"
                        :key="iD"
                      >
                        {{ driver.is_assigned ? driver.name : "" }}
                      </div>
                    </n-td>
                    <n-td
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        placement="bottom-end"
                        :options="optionsDropdown(list)"
                        :show-arrow="true"
                        @select="handleSelectDropdown($event, list._id, list)"
                      >
                        <n-button tertiary>
                          <template #icon>
                            <n-icon>
                              <ellipsis-vertical />
                            </n-icon>
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

  <modal-reject
    v-model:show="modalReject.show"
    v-model:data="modalReject.data"
    :is-btn-loading="isBtnLoading"
    @click:close="handleCloseModalReject"
    @click:confirm="rejectAccept"
  ></modal-reject>

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
          color="#828282"
          class="button-tnt"
          @click.prevent="getData"
        >
          Tutup
        </n-button>
        <router-link
          :to="'/pengiriman/assign-driver'"
          class="text-decoration-none"
        >
          <n-button
            :loading="isBtnLoading"
            color="#219653"
            class="button-tnt"
          >
            Assign Driver
          </n-button>
        </router-link>
      </template>
    </n-space>
  </t-feedback>
</template>
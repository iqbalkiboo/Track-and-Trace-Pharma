<script setup lang="ts">
import type { SelectOption } from "naive-ui"
import { NIcon, useMessage } from "naive-ui"
import { EllipsisVertical, LocationOutline, SearchOutline } from "@vicons/ionicons5"
import { monitoringDriverModel } from "@/models/pengiriman/monitoring-driver"
import { SetLanguageStatusToIndonesian } from "@/helpers/setStatus"
import constants from "@/helpers/constant"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  status: "",
  sort: "created_at",
  dir: "desc",
  page: 1,
  limit: 10,
})
const status = new SetLanguageStatusToIndonesian()

const options: SelectOption[] = [
  { label: "Create DO", value: "Create DO" },
  { label: "Create Package", value: "Create Package" },
  { label: "Packaged", value: "Packaged" },
]
const optionsStatus = ref([
  {
    label: "Perlu Agregasi",
    value: "perlu_agregasi",
  },
  {
    label: "Ready to Delivery",
    value: "ready_to_delivery",
  },
  {
    label: "On Delivery",
    value: "on_delivery",
  },
  {
    label: "Finish",
    value: "finish",
  },
])

const optionsTable = [
  {
    label: "Lihat Detail",
    key: "detail",
    icon: renderIcon(SearchOutline),
  },
  {
    label: "Lacak DO",
    key: "lacak",
    icon: renderIcon(LocationOutline),
    disabled: false,
  },
]

onMounted(() => {
  if (!filters.checkPermission(constants.accessDelivery.pengirimanMonitorDelivery + ".list")) {
    return router.push('/')
  }
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await monitoringDriverModel
    .getMonitoringDriver(params.value)
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

const timerSearch = ref<any>(0)
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
function handleUpdateStatus(value: any) {
  params.value.status = value ? value : null
  getData()
}

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "detail":
      router.push({
        name: "pengiriman-monitoring-id-detail",
        params: { id: id },
      })
      break
    case "lacak":
      router.push({
        path: `/lacak/do/${id}`,
      })
      break

    default:
      break
  }
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical>
      <n-space
        vertical
        :size="0"
      >
        <n-h2 style="margin-bottom: 0">Monitoring Delivery</n-h2>
        <n-breadcrumb>
          <n-breadcrumb-item>Monitoring Delivery</n-breadcrumb-item>
        </n-breadcrumb>
      </n-space>
    </n-space>

    <div class="card-tnt">
      <n-grid
        cols="4"
        x-gap="12"
        style="margin-top: 1rem"
      >
        <n-gi>
          <n-input
            v-model:value="params.search"
            @update:value="searchData"
            clearable
            placeholder="Cari Kode DO"
          />
        </n-gi>
        <n-gi>
          <n-select
            :options="optionsStatus"
            @update:value="handleUpdateStatus"
            clearable
            filterable
            placeholder="Pilih Status"
          />
        </n-gi>
      </n-grid>
      <div class="table-tnt">
        <template v-if="isLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <n-scrollbar x-scrollable>
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th style="text-align: center">No</th>
                  <th>ID DO</th>
                  <!-- <th>Driver</th> -->
                  <th style="text-align: center">Qty Manifest</th>
                  <th>Tujuan</th>
                  <th style="text-align: center">Qty Packing</th>
                  <th style="text-align: center">SLA Pengiriman</th>
                  <th style="text-align: center">Parameter SLA</th>
                  <th style="text-align: center">Durasi Pengiriman</th>
                  <th style="text-align: center">TTD Customer</th>
                  <th>Status</th>
                  <th style="text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dataRes.list.length > 0">
                  <tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <td
                      data-label="No"
                      style="text-align: center"
                    >
                      {{ params.limit * (params.page - 1) + (i + 1) }}
                    </td>
                    <td data-label="Kode Delivery Order">
                      {{ list.code }}
                    </td>
                    <!-- <td>{{ list.driver?.name }}</td> -->
                    <td
                      data-label="Qty Manifest "
                      style="text-align: center"
                    >
                      {{ list.total?.manifest }}
                    </td>
                    <td data-label="Tujuan">
                      {{ list.destination?.address?.province?.name || "-" }}
                    </td>
                    <td
                      data-label="Qty Packing "
                      style="text-align: center"
                    >
                      {{ list.total?.qty_packed }}
                    </td>
                    <td data-label="SLA Pengiriman" class="text-center">
                      <span v-if="typeof list.customer.standart_sla === 'string'">
                        {{ $filters.isEmpty(list.customer.standart_sla) }} hari
                      </span>
                    </td>
                    <td data-label="Parameter SLA" class="text-center">
                      <n-tag
                        v-if="list.sla?.delivery.status"
                        type="warning"
                        strong
                        :bordered="false"
                        round
                      >
                        {{ list.sla?.delivery.status }}
                      </n-tag>
                    </td>
                    <td data-label="Durasi Pengiriman" class="text-center">
                      <span v-if="typeof list.sla?.delivery?.days === 'number'">
                        {{ $filters.isEmpty(list.sla?.delivery.days) }} hari
                      </span>
                    </td>
                    <td data-label="TTD Customer" class="text-center">
                      {{ list?.signature ? 'Sudah' : 'Belum' }}
                    </td>
                    <td data-label="Status">
                      <n-tag
                        type="warning"
                        strong
                        :bordered="false"
                        round
                      >
                        {{ status.MonitoringDelivery(list.status) }}
                      </n-tag>
                    </td>
                    <td
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        show-arrow
                        placement="bottom-end"
                        :options="optionsTable"
                        @select="handleSelectDropdown($event, list._id)"
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
                      colspan="9"
                      style="text-align: center !important"
                      class="not-content"
                    >
                      Belum ada data tersedia
                    </td>
                  </tr>
                </template>
              </tbody>
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
</template>

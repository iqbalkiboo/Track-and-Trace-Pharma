<script setup lang="ts">
import { useMessage } from "naive-ui"
import { assignDriverModel } from "@/models/pengiriman/assign-driver"
import {
  ArrowRedoOutline,
  CheckmarkCircle,
  EllipsisVertical,
  Hourglass,
  ReloadOutline,
  WarningOutline,
  ArrowDownOutline,
} from "@vicons/ionicons5"
import { SetLanguageStatusToIndonesian } from "@/helpers/setStatus"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import constants from "@/helpers/constant"

onMounted(() => {
  if (!filters.checkPermission(constants.accessDelivery.pengirimanAssignDriver + ".list")) {
    return router.push('/')
  }
  getData()
  getDataWarehouse()
})

const router = useRouter()
const params = ref<any>({
  code: "",
  sort: "desc",
  sortBy: "created_at",
  delivery_type: "direct_kendaraan",
  status: "need_assign_driver,reject_accept",
  page: 1,
  limit: 10,
})
const tMessage = useMessage()
const status = new SetLanguageStatusToIndonesian()
const isLoading = ref(false)
const dataRes = ref<any>({})
const optionsDestionations = ref<any>([])
const optionsStatus = ref([
  {
    label: "Need Assign Driver",
    value: "need_assign_driver",
  },
  {
    label: "Driver Assigned",
    value: "driver_assigned",
  },
  {
    label: "Shipping",
    value: "shipping",
  },
  {
    label: "Accepted",
    value: "accepted",
  },
])

async function getData() {
  isLoading.value = true
  await assignDriverModel
    .getmanifest(params.value)
    .then((res: any) => {
      dataRes.value = res.data
      isLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

const optionsDropdownAssign = (id: string) => {
  return [
    {
      label: "Assign Driver",
      key: `/pengiriman/assign-driver/${id}/add-driver`,
      disabled: false,
      icon: renderIcon(ArrowRedoOutline),
    },
  ]
}

const optionsDropdown = (id: string) => [
  {
    label: "Edit",
    key: `/pengiriman/assign-driver/${id}/add-driver`,
    disabled: false,
  },
  {
    label: "Lacak Manifest",
    key: `/lacak/manifest/${id}`,
    disabled: false,
  },
]
async function getDataWarehouse() {
  isLoading.value = true
  await masterWarehouseModel
    .getWarehouse({
      limit: 1000,
      sort: "desc",
    })
    .then((res: any) => {
      isLoading.value = false
      optionsDestionations.value = res.data?.list.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      dataRes.error(data.message)
    })
}

function handleSelect(key: string) {
  router.push(key)
}
function updatePageSize(pageSize: number) {
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
function handleUpdateDestionations(value: any) {
  params.value["do.destination._id"] = value ? value : null
  getData()
}
function handleUpdateTargetDelivery(value: any) {
  params.value.target_delivery_date = value ? value : null
  getData()
}
function handleUpdateStatus(value: any) {
  params.value.status = value ? value : null
  getData()
}
function handleUpdateProduct(value: any) {
  if (value) {
    params.value.products = value ? value : null
  } else {
    params.value.products = null
  }
  searchData()
}

const sortData = (field: string) => {
  if (params.value.sortBy !== field) {
    params.value.sort = 'asc'
    params.value.sortBy = field
  } else {
    params.value.sort = params.value.sort === 'asc' ? 'desc' : 'asc'
  }
  getData()
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Assign Driver</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Assign Driver</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-grid
        cols="5"
        x-gap="12"
        style="margin-top: 1rem"
      >
        <n-gi>
          <n-input
            v-model:value="params.code"
            @update:value="searchData"
            clearable
            placeholder="Cari Kode Manifest"
          />
        </n-gi>
        <n-gi>
          <n-input
            @update:value="handleUpdateProduct"
            clearable
            placeholder="Cari Kode Product"
          />
        </n-gi>
        <n-gi>
          <n-date-picker
            value-format="yyyy-MM-dd"
            clearable
            @update-formatted-value="handleUpdateTargetDelivery"
            type="date"
          />
        </n-gi>
        <n-gi>
          <n-select
            :options="optionsDestionations"
            @update:value="handleUpdateDestionations"
            clearable
            filterable
            placeholder="Pilih Tujuan"
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
          <t-loading />
        </template>
        <template v-else>
          <n-scrollbar x-scrollable>
            <n-table
              :bottom-bordered="false"
              :bordered="false"
              :single-line="true"
            >
              <n-thead>
                <n-tr>
                  <n-th>No</n-th>
                  <n-th class="cursor-pointer" @click="sortData('code')">
                    <div class="flex items-center justify-between">
                      ID Manifest
                      <ArrowDownOutline :class="[
                        'w-4 duration-100',
                        params.sortBy !== 'code' && 'opacity-50',
                        params.sortBy === 'code' && params.sort === 'desc' && 'rotate-180', 
                      ]"/>
                    </div>
                  </n-th>
                  <n-th class="cursor-pointer" @click="sortData('do.code')">
                    <div class="flex items-center justify-between">
                      No. DO/Invoice
                      <ArrowDownOutline :class="[
                        'w-4 duration-100',
                        params.sortBy !== 'do.code' && 'opacity-50',
                        params.sortBy === 'do.code' && params.sort === 'desc' && 'rotate-180', 
                      ]"/>
                    </div>
                  </n-th>
                  <n-th class="cursor-pointer" @click="sortData('do.destination.name')">
                    <div class="flex items-center justify-between">
                      Tujuan
                      <ArrowDownOutline :class="[
                        'w-4 duration-100',
                        params.sortBy !== 'do.destination.name' && 'opacity-50',
                        params.sortBy === 'do.destination.name' && params.sort === 'desc' && 'rotate-180', 
                      ]"/>
                    </div>
                  </n-th>
                  <n-th style="text-align: center">Qty Packing</n-th>
                  <n-th style="text-align: center">Qty Load</n-th>
                  <n-th style="text-align: center"
                    >Sisa Vol (cm<sup>3</sup>)</n-th
                  >
                  <n-th>Tipe Pengiriman</n-th>
                  <n-th style="text-align: center">Status</n-th>
                  <!-- <n-th>Driver</n-th> -->
                  <n-th>Aksi</n-th>
                </n-tr>
              </n-thead>

              <n-tbody>
                <template v-if="dataRes?.list?.length > 0">
                  <n-tr
                    v-for="(item, i) in dataRes.list"
                    :key="i"
                  >
                    <n-td data-label="No">{{
                      params.limit * (params.page - 1) + (i + 1)
                    }}</n-td>
                    <n-td data-label="ID Manifest">{{ item.code }}</n-td>
                    <n-td data-label="No. DO">{{ item.do.code }}</n-td>
                    <n-td data-label="Tujuan">{{
                      item.do.destination.name
                    }}</n-td>
                    <n-td
                      data-label="Qty Packing"
                      style="text-align: center"
                      >{{ $filters.toNumber(item.total.packing) }}</n-td
                    >
                    <n-td
                      data-label="Qty Load"
                      style="text-align: center"
                      >{{ $filters.toNumber(item.total.qty) }}</n-td
                    >
                    <n-td
                      data-label="Sisa Vol (cm3)"
                      style="text-align: center"
                      >{{ $filters.toNumber(item.volume) }}</n-td
                    >
                    <n-td data-label="Tipe Pengiriman">{{
                      item.delivery_type
                    }}</n-td>
                    <n-td
                      data-label="Status"
                      style="text-align: center"
                    >
                      <n-tag
                        round
                        :bordered="false"
                        :type="
                          item.status == 'siap_dikirim'
                            ? 'warning'
                            : item.status == 'agregasi'
                            ? 'error'
                            : item.status == 'loading'
                            ? 'info'
                            : 'success'
                        "
                      >
                        <span style="text-transform: capitalize">{{
                          status.AssignDriver(item.status)
                        }}</span>
                        <template #icon>
                          <n-icon
                            :component="
                              item.status == 'siap_dikirim'
                                ? Hourglass
                                : item.status == 'agregasi'
                                ? WarningOutline
                                : item.status == 'loading'
                                ? ReloadOutline
                                : CheckmarkCircle
                            "
                          />
                        </template>
                      </n-tag>
                    </n-td>
                    <!-- <n-td>{{
                      item.driver_info.drivers
                        ?.map((item: any) => item.name)
                        .join(", ")
                    }}</n-td> -->
                    <n-td data-label="Aksi">
                      <n-dropdown
                        placement="bottom-end"
                        :options="
                          item.driver_info?.drivers
                            ? optionsDropdown(item._id)
                            : optionsDropdownAssign(item._id)
                        "
                        :show-arrow="true"
                        @select="handleSelect"
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
                      colspan="11"
                      style="text-align: center !important"
                      class="not-content"
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
</template>

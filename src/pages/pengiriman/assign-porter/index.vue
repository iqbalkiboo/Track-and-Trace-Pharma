<script setup lang="ts">
import { useMessage } from "naive-ui"
import {
  ArrowRedoOutline,
  CheckmarkCircle,
  EllipsisVertical,
  Hourglass,
  LocationOutline,
  ReloadOutline,
  SearchOutline,
  WarningOutline,
} from "@vicons/ionicons5"
import { assignPorterModel } from "@/models/pengiriman/assign-porter"
import { SetLanguageStatusToIndonesian } from "@/helpers/setStatus"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import constants from "@/helpers/constant"

onMounted(() => {
  if (!filters.checkPermission(constants.accessDelivery.pengirimanAssignPorter + ".list")) {
    return router.push('/')
  }
  getData()
  getDataWarehouse()
})
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const dataRes = ref<any>({})
const params = ref<any>({
  code: "",
  sort: "desc",
  page: 1,
  limit: 10,
  delivery_type: "direct_manual",
})

const pagination = ref({ page: 1, limit: 10 })
const status = new SetLanguageStatusToIndonesian()
const optionsDestionations = ref<any>([])
const optionsStatus = ref([
  {
    label: "Need Assign Porter",
    value: "need_assign_porter",
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

const optionsDropdownAssign = (id: string) => {
  return [
    {
      label: "Assign Porter",
      key: `/pengiriman/assign-porter/${id}/assign-porter`,
      disabled: false,
      icon: renderIcon(ArrowRedoOutline),
    },
  ]
}

const optionsDropdown = (id: string) => [
  {
    label: "Detail",
    key: `/pengiriman/assign-porter/${id}/assign-porter`,
    disabled: false,
    icon: renderIcon(SearchOutline),
  },
  {
    label: "Lacak Manifest",
    key: `/lacak/manifest/${id}`,
    disabled: false,
    icon: renderIcon(LocationOutline),
  },
]

function handleSelect(key: string) {
  router.push(key)
}

async function getData() {
  isLoading.value = true
  try {
    const res = await assignPorterModel.getManifest(params.value)
    dataRes.value = res.data
    isLoading.value = false
  } catch (err: any) {
    if (err.response) {
      const data = err.response.data.message
      tMessage.error(data)
      isLoading.value = false
    }
  }
}
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
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Assign Porter</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Assign Porter</n-breadcrumb-item>
    </n-breadcrumb>

    <n-space
      vertical
      :size="0"
    >
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
              placeholder="Pilih Product"
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
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table
                :bordered="false"
                :single-line="true"
              >
                <n-thead>
                  <n-tr style="border-radius: 20px">
                    <n-th>No</n-th>
                    <n-th>ID Manifest</n-th>
                    <n-th>No. DO</n-th>
                    <n-th>Tujuan</n-th>
                    <n-th>Qty Packing</n-th>
                    <n-th>Qty Load</n-th>
                    <n-th>Sisa Vol (cm<sup>3</sup>)</n-th>
                    <n-th>Tipe Pengiriman</n-th>
                    <n-th>Status</n-th>
                    <n-th>Driver</n-th>
                    <n-th style="text-align: center">Aksi</n-th>
                  </n-tr>
                </n-thead>

                <n-tbody>
                  <template v-if="dataRes?.list?.length > 0">
                    <n-tr
                      v-for="(item, i) in dataRes?.list"
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
                      <n-td data-label="Qty Packing">{{
                        item.total.packing
                      }}</n-td>
                      <n-td data-label="Qty Load">{{ item.total.qty }}</n-td>
                      <n-td data-label="Sisa Vol (cm3)">{{ item.volume }}</n-td>
                      <n-td data-label="Tipe Pengiriman">{{
                        item.delivery_type
                      }}</n-td>
                      <n-td data-label="Status">
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
                            status.AssignPorter(item.status)
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
                      <n-td data-label="Driver">
                        {{
                          item.driver_info.drivers
                            ?.map((item: any) => item.name)
                            .join(", ") || "-"
                        }}
                      </n-td>
                      <n-td
                        data-label="Aksi"
                        style="text-align: center"
                      >
                        <n-dropdown
                          placement="bottom-end"
                          :options="
                            item.driver_info.drivers
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
                        colspan="12"
                        style="text-align: center"
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
              :page-count="dataRes?.total_page"
              :page-slot="7"
              :show-size-picker="dataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getData"
              @update:page-size="updatePageSize"
            />
          </div>
        </div>
      </div>
    </n-space>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

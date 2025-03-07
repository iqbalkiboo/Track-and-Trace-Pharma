<route lang="yaml">
meta:
layout: auth
title: Request 3PL
requireAuth: true
</route>

<script setup lang="ts">
import {
  Add,
  AddOutline,
  CloudUploadOutline,
  EllipsisVertical,
  ListOutline,
  LocationOutline,
} from "@vicons/ionicons5"
import { useMessage } from "naive-ui"
import { deliveryModel } from "@/models/pengiriman/3pl"
import { renderIcon } from "@/helpers/render-icon"
import { setAddress } from "@/helpers/setAddress"
import { SetLanguageStatusToIndonesian } from "@/helpers/setStatus"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import { masterThreeplModel } from "@/models/setting/master-threepl"
import constants from "@/helpers/constant"

const route = useRoute()
const router = useRouter()

const params = ref<any>({
  sort: "desc",
  page: 1,
  limit: 10,
  delivery_type: "3pl",
  vehicle_type: null,
  target_delivery_date: null,
  "do.destination._id": null,
  "3pl.id": null,
})
const status = new SetLanguageStatusToIndonesian()
const tMessage = useMessage()
const isLoading = ref(false)
const showModalRequest3pl = ref(false)
const manifest = ref("")
const showModalSerahTerimaTujuan = ref(false)
const dataRes = ref<any>({})
const checkAll = ref(false)
const arrManifest = ref<any>([])
const optionsStatus = ref([
  {
    label: "Need Assign 3pl",
    value: "need_assign_3pl",
  },
  {
    label: "Shipping",
    value: "shipping",
  },
  {
    label: "Terkirim",
    value: "shipped",
  },
  {
    label: "Accepted",
    value: "accepted",
  },
  {
    label: "Telah di request",
    value: "requested",
  },
])

function checkManifestAll() {
  if (checkAll.value) {
    arrManifest.value = []
    dataRes.value.list.forEach((el: any) => {
      arrManifest.value.push(el)
      return (el.checked = true)
    })
  } else {
    dataRes.value.list.forEach((el: any) => {
      arrManifest.value = []
      return (el.checked = false)
    })
  }
}

function checkManifest(data: any, id: any) {
  if (data.checked == true) {
    arrManifest.value.push(
      dataRes.value.list.filter((item: any) => item._id === id)[0]
    )
  } else {
    arrManifest.value = arrManifest.value.filter((item: any) => item._id !== id)
  }
}

const optionsTujuan = ref([
  {
    label: "Semarang",
    value: "semarang",
  },
  {
    label: "Yogyakarta",
    value: "yogyakarta",
  },
])

const optionsDataJalur = ref([
  {
    label: "Darat",
    value: "darat",
  },
  {
    label: "Laut",
    value: "laut",
  },
  {
    label: "Udara",
    value: "udara",
  },
])
const optionsDestionations = ref<any>([])
const options3pl = ref<any>([])

async function getData() {
  isLoading.value = true
  await deliveryModel
    .getmanifest(params.value)
    .then((res: any) => {
      dataRes.value = res.data
      isLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      dataRes.error(data.message)
    })
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

async function getData3Pl() {
  isLoading.value = true
  await masterThreeplModel
    .getThreepl({
      limit: 1000,
      sort: "desc",
    })
    .then((res: any) => {
      isLoading.value = false
      options3pl.value = res.data?.list.map((v: any) => ({
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

function handleUpdateOptionsVehicleType(value: any) {
  switch (value) {
    case "darat":
      params.value.vehicle_type = "darat"
      break
    case "laut":
      params.value.vehicle_type = "laut"
      break
    case "udara":
      params.value.vehicle_type = "udara"
      break
  }
  getData()
}

function handleUpdateTargetDelivery(value: any) {
  params.value.target_delivery_date = value ? value : null
  getData()
}

function handleUpdateDestionations(value: any) {
  params.value["do.destination._id"] = value ? value : null
  getData()
}

function handleUpdate3pl(value: any) {
  params.value["3pl.name"] = value ? value : null
  searchData()
}

function updatePage(page: number) {
  router.push({ query: { ...route.query, page } })
}

function updatePageSize(pageSize: number) {
  params.value.limit = pageSize
  getData()
}

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "detail":
      break
    case "serah":
      manifest.value = id
      showModalSerahTerimaTujuan.value = true
      break
    case "track/manifest":
      router.push(`/lacak/manifest/${id}`)
      break
    case "request":
      checkAll.value = false
      checkManifestAll()
      arrManifest.value = dataRes.value.list.filter(
        (item: any) => item._id === id
      )
      showModalRequest3pl.value = true
      break
    default:
      break
  }
}

function handleCloseModalRequest3pl() {
  showModalRequest3pl.value = false
}

function handleCloseSerahTerimaTujuan() {
  showModalSerahTerimaTujuan.value = false
}

function handleClickRequest3pl() {
  if (arrManifest.value?.length > 0) {
    showModalRequest3pl.value = true
  } else {
    tMessage.error("Anda Harus Memilih Manifest")
  }
}

const actionOptions = (status: string) => [
  {
    label: "Serah Terima",
    key: "serah",
    disabled: status === "shipping" || status === "need_request_3pl",
    icon: renderIcon(CloudUploadOutline),
  },
  {
    label: "Request 3PL",
    key: "request",
    icon: renderIcon(AddOutline),
    disabled: status === "requested",
  },
  {
    label: "Lacak Manifest",
    key: "track/manifest",
    icon: renderIcon(LocationOutline),
  },
]

async function handleUpdateValueVechileType(
  value: string,
  _options: any,
  id: string
) {
  const payload = {
    line: value,
    manifest_id: id,
  }
  await deliveryModel.postVechileType(payload).catch((err: any) => {
    if (err.response) {
      tMessage.error(err.response.data.message)
    }
  })
}

async function getArrManifest(data: any) {
  arrManifest.value = data
}

function handleUpdateStatus(value: any) {
  params.value.status = value ? value : null
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

function handleUpdateProduct(value: any) {
  if (value) {
    params.value.products = value ? value : null
  } else {
    params.value.products = null
  }
  searchData()
}

onMounted(async () => {
  if (!filters.checkPermission(constants.accessDelivery.pengirimanRequest3pl + ".list")) {
    return router.push('/')
  }
  if (!route.query.page) {
    await router.replace({ query: { page: 1 } })
  } else {
    params.value.page = parseInt(route.query.page as string)
    await getData()
    await getDataWarehouse()
    await getData3Pl()
  }
})
</script>

<template>
  <div class="body-tnt">
    <n-space justify="space-between">
      <n-space
        vertical
        :size="0"
      >
        <n-h2 style="margin-bottom: 4px">3PL</n-h2>
        <n-breadcrumb>
          <n-breadcrumb-item>3PL</n-breadcrumb-item>
        </n-breadcrumb>
      </n-space>
      <n-space>
        <n-button
          class="button-tnt"
          type="info"
          @click="$router.push({ name: 'pengiriman-request-3pl-list' })"
        >
          <n-icon :component="ListOutline" />
          List Request 3PL
        </n-button>
        <n-button
          class="button-tnt"
          type="primary"
          @click="handleClickRequest3pl"
        >
          <n-icon :component="Add" />
          Request 3PL
        </n-button>
      </n-space>
    </n-space>
    <n-grid
      cols="7"
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
        <n-input
          @update:value="handleUpdate3pl"
          placeholder="Cari Nama 3pl"
          clearable
        />
      </n-gi>
      <n-gi>
        <n-date-picker
          value-format="yyyy-MM-dd"
          clearable
          @update-formatted-value="handleUpdateTargetDelivery"
          placeholder="Tanggal Kirim"
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
          :options="optionsDataJalur"
          placeholder="Pilih Jalur"
          clearable
          @update:value="handleUpdateOptionsVehicleType"
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
    <div class="card-tnt">
      <div class="table-tnt">
        <template v-if="isLoading">
          <t-loading></t-loading>
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
                  <n-th>Tanggal kirim</n-th>
                  <n-th>ID Manifest</n-th>
                  <n-th>No. DO</n-th>
                  <n-th>Tujuan</n-th>
                  <n-th>Kota</n-th>
                  <n-th>Qty Packing</n-th>
                  <n-th>3PL</n-th>
                  <n-th>Jalur</n-th>
                  <n-th>Est Tonase(Gram)</n-th>
                  <n-th>Status</n-th>
                  <n-th>
                    <div style="display: flex; justify-content: center">
                      <div style="padding-right: 10px">All</div>
                      <n-checkbox
                        size="large"
                        v-model:checked="checkAll"
                        @click="checkManifestAll"
                      />
                    </div>
                  </n-th>
                  <n-th>Aksi</n-th>
                </n-tr>
              </n-thead>
              <n-tbody>
                <template v-if="dataRes?.list?.length > 0">
                  <n-tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <n-td data-label="NO"
                      >{{ params.limit * (params.page - 1) + (i + 1) }}
                    </n-td>
                    <n-td data-label="Tanggal Kirim"
                      >{{ list.target_delivery_date }}
                    </n-td>
                    <n-td data-label="ID Manifest">{{ list.code }}</n-td>
                    <n-td data-label="NO. DO">{{ list.do.code }}</n-td>
                    <n-td data-label="Tujuan"
                      >{{ list.do.destination.name }}
                    </n-td>
                    <n-td data-label="Kota"
                      >{{ setAddress(list.do?.destination?.address) }}
                    </n-td>
                    <n-td data-label="Qty Packing"
                      >{{ list.total.packing }}
                    </n-td>
                    <n-td data-label="3PL">{{ list["3pl"]?.name || "-" }}</n-td>
                    <n-td data-label="Jalur">
                      <n-space
                        justify="end"
                        align="center"
                      >
                        <n-select
                          v-model:value="list.vehicle_type"
                          :options="optionsDataJalur"
                          style="width: 150px; max-width: 100%"
                          @update:value="
                            handleUpdateValueVechileType(
                              $event,
                              $event,
                              list._id
                            )
                          "
                        />
                      </n-space>
                    </n-td>
                    <n-td data-label="Est Ton(Gram)">{{ list.weight }}</n-td>
                    <n-td data-label="Status">
                      <n-tag
                        type="primary"
                        round
                        >{{ status.Request3pl(list.status) }}
                      </n-tag>
                    </n-td>
                    <n-td
                      style="text-align: center"
                      data-label="All"
                    >
                      <n-space
                        justify="end"
                        align="center"
                      >
                        <n-checkbox
                          size="large"
                          label=""
                          v-model:checked="list.checked"
                          @click="checkManifest(list, list._id)"
                        />
                      </n-space>
                    </n-td>
                    <n-td data-label="Aksi">
                      <n-dropdown
                        placement="bottom-end"
                        show-arrow
                        :options="actionOptions(list.status)"
                        @select="handleSelectDropdown($event, list._id)"
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
                      colspan="20"
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
            @update:page="updatePage"
            @update:page-size="updatePageSize"
          />
        </div>
      </div>
    </div>
  </div>

  <t-3pl-add-request-modal
    :show="showModalRequest3pl"
    @click:close="handleCloseModalRequest3pl"
    :manifest="arrManifest"
    @getArrManifest="getArrManifest"
  />

  <t-3pl-serah-terima-tujuan
    :show="showModalSerahTerimaTujuan"
    @update:show="handleCloseSerahTerimaTujuan"
    :manifest_id="manifest"
    @click:get="getData"
  />
</template>

<style>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
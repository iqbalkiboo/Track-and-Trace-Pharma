<route lang="yaml">
meta:
  layout: auth
  title: List Request 3PL
  requireAuth: true
</route>
<script setup lang="ts">
import {
  CloudUploadOutline,
  EllipsisVertical,
  MailOutline,
  SearchOutline,
} from "@vicons/ionicons5"
import { deliveryModel } from "@/models/pengiriman/3pl"
import { useMessage } from "naive-ui"
import { renderIcon } from "@/helpers/render-icon"
import { masterThreeplModel } from "@/models/setting/master-threepl"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"

const filter = ref({
  date: null,
  status: "",
  product: "",
  selected_data_all: false,
})
const params = ref<any>({
  sort: "desc",
  page: 1,
  pickup_warehouse_building: {
    id: null,
  },
  limit: 10,
})
const type = ref("")
const isLoading = ref(false)
const dataRes = ref<any>({})
const options3pl = ref<any>([])
const selectId = ref("")
const optionsDestionations = ref<any>([])
const showModalSerahTerima = ref(false)
const tMessage = useMessage()

const optionsDataRequested = (status: string) => [
  {
    label: "Serah Terima",
    key: "serah-terima",
    icon: renderIcon(CloudUploadOutline),
  },
  {
    label: "Lihat Detail",
    key: "detail",
    icon: renderIcon(SearchOutline),
  },
]

async function getData() {
  isLoading.value = true
  await deliveryModel
    .get3pl(params.value)
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
async function getDataWarehouse() {
  isLoading.value = true
  await masterWarehouseModel
    .getBuilding({
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

function handleChangeTypeSerahTerima() {
  type.value = "serah-terima"
}
function handleSelect(key: string | number, id: string) {
  selectId.value = id
  switch (key) {
    case "detail":
      type.value = key
      showModalSerahTerima.value = true
      break
    case "repeat_send":
      break
    case "edit":
      break
    case "serah-terima":
      type.value = key
      showModalSerahTerima.value = true
      break
    default:
      break
  }
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
  params.value.limit = pageSize
  getData()
}
function handleCloseSerahTerimaModal() {
  showModalSerahTerima.value = false
}
function handleUpdateDestionations(value: any) {
  params.value.pickup_warehouse_building.id = value ? value : null
  getData()
}
function handleUpdateTargetDelivery(value: any) {
  params.value.pickup_date = value ? value : null
  getData()
}

function handleUpdate3pl(value: any) {
  params.value["3pl.name"] = value ? value : null
  getData()
}
onMounted(() => {
  getData()
  getDataWarehouse()
  getData3Pl()
})
</script>

<template>
  <div class="body-tnt">
    <n-space
      vertical
      style="padding: 1rem"
    >
      <n-row
        :cols="12"
        class="row"
      >
        <n-col :span="12">
          <n-h2 style="margin-bottom: 4px">List Request 3PL</n-h2>
          <n-breadcrumb>
            <n-breadcrumb-item>List Request 3PL</n-breadcrumb-item>
          </n-breadcrumb>
        </n-col>
      </n-row>

      <n-grid
        cols="4"
        x-gap="12"
        style="margin-top: 1rem"
      >
        <n-gi>
          <n-input
            v-model:value="params.order_id"
            @update:value="searchData"
            clearable
            placeholder="Cari Kode Manifest"
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
            placeholder="Tanggal Request kirim"
            type="date"
          />
        </n-gi>
        <n-gi>
          <n-select
            :options="optionsDestionations"
            @update:value="handleUpdateDestionations"
            clearable
            filterable
            placeholder="Pilih Lokasi Pengambilan"
          />
        </n-gi>
      </n-grid>

      <div class="card-tnt">
        <div class="table-tnt">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-table
              :bottom-bordered="false"
              :bordered="false"
              :single-line="true"
            >
              <n-thead>
                <n-tr>
                  <n-th>No</n-th>
                  <n-th>ID Order 3PL</n-th>
                  <n-th>Tanggal Request kirim</n-th>
                  <n-th>3PL</n-th>
                  <n-th>Lokasi Pengambilan</n-th>
                  <n-th>Qty Manifest</n-th>
                  <n-th>Qty Packing</n-th>
                  <n-th>Status Email</n-th>
                  <n-th>Aksi</n-th>
                </n-tr>
              </n-thead>

              <n-tbody>
                <template v-if="dataRes?.list?.length > 0">
                  <n-tr
                    v-for="(item, key) in dataRes.list"
                    :key="key"
                  >
                    <n-td>{{
                      params.limit * (params.page - 1) + (key + 1)
                    }}</n-td>
                    <n-td style="text-align: center">{{
                      item.order_id || "-"
                    }}</n-td>
                    <n-td>{{ item.pickup_date }}</n-td>
                    <n-td>{{ item["3pl"].name || "-" }}</n-td>
                    <n-td>{{ item.pickup_warehouse_building?.name }}</n-td>
                    <n-td>{{ item.qty?.manifest }}</n-td>
                    <n-td>{{ item.qty?.packing }}</n-td>
                    <n-td>
                      <n-tag
                        round
                        :bordered="false"
                        :type="
                          item.is_email_request_sent ? 'success' : 'warning'
                        "
                      >
                        <span style="text-transform: capitalize">{{
                          item.is_email_request_sent
                            ? "Terkirim"
                            : "Gagal Terkirim"
                        }}</span>
                        <template #icon>
                          <n-icon :component="MailOutline" />
                        </template>
                      </n-tag>
                    </n-td>
                    <n-td>
                      <n-dropdown
                        placement="bottom-end"
                        show-arrow
                        :options="optionsDataRequested(item.status)"
                        @select="handleSelect($event, item._id)"
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
                      colspan="20"
                      style="text-align: center"
                    >
                      Belum ada data tersedia
                    </td>
                  </tr>
                </template>
              </n-tbody>
            </n-table>
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
    </n-space>
  </div>
  <t-3pl-serah-terima-modal
    :show="showModalSerahTerima"
    :id="selectId"
    @update:show="handleCloseSerahTerimaModal"
    :type="type"
    @click:serah="handleChangeTypeSerahTerima"
    @click:get="getData"
  />
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

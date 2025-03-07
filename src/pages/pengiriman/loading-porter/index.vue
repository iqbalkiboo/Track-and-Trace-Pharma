<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
import { Add, EllipsisVertical } from "@vicons/ionicons5"
import { loadingModel } from "@/models/pengiriman/loading"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  // sort: "desc",
  delivery_type: 'direct_manual',
  page: 1,
  limit: 10,
})
const filter = ref({ date: 1183135260000, status: "", product: "" })

const optionsStatus = ref([
  {
    label: "Siap Dikirim",
    value: "siap_dikirim",
  },
  {
    label: "Agregasi",
    value: "agregasi",
  },
  {
    label: "Loading",
    value: "loading",
  },
  {
    label: "Selesai",
    value: "selesai",
  },
])

const optionsDropdown = ref([
  {
    label: "Detail",
    key: "detail",
    disabled: false,
  },
])

const optionsProduct = ref([
  {
    label: "Paracetamol",
    value: "paracetamol",
  },
  {
    label: "Oskadon Oye",
    value: "oskadon",
  },
])

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "detail":
      router.push({
        name: "pengiriman-loading-porter-id-detail",
        params: { id: id },
      })
      break

    default:
      break
  }
}

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await loadingModel.getManifest(params.value)
  .then((res) => {
    dataRes.value = res.data
    isLoading.value = false
    isBtnLoading.value = false
    console.log(dataRes.value)
  })
  .catch((err: any) => {
    isLoading.value = false
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="24">
      <n-space vertical :size="0">
        <n-h2 style="margin-bottom: 0">Loading</n-h2>
        <n-breadcrumb>
          <n-breadcrumb-item>Loading</n-breadcrumb-item>
        </n-breadcrumb>
      </n-space>

      <n-card style="border-radius: 10px;">
        <n-space>
          <router-link :to="{ name: 'pengiriman' }" style="text-decoration: none">
            <n-button type="primary" class="button-tnt">
              <n-icon :component="Add" />
              Tambah DO
            </n-button>
          </router-link>
        </n-space>
      </n-card>

      <div class="card-tnt" style="margin-top: 0">
        <n-space>
          <n-date-picker v-model:value="filter.date" type="date" />
          <n-select
            v-model:value="filter.status"
            :options="optionsStatus"
            placeholder="Pilih Status"
            style="width: 256px; max-width: 100%"
          />
          <n-select
            v-model:value="filter.product"
            :options="optionsProduct"
            placeholder="Pilih Product"
            style="width: 256px; max-width: 100%"
          />
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
                    <n-th>Kode Manifest</n-th>
                    <n-th>No. DO</n-th>
                    <n-th>Item</n-th>
                    <n-th>Tujuan</n-th>
                    <n-th style="text-align: center;">Qty Packing</n-th>
                    <n-th style="text-align: center;">Qty Load</n-th>
                    <n-th style="text-align: center;">Volume (cm<sup>3</sup>)</n-th>
                    <n-th>Tipe Pengiriman</n-th>
                    <n-th>Status</n-th>
                    <n-th>Driver</n-th>
                    <n-th style="text-align: center;">Aksi</n-th>
                  </n-tr>
                </n-thead>
  
                <n-tbody>
                  <template v-if="dataRes.list.length > 0">
                    <n-tr v-for="(list, i) in dataRes.list" :key="i">
                      <n-td>{{ params.limit * (params.page - 1) + (i + 1) }}</n-td>
                      <n-td>{{ list.code }}</n-td>
                      <n-td>{{ list.do?.code }}</n-td>
                      <n-td>{{ '?' }}</n-td>
                      <n-td>{{ list.do?.destination?.name }}</n-td>
                      <n-td style="text-align: center;">{{ list.total?.packing }}</n-td>
                      <n-td style="text-align: center;">{{ list.total?.qty }}</n-td>
                      <n-td style="text-align: center;">{{ list.volume }}</n-td>
                      <n-td>{{ list.delivery_type }}</n-td>
                      <n-td>
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
                            list.status == "siap_dikirim" ? "Siap Dikirim" : list.status
                          }}</span>
                        </n-tag>
                      </n-td>
                      <n-td>
                        <div v-for="driver, iD in list.driver_info?.drivers" :key="iD">
                          {{ driver.name }}
                        </div>
                      </n-td>
                      <n-td style="text-align: center;">
                        <n-dropdown
                          placement="bottom-end"
                          :options="optionsDropdown"
                          :show-arrow="true"
                          @select="handleSelectDropdown($event, list._id)"
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
                      <td colspan="10" style="text-align: center">Belum ada data tersedia</td>
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
    </n-space>
  </div>
</template>

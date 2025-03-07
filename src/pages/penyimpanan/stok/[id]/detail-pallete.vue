<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const rackDetailRes = ref<any>({})
const binDataRes = ref<any>({})
const roomId = localStorage.getItem("room_id")
const params = ref<any>({
  search: '',
  sort: 'desc',
  sort_field: 'created_at',
  page: 1,
  limit: 10,
})

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  getDetailRackPallete()
  await getBin()
  isLoading.value = false
}

async function getDetailRackPallete() {
  const id = route.params.id
  await masterWarehouseModel.getDetailRackPallete(id).then((res) => {
    rackDetailRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getBin() {
  params.value.warehouse_id = localStorage.getItem("plant_id")
  params.value.building_id = localStorage.getItem("building_id")
  params.value.room_id = localStorage.getItem("room_id")
  params.value.rack_pallete_id = route.params.id
  await masterWarehouseModel.getBin(params.value).then((res) => {
    binDataRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getBin()
}

const timerSearch = ref<any>(0)
function searchData() {
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getBin()
  }, 600 || 0)
}

</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="14">
      <n-space justify="space-between">
        <n-space vertical :size="0">
          <n-h2 style="margin-bottom: 4px">{{ rackDetailRes.warehouse?.name }}</n-h2>
          <n-h6 style="margin-bottom: 4px">{{ Object.keys(rackDetailRes).length > 0 ? rackDetailRes?.warehouse_building?.name + ' / ' + rackDetailRes?.warehouse_room?.name + ' / ' + rackDetailRes?.name : '' }}</n-h6>
        </n-space>
        <div style="display: flex; align-items: end">
          <n-input
            v-model:value="params.search"
            @keyup="searchData"
            type="text"
            placeholder="Cari nama produk"
            style="width: 300px; max-width: 200%"
          />
        </div>
      </n-space>
  
      <n-row :cols="12">
        <n-col :span="4">
          <n-space vertical>
            <n-text>Kapsitas(m3) : {{ rackDetailRes.volume ? rackDetailRes.volume : '-' }}</n-text>
            <n-text>Terisi(m3) : {{ rackDetailRes.results?.total_used_volume }}</n-text>
            <n-text>Usage(%) : {{ rackDetailRes.results?.total_used_volume_percent }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="4">
          <n-space vertical>
            <n-text>Total SKU : {{ rackDetailRes.results?.total_product }}</n-text>
            <n-text>Total Item : {{ rackDetailRes.results?.total_first_level }}</n-text>
          </n-space>
        </n-col>
      </n-row>

      <n-card
        style="margin-bottom: 1rem; border-radius: 10px;"
      >
        <template v-if="isLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <n-scrollbar x-scrollable>
            <n-table :bordered="false" :single-line="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th>Item</th>
                  <th>Total Item</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="binDataRes.list ? binDataRes.list.length > 0 : false">
                  <tr v-for="bin, iBin in binDataRes.list" :key="iBin">
                    <td>?</td>
                    <td>?</td>
                    <td>?</td>
                    <td>?</td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="5" style="text-align: center">Belum ada data serialisasi tersedia</td>
                  </tr>
                </template>
              </tbody>
            </n-table>
          </n-scrollbar>
        </template>
        <div style="margin-top: 14px; display: flex; justify-content: center;">
          <n-pagination
            v-model:page="params.page"
            v-model:page-size="params.limit"
            :page-count="binDataRes.total_page"
            :page-slot="7"
            :show-size-picker="binDataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getData"
            @update:page-size="updatePageSize"
          />
        </div>
      </n-card>
    </n-space>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'penyimpanan-stok-id-detail-room', params: { id: roomId } }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

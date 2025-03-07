<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const binDetailRes = ref<any>({})
const binDataRes = ref<any>({})
const rackId = localStorage.getItem("rack_id")
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
  await getDetailBin()
  // await getBin()
  isLoading.value = false
}

async function getDetailBin() {
  const id = route.params.id
  await masterWarehouseModel.getDetailBin(id).then((res) => {
    binDetailRes.value = res.data
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
          <n-h2 style="margin-bottom: 4px">{{ binDetailRes.name }}</n-h2>
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
          <div>Kapsitas(m3) : {{ binDetailRes.volume ? binDetailRes.volume : '-' }}</div>
          <div>Terisi(m3) : ?</div>
          <div>Usage(%) : ?</div>
        </n-col>
        <n-col :span="4">
          <div>Total SKU : ?</div>
          <div>Total Item : ?</div>
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
                    <td colspan="4" style="text-align: center">Belum ada data serialisasi tersedia</td>
                  </tr>
                </template>
              </tbody>
            </n-table>
          </n-scrollbar>
        </template>
      </n-card>
    </n-space>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'penyimpanan-stok-id-detail-rack', params: { id: rackId } }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const route = useRoute()
const router = useRouter()
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
  getDetailRackPallete()
  await getBin()
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
  isLoading.value = true
  params.value.warehouse_id = localStorage.getItem("plant_id")
  params.value.building_id = localStorage.getItem("building_id")
  params.value.room_id = localStorage.getItem("room_id")
  params.value.rack_pallete_id = route.params.id
  await masterWarehouseModel.getBin(params.value).then((res) => {
    binDataRes.value = res.data
    isLoading.value = false
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
    isLoading.value = false
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

function handleCopyCode() {
  const copyText = document.getElementById("copyCode") as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function handleCopyIdBin(index: number, IdBin: string) {
  const copyText = document.getElementById("copyIdBin" + index + IdBin) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("ID Bin tersalin")
}

function goToDetailBin(rackId: string, binId: string) {
  localStorage.setItem("rack_id", rackId)
  router.push({ name: 'penyimpanan-stok-id-detail-bin', params: { id: binId } })
}

function goToDetailListProductNon(type: string, rackId: string) {
  localStorage.setItem("warehouse_type", type)
  localStorage.setItem("rack_id", rackId)
  router.push({ name: 'penyimpanan-stok-id-detail-list-product', params: { id: rackId } })
}

function goToDetailListProduct(type: string, binId: string, rackId: string) {
  localStorage.setItem("warehouse_type", type)
  localStorage.setItem("rack_id", rackId)
  router.push({ name: 'penyimpanan-stok-id-detail-list-product', params: { id: binId } })
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="14">
      <n-space justify="space-between">
        <n-space vertical :size="0">
          <n-h2 style="margin-bottom: 4px">{{ rackDetailRes.warehouse?.name }}</n-h2>
          <n-h6 style="margin-bottom: 4px">{{ Object.keys(rackDetailRes).length > 0 ? rackDetailRes?.warehouse_building?.name + ' / ' + rackDetailRes?.warehouse_room?.name + ' / ' + rackDetailRes?.name : '' }}</n-h6>
          <n-text
            type="primary"
            strong
            style="cursor: pointer;"
            @click.prevent="handleCopyCode"
          >
            {{ rackDetailRes.erp_code }}
          </n-text>
          <div v-show="false">
            <input v-show="false" type="text" :value="rackDetailRes.erp_code" :id="'copyCode'">
          </div>
        </n-space>
        <div style="display: flex; align-items: end">
          <n-input
            v-model:value="params.search"
            @keyup="searchData"
            type="text"
            placeholder="Cari nama bin"
            style="width: 300px; max-width: 200%"
          />
        </div>
      </n-space>
  
      <n-row :cols="12">
        <n-col :span="4">
          <n-space vertical>
            <n-text>Kapsitas(m³) : {{ $filters.toNumber(rackDetailRes.volume) }}</n-text>
            <n-text>Terisi(m³) : {{ $filters.toNumber(rackDetailRes.results?.total_used_volume) }}</n-text>
            <n-text>Usage(%) : {{ $filters.toNumber(rackDetailRes.results?.total_used_volume_percent) }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="4">
          <n-space vertical>
            <n-text>Total SKU : {{ $filters.toNumber(rackDetailRes.results?.total_product) }}</n-text>
            <n-text>Total Stok : {{ $filters.toNumber(rackDetailRes.results?.total_first_level) }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="16">
          <n-tag
            :bordered="false"
            style="margin-right: 10px; width: 10rem; height: 2rem; justify-content: center;"
          >
            {{ $filters.toNumber(rackDetailRes.counts?.bin) }} Bin
          </n-tag>
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
            <n-scrollbar x-scrollable>
            <n-table :bordered="false" :single-line="false">
              <thead>
                <tr>
                  <th style="width: 20%">Non Rack</th>
                  <th style="width: 15%; text-align: right;">Kapasitas(m3)</th>
                  <th style="width: 15%; text-align: right;">Terisi(m3)</th>
                  <th style="width: 15%; text-align: right;">Usage(%)</th>
                  <th style="width: 10%; text-align: right;">Total SKU</th>
                  <th style="width: 10%; text-align: right;">Total Stok</th>
                  <th style="width: 15%; text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="Object.keys(rackDetailRes).length > 0">
                  <tr>
                    <td>
                      <div>
                        {{ rackDetailRes?.name }}
                        <n-text
                          type="primary"
                          strong
                          style="font-size: 11px; display:block; cursor: pointer;"
                          @click.prevent="handleCopyCode"
                        >
                          {{ rackDetailRes.erp_code }}
                        </n-text>
                      </div>
                      <div v-show="false">
                        <input v-show="false" type="text" :value="rackDetailRes.erp_code" :id="'copyCode'">
                      </div>
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rackDetailRes.volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rackDetailRes?.results?.total_used_volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rackDetailRes?.results?.total_used_volume_percent) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rackDetailRes?.results?.current?.total_product) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rackDetailRes?.results?.current?.total_first_level) }}
                    </td>
                    <td style="text-align: center">
                      <n-space justify="center">
                        <n-button
                          tertiary
                          @click.prevent="goToDetailListProductNon('rack_pallete_non_bin', rackDetailRes.id)"
                        >
                          List Produk
                        </n-button>
                      </n-space>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="7" style="text-align: center">Belum ada data non rack tersedia</td>
                  </tr>
                </template>
              </tbody>
            </n-table>
          </n-scrollbar>
            <n-table :bordered="false" :single-line="false" style="margin-top: 24px;">
              <thead>
                <tr>
                  <th>ID Bin</th>
                  <th>Nama</th>
                  <th style="text-align: right;">Total Stok</th>
                  <th style="width: 12rem; text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="binDataRes.list ? binDataRes.list.length > 0 : false">
                  <tr v-for="bin, iBin in binDataRes.list" :key="iBin">
                    <td>
                      <div>
                        <n-text
                          type="primary"
                          strong
                          style="display:block; cursor: pointer;"
                          @click.prevent="handleCopyIdBin(iBin, bin.id_bin)"
                        >
                          {{ bin.id_bin }}
                        </n-text>
                      </div>
                      <div v-show="false">
                        <input v-show="false" type="text" :value="bin.id_bin" :id="'copyIdBin' + iBin + bin.id_bin">
                      </div>
                    </td>
                    <td>{{ bin.name }}</td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(bin.results?.total_first_level) }}
                    </td>
                    <td style="text-align: center">
                      <n-space justify="center">
                        <n-button
                          v-if="false"
                          tertiary
                          @click.prevent="goToDetailBin(rackDetailRes.id, bin.id)"
                        >
                          Detail
                        </n-button>
                        <n-button
                          tertiary
                          @click.prevent="goToDetailListProduct('bin', bin.id, rackDetailRes.id)"
                        >
                          List Produk
                        </n-button>
                      </n-space>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="5" style="text-align: center">Belum ada data bin tersedia</td>
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

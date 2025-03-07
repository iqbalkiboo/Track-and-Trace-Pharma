<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const buildingDetailRes = ref<any>({})
const roomDataRes = ref<any>({})
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
  getDetailBuilding()
  await getRoom()
}

async function getDetailBuilding() {
  const id = route.params.id
  await masterWarehouseModel.getDetailBuilding(id).then((res) => {
    buildingDetailRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getRoom() {
  isLoading.value = true
  params.value.warehouse_id = localStorage.getItem("plant_id")
  params.value.building_id = route.params.id
  await masterWarehouseModel.getRoom(params.value).then((res) => {
    roomDataRes.value = res.data
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
  getRoom()
}

const timerSearch = ref<any>(0)
function searchData() {
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getRoom()
  }, 600 || 0)
}

function handleCopyCode() {
  const copyText = document.getElementById("copyCode") as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function handleCopyCodeRoom(index: number, roomCode: string) {
  const copyText = document.getElementById("copyCodeRoom" + index + roomCode) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function goToDetailRoom(buildingId: string, roomId: string) {
  localStorage.setItem("building_id", buildingId)
  router.push({ name: 'penyimpanan-stok-id-detail-room', params: { id: roomId } })
}

function goToDetailListProductNon(type: string, buildingId: string, warehouseName: string) {
  localStorage.setItem("warehouse_type", type)
  localStorage.setItem("warehouse_name", warehouseName)
  localStorage.setItem("building_id", buildingId)
  router.push({ name: 'penyimpanan-stok-id-detail-list-product', params: { id: buildingId } })
}

function goToDetailListProduct(type: string, roomId: string, buildingId: string) {
  localStorage.setItem("warehouse_type", type)
  localStorage.setItem("building_id", buildingId)
  router.push({ name: 'penyimpanan-stok-id-detail-list-product', params: { id: roomId } })
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="14">
      <n-space justify="space-between">
        <n-space vertical :size="0">
          <n-h2 style="margin-bottom: 4px">{{ buildingDetailRes.warehouse?.name }}</n-h2>
          <n-h6 style="margin-bottom: 4px">{{ buildingDetailRes.name }}</n-h6>
          <n-text
            type="primary"
            strong
            style="cursor: pointer;"
            @click.prevent="handleCopyCode"
          >
            {{ buildingDetailRes.erp_code }}
          </n-text>
          <div v-show="false">
            <input v-show="false" type="text" :value="buildingDetailRes.erp_code" :id="'copyCode'">
          </div>
        </n-space>
        <div style="display: flex; align-items: end">
          <n-input
            v-model:value="params.search"
            @keyup="searchData"
            type="text"
            placeholder="Cari nama room"
            style="width: 300px; max-width: 200%"
          />
        </div>
      </n-space>
  
      <n-row :cols="12">
        <n-col :span="4">
          <n-space vertical>
            <n-text>Kapsitas(m³) : {{ $filters.toNumber(buildingDetailRes.volume) }}</n-text>
            <n-text>Terisi(m³) : {{ $filters.toNumber(buildingDetailRes.results?.total_used_volume) }}</n-text>
            <n-text>Usage(%) : {{ $filters.toNumber(buildingDetailRes.results?.total_used_volume_percent) }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="4">
          <n-space vertical>
            <n-text>Total SKU : {{ $filters.toNumber(buildingDetailRes.results?.total_product) }}</n-text>
            <n-text>Total Stok : {{ $filters.toNumber(buildingDetailRes.results?.total_first_level) }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="16" >
          <n-tag
            :bordered="false"
            style="margin-right: 10px; width: 8rem; height: 2rem; justify-content: center;"
          >
            {{ $filters.toNumber(buildingDetailRes.counts?.room) }} Room
          </n-tag>
          <n-tag
            :bordered="false"
            style="margin-right: 10px; width: 10rem; height: 2rem; justify-content: center;"
          >
            {{ $filters.toNumber(buildingDetailRes.counts?.rack) }} Rack ({{ $filters.toNumber(buildingDetailRes.counts?.bin) }} Bin)
          </n-tag>
          <n-tag
            :bordered="false"
            style="margin-right: 10px; width: 8rem; height: 2rem; justify-content: center;"
          >
            {{ $filters.toNumber(buildingDetailRes.counts?.pallete) }} Pallete
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
            <n-table :bordered="false" :single-line="false">
              <thead>
                <tr>
                  <th style="width: 20%">Non Room</th>
                  <th style="width: 15%; text-align: right;">Kapasitas(m3)</th>
                  <th style="width: 15%; text-align: right;">Terisi(m3)</th>
                  <th style="width: 15%; text-align: right;">Usage(%)</th>
                  <th style="width: 10%; text-align: right;">Total SKU</th>
                  <th style="width: 10%; text-align: right;">Total Stok</th>
                  <th style="width: 15%; text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="Object.keys(buildingDetailRes).length > 0">
                  <tr>
                    <td>
                      <div>
                        {{ buildingDetailRes?.name }}
                        <n-text
                          type="primary"
                          strong
                          style="font-size: 11px; display:block; cursor: pointer;"
                          @click.prevent="handleCopyCode"
                        >
                          {{ buildingDetailRes.erp_code }}
                        </n-text>
                      </div>
                      <div v-show="false">
                        <input v-show="false" type="text" :value="buildingDetailRes.erp_code" :id="'copyCode'">
                      </div>
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(buildingDetailRes.volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(buildingDetailRes?.results?.total_used_volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(buildingDetailRes?.results?.total_used_volume_percent) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(buildingDetailRes?.results?.current?.total_product) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(buildingDetailRes?.results?.current?.total_first_level) }}
                    </td>
                    <td style="text-align: center">
                      <n-space justify="center">
                        <n-button
                          tertiary
                          @click.prevent="goToDetailListProductNon('building_non_room', buildingDetailRes.id, buildingDetailRes.warehouse?.name)"
                        >
                          List Produk
                        </n-button>
                      </n-space>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="7" style="text-align: center">Belum ada data non room tersedia</td>
                  </tr>
                </template>
              </tbody>
            </n-table>
          </n-scrollbar>
          <n-scrollbar x-scrollable>
            <n-table :bordered="false" :single-line="false" style="margin-top: 24px;">
              <thead>
                <tr>
                  <th style="width: 20%">Warehouse Room</th>
                  <th style="width: 15%; text-align: right;">Kapasitas(m3)</th>
                  <th style="width: 15%; text-align: right;">Terisi(m3)</th>
                  <th style="width: 15%; text-align: right;">Usage(%)</th>
                  <th style="width: 10%; text-align: right;">Total SKU</th>
                  <th style="width: 10%; text-align: right;">Total Stok</th>
                  <th style="width: 15%; text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="roomDataRes.list ? roomDataRes.list.length > 0 : false">
                  <tr v-for="room, iRoom in roomDataRes.list" :key="iRoom">
                    <td>
                      <div>
                        {{ room.name }}
                        <n-text
                          type="primary"
                          strong
                          style="font-size: 11px; display:block; cursor: pointer;"
                          @click.prevent="handleCopyCodeRoom(iRoom, room.erp_code)"
                        >
                          {{ room.erp_code }}
                        </n-text>
                      </div>
                      <div v-show="false">
                        <input v-show="false" type="text" :value="room.erp_code" :id="'copyCodeRoom' + iRoom + room.erp_code">
                      </div>
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(room.volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(room.results?.total_used_volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(room.results?.total_used_volume_percent) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(room.results?.total_product) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(room.results?.total_first_level) }}
                    </td>
                    <td style="text-align: center">
                      <n-space justify="center">
                        <n-button
                          tertiary
                          @click.prevent="goToDetailRoom(buildingDetailRes.id, room.id)"
                        >
                          Detail
                        </n-button>
                        <n-button
                          tertiary
                          @click.prevent="goToDetailListProduct('room', room.id, buildingDetailRes.id)"
                        >
                          List Produk
                        </n-button>
                      </n-space>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="7" style="text-align: center">Belum ada data room tersedia</td>
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
            :page-count="roomDataRes.total_page"
            :page-slot="7"
            :show-size-picker="roomDataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getData"
            @update:page-size="updatePageSize"
          />
        </div>
      </n-card>
    </n-space>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'penyimpanan-stok' }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

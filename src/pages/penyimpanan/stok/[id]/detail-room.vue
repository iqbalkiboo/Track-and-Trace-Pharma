<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const roomDetailRes = ref<any>({})
const rackPalleteDataRes = ref<any>({})
const buildingId = localStorage.getItem("building_id")
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
  getDetailRoom()
  await getRackPallete()
}

async function getDetailRoom() {
  const id = route.params.id
  await masterWarehouseModel.getDetailRoom(id).then((res) => {
    roomDetailRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getRackPallete() {
  isLoading.value = true
  params.value.warehouse_id = localStorage.getItem("plant_id")
  params.value.building_id = localStorage.getItem("building_id")
  params.value.room_id = route.params.id
  await masterWarehouseModel.getRackPallete(params.value).then((res) => {
    rackPalleteDataRes.value = res.data
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
  getRackPallete()
}

const timerSearch = ref<any>(0)
function searchData() {
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getRackPallete()
  }, 600 || 0)
}

function handleCopyCode() {
  const copyText = document.getElementById("copyCode") as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function handleCopyCodeRack(index: number, rackCode: string) {
  const copyText = document.getElementById("copyCodeRack" + index + rackCode) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function goToDetailRackPallete(roomId: string, rackId: string, kind: string) {
  localStorage.setItem("room_id", roomId)
  if (kind === 'rack') {
    router.push({ name: 'penyimpanan-stok-id-detail-rack', params: { id: rackId } })
  } else {
    router.push({ name: 'penyimpanan-stok-id-detail-pallete', params: { id: rackId } })
  }
}

function goToDetailListProductNon(type: string, roomId: string) {
  localStorage.setItem("warehouse_type", type)
  localStorage.setItem("room_id", roomId)
  router.push({ name: 'penyimpanan-stok-id-detail-list-product', params: { id: roomId } })
}

function goToDetailListProduct(type: string, rackId: string, roomId: string) {
  localStorage.setItem("warehouse_type", type)
  localStorage.setItem("room_id", roomId)
  router.push({ name: 'penyimpanan-stok-id-detail-list-product', params: { id: rackId } })
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="14">
      <n-space justify="space-between">
        <n-space vertical :size="0">
          <n-h2 style="margin-bottom: 4px">{{ roomDetailRes.warehouse?.name }}</n-h2>
          <n-h6 style="margin-bottom: 4px">{{ Object.keys(roomDetailRes).length > 0 ? roomDetailRes?.warehouse_building?.name + ' / ' + roomDetailRes?.name : '' }}</n-h6>
          <n-text
            type="primary"
            strong
            style="cursor: pointer;"
            @click.prevent="handleCopyCode"
          >
            {{ roomDetailRes.erp_code }}
          </n-text>
          <div v-show="false">
            <input v-show="false" type="text" :value="roomDetailRes.erp_code" :id="'copyCode'">
          </div>
        </n-space>
        <div style="display: flex; align-items: end">
          <n-input
            v-model:value="params.search"
            @keyup="searchData"
            type="text"
            placeholder="Cari nama rack/pallete"
            style="width: 300px; max-width: 200%"
          />
        </div>
      </n-space>
  
      <n-row :cols="12">
        <n-col :span="4">
          <n-space vertical>
            <n-text>Kapsitas(m³) : {{ $filters.toNumber(roomDetailRes.volume) }}</n-text>
            <n-text>Terisi(m³) : {{ $filters.toNumber(roomDetailRes.results?.total_used_volume) }}</n-text>
            <n-text>Usage(%) : {{ $filters.toNumber(roomDetailRes.results?.total_used_volume_percent) }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="4">
          <n-space vertical>
            <n-text>Total SKU : {{ $filters.toNumber(roomDetailRes.results?.total_product) }}</n-text>
            <n-text>Total Stok : {{ $filters.toNumber(roomDetailRes.results?.total_first_level) }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="16">
          <n-tag
            :bordered="false"
            style="margin-right: 10px; width: 10rem; height: 2rem; justify-content: center;"
          >
            {{ $filters.toNumber(roomDetailRes.counts?.rack) }} 
            Rack ({{ $filters.toNumber(roomDetailRes.counts?.bin) }} Bin)
          </n-tag>
          <n-tag
            :bordered="false"
            style="margin-right: 10px; width: 8rem; height: 2rem; justify-content: center;"
          >
            {{ $filters.toNumber(roomDetailRes.counts?.pallete) }} Pallete
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
                <template v-if="Object.keys(roomDetailRes).length > 0">
                  <tr>
                    <td>
                      <div>
                        {{ roomDetailRes?.name }}
                        <n-text
                          type="primary"
                          strong
                          style="font-size: 11px; display:block; cursor: pointer;"
                          @click.prevent="handleCopyCode"
                        >
                          {{ roomDetailRes.erp_code }}
                        </n-text>
                      </div>
                      <div v-show="false">
                        <input v-show="false" type="text" :value="roomDetailRes.erp_code" :id="'copyCode'">
                      </div>
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(roomDetailRes.volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(roomDetailRes?.results?.total_used_volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(roomDetailRes?.results?.total_used_volume_percent) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(roomDetailRes?.results?.current?.total_product) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(roomDetailRes?.results?.current?.total_first_level) }}
                    </td>
                    <td style="text-align: center">
                      <n-space justify="center">
                        <n-button
                          tertiary
                          @click.prevent="goToDetailListProductNon('room_non_rack', roomDetailRes.id)"
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
          <n-scrollbar x-scrollable>
            <n-table :bordered="false" :single-line="false" style="margin-top: 24px;">
              <thead>
                <tr>
                  <th>Jenis</th>
                  <th>Nama</th>
                  <th style="text-align: right;">Kapasitas(m3)</th>
                  <th style="text-align: right;">Terisi(m3)</th>
                  <th style="text-align: right;">Usage(%)</th>
                  <th style="text-align: right;">Total SKU</th>
                  <th style="text-align: right;">Total Stok</th>
                  <th style="width: 12rem; text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="rackPalleteDataRes.list ? rackPalleteDataRes.list.length > 0 : false">
                  <tr v-for="rack, iRack in rackPalleteDataRes.list" :key="iRack">
                    <td>
                      <n-space vertical :size="0">
                        <n-text style="text-transform: capitalize">
                          {{ rack.kind }}
                        </n-text>
                        <n-text
                          type="primary"
                          strong
                          style="font-size: 11px; display:block; cursor: pointer;"
                          @click.prevent="handleCopyCodeRack(iRack, rack.erp_code)"
                        >
                          {{ rack.erp_code }}
                        </n-text>
                      </n-space>
                      <div v-show="false">
                        <input v-show="false" type="text" :value="rack.erp_code" :id="'copyCodeRack' + iRack + rack.erp_code">
                      </div>
                    </td>
                    <td>
                      {{ rack.name }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rack.volume) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rack.results?.total_used_volume) }}</td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rack.results?.total_used_volume_percent) }}
                    </td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rack.results?.total_product) }}</td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(rack.results?.total_first_level) }}
                    </td>
                    <td style="text-align: center">
                      <n-space justify="center">
                        <n-button
                          v-if="rack.kind === 'rack'"
                          tertiary
                          @click.prevent="goToDetailRackPallete(roomDetailRes.id, rack.id, rack.kind)"
                        >
                          Detail
                        </n-button>
                        <n-button
                          tertiary
                          @click.prevent="goToDetailListProduct('rack_pallete', rack.id, roomDetailRes.id)"
                        >
                          List Produk
                        </n-button>
                      </n-space>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="8" style="text-align: center">Belum ada data room tersedia</td>
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
            :page-count="rackPalleteDataRes.total_page"
            :page-slot="7"
            :show-size-picker="rackPalleteDataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getData"
            @update:page-size="updatePageSize"
          />
        </div>
      </n-card>
    </n-space>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'penyimpanan-stok-id-detail-building', params: { id: buildingId } }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'
import { stockModel } from '@/models/penyimpanan/penyimpanan-stok'
import moment from "moment"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const dataRes = ref<any>({})
const detailDataRes = ref<any>({})
const warehouseType = localStorage.getItem("warehouse_type")
const warehouseName = localStorage.getItem("warehouse_name")
const params = ref<any>({
  search: '',
  sort: 'desc',
  sort_field: 'created_at',
  current_allocation :  true,
  page: 1,
  limit: 10,
})

onMounted(() => {
  localStorage.removeItem("xx_product_storage")
  getData()
})

async function getData() {
  await getListProduct()
  await getDetail()
}

async function getListProduct() {
  isLoading.value = true
  let type = warehouseType as string
  if (type === 'building_non_room') {
    type = 'building'
  } else if (type === 'room_non_rack') {
    type = 'room'
  } else if (type === 'rack_pallete_non_bin') {
    type = 'rack_pallete'
  }
  const id = route.params.id as string
  await stockModel.getListProduct(type, id, params.value).then((res) => {
    dataRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
  isLoading.value = false
}

async function getDetail() {
  isLoading.value = true
  const id = route.params.id
  if (warehouseType === 'building' || warehouseType === 'building_non_room') {
    await masterWarehouseModel.getDetailBuilding(id).then((res) => {
      detailDataRes.value = res.data
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else if (warehouseType === 'room' || warehouseType === 'room_non_rack') {
    await masterWarehouseModel.getDetailRoom(id).then((res) => {
      detailDataRes.value = res.data
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else if (warehouseType === 'rack_pallete' || warehouseType === 'rack_pallete_non_bin') {
    await masterWarehouseModel.getDetailRackPallete(id).then((res) => {
      detailDataRes.value = res.data
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else {
    await masterWarehouseModel.getDetailBin(id).then((res) => {
      detailDataRes.value = res.data
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  }
  isLoading.value = false
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getListProduct()
}

const timerSearch = ref<any>(0)
function searchData() {
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getListProduct()
  }, 600 || 0)
}

function setFullName(data: any) {
  let fullName = ''
  if (data.warehouse_building) {
    fullName += data.warehouse_building.name + ' / '
  }
  if (data.warehouse_room) {
    fullName += data.warehouse_room.name + ' / '
  }
  if (data.warehouse_rack) {
    fullName += data.warehouse_rack.name + ' / '
  }
  fullName += data.name
  return fullName
}

function handleCopyCode() {
  const copyText = document.getElementById("copyCode") as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function goToListSerialize(product: any) {
  if (warehouseType === 'building' || warehouseType === 'building_non_room') {
    localStorage.setItem("building_id", route.params.id as string)
  } else if (warehouseType === 'room') {
    localStorage.setItem("room_id", route.params.id as string)
  } else if (warehouseType === 'rack_pallete') {
    localStorage.setItem("rack_id", route.params.id as string)
  } else {
    localStorage.setItem("bin_id", route.params.id as string)
  }
  localStorage.setItem("xx_product_storage", JSON.stringify(product))
  router.push({ name: 'penyimpanan-stok-id-list-serialize' })
}

function goBack() {
  if (warehouseType === 'building') {
    router.push({ name: 'penyimpanan-stok' })
  } else if (warehouseType === 'room' || warehouseType === 'building_non_room') {
    const id = localStorage.getItem("building_id")
    router.push({ name: 'penyimpanan-stok-id-detail-building', params: { id: id } })
  } else if (warehouseType === 'rack_pallete' || warehouseType === 'room_non_rack') {
    const id = localStorage.getItem("room_id")
    router.push({ name: 'penyimpanan-stok-id-detail-room', params: { id: id } })
  } else if (warehouseType === 'bin' || warehouseType === 'rack_pallete_non_bin') {
    const id = localStorage.getItem("rack_id")
    router.push({ name: 'penyimpanan-stok-id-detail-rack', params: { id: id } })
  }
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="14">
      <n-space justify="space-between">
        <n-space vertical :size="0">
          <n-h2 style="margin-bottom: 4px">{{ warehouseName }}</n-h2>
          <n-h6 style="margin-bottom: 0">{{ Object.keys(detailDataRes).length > 0 ? setFullName(detailDataRes) : 'loading...' }}</n-h6>
          <n-text
            type="primary"
            strong
            style="cursor: pointer;"
            @click.prevent="handleCopyCode"
          >
            {{ detailDataRes.erp_code }}
          </n-text>
          <div v-show="false">
            <input v-show="false" type="text" :value="detailDataRes.erp_code" :id="'copyCode'">
          </div>
        </n-space>
        <div style="display: flex; align-items: end">
          <n-input
            v-model:value="params.search"
            type="text"
            placeholder="Cari nama produk"
            clearable
            style="width: 300px; max-width: 200%"
            @update:value="searchData"
          />
        </div>
      </n-space>
  
      <n-row>
        <n-col
          v-if="warehouseType !=='bin'"
          :span="4"
        >
          <n-space vertical>
            <n-text>
              Kapsitas(m3) : {{ $filters.toNumber(detailDataRes.volume) }}
            </n-text>
            <n-text>
              Terisi(m3) : {{ $filters.toNumber(detailDataRes.results?.total_used_volume) }}
            </n-text>
            <n-text>
              Usage(%) : {{ $filters.toNumber(detailDataRes.results?.total_used_volume_percent) }}
            </n-text>
          </n-space>
        </n-col>
        <n-col :span="4">
          <n-space vertical v-if="warehouseType ==='bin'">
            <n-text>
              Total SKU : {{ $filters.toNumber(detailDataRes.results?.total_product) }}
            </n-text>
            <n-text>
              Total Stok : {{ $filters.toNumber(detailDataRes.results?.total_first_level) }}
            </n-text>
          </n-space>
          <n-space vertical v-else>
            <n-text>
              Total SKU : {{ $filters.toNumber(detailDataRes.results?.current?.total_product) }}
            </n-text>
            <n-text>
              Total Stok : {{ $filters.toNumber(detailDataRes.results?.current?.total_first_level) }}
            </n-text>
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
                  <th>Kode Produk</th>
                  <th>Item</th>
                  <th>No Batch</th>
                  <th>Expired Date</th>
                  <th style="text-align: right;">Total Stok</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dataRes.products ? dataRes.products.length > 0 : false">
                  <tr v-for="product, i in dataRes.products" :key="i">
                    <td>{{ params.limit * (params.page - 1) + (i + 1) }}</td>
                    <td>
                      <n-text
                        type="primary"
                        strong
                        style="cursor: pointer; text-decoration: underline;"
                        @click.prevent="goToListSerialize(product)"
                      >
                        {{ product.code }}
                      </n-text>
                    </td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.batch }}</td>
                    <td>{{ moment(product.expired_date).format("yyyy-MM-DD") }}</td>
                    <td style="text-align: right;">
                      {{ $filters.toNumber(product.count) }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="6" style="text-align: center">Belum ada data produk tersedia</td>
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
            :page-count="dataRes.total_page"
            :page-slot="7"
            :show-size-picker="dataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getListProduct"
            @update:page-size="updatePageSize"
          />
        </div>
      </n-card>
    </n-space>

    <div class="bottom-action-button">
      <div class="action-item">
        <n-button
          color="#828282"
          class="button-tnt"
          style="width: 120px"
          @click="goBack"
        >
          Kembali
        </n-button>
      </div>
    </div>
  </div>
</template>

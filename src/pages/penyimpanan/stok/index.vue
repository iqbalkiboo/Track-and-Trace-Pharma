<script setup lang="ts">
import { useMessage } from "naive-ui"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"

const router = useRouter()
const tMessage = useMessage()
const authData = auth.getAuth()
const isLoading = ref(false)
const isBtnLoading = ref(false)
const warehouseDataRes = ref<any>({})
const params = ref({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
})

onMounted(() => {
  if (authData.xxtype !== "5up3r4dm1n") {
    setIsGranted()
  }
  localStorage.removeItem("warehouse_name")
  localStorage.removeItem("warehouse_type")
  localStorage.removeItem("plant_id")
  localStorage.removeItem("building_id")
  localStorage.removeItem("room_id")
  localStorage.removeItem("rack_id")
  localStorage.removeItem("bin_id")
  localStorage.removeItem("batch_number")
  getData()
})

async function getData() {
  isLoading.value = true
  await getWarehouse()
  isLoading.value = false
}

async function getWarehouse() {
  await masterWarehouseModel
    .getWarehouse(params.value)
    .then((res) => {
      warehouseDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getBuilding(id: any, iParent: any) {
  const params = {
    warehouse_id: "",
    sort: "desc",
    sort_field: "created_at",
    page: 1,
    limit: 1000,
  }
  isBtnLoading.value = true
  params.warehouse_id = id
  masterWarehouseModel
    .getBuilding(params)
    .then((res: any) => {
      if (res.data.list.length > 0) {
        // Check if id is same
        if (id === res.data.list[0].warehouse.id) {
          warehouseDataRes.value.list[iParent].is_show_detail = true
          warehouseDataRes.value.list[iParent].building = res.data.list
          isBtnLoading.value = false
          warehouseDataRes.value.list[iParent].building.forEach((el: any) => {
            // For hide/show detail building
            return (el.is_show_detail = false)
          })
        }
      } else {
        isBtnLoading.value = false
        tMessage.error("Plant/Cabang tidak memiliki building")
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

const timerSearch = ref<any>(0)
function searchData() {
  //reset param page
  params.value.page = 1
  // route.query.search = params.value.search
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    // router.push({ query: { search: params.value.search } })
    getData()
  }, 600 || 0)
}

function handleCopyCodePlant(index: number) {
  const copyText = document.getElementById(
    "copyCodePlant" + index
  ) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function handleCopyCodeBuilding(index: number, buildingCode: string) {
  const copyText = document.getElementById(
    "copyCodeBuilding" + index + buildingCode
  ) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function goToDetailBuilding(
  plantId: string,
  buildingId: string,
  warehouseName: string
) {
  localStorage.setItem("warehouse_name", warehouseName)
  localStorage.setItem("plant_id", plantId)
  router.push({
    name: "penyimpanan-stok-id-detail-building",
    params: { id: buildingId },
  })
}

function goToDetailListProduct(
  plantId: string,
  type: string,
  buildingId: string,
  warehouseName: string
) {
  localStorage.setItem("warehouse_type", type)
  localStorage.setItem("warehouse_name", warehouseName)
  localStorage.setItem("plant_id", plantId)
  router.push({
    name: "penyimpanan-stok-id-detail-list-product",
    params: { id: buildingId },
  })
}

function setIsGranted() {
  isLoading.value = true
  if (filters.checkPermission(constants.accessStorage.penyimpananStok + ".list")) {
    getData()
    isLoading.value = false
  } else {
    router.push("/")
  }
}
</script>

<template>
  <div class="body-tnt">
    <n-space
      vertical
      :size="14"
    >
      <n-space justify="space-between">
        <n-space
          vertical
          :size="0"
        >
          <n-h2 style="margin-bottom: 4px">Penyimpanan Stok</n-h2>
          <n-breadcrumb>
            <n-breadcrumb-item>Penyimpanan Stok</n-breadcrumb-item>
          </n-breadcrumb>
        </n-space>
        <div style="display: flex; align-items: end">
          <n-input
            v-model:value="params.search"
            @update:value="searchData"
            type="text"
            placeholder="Cari nama plant/cabang"
            style="width: 350px; max-width: 200%"
          />
        </div>
      </n-space>

      <template v-if="isLoading">
        <div class="card-tnt">
          <t-loading></t-loading>
        </div>
      </template>
      <template v-else>
        <n-card
          v-for="(plant, iPlant) in warehouseDataRes.list"
          :key="iPlant"
          style="border-radius: 10px"
        >
          <!-- CARD HEADER -->
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div>
              <h2
                style="
                  font-weight: 600;
                  font-size: 16px;
                  margin-top: 0;
                  margin-bottom: 0;
                "
              >
                {{ plant.name }}
              </h2>
              <div>
                <n-text
                  type="primary"
                  strong
                  style="cursor: pointer"
                  @click.prevent="handleCopyCodePlant(iPlant)"
                >
                  {{ plant.erp_code }}
                </n-text>
              </div>
              <div v-show="false">
                <input
                  v-show="false"
                  type="text"
                  :value="plant.erp_code"
                  :id="'copyCodePlant' + iPlant"
                />
              </div>
              <div>
                <n-text
                  >Lokasi Warehouse :
                  {{ $filters.setAddress(plant.address) }}</n-text
                >
              </div>
              <n-button
                v-if="plant.counts.building > 0 && !plant.is_show_detail"
                :loading="isBtnLoading"
                ghost
                type="primary"
                class="button-tnt"
                style="margin-top: 8px"
                @click.prevent="getBuilding(plant.id, iPlant)"
              >
                Detail Plant/Cabang
              </n-button>
            </div>
            <div>
              <n-tag
                :bordered="false"
                style="
                  margin-right: 10px;
                  width: 8rem;
                  height: 2rem;
                  justify-content: center;
                "
              >
                {{ plant.counts.building }} Building
              </n-tag>
              <n-tag
                :bordered="false"
                style="
                  margin-right: 10px;
                  width: 8rem;
                  height: 2rem;
                  justify-content: center;
                "
              >
                {{ plant.counts.room }} Room
              </n-tag>
            </div>
          </div>

          <!-- CARD CONTENT -->
          <div
            v-if="plant.building"
            style="
              max-height: 260px;
              overflow: auto;
              margin-top: 20px;
              margin-bottom: 20px;
            "
          >
            <n-table
              :bordered="false"
              :single-line="false"
            >
              <thead>
                <tr>
                  <th>Warehouse Building</th>
                  <th style="text-align: right">Qty Room</th>
                  <th style="text-align: right">Kapasitas(m³)</th>
                  <th style="text-align: right">Terisi(m³)</th>
                  <th style="text-align: right">Usage(%)</th>
                  <th style="text-align: right">Total SKU</th>
                  <th style="text-align: right">Total Stok</th>
                  <th style="width: 12rem; text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(building, iBuilding) in plant.building"
                  :key="iBuilding"
                >
                  <td>
                    <div>
                      {{ building.name }}
                      <n-text
                        type="primary"
                        strong
                        style="font-size: 11px; display: block; cursor: pointer"
                        @click.prevent="
                          handleCopyCodeBuilding(iBuilding, building.erp_code)
                        "
                      >
                        {{ building.erp_code }}
                      </n-text>
                    </div>
                    <div v-show="false">
                      <input
                        v-show="false"
                        type="text"
                        :value="building.erp_code"
                        :id="'copyCodeBuilding' + iBuilding + building.erp_code"
                      />
                    </div>
                  </td>
                  <td style="text-align: right">
                    {{ $filters.toNumber(building?.counts?.room) }}
                  </td>
                  <td style="text-align: right">
                    {{ $filters.toNumber(building?.volume) }}
                  </td>
                  <td style="text-align: right">
                    {{
                      $filters.toNumber(building?.results?.total_used_volume)
                    }}
                  </td>
                  <td style="text-align: right">
                    {{
                      $filters.toNumber(
                        building?.results?.total_used_volume_percent
                      )
                    }}
                  </td>
                  <td style="text-align: right">
                    {{ $filters.toNumber(building.results?.total_product) }}
                  </td>
                  <td style="text-align: right">
                    {{ $filters.toNumber(building.results?.total_first_level) }}
                  </td>
                  <td style="text-align: center">
                    <n-space justify="center">
                      <n-button
                        tertiary
                        @click.prevent="
                          goToDetailBuilding(plant.id, building.id, plant.name)
                        "
                      >
                        Detail
                      </n-button>
                      <n-button
                        v-if="false"
                        tertiary
                        @click.prevent="
                          goToDetailListProduct(
                            plant.id,
                            'building',
                            building.id,
                            plant.name
                          )
                        "
                      >
                        List Produk
                      </n-button>
                    </n-space>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </n-card>
      </template>
      <div style="display: flex; justify-content: center">
        <n-pagination
          v-model:page="params.page"
          v-model:page-size="params.limit"
          :page-count="warehouseDataRes.total_page"
          :page-slot="7"
          :show-size-picker="warehouseDataRes.total_data > 10"
          :page-sizes="[10, 20, 30, 40, 50]"
          @update:page="getData"
          @update:page-size="updatePageSize"
        />
      </div>
    </n-space>
  </div>
</template>

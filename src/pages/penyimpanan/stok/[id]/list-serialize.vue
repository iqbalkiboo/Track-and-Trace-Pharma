<script setup lang="ts">
import { useMessage } from "naive-ui"
import { ArrowBackOutline } from "@vicons/ionicons5"
import moment from "moment"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import { stockModel } from "@/models/penyimpanan/penyimpanan-stok"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(true)
const dataRes = ref<any>({})
const detailDataRes = ref<any>({})
const warehouseType = localStorage.getItem("warehouse_type")
const warehouseName = localStorage.getItem("warehouse_name")
const warehouseId = localStorage.getItem("plant_id")
const productStorageData = JSON.parse(
  localStorage.getItem("xx_product_storage") as string
)
const arrCode = ref<any>([])
const levelSerializeParent = ref(0)
const levelSerializeChild = ref(0)
const params = ref<any>({
  code: "",
  parent_code: "",
  warehouse_id: warehouseId,
  batch_number: productStorageData.batch,
  un_nested_wh: 1,
  sort: "desc",
  sort_field: "serialize.level",
  page: 1,
  limit: 10,
})

onMounted(() => {
  getData()
})

async function getData() {
  await getDetail()
  getListSerialize()
}

async function getListSerialize() {
  isLoading.value = true
  isBtnLoading.value = true
  if (warehouseType === "building" || warehouseType === "building_non_room") {
    const id = localStorage.getItem("building_id")
    params.value.building_id = id
  } else if (warehouseType === "room" || warehouseType === "room_non_rack") {
    const id = localStorage.getItem("room_id")
    params.value.room_id = id
  } else if (
    warehouseType === "rack_pallete" ||
    warehouseType === "rack_pallete_non_bin"
  ) {
    const id = localStorage.getItem("rack_id")
    params.value.rack_id = id
  } else {
    const id = localStorage.getItem("bin_id")
    params.value.bin_id = id
  }
  await stockModel
    .getListSerialize(params.value)
    .then((res) => {
      isLoading.value = false
      isBtnLoading.value = false
      dataRes.value = res.data
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDetail() {
  const id = route.params.id
  if (warehouseType === "building" || warehouseType === "building_non_room") {
    await masterWarehouseModel
      .getDetailBuilding(id)
      .then((res) => {
        detailDataRes.value = res.data
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else if (warehouseType === "room" || warehouseType === "room_non_rack") {
    await masterWarehouseModel
      .getDetailRoom(id)
      .then((res) => {
        detailDataRes.value = res.data
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else if (
    warehouseType === "rack_pallete" ||
    warehouseType === "rack_pallete_non_bin"
  ) {
    await masterWarehouseModel
      .getDetailRackPallete(id)
      .then((res) => {
        detailDataRes.value = res.data
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else {
    await masterWarehouseModel
      .getDetailBin(id)
      .then((res) => {
        detailDataRes.value = res.data
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  }
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getListSerialize()
}

const timerSearch = ref<any>(0)
function searchData() {
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getListSerialize()
  }, 600 || 0)
}

function setFullName(data: any) {
  let fullName = ""
  if (data.warehouse_building) {
    fullName += data.warehouse_building.name
  }
  if (data.warehouse_room) {
    fullName += " / " + data.warehouse_room.name
  }
  if (data.warehouse_rack) {
    fullName += " / " + data.warehouse_rack.name + " / "
  }
  fullName += data.name
  return fullName
}

function handleCopyErpCode() {
  const copyText = document.getElementById("copyErpCode") as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode erp tersalin")
}

function handleCopyCode(index: number) {
  const copyText = document.getElementById(
    "copyCode" + index
  ) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode serialisasi tersalin")
}

function handleGetSerialize(code: string, level: number, type: string) {
  params.value.parent_code = code
  params.value.page = 1

  if (!arrCode.value.includes(code)) {
    arrCode.value.push(code)
  }

  if (levelSerializeParent.value === 0) {
    levelSerializeParent.value = level
  } else if (levelSerializeParent.value === levelSerializeChild.value) {
    levelSerializeParent.value = 0
    levelSerializeChild.value = 0
    arrCode.value = []
    params.value.parent_code = ""
  }

  if (type === "get") {
    if (levelSerializeChild.value === levelSerializeParent.value - 1) {
      levelSerializeChild.value = levelSerializeParent.value - 2
    } else {
      levelSerializeChild.value = levelSerializeParent.value - 1
      if (levelSerializeChild.value < 0) {
        levelSerializeChild.value = 0
      }
    }
  } else {
    levelSerializeChild.value = levelSerializeParent.value - 1
    if (levelSerializeChild.value < 0) {
      levelSerializeChild.value = 0
    }

    if (levelSerializeChild.value === levelSerializeParent.value - 1) {
      arrCode.value.pop()
    }
  }

  // console.log('get', level)
  // console.log('get', levelSerializeParent.value, levelSerializeChild.value)
  getListSerialize()
}

function goBack() {
  router.push({ name: "penyimpanan-stok-id-detail-list-product" })
}

function getBack() {
  const code =
    arrCode.value[levelSerializeParent.value - 2 - levelSerializeChild.value]
  levelSerializeChild.value = levelSerializeChild.value + 1
  // console.log('back', code)
  // console.log('back', levelSerializeParent.value, levelSerializeChild.value)
  handleGetSerialize(code, levelSerializeChild.value, "back")
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
          <n-h2 style="margin-bottom: 4px">{{ warehouseName }}</n-h2>
          <n-h6 style="margin-bottom: 0">{{
            Object.keys(detailDataRes).length > 0
              ? setFullName(detailDataRes)
              : "loading..."
          }}</n-h6>
          <n-text
            type="primary"
            strong
            style="cursor: pointer"
            @click.prevent="handleCopyErpCode"
          >
            {{ detailDataRes.erp_code }}
          </n-text>
          <div v-show="false">
            <input
              v-show="false"
              type="text"
              :value="detailDataRes.erp_code"
              :id="'copyErpCode'"
            />
          </div>
        </n-space>
        <div style="display: flex; align-items: end">
          <n-input
            v-model:value="params.code"
            type="text"
            placeholder="Cari kode serialisasi"
            clearable
            style="width: 300px; max-width: 200%"
            @update:value="searchData"
          />
        </div>
      </n-space>

      <n-row gutter="12">
        <n-col :span="6">
          <n-space vertical>
            <n-text> Kode Produk : {{ productStorageData.code }} </n-text>
            <n-text> Nama Produk : {{ productStorageData.name }} </n-text>
            <n-text> No. Batch : {{ productStorageData.batch }} </n-text>
          </n-space>
        </n-col>
        <n-col :span="6">
          <n-space vertical>
            <n-text>
              Expired Date :
              {{ moment(productStorageData.expired_date).format("yyyy-MM-DD") }}
            </n-text>
            <n-text>
              Total Qty Level Terendah :
              {{ $filters.toNumber(productStorageData.count) }}
            </n-text>
          </n-space>
        </n-col>
      </n-row>

      <n-card style="margin-bottom: 1rem; border-radius: 10px">
        <template v-if="isLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <n-scrollbar x-scrollable>
            <n-table
              :bordered="false"
              :single-line="false"
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th style="text-align: right">Level</th>
                  <th style="text-align: center">Status</th>
                  <th
                    v-if="false"
                    style="text-align: right"
                  >
                    Total Qty
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dataRes.list ? dataRes.list.length > 0 : false">
                  <tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <td>{{ params.limit * (params.page - 1) + (i + 1) }}</td>
                    <td>
                      <n-space>
                        <n-text
                          v-if="list.serialize?.level !== 1"
                          type="primary"
                          strong
                          style="cursor: pointer; text-decoration: underline"
                          @click.prevent="
                            handleGetSerialize(
                              list.code,
                              list.serialize?.level,
                              'get'
                            )
                          "
                        >
                          {{ list.code }}
                        </n-text>
                        <n-text
                          v-else
                          strong
                        >
                          {{ list.code }}
                        </n-text>
                        <div
                          style="
                            border-radius: 5px;
                            padding-left: 4px;
                            padding-right: 4px;
                            border: 1px solid #000;
                            cursor: pointer;
                          "
                          @click.prevent="handleCopyCode(i)"
                        >
                          Copy
                        </div>
                      </n-space>
                      <div v-show="false">
                        <input
                          v-show="false"
                          type="text"
                          :value="list.code"
                          :id="'copyCode' + i"
                        />
                      </div>
                    </td>
                    <td style="text-align: right">
                      {{ list.serialize?.level }}
                    </td>
                    <td style="text-align: center">
                      <n-tag
                        type="success"
                        :bordered="false"
                        round
                      >
                        {{ list.status ? list.status : "-" }}
                      </n-tag>
                    </td>
                    <td
                      v-if="false"
                      style="text-align: right"
                    >
                      {{ $filters.toNumber(list.serialize?.first_level_qty) }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td
                      colspan="4"
                      style="text-align: center"
                    >
                      Belum ada data produk tersedia
                    </td>
                  </tr>
                </template>
              </tbody>
            </n-table>
          </n-scrollbar>
        </template>
        <div style="margin-top: 14px; display: flex; justify-content: center">
          <n-pagination
            v-model:page="params.page"
            v-model:page-size="params.limit"
            :page-count="dataRes.total_page"
            :page-slot="7"
            :show-size-picker="dataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getListSerialize"
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
          :loading="isLoading"
          @click="goBack"
        >
          Kembali
        </n-button>
        <n-button
          v-if="arrCode.length > 0"
          :loading="isBtnLoading"
          color="#828282"
          ghost
          class="button-tnt"
          @click="getBack"
        >
          <n-icon :component="ArrowBackOutline" />
          <span style="margin-left: 5px">Level Sebelumnya</span>
        </n-button>
      </div>
    </div>
  </div>
</template>

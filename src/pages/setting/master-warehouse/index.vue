<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
import { Add } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import ModalImportExcel from "@/pages/setting/master-warehouse/modal/modal-import-excel.vue"

const tMessage = useMessage()

const isLoading = ref(false)
const warehouseDataRes = ref<any>({})
const isShowModalImport = ref(false)
const params = ref({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
})

const router = useRouter()

onMounted(() => {
  if (filters.isGranted(constants.accessSettings.settingWarehouse + ".list")) {
    getData()
  } else {
    return router.push('/')
  }
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
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

function showModalImport(e: MouseEvent) {
  e.preventDefault()
  isShowModalImport.value = true
}
function hideModalImport() {
  isShowModalImport.value = false
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Master Warehouse</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Master Warehouse</n-breadcrumb-item>
    </n-breadcrumb>

    <template
      v-if="$filters.isGranted(constants.accessSettings.settingWarehouse + '.list')"
    >
      <div
        class="card-tnt"
        style="width: 30%"
      >
        <n-button
          v-if="$filters.isGranted(constants.accessSettings.settingWarehouse + '.create')"
          color="#219653"
          class="button-tnt mb-5"
          @click="showModalImport"
        >
          <n-icon :component="Add" />
          Import Building
        </n-button>
        <n-input
          v-model:value="params.search"
          @update:value="searchData"
          clearable
          placeholder="Cari nama plant/cabang"
        />
      </div>

      <template v-if="isLoading">
        <div class="card-tnt">
          <t-loading></t-loading>
        </div>
      </template>
      <template v-else>
        <div
          class="card-tnt"
          v-for="(list, i) in warehouseDataRes.list"
          :key="i"
        >
          <n-space
            vertical
            :size="18"
          >
            <n-space justify="space-between">
              <n-space
                vertical
                :size="0"
              >
                <n-h3 style="font-size: 16px; margin-bottom: 0">{{
                  list.name
                }}</n-h3>
                <n-text>{{ $filters.setAddress(list.address) }}</n-text>
              </n-space>
              <n-space
                vertical
                :size="0"
              >
                <div>
                  <template
                    v-if="
                      $filters.isGranted(
                        constants.accessSettings.settingWarehouse + '.update'
                      )
                    "
                  >
                    <router-link
                      v-if="false"
                      :to="{
                        name: 'setting-master-perusahaan-crud-id-plant-area',
                        params: { crud: 'update', id: list.id },
                      }"
                      style="text-decoration: none"
                    >
                      <n-button
                        color="#F2C94C"
                        text-color="#1E1E1E"
                        class="button-tnt"
                        style="margin-right: 10px"
                      >
                        Edit
                      </n-button>
                    </router-link>
                  </template>
                  <template
                    v-if="
                      $filters.isGranted(
                        constants.accessSettings.settingWarehouse + '.detail'
                      )
                    "
                  >
                    <router-link
                      v-if="list.counts.building > 0"
                      :to="{
                        name: 'setting-master-warehouse-id',
                        params: { id: list.id },
                      }"
                      style="text-decoration: none"
                    >
                      <n-button
                        type="primary"
                        class="button-tnt"
                        >Detail</n-button
                      >
                    </router-link>
                  </template>
                </div>
              </n-space>
            </n-space>
            <n-grid
              cols="4"
              item-responsive
              responsive="screen"
              :x-gap="16"
              :y-gap="16"
            >
              <n-grid-item span="1">
                <div
                  class="card-tnt"
                  style="
                    border: 2px solid #e5e5e5;
                    margin-top: 0;
                    padding: 14px;
                    text-align: center;
                  "
                >
                  <n-text style="font-size: 14px; margin-bottom: 0">
                    {{ list.counts.building }} Building
                  </n-text>
                </div>
              </n-grid-item>
              <n-grid-item span="1">
                <div
                  class="card-tnt"
                  style="
                    border: 2px solid #e5e5e5;
                    margin-top: 0;
                    padding: 14px;
                    text-align: center;
                  "
                >
                  <n-text style="font-size: 14px; margin-bottom: 0">
                    {{ list.counts.room }} Room
                  </n-text>
                </div>
              </n-grid-item>
              <n-grid-item span="1">
                <div
                  class="card-tnt"
                  style="
                    border: 2px solid #e5e5e5;
                    margin-top: 0;
                    padding: 14px;
                    text-align: center;
                  "
                >
                  <n-text style="font-size: 14px; margin-bottom: 0">
                    {{ list.counts.rack }} Rack ({{ list.counts.bin }}
                    Bin)
                  </n-text>
                </div>
              </n-grid-item>
              <n-grid-item span="1">
                <div
                  class="card-tnt"
                  style="
                    border: 2px solid #e5e5e5;
                    margin-top: 0;
                    padding: 14px;
                    text-align: center;
                  "
                >
                  <n-text style="font-size: 14px; margin-bottom: 0">
                    {{ list.counts.pallete }} Pallete
                  </n-text>
                </div>
              </n-grid-item>
            </n-grid>
            <template
              v-if="
                $filters.isGranted(
                  constants.accessSettings.settingWarehouse + '.create'
                )
              "
            >
              <n-space
                v-if="
                  list.counts.building <= 0 &&
                  $filters.isGranted(
                    constants.accessSettings.settingWarehouse + '.create'
                  )
                "
                vertical
                :size="0"
              >
                <router-link
                  :to="{
                    name: 'setting-master-warehouse-crud-id-building',
                    params: { crud: 'create', id: list.id },
                  }"
                  style="text-decoration: none"
                >
                  <n-button
                    color="#219653"
                    text
                    style="margin-right: 10px"
                  >
                    <template #icon>
                      <n-icon><add /></n-icon>
                    </template>
                    Tambah Warehouse Building
                  </n-button>
                </router-link>
              </n-space>
            </template>
          </n-space>
        </div>
      </template>
      <div style="margin-top: 24px; display: flex; justify-content: center">
        <n-pagination
          v-model:page="params.page"
          v-model:page-size="params.limit"
          :page-count="warehouseDataRes.total_page"
          :page-slot="10"
          show-size-picker
          :page-sizes="[10, 20, 30, 40, 50]"
          @update:page="getData"
          @update:page-size="updatePageSize"
        />
      </div>
    </template>

    <template v-else>
      <t-not-granted></t-not-granted>
    </template>

    <modal-import-excel
      :is-show-modal="isShowModalImport"
      @hide-modal="hideModalImport"
      @get-data="getData"
    />
  </div>
</template>

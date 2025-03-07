<script setup lang="ts">
import { useMessage } from "naive-ui"
import type { SelectOption } from "naive-ui"
import { logModel } from "@/models/alertlog/log"
import TLogTerimaKemasCard from "../../components/log/t-log-terima-kemas-card.vue"
import TLogSerialisasiCard from "../../components/log/t-log-serialisasi-card.vue"
import TLogPengecekanCard from "../../components/log/t-log-pengecekan-card.vue"
import TLogPenyimpananTransferCard from "../../components/log/t-log-penyimpanan-transfer-card.vue"
import TLogPenyimpananAdjustCard from "../../components/log/t-log-penyimpanan-adjust-card.vue"
import TLogKirimAgerasiCard from "../../components/log/t-log-kirim-agregasi-card.vue"
import TLogKirimAssignCard from "../../components/log/t-log-kirim-assign.vue"
import TLogKirimLoadingCard from "../../components/log/t-log-kirim-loading.vue"
import TLogPenerimaanCard from "../../components/log/t-log-penerimaan-card.vue"
import constants from "@/helpers/constant"

const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref<any>({
  id: "",
  // status: "",
  // sort: "desc",
  // sort_field: "created_at",
  // type: "",
  category: "produksi",
  sub_category: "serialisasi",
  start_date: null,
  end_date: null,
  page: 1,
  limit: 10,
})

const router = useRouter()

onMounted(() => {
  if (!filters.checkPermission(constants.accessAlert.alertLogLog + ".list")) {
    return router.push('/')
  }
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await logModel.getLog(params.value)
  .then((res) => {
    dataRes.value = res.data
    isLoading.value = false
    isBtnLoading.value = false
  })
  .catch((err: any) => {
    isLoading.value = false
    isBtnLoading.value = false
    const data = err.response.data
    // tMessage.error(data.message)
    console.log(data)
  })
}

const timerSearch = ref<any>(0)
function searchData() {
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    params.value.page = 1
    getData()
  }, 0 || 0)
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

const tabModel = ref<number>(0)
const subTabModel = ref<number>(0)
const dateRange = ref<[number, number]>()
const optionValue = ref()

const compCards = computed(() => [
  [TLogSerialisasiCard, TLogTerimaKemasCard, TLogPengecekanCard],
  [TLogPenyimpananTransferCard, TLogPenyimpananAdjustCard],
  [TLogKirimAgerasiCard, TLogKirimAssignCard, TLogKirimLoadingCard],
  [TLogPenerimaanCard],
])
const options = computed<SelectOption[]>(() => {
  if (tabModel.value == 0 && subTabModel.value == 2)
    return [
      { label: "Released", value: "Released" },
      { label: "Pre Released", value: "Pre Released" },
    ]
  if (tabModel.value == 1 && subTabModel.value == 0)
    return [
      { label: "Assign", value: "Assign" },
      { label: "Move", value: "Move" },
      { label: "Void", value: "Void" },
    ]
  if (tabModel.value == 2 && subTabModel.value == 0)
    return [
      { label: "Create DO", value: "Create DO" },
      { label: "Create Package", value: "Create Package" },
      { label: "Packaged", value: "Packaged" },
    ]
  if ((tabModel.value == 2 && subTabModel.value == 1) || subTabModel.value == 2)
    return [
      { label: "Diambil", value: "Diambil" },
      { label: "Dikirim", value: "Dikirim" },
      { label: "Serah Terima", value: "Serah Terima" },
    ]

  if (tabModel.value == 3)
    return [
      { label: "Diambil", value: "Diambil" },
      { label: "Dikirim", value: "Dikirim" },
      { label: "Serah Terima", value: "Serah Terima" },
    ]
  return []
})

function typeData(index: number) {
  const type2 = ["diambil", "dikirim", "serah-terima"]
  const type3 = ["assign", "move", "void"]

  if (tabModel.value == 2) return type2[index]
  if (tabModel.value == 1) return type3[index]
}

function changeTab() {
  params.value.id = ''
  subTabModel.value = 0
  if (tabModel.value === 0) {
    params.value.category = 'produksi'
    params.value.sub_category = 'serialisasi'
  } else if (tabModel.value === 1) {
    params.value.category = 'penyimpanan'
    params.value.sub_category = 'transfer_order'
  } else if (tabModel.value === 2) {
    params.value.category = 'pengiriman'
    params.value.sub_category = 'aggregasi'
  } else {
    params.value.category = 'panerimaan'
    params.value.sub_category = ''
  }

  params.value.page = 1
  params.value.limit = 10
  getData()
}

function changeSubTab() {
  params.value.id = ''
  if (tabModel.value === 0) {
    if (subTabModel.value === 0) {
      params.value.sub_category = 'serialisasi'
    } else if (subTabModel.value === 1) {
      params.value.sub_category = 'pengemasan'
    } else if (subTabModel.value === 2) {
      params.value.sub_category = 'pengecekan'
    }
  } else if (tabModel.value === 1) {
    if (subTabModel.value === 0) {
      params.value.sub_category = 'transfer_order'
    } else if (subTabModel.value === 1) {
      params.value.sub_category = 'adjustment'
    }
  } else if (tabModel.value === 2) {
    if (subTabModel.value === 0) {
      params.value.sub_category = 'aggregasi'
    } else if (subTabModel.value === 1) {
      params.value.sub_category = 'assign'
    } else if (subTabModel.value === 2) {
      params.value.sub_category = 'loading'
    }
  }

  params.value.page = 1
  params.value.limit = 10
  getData()
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="20">
      <n-space vertical :size="0">
        <n-h2 style="margin-bottom: 0"> Log </n-h2>
        <n-text>Log reporting system</n-text>
      </n-space>
  
      <n-space vertical :size="0">
        <n-tabs
          class="report-tabs"
          v-model:value="tabModel"
          type="segment"
          @update:value="changeTab()"
        >
          <n-tab-pane :disabled="isBtnLoading" :name="0" tab="Produksi"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="1" tab="Penyimpanan"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="2" tab="Pengiriman"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="3" tab="Penerimaan"></n-tab-pane>
        </n-tabs>

        <n-tabs
          class="report-sub-tab"
          v-if="tabModel == 0"
          v-model:value="subTabModel"
          type="line"
          @update:value="changeSubTab()"
        >
          <n-tab-pane :disabled="isBtnLoading" :name="0" tab="Serialisasi"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="1" tab="Pengemasan"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="2" tab="Pengecekan"></n-tab-pane>
        </n-tabs>
  
        <n-tabs
          class="report-sub-tab"
          v-else-if="tabModel == 1"
          v-model:value="subTabModel"
          type="line"
          @update:value="changeSubTab()"
        >
          <n-tab-pane :disabled="isBtnLoading" :name="0" tab="Transfer Order"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="1" tab="Adjust"></n-tab-pane>
        </n-tabs>
  
        <n-tabs
          class="report-sub-tab"
          v-else-if="tabModel == 2"
          v-model:value="subTabModel"
          type="line"
          @update:value="changeSubTab()"
        >
          <n-tab-pane :disabled="isBtnLoading" :name="0" tab="Agregasi"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="1" tab="Assign"></n-tab-pane>
          <n-tab-pane :disabled="isBtnLoading" :name="2" tab="Loading"></n-tab-pane>
        </n-tabs>
      </n-space>
  
      <n-space justify="space-between" :size="20">
        <n-space>
          <n-date-picker
            v-model:formatted-value="params.start_date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="Tanggal Mulai"
          ></n-date-picker>
          <n-date-picker
            v-model:formatted-value="params.end_date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="Tanggal Selesai"
          ></n-date-picker>
          <!-- <n-select
            v-if="options.length > 0"
            v-model:value="optionValue"
            style="width: 256px; max-width: 100%"
            :options="options"
          >
          </n-select> -->
        </n-space>
  
        <n-space>
          <n-space :size="10">
            <n-input
              v-model:value="params.id"
              clearable
              placeholder="Cari Kode / Status / Type"
            ></n-input>
            <n-button
              :loading="isBtnLoading"
              type="primary"
              class="button-tnt"
              @click.prevent="searchData"
            >
              Cari
            </n-button>
            <n-button
              :loading="isBtnLoading"
              secondary
              class="button-tnt"
            >
              Reset
            </n-button>
            <n-button v-if="false" type="info">Export CSV</n-button>
          </n-space>
        </n-space>
      </n-space>
  
      <n-card style="border-radius: 10px;">
        <n-space vertical :size="14">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <template v-if="dataRes.docs.length > 0">
              <component
                v-for="data, i in dataRes.docs"
                :is="compCards[tabModel][subTabModel]"
                :key="i"
                :type="typeData(i)"
                :data="data"
              />
            </template>
            <template v-else>
              <div style="font-size: 14px; text-align: center">Belum ada data tersedia</div>
            </template>
          </template>
  
          <div style="display: flex; justify-content: center;">
            <n-pagination
              v-model:page="params.page"
              v-model:page-size="params.limit"
              :page-count="dataRes.totalPages"
              :page-slot="7"
              :show-size-picker="dataRes.totalDocs > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getData"
              @update:page-size="updatePageSize"
            />
          </div>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<style>
.report-tabs .n-tabs-tab {
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin-right: 1rem;
}

.report-tabs .n-tabs-tab--active {
  background: #219653 !important;
  color: white !important;
}

.report-tabs .report-sub-tab .n-tabs-tab--active {
  background: transparent !important;
}

.report-tabs .report-sub-tab .n-tabs-tab {
  border: none;
  margin-right: 0;
}
</style>

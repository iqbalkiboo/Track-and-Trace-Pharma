<route lang="yaml">
meta:
title: Beranda
requireAuth: true
layout: auth
</route>

<script setup lang="ts">
import type { THeader } from "@/components/components"
import { countReception, countReceptionByMonth, countReceptionDetail } from "@/models/dashboard"
import filters from '@/helpers/filters'
import { serializeModel } from "@/models/produksi/serialisasi"
import getCompanyId from "@/helpers/getCompanyId"
import { diffDays, formatDate } from "@/helpers/date"

// const filterDate = ref()
// const selectedProduct = ref('')

/*
const listProduct = ref<Array<{
  label: string
  key: string
}>>([
  {
    label: 'Amox',
    key: 'Amox'
  },
  {
    label: 'Antimo',
    key: 'Antimo'
  },
  {
    label: 'Dexa',
    key: 'Dexa'
  },
])
const handleSelectProduct = (value: string) => {
  selectedProduct.value = value
}
 */

const proporsiPK = ref<Array<any>>([])

const totalRilisBarcode = ref([
  {
    label: 'Total Rilis',
    value: 0,
  },
  {
    label: 'Rejection Rate',
    value: 0,
  },
])

const monitoringBarcode = ref([{
  name: "Aktif",
  data: []
}, {
  name: "Reject",
  data: []
}, {
  name: "Tidak Aktif",
  data: []
}])

const topProducts = ref([])

const headers = ref<THeader[]>([
  { label: "NAMA PK" },
  { label: "KODE PRODUK" },
  { label: "KATEGORI" },
  { label: "TANGGAL" },
  { label: "NO. BATCH" },
  { label: "JUMLAH" },
  { label: "RILIS" },
  { label: "STATUS" },
])

const productHeaders = ref<THeader[]>([
  { label: "NIE" },
  { label: "KODE PRODUK" },
  { label: "EXPIRED DATE" },
  { label: "SISA HARI" },
])

const tableData = ref<any>({
  limit: 0,
  list: [],
  page: 0,
  total_data: 0,
  total_page: 0,
})

const tableProductData = ref<any>({
  limit: 0,
  list: [],
  page: 0,
  total_data: 0,
  total_page: 0,
  expired_in: 1,
})

// const search = ref('')
const isLoading = ref(false)
const isLoadingReception = ref(true)
const isLoadingReleased = ref(true)
const isLoadingRejected = ref(true)
const isLoadingNonActive = ref(true)
const isLoadingByMonth = ref(true)
const isLoadingProporsiPK = ref(true)
const isLoadingTopProduct = ref(true)
const isLoadingTableData = ref(true)
const isLoadingTableProduct = ref(true)

const receptionMetric = ref(0)
const releasedMetric = ref(0)
const rejectedMetric = ref(0)
const nonActiveMetric = ref(0)

const getData = async () => {
  if (!getCompanyId)
    return

  countReception().then((res) => {
    receptionMetric.value = res.data.total
  }).finally(() => {
    isLoadingReception.value = false
  })
  countReceptionDetail({status: 'released,void'}).then((res) => {
    releasedMetric.value = res.data.total
    totalRilisBarcode.value[0].value = res.data.total
  }).finally(() => {
    isLoadingReleased.value = false
  })
  countReceptionDetail({status: 'rejected'}).then((res) => {
    rejectedMetric.value = res.data.total
    totalRilisBarcode.value[1].value = res.data.total
  }).finally(() => {
    isLoadingRejected.value = false
  })
  countReceptionDetail({not_status: 'released,rejected'}).then((res) => {
    nonActiveMetric.value = res.data.total
  }).finally(() => {
    isLoadingNonActive.value = false
  })

  countReceptionByMonth().then((res) => {
    monitoringBarcode.value = res.data
  }).finally(() => {
    isLoadingByMonth.value = false
  })

  countReception({grouped_by_status: true}).then((res) => {
    const serialisasiProdukPie = res.data.filter((e: any) => ["draft", "ready_to_print", "ready_to_generate"].includes(e.status))
      .reduce((a: any, b: any) => {
        a.value += b.total
        return a
      }, { label: "Serialisasi", value: 0 })
    const inspeksiAkhirProdukPie = res.data.filter((e: any) => ["ready_to_check", "on_checking", "pending"].includes(e.status))
      .reduce((a: any, b: any) => {
        a.value += b.total
        return a
      }, { label: "Inspeksi Akhir", value: 0 })
    const pengemasanPie = res.data.filter((e: any) => ["ready_to_pack", "process_packing"].includes(e.status))
      .reduce((a: any, b: any) => {
        a.value += b.total
        return a
      }, { label: "Pengemasan", value: 0 })
    const preRilisProdukPie = res.data.filter((e: any) => ["pre_release"].includes(e.status))
      .reduce((a: any, b: any) => {
        a.value += b.total
        return a
      }, { label: "Pre Release", value: 0 })
    const rilisProdukPie = res.data.filter((e: any) => ["void", "released"].includes(e.status))
      .reduce((a: any, b: any) => {
        a.value += b.total
        return a
      }, { label: "Rilis Produk", value: 0 })

    proporsiPK.value = [
      rilisProdukPie,
      preRilisProdukPie,
      pengemasanPie,
      inspeksiAkhirProdukPie,
      serialisasiProdukPie,
    ].sort((a: any, b: any) => b.value > a.value ? 1 : -1)
  }).finally(() => {
    isLoadingProporsiPK.value = false
  })

  countReceptionDetail({grouped_by_product: true, limit: 10}).then((res) => {
    topProducts.value = res.data.filter((e: any) => e.product_name).map((e: any) => {
      return {
        label: e.product_name,
        value: e.total,
      }
    }).sort((a: any, b: any) => b.value > a.value ? 1 : -1)
  }).finally(() => {
    isLoadingTopProduct.value = false
  })

  serializeModel.getSerialize({
    search: "",
    sort: "desc",
    sort_field: "created_at",
    page: 1,
    limit: 6,
  }).then((res) => {
    tableData.value = res.data
  }).finally(() => {
    isLoadingTableData.value = false
  })

  serializeModel.getSerialize({
    search: "",
    sort: "asc",
    sort_field: "nie.expired_date",
    limit: -1,
    type: 'product',
  }).then((res) => {
    tableProductData.value = res.data
  }).finally(() => {
    isLoadingTableProduct.value = false
  })
}

getData()

const totalDetail = computed(() => releasedMetric.value + rejectedMetric.value)
const releasedPercentage = computed(() => Math.round((releasedMetric.value / totalDetail.value) * 100) || 0)
const rejectedPercentage = computed(() => Math.round((rejectedMetric.value / totalDetail.value) * 100) || 0)

</script>

<style lang="scss">
.header-overlay::before {
  content: '';
  @apply absolute inset-0 opacity-70;
  background-image: linear-gradient(to bottom, #0B8F9D, #00474F)
}

.header-overlay .custom-datepicker {
  .n-input__input {
    @apply text-[16px] py-2 ml-4;
  }

  .n-input {
    @apply outline-0 border-none;
  }

  .n-input__border {
    @apply hidden;
  }

  .n-input__placeholder {
    color: #415167!important;
  }
  .n-input-wrapper {
    @apply pl-0;
  }

  .n-input__input {
    @apply ml-0 py-0;
  }

  .n-input__input-el {
    @apply h-[48px] max-w-[148px];
  }
}
</style>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>

<template>
  <div class="font-epilogue">
    <div
      :style="{
        backgroundImage: `url('/assets/images/bg-dashboard.jpg')`,
        backgroundPosition: 'bottom center'
      }"
      class="header-overlay relative pt-10 pb-20"
    >
      <div class="container relative flex flex-col md:flex-row flex-wrap md:justify-between">
        <h1 class="font-semibold text-[40px] text-white">Dashboard Medtrack</h1>

        <!--      
                <div class="flex items-center gap-4 font-bold">
                  <div class="flex items-center bg-white rounded">
                    <CalendarOutline class="w-6 h-6 ml-4 mr-2"/>
        
                    <n-date-picker
                      class="custom-datepicker pl-0"
                      v-model:formatted-value="filterDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Pilih Tanggal"
                      clearable
                    >
                      <template #date-icon><span/></template>
                    </n-date-picker>
                  </div>
        
                  <n-dropdown
                    trigger="click"
                    placement="bottom-start"
                    size="huge"
                    :options="listProduct"
                    @select="handleSelectProduct"
                  >
                    <n-button
                      color="#0b8f9d"
                      class="bg-white flex items-center h-[48px] text-[#415167] px-4 py-2"
                    >
                      <CubeOutline class="w-6 h-6 mr-2"/>
                      <span class="font-bold text-[16px]">{{ selectedProduct || 'Pilih Produk' }}</span>
                    </n-button>
                  </n-dropdown>
                  <n-button
                    color="#0b8f9d"
                    class="bg-[#F7941D] flex items-center h-[48px] text-[#ffffff] px-4 py-2"
                  >
                    <span class="font-bold text-[16px]">Download Report</span>
                  </n-button>
                </div>
                  -->
      </div>
    </div>

    <div class="container relative -mt-10 pb-10">
      <div v-if="isLoading" class="flex justify-center items-center mt-36">
        <n-spin size="large" />
        <span class="ml-4 font-bold text-xl">Loading...</span>
      </div>
      <div v-else class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-xl shadow-sm px-8 py-6">
          <p class="text-slate-500">Jumlah PK Generate</p>
          <div v-if="isLoadingReception" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <template v-else>
            <p class="text-3xl font-bold">{{ filters.toNumber(receptionMetric) }}</p>
            <p class="text-slate-400 text-right -mt-4">YTD</p>
          </template>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-xl shadow-sm px-8 py-6">
          <p class="text-slate-500">Jumlah Barcode Aktif</p>
          <div v-if="isLoadingReleased" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <template v-else>
            <p class="text-3xl font-bold">{{ filters.toNumber(releasedMetric) }}</p>
            <p class="text-slate-400 text-right -mt-4">YTD</p>
          </template>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-xl shadow-sm px-8 py-6">
          <p class="text-slate-500">Jumlah Barcode Reject</p>
          <div v-if="isLoadingRejected" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <template v-else>
            <p class="text-3xl font-bold">{{ filters.toNumber(rejectedMetric) }}</p>
            <p class="text-slate-400 text-right -mt-4">YTD</p>
          </template>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-xl shadow-sm px-8 py-6">
          <p class="text-slate-500">Jumlah Barcode Tidak Aktif</p>
          <div v-if="isLoadingNonActive" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <template v-else>
            <p class="text-3xl font-bold">{{ filters.toNumber(nonActiveMetric) }}</p>
            <p class="text-slate-400 text-right -mt-4">YTD</p>
          </template>
        </div>
        <div class="col-span-12 lg:col-span-3 bg-white rounded-xl shadow-sm px-8 py-8 flex flex-col gap-14">
          <p class="font-semibold text-xl">Proporsi PK Per Tahapan</p>
          <div v-if="isLoadingProporsiPK" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <div v-else>
            <t-dashboard-proporsi-pk v-model="proporsiPK"/>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-3 bg-white rounded-xl shadow-sm px-8 py-8 flex flex-col gap-8">
          <p class="font-semibold text-xl">Total Rilis Keseluruhan Barcode</p>
          <div v-if="isLoadingReleased || isLoadingRejected" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <div v-else>
            <t-dashboard-total-rilis v-model="totalRilisBarcode"/>

            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center">
                <span class="bg-[#0BB783] w-[18px] h-[18px] rounded-sm mr-2"/>
                <p class="font-bold">Total Rilis</p>
              </div>
              <span class="font-bold text-slate-500">{{ releasedPercentage }}%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="bg-[#FF6972] w-[18px] h-[18px] rounded-sm mr-2"/>
                <p class="font-bold">Rejection Rate</p>
              </div>
              <span class="font-bold text-slate-500">{{ rejectedPercentage }}%</span>
            </div>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-6 bg-white rounded-xl shadow-sm px-8 py-8 flex flex-col gap-4">
          <p class="font-semibold text-xl mb-4">Expired NIE {{ tableProductData.expired_in || 1 }} Bulan Ke Depan</p>
          <div v-if="isLoadingTableProduct" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <div class="max-h-[350px] overflow-y-auto">
            <t-table-dashboard :headers="productHeaders">
              <n-tr v-for="(item, index) in tableProductData.list" :key="index">
                <n-td class="font-semibold" style="padding-left: 18px">{{ item.nie.number }}</n-td>
                <n-td>
                  <p class="font-semibold">{{ item.item_code }}</p>
                  <p class="text-slate-500 text-xs">{{ item.short_name }}</p>
                </n-td>
                <n-td class="font-semibold">{{ formatDate(item.nie.expired_date) }}</n-td>
                <n-td class="font-semibold">{{ diffDays(item.nie.expired_date) }}</n-td>
              </n-tr>
            </t-table-dashboard>
          </div>
        </div>
        <div class="col-span-12 bg-white rounded-xl shadow-sm px-8 py-8 flex flex-col justify-between">
          <p class="font-semibold text-xl">Monitoring Barcode Serialisasi</p>
          <div v-if="isLoadingByMonth" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <t-dashboard-monitoring-barcode v-else v-model="monitoringBarcode"/>
        </div>
        <div class="col-span-12 lg:col-span-3 bg-white rounded-xl shadow-sm px-8 pt-8 flex flex-col">
          <p class="font-semibold text-xl">Top Produk</p>
          <div v-if="isLoadingTopProduct" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <t-dashboard-top-product v-else v-model="topProducts"/>
        </div>
        <div class="col-span-12 lg:col-span-9 bg-white rounded-xl shadow-sm px-8 pt-8 flex flex-col justify-between">
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="font-semibold text-xl">Latest Generated PK</p>
            </div>
<!--            <div>-->
<!--              <n-input v-model:value="search" type="text" placeholder="Cari Produk" />-->
<!--            </div>-->
          </div>
          <div v-if="isLoadingTableData" class="flex justify-center items-center mt-4 mb-2">
            <n-spin size="small" />
          </div>
          <t-table-dashboard v-else :headers="headers">
            <n-tr v-for="(item, index) in tableData.list" :key="index">
              <n-td style="padding-left: 18px">
                <p class="font-semibold">{{ item.pk_id }}</p>
                <p class="text-slate-500 text-xs">{{ item.product.item_code }}</p>
              </n-td>
              <n-td class="font-semibold">{{ item.product.item_code }}</n-td>
              <n-td class="font-semibold">{{ item.product.is_toll_in ? 'TOLL IN' : '-' }}</n-td>
              <n-td class="font-semibold">{{ formatDate(item.date.pk_date) }}</n-td>
              <n-td class="font-semibold">{{ item.batch_number }}</n-td>
              <n-td class="font-semibold">{{ item.serialize?.length > 0 ? item.serialize[0].qty : 0 }}</n-td>
              <n-td class="font-semibold">{{ item.serialize?.length > 0 ? (item.serialize[0].total_release ? item.serialize[0].total_release : '-') : 0 }}</n-td>
              <n-td>
                <div class="flex justify-center ">
                  <div :class="[
                    'inline-flex items-center h-[28px] text-white rounded px-4 py-0 leading-[1] text-[12px] bg-[#04AA77]',
                    item.status?.global?.value === 'draft' && 'bg-[#F7941D]',
                    // item.status?.global?.value === 'Printing' && 'bg-[#214178]',
                    ['canceled', 'rejected'].includes(item.status?.global?.value) && 'bg-[#FF6972]',
                    !['draft', 'canceled', 'rejected'].includes(item.status?.global?.value) && 'bg-[#04AA77]',
                  ]">
                    <span>{{ $filters.toStatus(item.status?.global?.value) }}</span>
                  </div>
                </div>
              </n-td>
            </n-tr>
          </t-table-dashboard>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useMessage, NInput } from 'naive-ui'
import moment from "moment"
import { lacakDOModel } from "@/models/lacak-do/index"
import Distribusi from './distribusi.vue'
import Penyimpanan from './penyimpanan.vue'
import ModalDetailDistribution from '../modal/modal-detail-distribution.vue'
import ModalDetailStorage from '../modal/modal-detail-storage.vue'
import constants from "@/helpers/constant"
import { useRouter } from "vue-router"

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const isTableLoading = ref(false)
const codeScan = ref('')
const distributionDataRes = ref<any>({})
const storageDataRes = ref<any>({})
const input = ref<typeof NInput | null>(null)
const params = ref<any>({
  sort: 'created_at',
  dir: 'desc',
  limit: 10000,
})
const modalDetailDistribution = ref<any>({
  show: false,
  data: {}
})
const modalDetailStorage = ref<any>({
  show: false,
  data: {},
  dataDistribution: {}
})
const routeType = ref('')
const router = useRouter()
const selectedTab = ref('distribusi')

onMounted(() => {
  routeType.value = route.params.type as string
  
  if (routeType.value === 'batch' && !filters.checkPermission(constants.accessTrack.lacakByBatch + ".list")) {
    return router.push('/')
  }
  if (routeType.value === 'serialisasi' && !filters.checkPermission(constants.accessTrack.lacakBySerialisasi + ".list")) {
    return router.push('/')
  }
  
  input.value?.focus()
})

async function handleClickScan() {
  if (codeScan.value) {
    isLoading.value = true
    isBtnLoading.value = true
    const code = codeScan.value
    selectedTab.value = 'distribusi'
  
    if (routeType.value === 'batch') {
      await lacakDOModel.getLacakDOBatch(code, params.value)
      .then((res) => {
        distributionDataRes.value = res.data
        isLoading.value = false
        isBtnLoading.value = false
      })
      .catch((err: any) => {
        isLoading.value = false
        isBtnLoading.value = false
        const data = err.response.data
        tMessage.error(data.message)
      })
    } else if (routeType.value === 'serialisasi') {
      await lacakDOModel.getLacakDOSerial(code, params.value)
      .then((res) => {
        distributionDataRes.value = res.data
        isLoading.value = false
        isBtnLoading.value = false
      })
      .catch((err: any) => {
        isLoading.value = false
        isBtnLoading.value = false
        const data = err.response.data
        tMessage.error(data.message)
      })
    }
  }
}

async function handleTabChanged(tab: string) {
  isTableLoading.value = true
  const code = codeScan.value

  if (routeType.value === 'batch') {
    if (tab === 'distribusi') {
      await lacakDOModel.getLacakDOBatch(code, params.value)
        .then((res) => {
          distributionDataRes.value = res.data
          isTableLoading.value = false
        })
        .catch((err: any) => {
          isTableLoading.value = false
          const data = err.response.data
          tMessage.error(data.message)
        })
    } else {
      await lacakDOModel.getListPlantByBatch(code, params.value)
        .then((res) => {
          storageDataRes.value = res.data
          isTableLoading.value = false
        })
        .catch((err: any) => {
          isTableLoading.value = false
          const data = err.response.data
          tMessage.error(data.message)
        })
    }
  } else if (routeType.value === 'serialisasi') {
    if (tab === 'distribusi') {
      await lacakDOModel.getLacakDOSerial(code, params.value)
        .then((res) => {
          distributionDataRes.value = res.data
          isTableLoading.value = false
        })
        .catch((err: any) => {
          isTableLoading.value = false
          const data = err.response.data
          tMessage.error(data.message)
        })
    }
  }
}

function handleShowDetailDistribution(data: any) {
  modalDetailDistribution.value.data = data
  modalDetailDistribution.value.show = true
}

function handleCloseDetailDistribution() {
  modalDetailDistribution.value.show = false
}

function handleShowDetailStorage(data: any) {
  modalDetailStorage.value.data = data
  modalDetailStorage.value.data.batch = codeScan.value
  modalDetailStorage.value.dataDistribution = distributionDataRes?.value?.list[0]
  modalDetailStorage.value.show = true
}

function handleCloseDetailStorage() {
  modalDetailStorage.value.show = false
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px; text-transform: capitalize;">Lacak By {{ routeType }}</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item style="text-transform: capitalize;">Lacak By {{ routeType }}</n-breadcrumb-item>
    </n-breadcrumb>

    <div
      class="card-tnt"
      style="background-color: #eeeeee;"
    >
      <n-space vertical align="center">
        <n-text style="text-transform: capitalize;">Masukkan Kode {{ routeType }}</n-text>
        <n-space>
          <n-input
            ref="input"
            v-model:value="codeScan"
            placeholder=""
            clearable
            @keyup.enter="handleClickScan"
            style="width: 35rem"
          ></n-input>
          <n-button
            :loading="isBtnLoading"
            :disabled="codeScan == ''"
            strong
            type="primary"
            class="button-tnt"
            @click="handleClickScan"
            >Cari</n-button
          >
        </n-space>
      </n-space>
    </div>

    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <template v-if="Object.keys(distributionDataRes).length > 0">
        <n-space v-if="distributionDataRes.list.length > 0" vertical :size="0" style="margin-top: 18px;">
          <template v-if="route.params.type === 'batch'">
            <n-text strong style="font-size: 16px;">
              Batch : {{ distributionDataRes.list[0].do.products[0].batch }}
            </n-text>
            <n-text>Nama Produk : {{ distributionDataRes.list[0].do.products[0].name }}</n-text>
            <n-text>Kode Produk : {{ distributionDataRes.list[0].do.products[0].code }}</n-text>
            <n-text>Exp Date : {{ moment(distributionDataRes.list[0].do.products[0].expired_date).format("yyyy-MM-DD") }}</n-text>
          </template>
          <template v-if="route.params.type === 'serialisasi'">
            <template v-if="'do' in distributionDataRes.list[0]">
              <n-text
                v-if="route.params.type === 'serialisasi'"
                strong
                style="font-size: 16px;"
              >
                No DO : {{ distributionDataRes.list[0].do.code }}
              </n-text>
              <n-text>Customer : {{ distributionDataRes.list[0].do.customer.name }}</n-text>
              <n-text>Alamat : {{ $filters.setAddress(distributionDataRes.list[0].do.destination.address) }}</n-text>
              <div style="margin-top: 15px;"></div>
              <n-text>Plant : {{ $filters.isEmpty(distributionDataRes.list[0].do.origin.warehouse.name) }}</n-text>
              <n-text>Building : {{ $filters.isEmpty(distributionDataRes.list[0].do.origin.warehouse_building.name) }}</n-text>
              <n-text>Room : {{ $filters.isEmpty(distributionDataRes.list[0].do.origin.warehouse_room.name) }}</n-text>
              <n-text>Rack : {{ $filters.isEmpty(distributionDataRes.list[0].do.origin.warehouse_rack.name) }}</n-text>
              <n-text>Bin : {{ $filters.isEmpty(distributionDataRes.list[0].do.origin.warehouse_bin.name) }}</n-text>
              <div style="margin-top: 15px;"></div>
              <n-text>Nama Produk : {{ distributionDataRes.list[0].do.products[0].name }}</n-text>
              <n-text>Kode Produk : {{ distributionDataRes.list[0].do.products[0].code }}</n-text>
              <n-text>Exp Date : {{ moment(distributionDataRes.list[0].do.products[0].expired_date).format("yyyy-MM-DD") }}</n-text>
            </template>
            <template v-else>
              <n-text>Plant : {{ $filters.isEmpty(distributionDataRes.list[0].allocation.warehouse.name) }}</n-text>
              <n-text>Building : {{ $filters.isEmpty(distributionDataRes.list[0].allocation.building.name) }}</n-text>
              <n-text>Room : {{ $filters.isEmpty(distributionDataRes.list[0].allocation.room.name) }}</n-text>
              <n-text>Rack : {{ $filters.isEmpty(distributionDataRes.list[0].allocation.rack_pallete.name) }}</n-text>
              <n-text>Bin : {{ $filters.isEmpty(distributionDataRes.list[0].allocation.bin.name) }}</n-text>
              <div style="margin-top: 15px;"></div>
              <n-text>Nama Produk : {{ distributionDataRes.list[0].name }}</n-text>
              <n-text>Kode Produk : {{ distributionDataRes.list[0].code }}</n-text>
              <n-text>Exp Date : {{ moment(distributionDataRes.list[0].expired_date).format("yyyy-MM-DD") }}</n-text>
            </template>
          </template>
        </n-space>
        <div class="card-tnt">
          <n-tabs
            v-if="route.params.type === 'batch'"
            class="card-tabs"
            animated
            pane-wrapper-style="margin: 0 -4px"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
            v-model:value="selectedTab"
            @update:value="handleTabChanged"
          >
            <n-tab-pane :disabled="isTableLoading" name="penyimpanan" tab="Penyimpanan">
            </n-tab-pane>
            <n-tab-pane :disabled="isTableLoading" name="distribusi" tab="Distribusi">
            </n-tab-pane>
          </n-tabs>

          <template v-if="isTableLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <template v-if="selectedTab === 'distribusi'">
              <template v-if="distributionDataRes.list.length > 0">
                <distribusi
                  v-if="'do' in distributionDataRes.list[0]"
                  v-model:data="distributionDataRes"
                  v-model:codeScan="codeScan"
                  @click:showDetail="handleShowDetailDistribution"
                ></distribusi>
              </template>
              <template v-else>
                <n-text>Belum ada data tersedia</n-text>
              </template>
            </template>
            <template v-if="selectedTab === 'penyimpanan'">
              <penyimpanan
                v-model:data="storageDataRes"
                v-model:codeScan="codeScan"
                @click:showDetail="handleShowDetailStorage"
              ></penyimpanan>
            </template>
          </template>
        </div>
      </template>
    </template>
  </div>

  <modal-detail-distribution
    v-model:show="modalDetailDistribution.show"
    v-model:data="modalDetailDistribution.data"
    @click:close="handleCloseDetailDistribution"
  >
  </modal-detail-distribution>

  <modal-detail-storage
    v-model:show="modalDetailStorage.show"
    v-model:data="modalDetailStorage.data"
    v-model:data-distribution="modalDetailStorage.dataDistribution"
    @click:close="handleCloseDetailStorage"
  >
  </modal-detail-storage>

</template>
<script setup lang="ts">
import { useMessage } from 'naive-ui'
import constants from "@/helpers/constant"
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isRackLoading = ref(true)
const isBinLoading = ref(true)
const warehouseDataRes = ref<any>({})
const rackPalleteDataRes = ref<any>({})
const binDataRes = ref<any>({})
const rackParams = ref<any>({
  warehouse_id: route.params.id,
  sort: 'desc',
  sort_field: 'created_at',
  page: 1,
  limit: 10,
})
const binParams = ref<any>({
  warehouse_id: route.params.id,
  sort: 'desc',
  sort_field: 'created_at',
  page: 1,
  limit: 10,
})
const permissionModal = ref<any>({
  show: false
})

onMounted(() => {
  if (filters.isGranted(constants.accessSettings.settingWarehouse + ".print")) {
    getData()
  } else {
    permissionModal.value.show = true
  }
})

async function getData() {
  isLoading.value = true
  await getDetailWarehouse()
  await getRackPallete()
  await getBin()
  isLoading.value = false
}

async function getDetailWarehouse() {
  const id = route.params.id
  await masterWarehouseModel.getDetailWarehouse(id).then((res: any) => {
    warehouseDataRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getRackPallete() {
  isRackLoading.value = true
  await masterWarehouseModel.getRackPallete(rackParams.value).then((res: any) => {
    rackPalleteDataRes.value = res.data
    isRackLoading.value = false
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
    isRackLoading.value = false
  })
}

async function getBin() {
  isBinLoading.value = true
  await masterWarehouseModel.getBin(binParams.value).then((res: any) => {
    binDataRes.value = res.data
    isBinLoading.value = false
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
    isBinLoading.value = false
  })
}

function updateRackPageSize(pageSize: number) {
  rackParams.value.limit = pageSize
  getRackPallete()
}

function updateBinPageSize(pageSize: number) {
  binParams.value.limit = pageSize
  getBin()
}

const printValue = ref({
  type: '',
  totalRack: 0,
  totalBin: 0,
})
const showFeedback = ref(false)
const showConfirm = ref(false)

function handlePrintQr(type: string, totalRack: number, totalBin: number) {
  printValue.value.type = type
  printValue.value.totalRack = totalRack
  printValue.value.totalBin = totalBin
  showConfirm.value = true
}

function handleConfirmPrintQr() {
  if (printValue.value.type === 'rack') {
    console.log(rackPalleteDataRes.value.list)
    localStorage.setItem('labels_wh', JSON.stringify(rackPalleteDataRes.value.list))
  } else if (printValue.value.type === 'pallete') {
    localStorage.setItem('labels_wh', JSON.stringify(rackPalleteDataRes.value.list))
  } else {
    localStorage.setItem('labels_wh', JSON.stringify(binDataRes.value.list))
  }
  localStorage.setItem('is_label_wh_open', "0" as string)
  const routeData = router.resolve({ path: `/print/labels-warehouse` })
  window.open(routeData.href, '_blank')
  showConfirm.value = false
  // showConfirm.value = false
  // showFeedback.value = true
}
</script>

<template>
  <div class="body-tnt">

    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-space vertical :size="24">
        <n-space vertical :size="0">
          <n-h2 style="margin-bottom: 4px">{{ warehouseDataRes.name }}</n-h2>
          <n-text style="margin-bottom: 0">{{ warehouseDataRes.address?.detail + ', ' + warehouseDataRes.address?.urban_village.name + ', ' + warehouseDataRes.address?.sub_district.name + ', ' + warehouseDataRes.address?.district.name + ', ' + warehouseDataRes.address?.province.name }}</n-text>
        </n-space>
  
        <n-card style="border-radius: 12px;">
          <n-space :size="10" vertical>
            <n-h6 style="font-size: 14px; margin-bottom: 0">Pratinjau</n-h6>
            <n-grid
              cols="3"
              item-responsive
              responsive="screen"
              x-gap="16"
              y-gap="16"
            >
              <n-grid-item span="3 m:1">
                <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 14px; text-align: center;">
                  <n-text style="font-size: 14px; margin-bottom: 0">
                    {{ warehouseDataRes.counts.rack }} Rack
                  </n-text>
                </div>
              </n-grid-item>
              <n-grid-item span="3 m:1">
                <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 14px; text-align: center;">
                  <n-text style="font-size: 14px; margin-bottom: 0">
                    {{ warehouseDataRes.counts.pallete }} Pallete
                  </n-text>
                </div>
              </n-grid-item>
              <n-grid-item span="3 m:1">
                <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 14px; text-align: center;">
                  <n-text style="font-size: 14px; margin-bottom: 0">
                    {{ warehouseDataRes.counts.bin }} Bin
                  </n-text>
                </div>
              </n-grid-item>
            </n-grid>
  
            <template v-if="isRackLoading">
              <div class="card-tnt">
                <t-loading></t-loading>
              </div>
            </template>
            <template v-else>
              <n-card style="border-radius: 12px;">
                <n-space vertical>
                  <n-grid cols="2" item-responsive responsive="screen">
                    <n-grid-item span="2 s:1">
                      <n-h6 style="font-size: 14px; margin-bottom: 0; margin-top: 0">
                        Rack
                      </n-h6>
                      <n-p style="margin-bottom: 0; margin-top: 0" v-if="false">
                        200 Rack (201 - 400)
                      </n-p>
                    </n-grid-item>
                    <n-grid-item span="2 s:1">
                      <n-space justify="end">
                        <n-button type="primary" class="button-tnt" @click="handlePrintQr('rack', rackPalleteDataRes.list.length, 0)">
                          Print QR Code
                        </n-button>
                      </n-space>
                    </n-grid-item>
                  </n-grid>
    
                  <n-grid
                    cols="20"
                    item-responsive
                    responsive="screen"
                    :x-gap="16"
                    :y-gap="16"
                  >
                    <n-grid-item span="20 m:4 s:10" v-for="rack, i in rackPalleteDataRes.list" :key="i">
                      <n-card style="border-radius: 12px; margin-top: 0;" content-style="padding: 5px">
                        <div style="display: flex; justify-content: space-between">
                          <div style="margin: auto">
                            <n-p style="font-size: 10px; font-weight: 600; margin-bottom: 0">
                              {{ rack.name }}
                            </n-p>
                            <n-p style="font-size: 10px; margin-top: 5px; margin-bottom: 0">
                              {{ rack.kind === 'rack' ? rack.erp_code : rack.id_pallete }}
                            </n-p>
                          </div>
                          <div>
                            <vue-qrcode
                              :options="{ width: 75 }"
                              :value="rack.kind === 'rack' ? rack.erp_code : rack.id_pallete"
                            />
                          </div>
                        </div>
                      </n-card>
                    </n-grid-item>
                  </n-grid>
                  <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <n-pagination
                      v-model:page="rackParams.page"
                      :page-count="rackPalleteDataRes.total_page"
                      :page-slot="7"
                      :show-size-picker="rackPalleteDataRes.total_data > 10"
                      :page-sizes="[10, 20, 30, 40, 50]"
                      @update:page="getRackPallete"
                      @update:page-size="updateRackPageSize"
                    />
                  </div>
                </n-space>
              </n-card>
            </template>

            <template v-if="isRackLoading">
              <div class="card-tnt">
                <t-loading></t-loading>
              </div>
            </template>
            <template v-else>
              <n-card style="border-radius: 12px;">
                <n-space vertical>
                  <n-grid cols="2" item-responsive responsive="screen">
                    <n-grid-item span="2 s:1">
                      <n-h6 style="font-size: 14px; margin-bottom: 0; margin-top: 0">
                        Pallete
                      </n-h6>
                      <n-p style="margin-bottom: 0; margin-top: 0" v-if="false">
                        Pallete (201 - 400)
                      </n-p>
                    </n-grid-item>
                    <n-grid-item span="2 s:1">
                      <n-space justify="end">
                        <template v-if="$filters.isGranted(constants.accessSettings.settingWarehouse + '.print')">
                          <n-button type="primary" class="button-tnt" @click="handlePrintQr('pallete', rackPalleteDataRes.list.length, 0)">
                            Print QR Code
                          </n-button>
                        </template>
                      </n-space>
                    </n-grid-item>
                  </n-grid>
    
                  <n-grid
                    cols="20"
                    item-responsive
                    responsive="screen"
                    :x-gap="16"
                    :y-gap="16"
                  >
                    <n-grid-item span="20 m:4 s:10" v-for="rack, i in rackPalleteDataRes.list" :key="i">
                      <n-card style="border-radius: 12px; margin-top: 0;" content-style="padding: 5px">
                        <div style="display: flex; justify-content: space-between">
                          <div style="margin: auto">
                            <n-p style="font-size: 10px; font-weight: 600; margin-bottom: 0">
                              {{ rack.name }}
                            </n-p>
                            <n-p style="font-size: 10px; margin-top: 5px; margin-bottom: 0">
                              {{ rack.kind === 'rack' ? rack.erp_code : rack.id_pallete }}
                            </n-p>
                          </div>
                          <div>
                            <vue-qrcode
                              :options="{ width: 75 }"
                              :value="rack.kind === 'rack' ? rack.erp_code : rack.id_pallete"
                            />
                          </div>
                        </div>
                      </n-card>
                    </n-grid-item>
                  </n-grid>
                  <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <n-pagination
                      v-model:page="rackParams.page"
                      :page-count="rackPalleteDataRes.total_page"
                      :page-slot="7"
                      :show-size-picker="rackPalleteDataRes.total_data > 10"
                      :page-sizes="[10, 20, 30, 40, 50]"
                      @update:page="getRackPallete"
                      @update:page-size="updateRackPageSize"
                    />
                  </div>
                </n-space>
              </n-card>
            </template>

            <template v-if="isBinLoading">
              <div class="card-tnt">
                <t-loading></t-loading>
              </div>
            </template>
            <template v-else>
              <n-card style="border-radius: 12px;">
                <n-space vertical>
                  <n-grid cols="2" item-responsive responsive="screen">
                    <n-grid-item span="2 s:1">
                      <n-h6 style="font-size: 14px; margin-bottom: 0; margin-top: 0">
                        Bin
                      </n-h6>
                      <n-p style="margin-bottom: 0; margin-top: 0" v-if="false">
                        200 Bin (201 - 400)
                      </n-p>
                    </n-grid-item>
                    <n-grid-item span="2 s:1">
                      <n-space justify="end">
                        <n-button type="primary" class="button-tnt" @click="handlePrintQr('bin', 0, binDataRes.list.length)">
                          Print QR Code
                        </n-button>
                      </n-space>
                    </n-grid-item>
                  </n-grid>
    
                  <n-grid
                    cols="20"
                    item-responsive
                    responsive="screen"
                    :x-gap="16"
                    :y-gap="16"
                  >
                    <n-grid-item span="20 m:4 s:10" v-for="bin, i in binDataRes.list" :key="i">
                      <n-card style="border-radius: 12px; margin-top: 0;" content-style="padding: 5px">
                        <div style="display: flex; justify-content: space-between">
                          <div style="margin: auto">
                            <n-p style="font-size: 10px; font-weight: 600; margin-bottom: 0">
                              {{ bin.name }}
                            </n-p>
                            <n-p style="font-size: 10px; margin-top: 5px; margin-bottom: 0">
                              {{ bin.id_bin }}
                            </n-p>
                          </div>
                          <div>
                            <vue-qrcode
                              :options="{ width: 75 }"
                              :value="bin.id_bin"
                            />
                          </div>
                        </div>
                      </n-card>
                    </n-grid-item>
                  </n-grid>
                  <div style="display: flex; justify-content: center; margin-top: 10px;">
                    <n-pagination
                      v-model:page="rackParams.page"
                      :page-count="binDataRes.total_page"
                      :page-slot="7"
                      :show-size-picker="binDataRes.total_data > 10"
                      :page-sizes="[10, 20, 30, 40, 50]"
                      @update:page="getBin"
                      @update:page-size="updateBinPageSize"
                    />
                  </div>
                </n-space>
              </n-card>
            </template>
  
          </n-space>
        </n-card>
      </n-space>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'setting-master-warehouse-id' }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
        <n-button v-if="false" type="primary" class="button-tnt" style="margin-left: 10px;" @click="handlePrintQr('all', rackPalleteDataRes.list.length, binDataRes.list.length)">Print QR Code</n-button>
      </div>
    </div>
  </div>

  <t-feedback v-model:show="showConfirm" hide-icon title="Konfirmasi QR Code">
    <n-space vertical :space="24">
      <n-p style="text-align: center">Anda akan mencetak {{ (printValue.totalRack + printValue.totalBin) }} QR Code</n-p>
      <n-grid cols="2" v-if="printValue.type == 'rack' || printValue.type == 'all'">
        <n-gi span="1">Rack :</n-gi>
        <n-gi span="1" style="text-align: right">{{ printValue.totalRack }}</n-gi>
      </n-grid>
      <n-grid cols="2" v-if="printValue.type == 'bin' || printValue.type == 'all'">
        <n-gi span="1">Bin :</n-gi>
        <n-gi span="1" style="text-align: right">{{ printValue.totalBin }}</n-gi>
      </n-grid>
      <n-space justify="center" style="margin-top: 20px">
        <n-button type="primary" class="button-tnt" @click="handleConfirmPrintQr">
          Print QR Code
        </n-button>
      </n-space>
    </n-space>
  </t-feedback>

  <t-feedback
    v-model:show="showFeedback"
    title="Print Barcode Berhasil"
    :subtitle="'Selamat ' + (printValue.totalRack + printValue.totalBin) + ' barcode berhasil diprint'"
  >
    <n-space justify="center">
      <n-button type="primary" class="button-tnt" @click="showFeedback = false">Kembali</n-button>
    </n-space>
  </t-feedback>

  <t-permission-modal
    v-model:show="permissionModal.show"
    @click:close="permissionModal.show = false"
  />

</template>
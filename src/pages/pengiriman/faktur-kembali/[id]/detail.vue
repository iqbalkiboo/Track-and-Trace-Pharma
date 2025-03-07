<script setup lang="ts">
import { useMessage } from "naive-ui"
import moment from "moment"
import { fakturKembaliModel } from "@/models/pengiriman/faktur-kembali"
import ModalImageArr from '../modal/modal-image-arr.vue'

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const detailDataRes = ref<any>({})
const manifestDataRes = ref<any>({})
const modalImageArr = ref<any>({
  show: false,
  data: {}
})

onMounted(() => {
  localStorage.removeItem('manifest_id')
  getData()
})

async function getData() {
  isLoading.value = true
  await getDetailDO()
  await getManifest()
  isLoading.value = false
}

async function getDetailDO() {
  const id = route.params.id
  await fakturKembaliModel.getDetailDO(id).then(async(res) => {
    detailDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getManifest() {
  const params = {
    do_id: route.params.id,
    limit: 1000
  }
  await fakturKembaliModel.getManifest(params).then(async(res) => {
    manifestDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleShowModalImgArr(data: any) {
  modalImageArr.value.data = data
  modalImageArr.value.show = true
}

function handleCloseModalImgArr() {
  modalImageArr.value.show = false
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
      <n-space vertical :size="14">
        <n-h2 style="margin-bottom: 0;">No. Invoice : {{ detailDataRes?.code }}</n-h2>
        <n-row
          gutter="14"
          style="display: flex; justify-content: space-between;"
        >
          <n-col :span="8">
            <n-space vertical :size="5">
              <n-text>Tanggal : {{ moment(detailDataRes?.created_at).format("yyyy-MM-DD") }}</n-text>
              <n-text>No. Quotation : {{ $filters.isEmpty(detailDataRes?.no_invoice) }}</n-text>
              <n-text>Customer : {{ detailDataRes?.customer?.name }}</n-text>
              <n-text>Alamat : {{ $filters.setAddress(detailDataRes?.destination?.address) }}</n-text>
              <n-text>Tanggal Terima Invoice : {{ moment(detailDataRes?.faktur?.tanggal_terima_invoice).format("yyyy-MM-DD") }}</n-text>
              <n-text>Jam : {{ detailDataRes?.faktur?.jam }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="8">
            <n-space vertical :size="5">
              <!-- <n-text>Jenis Kendaraan : {{ detailDataRes?.code }}</n-text> -->
              <n-text>SLA Customer : {{ detailDataRes?.customer?.standart_sla + " Hari" }}</n-text>
              <n-text>
                Parameter SLA : 
                <n-tag
                  round
                  :bordered="false"
                  type="success"
                >
                  <span style="text-transform: capitalize">{{
                    $filters.isEmpty(detailDataRes?.faktur?.parameter_sla)
                  }}</span>
                </n-tag>
              </n-text>
              <n-text>Tanggal Penerimaan : {{ moment(detailDataRes?.set_delivered_date).format("yyyy-MM-DD") }}</n-text>
              <n-text>Rayon Customer : {{ detailDataRes?.faktur?.rayon_customer }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="8">
            <n-space vertical :size="5">
              <n-text>Status : {{ $filters.isEmpty(detailDataRes?.faktur?.rayon_customer) }}</n-text>
              <n-text>Foto Bukti : 
                <n-button
                  text
                  type="primary"
                  @click="handleShowModalImgArr(detailDataRes?.finish_info)"
                >
                  Lihat Foto
                </n-button>
              </n-text>
            </n-space>
          </n-col>
        </n-row>

        <n-space
          vertical
          style="margin-top: .5rem;"
        >
          <n-card
            v-for="(manifest, key) in manifestDataRes?.list" :key="key"
            style="border-radius: 8px;"
            :content-style="{ background: '#eee', borderRadius: '8px' }"
          >
            <h6 style="margin: 0; font-size: 14px; font-weight: 500;">{{ manifest.code }}</h6>
            <n-space
              vertical
              style="margin-top: .5rem;"
            >
              <n-card
                v-if="'porter' in manifest?.driver_info"
                style="border-radius: 8px;"
                :content-style="{ background: '#fafafa', borderRadius: '8px' }"
              >
                <n-row :cols="12">
                  <n-col :span="12" style="font-size: 13px">
                    <div>Nama Porter : {{ manifest?.driver_info?.porter?.name }}</div>
                    <div>No. handphone : {{ manifest?.driver_info?.porter?.phone }}</div>
                  </n-col>
                </n-row>
              </n-card>
              <n-card
                v-if="manifest?.driver_info?.drivers !== null"
                v-for="(driver, key) in manifest?.driver_info?.drivers" :key="key"
                style="border-radius: 8px;"
                :content-style="{ background: '#fafafa', borderRadius: '8px' }"
              >
                <n-row :cols="12">
                  <n-col :span="12" style="font-size: 13px">
                    <div>Nama Driver : {{ driver.name }}</div>
                    <div>Plat Nomor Kendaraan : {{ driver.vehicle?.plate_number }}</div>
                  </n-col>
                  <n-col :span="12" style="font-size: 13px">
                    <div>Tipe Kendaraan : {{ driver.vehicle_category?.name }}</div>
                    <div v-if=false>Pemilik : {{ '?' }}</div>
                  </n-col>
                </n-row>
              </n-card>
            </n-space>
          </n-card>
        </n-space>


      </n-space>
    </template>
    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'pengiriman-faktur-kembali' }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
      </div>
    </div>
  </div>

  <modal-image-arr
    v-model:show="modalImageArr.show"
    v-model:data="modalImageArr.data"
    @click:close="handleCloseModalImgArr"
  >
  </modal-image-arr>

</template>

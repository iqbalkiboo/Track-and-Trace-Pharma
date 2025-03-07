<script setup lang="ts">
import { useMessage } from "naive-ui"
import { monitoringDriverModel } from "@/models/pengiriman/monitoring-driver"

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const manifestDataRes = ref<any>({})

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  await getDetailMonitoringDriver()
  await getManifest()
  isLoading.value = false
}

async function getDetailMonitoringDriver() {
  const id = route.params.id
  await monitoringDriverModel
    .getDetailMonitoringDriver(id)
    .then(async (res) => {
      detailDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getManifest() {
  const params = {
    do_id: detailDataRes.value.id,
    driver_id: localStorage.getItem("driver_id"),
    limit: 1000,
  }
  await monitoringDriverModel
    .getManifest(params)
    .then((res) => {
      manifestDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function setAddress(address: any) {
  const detail = address?.detail
  const urban_village = address?.urban_village?.name
  const sub_district = address?.sub_district?.name
  const district = address?.district?.name
  const province = address?.province?.name
  // const complete_address

  return `${detail}, ${urban_village}, ${sub_district}, ${district}, ${province}`
}

async function getManifestPacking(id: string, iManifest: number) {
  const params = {
    manifest_id: "",
    page: 1,
    limit: 1000,
  }
  isBtnLoading.value = true
  params.manifest_id = id
  monitoringDriverModel
    .getManifestPacking(params)
    .then((res: any) => {
      if (res.data.list.length > 0) {
        // Check if id is same
        if (id === res.data.list[0].manifest.id) {
          manifestDataRes.value.list[iManifest].is_show_detail = true
          manifestDataRes.value.list[iManifest].packings = res.data.list
          isBtnLoading.value = false
          manifestDataRes.value.list[iManifest].packings.forEach((el: any) => {
            // For hide/show detail manifest
            return (el.is_show_detail = false)
          })
        }
      } else {
        isBtnLoading.value = false
        tMessage.error("Manifest tidak memiliki packing")
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
}

async function getManifestSerialization(
  id: string,
  iManifest: number,
  iPacking: number
) {
  const params = {
    manifest_packing_id: "",
    page: 1,
    limit: 1000,
  }
  isBtnLoading.value = true
  params.manifest_packing_id = id
  monitoringDriverModel
    .getManifestSerialization(params)
    .then((res: any) => {
      if (res.data.list.length > 0) {
        // Check if id is same
        if (id === res.data.list[0].packing.id) {
          manifestDataRes.value.list[iManifest].packings[
            iPacking
          ].is_show_detail = true
          manifestDataRes.value.list[iManifest].packings[
            iPacking
          ].serializations = res.data.list
          isBtnLoading.value = false
          manifestDataRes.value.list[iManifest].packings[
            iPacking
          ].serializations.forEach((el: any) => {
            // For hide/show detail packing
            return (el.is_show_detail = false)
          })
        }
      } else {
        isBtnLoading.value = false
        tMessage.error("Packing tidak memiliki serialisasi")
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
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
      <n-space vertical>
        <n-space vertical>
          <n-space
            align="center"
            justify="space-between"
          >
            <n-h2
              >Kode Delivery Order :
              {{ detailDataRes?.delivery_order?.code }}</n-h2
            >
            <n-button
              type="warning"
              strong
              round
              secondary
              style="cursor: default"
              >{{ detailDataRes?.delivery_order?.status }}</n-button
            >
          </n-space>
          <n-row
            v-if="false"
            :cols="12"
          >
            <n-col :span="12">
              <n-space vertical>
                <n-text>Nama Driver : {{ detailDataRes.driver?.name }}</n-text>
                <n-text>Plat No Kendaraan : ?</n-text>
              </n-space>
            </n-col>
            <n-col :span="12">
              <n-space vertical>
                <n-text>Tipe Kendaraan : ?</n-text>
                <n-text>Pemilik : ?</n-text>
              </n-space>
            </n-col>
          </n-row>
        </n-space>
        <n-grid
          cols="2"
          item-responsive
          responsive="screen"
          x-gap="26"
          y-gap="16"
          style="margin-top: 0rem"
        >
          <n-grid-item span="2 s:2 m:1">
            <n-button
              block
              class="button-tnt"
              style="cursor: default"
              >Qty Manifest :
              {{ detailDataRes?.delivery_order?.total?.manifest }}</n-button
            >
          </n-grid-item>
          <n-grid-item span="2 s:2 m:1">
            <n-button
              block
              class="button-tnt"
              style="cursor: default"
              >Qty Packing :
              {{ detailDataRes?.delivery_order?.total?.qty_packed }}</n-button
            >
          </n-grid-item>
        </n-grid>

        <n-space
          v-if="detailDataRes?.drivers?.length > 0"
          vertical
          style="margin-top: 1rem"
        >
          <n-card
            v-for="(driver, iDriver) in detailDataRes?.drivers"
            :key="iDriver"
            style="border-radius: 8px"
            :content-style="{ background: '#eee', borderRadius: '8px' }"
          >
            <n-space
              vertical
              :size="10"
            >
              <n-row :cols="12">
                <n-col :span="12">
                  <n-space
                    vertical
                    style="font-size: 14px"
                  >
                    <div style="font-weight: 500">
                      Nama Driver : {{ driver.name }}
                    </div>
                  </n-space>
                </n-col>
              </n-row>
              <n-space
                v-for="(log, iLog) in driver?.logs"
                :key="iLog"
                vertical
                style="padding: 1rem; background: #dfdfdf; border-radius: 8px"
              >
                <n-space
                  vertical
                  :size="10"
                >
                  <n-text strong
                    >Kode Manifest : {{ log.manifest.code }}</n-text
                  >
                  <n-text
                    >Plat Nomor :
                    {{ log.driver?.vehicle?.plate_number }}</n-text
                  >
                  <n-space
                    v-for="(packing, iPacking) in log?.packings"
                    :key="iPacking"
                    vertical
                    style="
                      padding: 1rem;
                      background: #cfcfcf;
                      border-radius: 8px;
                    "
                  >
                    <n-space
                      vertical
                      :size="0"
                    >
                      <n-text>Kode Packing : {{ packing?.code }}</n-text>
                    </n-space>
                  </n-space>
                </n-space>
              </n-space>
            </n-space>
          </n-card>
        </n-space>

        <n-space
          v-else
          vertical
        >
          <div
            class="card-tnt"
            style="text-align: center"
          >
            <n-text>Belum ada data driver tersedia</n-text>
          </div>
        </n-space>
      </n-space>
    </template>
    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'pengiriman-monitoring' }"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            style="width: 120px"
            >Kembali</n-button
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui"
import moment from "moment"
import { loadingModel } from "@/models/pengiriman/loading"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const logDataRes = ref<any>({})

onMounted(() => {
  localStorage.removeItem('manifest_id')
  getData()
})

async function getData() {
  isLoading.value = true
  getManifestLog()
  await getDetailManifest()
  isLoading.value = false
}

async function getDetailManifest() {
  const id = route.params.id
  await loadingModel.getDetailManifest(id).then(async(res) => {
    detailDataRes.value = res.data
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getManifestLog() {
  const params = {
    manifest_id: route.params.id,
    limit: 1000
  }
  await loadingModel.getManifestLog(params).then(async(res) => {
    logDataRes.value = res.data
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

  return `${detail}, ${urban_village}, ${sub_district}, ${district}, ${province}`
}

function handlePrint() {
  localStorage.setItem('manifest_id', route.params.id as string)
  const routeData = router.resolve({ path: `/print/loading-manifest` })
  window.open(routeData.href, '_blank')
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
        <n-row
          style="display: flex; justify-content: space-between;"
        >
          <n-col :span="10">
            <n-space vertical :size="0">
              <n-h2>Kode Manifest : {{ detailDataRes.code }}</n-h2>
              <n-space vertical>
                <n-text>Kode DO : {{ detailDataRes.do?.code }}</n-text>
                <n-text>Target Tanggal Pengiriman : {{ moment(detailDataRes.target_delivery_date).format("yyyy-MM-DD") }}</n-text>
              </n-space>
            </n-space>
          </n-col>
          <n-col :span="10">
            <n-space vertical :size="0">
              <n-h2> Tujuan : {{ detailDataRes.do?.destination?.name }} </n-h2>
              <n-text>
                {{ setAddress(detailDataRes.do?.destination?.address ) }}
              </n-text>
            </n-space>
          </n-col>
          <n-col :span="4">
            <n-button
              ghost
              type="primary"
              class="button-tnt"
              style="float: right"
              @click.prevent="handlePrint"
            >
              Cetak Manifest
            </n-button>
          </n-col>
        </n-row>

        <n-grid
          cols="2"
          item-responsive
          responsive="screen"
          :x-gap="16"
          :y-gap="16"
        >
          <n-grid-item span="1">
            <div
              class="card-tnt"
              style="border: 1px solid #e5e5e5; border-radius: 10px; margin-top: 0; padding: 10px; text-align: center;"
            >
              <n-text style="font-size: 13px; margin-bottom: 0">
                Total Pack : {{ detailDataRes.total?.packing }}
              </n-text>
            </div>
          </n-grid-item>
          <n-grid-item span="1">
            <div
              class="card-tnt"
              style="border: 1px solid #e5e5e5; border-radius: 10px; margin-top: 0; padding: 10px; text-align: center;"
            >
              <n-text style="font-size: 13px; margin-bottom: 0">
                Loaded Pack : {{ detailDataRes.total?.qty }}
              </n-text>
            </div>
          </n-grid-item>
        </n-grid>

        <div
          v-if="detailDataRes.products?.length > 0"
          class="table-tnt"
          style="margin-top: 0;"
        >
          <n-scrollbar x-scrollable>
            <n-table
              :bordered="false"
              :single-line="true"
            >
              <n-thead>
                <n-tr style="border-radius: 20px">
                  <n-th>No</n-th>
                  <n-th>Kode Produk</n-th>
                  <n-th>Nama Produk</n-th>
                  <n-th>Batch</n-th>
                </n-tr>
              </n-thead>

              <n-tbody>
                <n-tr
                  v-for="(product, iProduct) in detailDataRes.products"
                  :key="iProduct"
                >
                  <n-td>{{ iProduct + 1 }}</n-td>
                  <n-td>{{ product.name }}</n-td>
                  <n-td>{{ product.code }}</n-td>
                  <n-td>{{ product.batch }}</n-td>
                </n-tr>
              </n-tbody>
            </n-table>
          </n-scrollbar>
        </div>

        <n-space
          vertical
          style="margin-top: 1rem;"
        >
          <n-card
            v-for="(driver, key) in detailDataRes?.driver_info?.drivers" :key="key"
            style="border-radius: 8px;"
            :content-style="{ background: '#eee', borderRadius: '8px' }"
          >
            <n-row :cols="12">
              <n-col :span="12" style="font-size: 13px">
                <div>Nama Driver : {{ driver.name }}</div>
                <div>Plat Nomor Kendaraan : {{ driver.vehicle?.plate_number }}</div>
              </n-col>
              <n-col :span="12" style="font-size: 13px">
                <div>Tipe Kendaraan : {{ driver.vehicle_category?.name }}</div>
                <div>Pemilik : {{ '?' }}</div>
              </n-col>
            </n-row>

            <n-collapse-transition>
              <n-space
                v-for="packing, iPacking in driver?.packings"
                :key="iPacking"
                vertical
                style="padding: 1rem; background: #dfe2e7; border-radius: 8px; margin-top: .8rem;"
              >
                <n-space justify="space-between">
                  <n-text>Kode Packing : {{ packing.code }}</n-text>
                  <n-button
                    v-if="driver?.packings?.length > 0"
                    :loading="isBtnLoading"
                    text
                    type="primary"
                    @click.prevent="packing.is_show_detail = !packing.is_show_detail"
                  >
                    {{ packing.is_show_detail ? 'Tutup' : 'Tampilkan Detail' }}
                  </n-button>
                </n-space>
                <n-collapse-transition :show="packing.is_show_detail === true">
                  <div class="table-tnt" style="margin-top: 0;">
                    <n-scrollbar x-scrollable>
                      <n-table
                        :bordered="false"
                        :single-line="true"
                      >
                        <n-thead>
                          <n-tr style="border-radius: 20px">
                            <n-th>No</n-th>
                            <n-th>Kode Serialisasi</n-th>
                            <n-th>Level</n-th>
                            <n-th>Produk</n-th>
                            <n-th>Qty Level</n-th>
                          </n-tr>
                        </n-thead>

                        <n-tbody>
                          <n-tr
                            v-for="(serialization, key) in packing.serializations"
                            :key="key"
                          >
                            <n-td>{{ key + 1 }}</n-td>
                            <n-td>{{ serialization.serialization?.code }}</n-td>
                            <n-td>{{ serialization.serialization?.name }}</n-td>
                            <n-td>{{ serialization.serialization?.product_name }}</n-td>
                            <n-td>{{ serialization.serialization?.qty }}</n-td>
                          </n-tr>
                        </n-tbody>
                      </n-table>
                    </n-scrollbar>
                  </div>
                </n-collapse-transition>
              </n-space>
            </n-collapse-transition>
          </n-card>
        </n-space>

        <template
          v-for="log, iLog in logDataRes.list"
        >
          <n-card
            v-if="log.attributes?.receiver"
            :key="iLog"
            style="border-radius: 10px;"
          >
            <n-space vertical>
              <n-text style="font-size: 14px; font-weight: 500; margin-bottom: 0px">Penerima</n-text>
              <n-row>
                <n-col :span="12">
                  <div style="margin-bottom: .5rem">
                    <n-space vertical :size="0">
                      <n-text style="font-weight: 500;">Nama Penerima</n-text>
                      <n-text>{{ log.attributes?.receiver?.name }}</n-text>
                    </n-space>
                  </div>
                  <div style="margin-bottom: .5rem">
                    <n-space vertical :size="0">
                      <n-text style="font-weight: 500;">No.Hp Penerima</n-text>
                      <n-text>{{ log.attributes?.receiver?.phone }}</n-text>
                    </n-space>
                  </div>
                  <div style="margin-bottom: .5rem">
                    <n-space vertical :size="0">
                      <n-text style="font-weight: 500;">Email</n-text>
                      <n-text>{{ log.attributes?.receiver?.email }}</n-text>
                    </n-space>
                  </div>
                  <div style="margin-bottom: .5rem">
                    <n-space vertical :size="0">
                      <n-text style="font-weight: 500;">Jabatan Penerima</n-text>
                      <n-text>{{ log.attributes?.receiver?.department }}</n-text>
                    </n-space>
                  </div>
                  <div style="margin-bottom: .5rem">
                    <n-space vertical :size="0">
                      <n-text style="font-weight: 500;">Foto Bukti</n-text>
                      <n-image
                        width="100"
                        :style="{
                          backgroundColor: '#f1f1f1',
                        }"
                        src=""
                      />
                    </n-space>
                  </div>
                  <div style="margin-bottom: .5rem">
                    <n-space vertical :size="0">
                      <n-text style="font-weight: 500;">Tanda Tangan Digital</n-text>
                      <n-image
                        width="100"
                        :style="{
                          backgroundColor: '#f1f1f1',
                        }"
                        src=""
                      />
                    </n-space>
                  </div>
                </n-col>
                <n-col :span="12">
                  <n-text style="font-weight: 500; margin-bottom: 0px">Tanggal</n-text>
                  <div style="margin-bottom: .5rem">
                    <n-text>{{ moment(log.created_at).format("yyyy-MM-DD") }}</n-text>
                  </div>
                </n-col>
              </n-row>

            </n-space>
          </n-card>
        </template>
      </n-space>
    </template>
    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'pengiriman-loading-porter' }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="width: 120px">Kembali</n-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

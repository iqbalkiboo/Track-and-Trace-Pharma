<route lang="yaml">
meta:
  title: Print Manifest
  layout: blank
  requireAuth: true
</route>

<script setup lang="ts">
import { useMessage } from "naive-ui"
import moment from "moment"
import { auth } from "@/models/auth"
import { loadingModel } from "@/models/pengiriman/loading"
import { masterCompanyModel } from "@/models/setting/master-perusahaan"

const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const manifestId = localStorage.getItem("manifest_id")
const detailDataRes = ref<any>({})
const packingDataRes = ref<any>({})
const companyDataRes = ref<any>({})
const logDataRes = ref<any>({})

onMounted(() => {
  authData.value = auth.getAuth()
  getData()
})

async function getData() {
  isLoading.value = true
  getPrintLoading()
  // getManifestPacking()
  getManifestLog()
  getCompany()
  await getDetailManifest()
  isLoading.value = false
  setTimeout(() => {
    window.print()
  }, 300)
}

async function getPrintLoading() {
  const params = {
    limit: 1000,
  }
  await loadingModel
    .getPrintLoading(manifestId, params)
    .then(async (res) => {
      packingDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDetailManifest() {
  await loadingModel
    .getDetailManifest(manifestId)
    .then(async (res) => {
      detailDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getManifestPacking() {
  const params = {
    manifest_id: manifestId,
    limit: 1000,
  }
  await loadingModel
    .getManifestPacking(params)
    .then(async (res) => {
      packingDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getManifestLog() {
  const params = {
    manifest_id: manifestId,
    limit: 1000,
  }
  await loadingModel
    .getManifestLog(params)
    .then(async (res) => {
      logDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getCompany() {
  let company_id: string = ""
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"].company_id
  } else {
    company_id = authData.value.users.user_type.id
  }

  await masterCompanyModel
    .getDetailCompany(company_id)
    .then((res) => {
      companyDataRes.value = res.data
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
</script>

<template>
  <div style="padding: 1rem">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-space
        vertical
        :size="10"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="padding-right: 20px">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <n-avatar
                  round
                  :style="{
                    color: 'yellow',
                    backgroundColor: '#f1f1f1',
                  }"
                  :size="60"
                  :src="
                    companyDataRes.image?.url ? companyDataRes.image?.url : ''
                  "
                >
                </n-avatar>
              </div>
              <div style="margin-left: 2rem">
                <div style="font-size: 14px; font-weight: 600">
                  {{ companyDataRes.name }}
                </div>
                <n-text style="font-size: 11px">{{
                  companyDataRes.address?.detail +
                  ", " +
                  companyDataRes.address?.urban_village.name +
                  ", " +
                  companyDataRes.address?.sub_district.name +
                  ", " +
                  companyDataRes.address?.district.name +
                  ", " +
                  companyDataRes.address?.province.name
                }}</n-text>
              </div>
            </div>
          </div>
          <div>
            <n-card
              style="border-radius: 10px"
              content-style="padding: 10px"
            >
              <n-space vertical>
                <n-text style="font-size: 11px; margin-bottom: 10px"
                  >Kode Manifest : {{ detailDataRes.code }}</n-text
                >
                <vue-qrcode
                  :options="{ width: 50, margin: 0 }"
                  :value="detailDataRes.code"
                />
              </n-space>
            </n-card>
          </div>
        </div>

        <n-row
          :cols="12"
          style="display: flex; justify-content: space-between"
        >
          <n-col :span="10">
            <n-space
              vertical
              :size="0"
            >
              <n-text
                style="font-size: 11px; font-weight: 500; margin-bottom: 0"
                >Kode Manifest : {{ detailDataRes.code }}</n-text
              >
              <n-text style="font-size: 11px"
                >Kode DO : {{ detailDataRes.do?.code }}</n-text
              >
              <n-text style="font-size: 11px"
                >Tanggal Pengiriman :
                {{
                  moment(detailDataRes.target_delivery_date).format("yyyy-MM-DD")
                }}</n-text
              >
              <n-text style="font-size: 11px">
                PIC Packing :
                {{
                  detailDataRes.created_by?.is_superadmin
                    ? detailDataRes.created_by?.superadmin?.name
                    : detailDataRes.created_by?.user?.name
                }}
              </n-text>
              <n-text style="font-size: 11px"
                >Total Qty Packing : {{ detailDataRes.total?.packing }}</n-text
              >
            </n-space>
          </n-col>
          <n-col :span="14">
            <n-space
              vertical
              :size="0"
            >
              <n-text
                style="font-size: 11px; font-weight: 500; margin-bottom: 0"
                >Tujuan : {{ detailDataRes.do?.destination?.name }}</n-text
              >
              <n-text style="font-size: 11px">
                {{ setAddress(detailDataRes.do?.destination?.address) }}
              </n-text>
              <n-text style="font-size: 11px"
                >Tipe Pengiriman : {{ detailDataRes.delivery_type }}</n-text
              >
              <n-text style="font-size: 11px"
                >Tanggal Packing :
                {{
                  moment(detailDataRes.finish_aggregation).format("yyyy-MM-DD")
                }}</n-text
              >
            </n-space>
          </n-col>
        </n-row>

        <template v-if="detailDataRes?.products?.length > 0">
          <n-card
            style="border-radius: 10px"
            content-style="padding: 5px;"
          >
            <div
              class=""
              style="margin-top: 0"
            >
              <n-table
                :bottom-bordered="false"
                :bordered="false"
                :single-line="true"
                class="print-maniest-table"
              >
                <n-thead>
                  <n-tr style="border-radius: 20px">
                    <n-th style="font-size: 10px">Kode Produk</n-th>
                    <n-th style="font-size: 10px">Nama Produk</n-th>
                    <n-th style="font-size: 10px">Batch</n-th>
                    <n-th style="text-align: left; font-size: 10px"
                      >Expired Date</n-th
                    >
                    <n-th style="text-align: right; font-size: 10px">Qty</n-th>
                  </n-tr>
                </n-thead>

                <n-tbody>
                  <n-tr
                    v-for="(product, iProduct) in detailDataRes?.products"
                    :key="iProduct"
                  >
                    <n-td style="font-size: 10px">{{
                      (product as any).code
                    }}</n-td>
                    <n-td style="font-size: 10px">{{
                      (product as any).name
                    }}</n-td>
                    <n-td style="font-size: 10px">{{
                      (product as any).batch
                    }}</n-td>
                    <n-td style="text-align: left; font-size: 10px">{{
                      moment((product as any).expired_date).format("yyyy-MM-DD")
                    }}</n-td>
                    <n-td style="text-align: right; font-size: 10px">{{
                      (product as any).qty_packed
                    }}</n-td>
                  </n-tr>
                </n-tbody>
              </n-table>
            </div>
          </n-card>
        </template>

        <n-card
          style="border-radius: 10px"
          content-style="padding: 15px;"
        >
          <n-space vertical>
            <n-text
              style="font-size: 11px; font-weight: 500; margin-bottom: 0px"
              >Penerima</n-text
            >
            <n-row>
              <n-col :span="12">
                <div style="margin-bottom: 1.5rem">
                  <n-space
                    vertical
                    :size="0"
                  >
                    <n-text style="font-size: 11px; font-weight: 500"
                      >Nama Penerima</n-text
                    >
                    <n-text style="font-size: 11px">{{
                      detailDataRes.receiver_info?.name
                    }}</n-text>
                  </n-space>
                </div>
                <div style="margin-bottom: 1.5rem">
                  <n-space
                    vertical
                    :size="0"
                  >
                    <n-text style="font-size: 11px; font-weight: 500"
                      >No.Hp Penerima</n-text
                    >
                    <n-text style="font-size: 11px">{{
                      detailDataRes.receiver_info?.phone
                    }}</n-text>
                  </n-space>
                </div>
                <div style="margin-bottom: 1.5rem">
                  <n-space
                    vertical
                    :size="0"
                  >
                    <n-text style="font-size: 11px; font-weight: 500"
                      >Email</n-text
                    >
                    <n-text style="font-size: 11px">{{
                      detailDataRes.receiver_info?.email
                    }}</n-text>
                  </n-space>
                </div>
                <div style="margin-bottom: 1.5rem">
                  <n-space
                    vertical
                    :size="0"
                  >
                    <n-text style="font-size: 11px; font-weight: 500"
                      >Jabatan Penerima</n-text
                    >
                    <n-text style="font-size: 11px">{{
                      detailDataRes.receiver_info?.department
                    }}</n-text>
                  </n-space>
                </div>
              </n-col>
              <n-col :span="12">
                <n-text
                  style="font-size: 11px; font-weight: 500; margin-bottom: 0px"
                  >Tanggal</n-text
                >
                <div style="margin-bottom: 1.5rem">
                  <n-text style="font-size: 11px; font-weight: 500">{{
                    moment().format("yyyy-MM-DD")
                  }}</n-text>
                </div>
              </n-col>
            </n-row>

            <div
              style="text-align: right; margin-right: 6rem; margin-bottom: 3rem"
            >
              <n-text style="font-size: 11px; font-weight: 500">
                Tanda Tangan Penerima
              </n-text>
            </div>
          </n-space>
        </n-card>

        <template v-if="logDataRes?.list?.length > 0">
          <template
            v-for="(log, iLog) in logDataRes.list"
            :key="iLog"
          >
            <n-card
              v-if="(log as any).attributes?.receiver"
              :key="iLog"
              style="border-radius: 10px"
            >
              <n-space vertical>
                <n-text
                  style="font-size: 11px; font-weight: 500; margin-bottom: 0px"
                  >Penerima</n-text
                >
                <n-row>
                  <n-col :span="12">
                    <div style="margin-bottom: 0.5rem">
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-text style="font-size: 11px; font-weight: 500"
                          >Nama Penerima</n-text
                        >
                        <n-text style="font-size: 11px">{{
                          (log as any).attributes?.receiver?.name
                        }}</n-text>
                      </n-space>
                    </div>
                    <div style="margin-bottom: 0.5rem">
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-text style="font-size: 11px; font-weight: 500"
                          >No.Hp Penerima</n-text
                        >
                        <n-text style="font-size: 11px">{{
                          (log as any).attributes?.receiver?.phone
                        }}</n-text>
                      </n-space>
                    </div>
                    <div style="margin-bottom: 0.5rem">
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-text style="font-size: 11px; font-weight: 500"
                          >Email</n-text
                        >
                        <n-text style="font-size: 11px">{{
                          (log as any).attributes?.receiver?.email
                        }}</n-text>
                      </n-space>
                    </div>
                    <div style="margin-bottom: 0.5rem">
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-text style="font-size: 11px; font-weight: 500"
                          >Jabatan Penerima</n-text
                        >
                        <n-text style="font-size: 11px">{{ "?" }}</n-text>
                      </n-space>
                    </div>
                    <div style="margin-bottom: 0.5rem">
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-text style="font-size: 11px; font-weight: 500"
                          >Foto Bukti</n-text
                        >
                        <n-image
                          width="100"
                          :style="{
                            backgroundColor: '#f1f1f1',
                          }"
                          src=""
                        />
                      </n-space>
                    </div>
                    <div style="margin-bottom: 0.5rem">
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-text style="font-size: 11px; font-weight: 500"
                          >Tanda Tangan Digital</n-text
                        >
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
                    <n-text
                      style="
                        font-size: 11px;
                        font-weight: 500;
                        margin-bottom: 0px;
                      "
                      >Tanggal</n-text
                    >
                    <div style="margin-bottom: 0.5rem">
                      <n-text style="font-size: 11px">{{
                        moment((log as any).created_at).format("yyyy-MM-DD")
                      }}</n-text>
                    </div>
                  </n-col>
                </n-row>
              </n-space>
            </n-card>
          </template>
        </template>
      </n-space>
    </template>
  </div>
</template>

<style lang="scss">
.print-maniest-table {
  tr th {
    padding: 8px;
  }
  tr td {
    padding: 8px;
  }
}
</style>

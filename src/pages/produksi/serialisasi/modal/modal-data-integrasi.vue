<script setup lang="ts">
import { useMessage } from "naive-ui"
import exportFromJSON from "export-from-json"
import { serializeModel } from "@/models/produksi/serialisasi"
import moment from "moment"

const props = withDefaults(
  defineProps<{
    show: boolean
    isLog: boolean
    serializeDetailDataRes: any
    loading?: boolean
  }>(),
  {
    show: false,
    isLog: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
}>()

const tMessage = useMessage()
const isLoading = ref(false)
const reportDataRes = ref<any>([])
const showModalCetakLaporan = ref(false)
const detailDataRes = ref<any>({})

watch(
  () => props.show,
  (value) => {
    if (value) {
    }
  }
)

const getTitle = computed(() => {
  // console.log(props.isLog)
  if (props.isLog) return "Log Cetak"
  else return "Data QR Code"
})

function handleToogleShowModalCetakLaporan() {
  showModalCetakLaporan.value = !showModalCetakLaporan.value
}
function exportCsv() {
  const dataCsv: any = []
  detailDataRes.value.forEach((el: any, i: number) => {
    dataCsv.push({
      No: i + 1,
      "Wh Building": el.building_name,
      Room: el.room_name,
      "Rack/Pallete": el.rack_pallete,
      Bin: el.bin,
      "Qty Stok": el.qty,
      Batch: "",
    })
  })
  const data = dataCsv
  const fileName = "Data_Integrasi"
  const exportType = exportFromJSON.types.csv

  if (data) exportFromJSON({ data, fileName, exportType })
}
async function getDetailReport() {
  const printer_key = localStorage.getItem("select-printer")
  const payload = {
    printer_key,
  }
  isLoading.value = true
  serializeModel
    .postReportDriverPrinter(payload, "void")
    .then((res: any) => {
      reportDataRes.value = res.data.message
    })
    .then((e: any) => {
      if (e?.response) {
        const data = e.response.data
        tMessage.error(data.message)
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}

watch(
  () => props.show,
  (value: boolean) => {
    if (value) {
      getDetailReport()
    }
  }
)
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    :title="getTitle"
    style="width: 800px; max-width: 100%; border-radius: 10px"
    :header-style="{
      paddingLeft: '30px',
      paddingRight: '30px',
      paddingBottom: '15px',
    }"
    :content-style="{
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
    }"
    @update:show="$emit('update:show', $event)"
  >
    <n-space
      vertical
      :size="0"
      style="padding-left: 10px; padding-right: 10px"
    >
      <n-text
        strong
        style="font-size: 16px"
        >{{ serializeDetailDataRes.product.long_name }}</n-text
      >
      <n-row :gutter="16">
        <n-col :span="12">
          <n-space
            vertical
            :size="0"
          >
            <n-text
              >Kode Perintah Kemas : {{ serializeDetailDataRes.pk_id }}</n-text
            >
            <n-text
              >Kode Produk :
              {{ serializeDetailDataRes.product.item_code }}</n-text
            >
          </n-space>
        </n-col>
        <n-col
          v-if="!props.isLog"
          :span="12"
        >
          <n-space
            vertical
            :size="0"
          >
            <n-text>ID Batch : {{ "KHJ67" }}</n-text>
            <n-text>Qty Item : {{ 800 }}</n-text>
          </n-space>
        </n-col>
      </n-row>
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <template v-if="props.isLog">
          <n-space
            v-if="reportDataRes.length > 0"
            vertical
            :size="0"
            align="end"
          >
            <n-button
              v-if="false"
              type="primary"
              class="button-tnt"
              @click="handleToogleShowModalCetakLaporan"
            >
              Cetak Laporan
            </n-button>
          </n-space>
          <div style="margin-top: 15px">
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Serialisasi</th>
                    <th>Tanggal</th>
                    <th>Jam</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="reportDataRes.length > 0">
                    <tr
                      v-for="(list, i) in reportDataRes"
                      :key="i"
                    >
                      <td data-label="No">
                        {{ i + 1 }}
                      </td>
                      <td data-label="Kode Serialisasi">
                        {{ $filters.isEmpty(list.message) }}
                      </td>
                      <td data-label="Tanggal">
                        {{
                          $filters.isEmpty(
                            list.scan_at && moment(list.scan_at).format("L")
                          )
                        }}
                      </td>
                      <td data-label="Jam">
                        {{
                          $filters.isEmpty(
                            list.scan_at && moment(list.scan_at).format("LT")
                          )
                        }}
                      </td>
                      <td data-label="Status">
                        {{ $filters.isEmpty(list.scan_status) }}
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td
                        colspan="4"
                        style="text-align: center"
                      >
                        Belum ada data tersedia
                      </td>
                    </tr>
                  </template>
                </tbody>
              </n-table>
            </n-scrollbar>
          </div>
        </template>
        <template v-else>
          <n-space
            v-if="false"
            vertical
            :size="0"
            align="end"
          >
            <n-button
              type="primary"
              class="button-tnt"
              @click="exportCsv"
            >
              Export Csv
            </n-button>
          </n-space>
          <div style="margin-top: 15px">
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Serialisasi</th>
                    <th>Batch</th>
                    <th>Exp Date</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="reportDataRes.length > 0">
                    <tr
                      v-for="(list, i) in reportDataRes"
                      :key="i"
                    >
                      <td data-label="No">
                        {{ i + 1 }}
                      </td>
                      <td data-label="Kode Serialisasi">
                        {{ $filters.isEmpty(list.message) }}
                      </td>
                      <td data-label="Batch">
                        {{ $filters.isEmpty(list.room_name) }}
                      </td>
                      <td data-label="Exp Date">
                        {{ $filters.isEmpty(list.rack_pallete) }}
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td
                        colspan="4"
                        style="text-align: center"
                      >
                        Belum ada data tersedia
                      </td>
                    </tr>
                  </template>
                </tbody>
              </n-table>
            </n-scrollbar>
          </div>
        </template>
      </template>
    </n-space>
  </n-modal>
</template>

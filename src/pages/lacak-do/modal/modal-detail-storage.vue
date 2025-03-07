<script setup lang="ts">
import { useMessage } from 'naive-ui'
import moment from "moment"
import exportFromJSON from "export-from-json"
import { lacakDOModel } from "@/models/lacak-do/index"

const props = withDefaults(
  defineProps<{
    show: boolean
    data?: any
    dataDistribution?: any
    loading?: boolean
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "click:close", value: boolean): void
}>()

const tMessage = useMessage()
const isLoading = ref(false)
const detailDataRes = ref<any>({})

watch(() => props.show, (value) => {
  if (value) {
    getDetailPlantByBatch()
  }
})

async function getDetailPlantByBatch() {
  isLoading.value = true
  const params = {
    limit: 10000,
  }
  await lacakDOModel.getDetailPlantByBatch(props.data.batch, props.data.warehouse_id, params).then((res) => {
    isLoading.value = false
    detailDataRes.value = res.data
  })
  .catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function exportCsv() {
  const dataCsv: any = []
  detailDataRes.value.forEach((el: any, i: number) => {
    dataCsv.push({
      'No': i + 1,
      'Wh Building': el.building_name,
      'Room': el.room_name,
      'Rack/Pallete': el.rack_pallete,
      'Bin': el.bin,
      'Qty Stok': el.qty,
      'Batch': props.data.batch,
    })
  })
  const data = dataCsv
  const fileName = "Lacak_By_Batch_Detail_Penyimpanan"
  const exportType = exportFromJSON.types.csv

  if (data) exportFromJSON({ data, fileName, exportType })
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    :title="props?.data?.do?.code"
    style="width: 800px; max-width: 100%; border-radius: 10px"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical :size="0" style="padding-left: 10px; padding-right: 10px;">
      <n-text strong style="font-size: 16px;">Batch : {{ props.data.batch }}</n-text>
      <n-row :gutter="16">
        <n-col :span="12">
          <n-space vertical :size="0">
            <n-text>Nama Produk : {{ props.dataDistribution?.do?.products[0]?.name }}</n-text>
            <n-text>Kode Produk : {{ props.dataDistribution?.do?.products[0]?.code }}</n-text>
            <n-text>Exp Date : {{ moment(props.dataDistribution?.do?.products[0]?.expired_date).format("yyyy-MM-DD") }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="12">
          <n-space vertical :size="0">
            <n-text>Wh Plant/Cabang : {{ props.data.warehouse_name }}</n-text>
            <n-text>Qty : {{ $filters.toNumber(props.data.qty) }}</n-text>
          </n-space>
        </n-col>
      </n-row>
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-space
          v-if="detailDataRes.length > 0"
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
        <div
          style="margin-top: 15px;"
        >
          <n-scrollbar x-scrollable>
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Wh Building</th>
                  <th>Room</th>
                  <th>Rack/Pallete</th>
                  <th>Bin</th>
                  <th style="text-align: center">Qty Stok</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="detailDataRes.length > 0">
                  <tr
                    v-for="(list, i) in detailDataRes"
                    :key="i"
                  >
                    <td data-label="No">
                      {{ i + 1 }}
                    </td>
                    <td data-label="Wh Building">
                      {{  $filters.isEmpty(list.building_name) }}
                    </td>
                    <td data-label="Room">
                      {{ $filters.isEmpty(list.room_name) }}
                    </td>
                    <td data-label="Rack/Pallete">
                      {{ $filters.isEmpty(list.rack_pallete) }}
                    </td>
                    <td data-label="Bin">
                      {{ $filters.isEmpty(list.bin) }}
                    </td>
                    <td data-label="Qty Stok" style="text-align: center">
                      {{ $filters.toNumber(list.qty) }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td
                      colspan="6"
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
    </n-space>
  </n-modal>
</template>

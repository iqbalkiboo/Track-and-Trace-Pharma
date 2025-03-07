<script setup lang="ts">
import exportFromJSON from "export-from-json"

const props = withDefaults(
  defineProps<{
    data?: any
    codeScan: string
  }>(),
  {
    data: () => ({}),
  }
)

const emit = defineEmits<{
  (e: "click:showDetail", data: any): void
}>()

function handleShowModalDetail(data: any) {
  emit('click:showDetail', data)
}

function exportCsv() {
  const dataCsv: any = []
  props.data.payload.forEach((el: any, i: number) => {
    dataCsv.push({
      'No': i + 1,
      'Plant/Cabang': el.warehouse_name,
      'Qty Stok': el.qty,
      'Batch': props.codeScan
    })
  })
  const data = dataCsv
  const fileName = "Lacak_By_Batch_Penyimpanan"
  const exportType = exportFromJSON.types.csv

  if (data) exportFromJSON({ data, fileName, exportType })
}
</script>

<template>
  <n-space vertical>
    <n-space
      v-if="props?.data?.payload?.length > 0"
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
      class="table-tnt"
      style="margin-top: 10px;"
    >
      <n-scrollbar x-scrollable>
        <n-table :single-line="false">
          <thead>
            <tr>
              <th>No</th>
              <th>Plant/Cabang</th>
              <th style="text-align: center">Qty Stok</th>
              <th style="text-align: center; width: 5rem">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="props?.data?.payload?.length > 0">
              <tr
                v-for="(list, i) in props?.data?.payload"
                :key="i"
              >
                <td data-label="No">
                  {{ i + 1 }}
                </td>
                <td data-label="Plant/Cabang">
                  {{ list?.warehouse_name }}
                </td>
                <td
                  data-label="Qty Stok"
                  style="text-align: center"
                >
                  {{ $filters.toNumber(list?.qty) }}
                </td>
                <td data-label="Aksi">
                  <n-button
                    type="primary"
                    text
                    @click="handleShowModalDetail(list)"
                  >
                    Lihat Detail
                  </n-button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td
                  colspan="7"
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
  </n-space>
</template>


<script setup lang="ts">
import moment from "moment"
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

const route = useRoute()

function handleShowModalDetail(data: any) {
  emit('click:showDetail', data)
}

function exportCsv() {
  let dataCsv: any = []
  let fileName =''
  if (route.params.type === 'batch') {
    props.data.list.forEach((el: any, i: number) => {
      dataCsv.push({
        'No': i + 1,
        'Kode DO': el.do?.code,
        'Tanggal DO': moment(el?.do?.created_at).format("yyyy-MM-DD"),
        'Tujuan': el.do?.destination?.name,
        'Pengirim': el.do?.origin?.warehouse?.name,
        'Qty': el.do?.total?.qty_packed,
        'Status': el.do?.status,
        'Batch': props.codeScan
      })
    })
    fileName = "Lacak_By_Batch_Distribusi"
  } else if (route.params.type === 'serialisasi') {
    props.data.list.forEach((el: any, i: number) => {
      dataCsv.push({
        'No': i + 1,
        'Kode DO': el.do?.code,
        'Tanggal DO': moment(el?.do?.created_at).format("yyyy-MM-DD"),
        'Tujuan': el.do?.destination?.name,
        'Pengirim': el.do?.origin?.warehouse?.name,
        'Qty': el.do?.total?.qty_packed,
        'Status': el.do?.status,
        'Serialisasi': props.codeScan
      })
    })
    fileName = "Lacak_By_Serialisasi_Distribusi"
  }
  const data = dataCsv
  const exportType = exportFromJSON.types.csv

  if (data) exportFromJSON({ data, fileName, exportType })
}
</script>

<template>
  <n-space vertical>
    <n-space
      v-if="props.data.list.length > 0"
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
              <th>Kode DO</th>
              <th>Tanggal DO</th>
              <th>Tujuan</th>
              <th>Pengirim</th>
              <th style="text-align: center">Qty</th>
              <th style="text-align: center">Status</th>
              <th style="text-align: center; width: 5rem">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="props.data.list.length > 0">
              <tr
                v-for="(list, i) in props.data.list"
                :key="i"
              >
                <td data-label="No">
                  {{ i + 1 }}
                </td>
                <td data-label="No DO">
                  {{ list?.do?.code }}
                </td>
                <td data-label="Tanggal DO">
                  {{ moment(list?.do?.created_at).format("yyyy-MM-DD") }}
                </td>
                <td data-label="Tujuan">
                  {{ list?.do?.destination?.name }}
                </td>
                <td data-label="Pengirim">
                  {{ list?.do?.origin?.warehouse?.name }}
                </td>
                <td
                  data-label="Qty"
                  style="text-align: center"
                >
                  {{ $filters.toNumber(list?.do?.total?.qty_packed) }}
                </td>
                <td
                  data-label="Status"
                  style="text-align: center"
                >
                  <n-tag
                    round
                    :bordered="false"
                    :type="
                      list.status == 'cancel'
                        ? 'error'
                        : list.status == 'pending'
                        ? 'warning'
                        : 'success'
                    "
                  >
                    {{ list?.do?.status }}
                  </n-tag>
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


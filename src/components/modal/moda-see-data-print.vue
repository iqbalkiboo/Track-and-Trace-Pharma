<script setup lang="ts">
import { useMessage } from "naive-ui"
import { ChevronDownOutline } from "@vicons/ionicons5"
import exportFromJSON from "export-from-json"
import moment from "moment"
import { serializeModel } from "@/models/produksi/serialisasi"

const props = withDefaults(
  defineProps<{
    show: boolean
    serializeDetailDataRes: any
    loading?: boolean
  }>(),
  {
    show: false,
    serializeLevelDataRes: [],
  }
)

const emit = defineEmits<{
  (e: "click:close", value: boolean): void
  (e: "update:show", value: boolean): void
}>()

const optionsDownload = ref([
  {
    key: "csv",
    label: "CSV",
  },
  {
    key: "txt",
    label: "TXT",
  },
])
const exportType = ref<any>(null)

const route = useRoute()
const levelParams = ref({
  level: 1,
  page: 1,
  limit: 10,
  reception_id: route.params.id,
})

const tMessage = useMessage()
const isLoading = ref(false)
const serializeLevelDataRes = ref<any>([])
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})

async function getSerializeLevel(level: number) {
  isBtnLoading.value = true
  levelParams.value.level = level

  await serializeModel
    .getSerializeLevel(levelParams.value)
    .then((res) => {
      serializeLevelDataRes.value = res.data
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
function updatePageSizeSerializeLevel(pageSize: number) {
  levelParams.value.page = 1
  levelParams.value.limit = pageSize
  getSerializeLevel(levelParams.value.level)
}

watch(
  () => props.show,
  (value) => {
    if (value) {
      getSerializeLevel(levelParams.value.level)
    }
  }
)

function exportDataSerialize() {
  const data = serializeLevelDataRes.value.list
  const fileName = "Data_Serialize"

  if (data) exportFromJSON({ data, fileName, exportType: exportType.value })
}
function handleSelectOptionsDownload(key: string) {
  switch (key) {
    case "csv":
      exportType.value = exportFromJSON.types.csv
      exportDataSerialize()
      break
    case "txt":
      exportType.value = exportFromJSON.types.txt
      exportDataSerialize()
      break
  }
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    @update-show="emit('update:show', $event)"
    :bordered="false"
    title="Data QR Code Level 1"
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
  >
    <n-space
      vertical
      :size="0"
      style="padding-left: 10px; padding-right: 10px"
    >
      <n-space
        align="center"
        justify="space-between"
      >
        <n-text
          strong
          style="font-size: 16px"
        >
          {{ serializeDetailDataRes.product.long_name }}
        </n-text>
        <n-dropdown
          trigger="hover"
          :options="optionsDownload"
          @select="handleSelectOptionsDownload"
        >
          <n-button type="primary">
            Unduh
            <template #icon>
              <n-icon :size="12">
                <chevron-down-outline />
              </n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </n-space>
      <n-grid
        cols="3"
        item-responsive
        style="margin-top: 1rem"
        responsive="screen"
        x-gap="30"
        y-gap="30"
      >
        <n-grid-item span="3 m:1">
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
        </n-grid-item>
        <n-grid-item span="3 m:1">
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
        </n-grid-item>
        <n-grid-item span="3 m:1"> </n-grid-item>
      </n-grid>
      <n-space
        vertical
        :size="0"
        align="end"
      >
        <n-button
          v-if="false"
          type="primary"
          class="button-tnt"
        >
          Cetak Laporan
        </n-button>
      </n-space>
      <template v-if="isLoading">
        <t-loading />
      </template>
      <template v-else>
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
                <tr
                  v-for="(list, i) in serializeLevelDataRes.list"
                  :key="i"
                >
                  <td data-label="No">
                    {{ levelParams.limit * (levelParams.page - 1) + (i + 1) }}
                  </td>
                  <td data-label="Kode Serialisasi">
                    {{ $filters.isEmpty(list.code) }}
                  </td>
                  <td data-label="Batch">
                    {{ $filters.isEmpty(list.reception.batch_number) }}
                  </td>
                  <td data-label="Exp Date">
                    {{
                      $filters.isEmpty(
                        list.expired_date &&
                          moment(list.expired_date).format("L")
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </n-table>
            <div
              style="display: flex; justify-content: center; margin-top: 16px"
            >
              <n-pagination
                v-model:page="levelParams.page"
                :page-count="serializeLevelDataRes.total_page"
                :page-slot="7"
                :show-size-picker="serializeLevelDataRes.total_data > 10"
                :page-sizes="[10, 20, 30, 40, 50]"
                @update:page="getSerializeLevel(levelParams.level)"
                @update:page-size="updatePageSizeSerializeLevel"
              />
            </div>
          </n-scrollbar>
        </div>
      </template>
    </n-space>
  </n-modal>
</template>

<script lang="ts" setup>
import { useMessage } from "naive-ui"
import TLoading from "@/components/t-loading.vue"

const props = defineProps<{
  dataRes: any
  product: any
  reception_code: any
  packing_code: any
}>()
const emits = defineEmits<{
  (e: "get:data", value: any): void
}>()
const tMessage = useMessage()
const isLoading = ref(false)
const params = ref<any>({
  page: 1,
  limit: 10,
  status: null,
  dir: "desc",
  sort: "level",
  product_code: props.product.code as string,
  reception_code: props.reception_code as string,
  packing_code: props.packing_code as string,
})

const optionsStatus = ref<any>([
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Broken",
    value: "broken",
  },
  {
    label: "Missing",
    value: "missing",
  },
])
const optionsSortLevel = ref<any>([
  {
    label: "Level Tertinggi",
    value: "desc",
  },
  {
    label: "Level Terendah",
    value: "asc",
  },
])

function getData() {
  emits("get:data", params.value)
}

onMounted(() => {
  getData()
})
</script>
<template>
  <template v-if="dataRes?.list?.length">
    <n-row
      gutter="16"
      style="margin-top: 1rem"
    >
      <n-col :span="6">
        <n-select
          placeholder="Pilih Status"
          clearable
          v-model:value="params.status"
          :options="optionsStatus"
          @update:value="getData"
        />
      </n-col>
      <n-col :span="6">
        <n-select
          placeholder="Pilih Urutan Level"
          v-model:value="params.dir"
          :options="optionsSortLevel"
          @update:value="getData"
        />
      </n-col>
    </n-row>
    <div class="table-tnt">
      <n-table
        :bottom-bordered="false"
        :bordered="false"
        :single-line="true"
      >
        <n-thead>
          <n-tr>
            <n-th>Code</n-th>
            <n-th>Level</n-th>
            <n-th>Status</n-th>
          </n-tr>
        </n-thead>
        <n-tbody>
          <n-tr
            v-for="serialize in dataRes.list ?? []"
            :key="serialize.id"
          >
            <n-td data-label="Code">
              {{ serialize.code }}
            </n-td>
            <n-td data-label="Level">
              {{ serialize.name }}
            </n-td>
            <n-td data-label="Status">
              {{ serialize.status }}
            </n-td>
          </n-tr>
        </n-tbody>
      </n-table>
      <div class="table-footer">
        <!-- <n-pagination -->
        <!--     v-model:page="product.page" -->
        <!--     :page-count="product.total_page ?? 0" -->
        <!--     :page-slot="5" -->
        <!--     @update:page="handlePageChanged($event, product)" -->
        <!-- /> -->
      </div>
    </div>
  </template>
  <template v-else>
    <p class="text-center">Tidak ada data</p>
  </template>
</template>

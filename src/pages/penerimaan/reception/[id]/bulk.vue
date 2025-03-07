<script setup lang="ts">
import { ref } from "vue"
import { type DataTableColumns, useMessage } from "naive-ui"
import {
  detailReception,
  getPackingSerializeList,
  getSerializePacking,
  markSerializePacking,
} from "@/models/penerimaan/reception"

const columns: DataTableColumns = [
  {
    type: "selection",
  },
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Level",
    key: "level",
  },
  {
    title: "Status",
    key: "status",
  },
]

function getKey(row: any) {
  return row.code
}

const tMessage = useMessage()
const route = useRoute()
const router = useRouter()

const loadingPage = ref(false)
const detail = ref<any>({})
const serialize = ref<any>([])
const loadingBroke = ref(false)
const loadingApprove = ref(false)
const showScanModal = ref(false)
const loadingScan = ref(false)
const code = ref("")
const selected = ref<string[]>([])

onMounted(() => {
  getData()
})
const params = ref<any>({
  page: 1,
  limit: 10,
  status: null,
  dir: "desc",
  sort: "level",
  level: 3,
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
  {
    label: "Pending",
    value: "pending",
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
const optionsLevel = ref<any>([])

async function getData() {
  loadingPage.value = true
  await getDetail()
  await getSerializeList()
  loadingPage.value = false
}

async function getDetail() {
  const res = await detailReception(route.params.id as string)
  detail.value = res.data
}

async function getSerializeList() {
  const res = await getPackingSerializeList({
    page: 1,
    limit: 1,
    reception_code: detail?.value.code as string,
  })
  params.value.limit = res.data.total_data
  params.value.reception_code = detail?.value.code as string
  const res2 = await getPackingSerializeList(params.value)
  serialize.value = res2.data.list
  optionsLevel.value = res2.data.levels.map((v: any) => ({
    label: `Level ${v}`,
    value: v,
  }))
}

async function handleScanned() {
  const res = await getSerializePacking(code.value)
  if (serialize.value.findIndex((v: any) => res.data.id == v.id) != -1) {
    serialize.value.push(res.data)
  }
}

async function handleApproveSerialize() {
  loadingApprove.value = true
  await markSerializePacking({
    codes: selected.value,
    status: "approved",
  }).finally(() => {
    loadingApprove.value = false
  })
  tMessage.success("Serialize berhasil diupdate.")
  router.push({ name: "penerimaan-reception-id-form" })
}
async function handleMissingSerialize() {
  loadingApprove.value = true
  await markSerializePacking({
    codes: selected.value,
    status: "missing",
  }).finally(() => {
    loadingApprove.value = false
  })
  tMessage.success("Serialize berhasil diupdate.")
  router.push({ name: "penerimaan-reception-id-form" })
}

async function handleBrokenSerialize() {
  loadingBroke.value = true
  await markSerializePacking({
    codes: selected.value,
    status: "broken",
  }).finally(() => {
    loadingBroke.value = false
  })
  tMessage.success("Serialize berhasil diupdate.")
  router.push({ name: "penerimaan-id" })
}
</script>

<template>
  <template v-if="loadingPage">
    <t-loading />
  </template>
  <template v-else>
    <div class="body-tnt">
      <n-h3 style="margin-bottom: 4px">Aksi Masal</n-h3>
      <n-space
        vertical
        :size="0"
      >
        <n-space>
          <n-text>ID Manifest : </n-text>
          <n-text>{{ detail?.manifest?.code }}</n-text>
        </n-space>
        <n-space>
          <n-text>ID DO : </n-text>
          <n-text>{{ detail?.do?.code }}</n-text>
        </n-space>
        <n-space>
          <n-text>Total item :</n-text>
          <n-text>{{ detail?.total?.qty }}</n-text>
        </n-space>
      </n-space>

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
            @update:value="getSerializeList"
          />
        </n-col>
        <n-col :span="6">
          <n-select
            placeholder="Pilih Level"
            v-model:value="params.level"
            :options="optionsLevel"
            @update:value="getSerializeList"
          />
        </n-col>
        <!--        <n-col :span="6">-->
        <!--          <n-select-->
        <!--            placeholder="Pilih Urutan Level"-->
        <!--            v-model:value="params.dir"-->
        <!--            :options="optionsSortLevel"-->
        <!--            @update:value="getSerializeList"-->
        <!--          />-->
        <!--        </n-col>-->
      </n-row>

      <n-data-table
        style="margin-top: 1rem"
        v-model:checked-row-keys="selected"
        :columns="columns"
        :data="serialize"
        :row-key="getKey"
      />
      <n-space
        justify="center"
        style="margin-top: 1rem"
      >
        <n-button
          :loading="loadingBroke"
          :disabled="loadingApprove"
          strong
          secondary
          type="warning"
          class="button-tnt"
          @click="handleBrokenSerialize"
          >Broken</n-button
        >
        <n-button
          :loading="loadingApprove"
          strong
          secondary
          :disabled="loadingBroke"
          type="success"
          class="button-tnt"
          @click="handleApproveSerialize"
          >Approve</n-button
        >
        <n-button
          :loading="loadingApprove"
          strong
          secondary
          :disabled="loadingBroke"
          type="error"
          class="button-tnt"
          @click="handleMissingSerialize"
          >Missing</n-button
        >
      </n-space>

      <div class="bottom-action-button">
        <div class="action-item">
          <router-link
            :to="{ name: 'penerimaan-reception-id' }"
            class="text-decoration-none"
          >
            <n-button
              :loading="loadingPage"
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

  <t-scan-modal
    v-model:show="showScanModal"
    v-model:code="code"
    :loading="loadingScan"
    title="Scan code serialize"
    @scanned="handleScanned"
  ></t-scan-modal>
</template>

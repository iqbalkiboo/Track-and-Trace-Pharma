<script setup lang="ts">
import { useMessage } from "naive-ui"
import {
  detailReception,
  getPackingSerializeList,
  getSerializePacking,
  markSerializePacking,
} from "@/models/penerimaan/reception"

const tMessage = useMessage()
const route = useRoute()

const openModalScan = ref(false)
const loadingScan = ref(false)
const loadingPage = ref(false)
const serialize = ref<any>(null)
const detail = ref<any>(null)
const serializeList = ref<any>({})
const packingParams = ref<any>()
const isResult = ref(false)
const detailSerialize = ref<any>(null)

onMounted(() => {
  getData()
})

async function getData() {
  loadingPage.value = true
  await getDetail()
  await getSerialize()
  await getSerializeList()
  loadingPage.value = false
}

async function getDetail() {
  const res = await detailReception(route.params.id as string)
  detail.value = res.data
  packingParams.value = {
    page: 1,
    limit: 10,
    reception_id: detail.value.id,
    parent_code: route.params.code as string,
  }
}

async function getSerialize() {
  const res = await getSerializePacking(route.params.code as string)
  serialize.value = res.data
}

async function getSerializeList() {
  const res = await getPackingSerializeList(packingParams.value)
  serializeList.value = res.data
}

function handlePageChanged() {
  getSerializeList()
}

async function handleScanSerialize(code: string) {
  loadingScan.value = true
  const res = await getSerializePacking(code).finally(() => {
    loadingScan.value = false
  })
  isResult.value = true
  detailSerialize.value = res.data
}

async function handleApproveSerialize() {
  await markSerializePacking({
    codes: [detailSerialize.value.code],
    status: "approved",
  })
  tMessage.success("Serialize berhasil diupdate.")
  getSerializeList()
  openModalScan.value = false
}

async function handleBrokenSerialize() {
  await markSerializePacking({
    codes: [detailSerialize.value.code],
    status: "broken",
  })
  tMessage.success("Serialize berhasil diupdate.")
  getSerializeList()
  openModalScan.value = false
}
</script>

<template>
  <t-loading v-if="loadingPage" />
  <template v-else>
    <n-space
      vertical
      style="padding: 1rem"
    >
      <n-space
        vertical
        :size="0"
      >
        <n-h3 style="margin-bottom: 0">
          ID Level {{ serialize?.level }}: {{ serialize?.code }}
        </n-h3>
        <n-p>ID Manifest: {{ serialize?.manifest.code }}</n-p>
        <n-p>ID DO: {{ serialize?.do.code }}</n-p>
        <n-p>Produk: {{ serialize?.product.name }}</n-p>
        <n-p>
          Location: {{ serialize?.warehouse_building.code }} -
          {{ serialize?.warehouse_building.name }}
        </n-p>
      </n-space>
    </n-space>

    <n-space
      justify="space-between"
      style="padding: 1rem"
    >
      <n-input placeholder="ID Kemasan/Product" />
      <n-space>
        <n-button
          type="error"
          @click="
            $router.push(`/penerimaan/serialisasi/${$route.params.id}/bulk`)
          "
          >Bulk Aksi</n-button
        >
        <n-button
          type="warning"
          @click="openModalScan = true"
          >ScanQR</n-button
        >
      </n-space>
    </n-space>
    <n-card>
      <n-space
        vertical
        :size="24"
      >
        <n-card
          v-for="item in serializeList?.list ?? []"
          :key="item.id"
          :content-style="{ background: '#eee', padding: '.5rem' }"
        >
          <n-space
            style="padding: 0 1rem"
            align="center"
            justify="space-between"
          >
            <n-h3 style="margin: 0">
              ID Level {{ item.level }}: {{ item.code }}
            </n-h3>

            <n-space align="center">
              <n-p style="font-size: 0.8rem">
                Status:
                <n-button
                  v-if="item.status == 'missing'"
                  type="warning"
                  size="small"
                >
                  Missing
                </n-button>
                <n-button
                  v-else-if="item.status == 'broken'"
                  type="error"
                  size="small"
                >
                  Broken
                </n-button>
                <n-button
                  v-else-if="item.status == 'approved'"
                  type="success"
                  size="small"
                >
                  Approved
                </n-button>
              </n-p>
            </n-space>
          </n-space>
        </n-card>

        <n-space justify="center">
          <n-pagination
            v-model:page="serializeList.page"
            :page-count="serializeList.total_page ?? 0"
            :page-slot="5"
            @update:page="handlePageChanged()"
          />
        </n-space>
      </n-space>
    </n-card>
  </template>

  <t-modal-scan-serialisasi
    v-model:show="openModalScan"
    :result="isResult"
    :data="detailSerialize"
    @click:submit="handleScanSerialize"
    @click:approve="handleApproveSerialize"
    @click:broken="handleBrokenSerialize"
  ></t-modal-scan-serialisasi>
</template>

<style></style>

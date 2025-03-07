<script setup lang="ts">
import { agregasiModel } from "@/models/pengiriman/agregasi"
import { useMessage } from "naive-ui"
import { AddOutline } from "@vicons/ionicons5"

const props = defineProps<{
  id_manifest: string
  total: any
  totalPacking: number
  typeDisabled: any
  detailDO?: any
}>()

const params = ref({
  q: "",
  dir: "desc",
  page: 1,
  limit: 10,
  manifest_id: props.id_manifest,
})

const emits = defineEmits<{
  (e: "getDo"): any
  (e: "getDataManifest"): any
}>()

function getDo() {
  emits("getDo")
}

const tMessage = useMessage()
const route = useRoute()
const dataResPacking = ref<any>({})
const dataRes = ref<any>({})
const isLoading = ref(true)
const showModalBulkBarcodeFeedback = ref(false)
const isBtnLoading = ref(false)

async function getDataPacking() {
  isLoading.value = true
  isBtnLoading.value = true
  await agregasiModel
    .getPacking(params.value)
    .then((res: any) => {
      const data = res.data.list.map((el: any) => ({
        ...el,
        active: false,
      }))
      dataRes.value = res.data
      dataResPacking.value = data
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch(() => {
      isLoading.value = false
      isBtnLoading.value = false
    })
}

async function handlePostPacking() {
  if (props.total.qty_packed >= props.total.qty_request) {
    tMessage.error(
      "Maaf, tidak bisa menambah packing karena pesanan sudah penuh"
    )
  } else {
    isLoading.value = true
    isBtnLoading.value = true
    await agregasiModel
      .postPacking({
        do_id: route.params.id,
        manifest_id: props.id_manifest,
      })
      .then(() => {
        getDataPacking()
        emits("getDataManifest")
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
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getDataPacking()
}

async function handleCloseBulkBarCodeModal() {
  showModalBulkBarcodeFeedback.value = false
}

// watchEffect(async () => {
//   if (props.totalPacking <= 0) {
//     await handlePostPacking()
//   }
// })

onMounted(() => {
  // if (props.totalPacking <= 0) {
  //   handlePostPacking()
  // } else {
    getDataPacking()
  // }
})
</script>

<template>
  <n-space
    justify="space-between"
    align="center"
  >
    <n-space vertical>
      <n-text strong style="font-size: 14px; opacity: 0.8; margin-bottom: 0">Daftar Packing</n-text>
    </n-space>
    <n-button
      type="info"
      class="button-tnt"
      v-if="dataResPacking.length > 0"
      tertiary
      @click="showModalBulkBarcodeFeedback = true"
      >Bulk Cetak Label Packing</n-button
    >
  </n-space>
  <n-space
    vertical
    :size="10"
    v-if="dataResPacking.length > 0"
    style="margin-top: 1rem"
  >
    <template v-if="isLoading">
      <t-loading></t-loading>
    </template>
    <template v-else>
      <div
        class="card-tnt card-box-tnt"
        style="background: #eee; margin-top: 0; border-radius: 12px"
        v-for="(list, i) in dataResPacking"
        :key="i"
      >
        <n-space justify="space-between">
          <n-text>ID Packing: {{ list.code }}</n-text>
          <div
            class="text_link"
            @click="list.active = !list.active"
            v-if="list.total.qty > 0"
          >
            {{ list.active ? "Tampilkan lebih sedikit" : "Detail" }}
          </div>
        </n-space>
        <n-collapse-transition :show="list.total.qty > 0 ? list.active : true">
          <t-agregasi-list-produk
            :packing_id="list.id"
            :packing_code="list.code"
            :manifest_id="props.id_manifest"
            :typeDisabled="typeDisabled"
            :detailDO="props.detailDO"
            @getDo="getDo"
          />
        </n-collapse-transition>
      </div>
    </template>
    <n-space justify="center">
      <n-pagination
        v-model:page="params.page"
        :page-count="dataRes.total_page"
        :page-slot="7"
        :show-size-picker="dataRes.total_data > 10"
        :page-sizes="[10, 20, 30, 40, 50]"
        @update:page="getDataPacking"
        @update:page-size="updatePageSize"
      />
    </n-space>
    <n-button
      type="primary"
      class="button-tnt"
      quaternary
      :loading="isBtnLoading"
      @click="handlePostPacking"
      :disabled="typeDisabled"
    >
      <template #icon>
        <n-icon><add-outline></add-outline></n-icon>
      </template>
      Tambah Packing
    </n-button>
  </n-space>
  <template v-else>
    <n-space justify="center">
      <n-button
        type="primary"
        class="button-tnt"
        :loading="isBtnLoading"
        @click="handlePostPacking"
        :disabled="typeDisabled"
      >
        <template #icon>
          <n-icon>
            <add-outline></add-outline>
          </n-icon> </template
        >Tambah Packing
      </n-button>
    </n-space>
  </template>

  <t-agregasi-barcode-bulk-produk-modal
    :show="showModalBulkBarcodeFeedback"
    :manifest_id="params.manifest_id"
    :detailDO="props.detailDO"
    @click:close="handleCloseBulkBarCodeModal"
  />

</template>

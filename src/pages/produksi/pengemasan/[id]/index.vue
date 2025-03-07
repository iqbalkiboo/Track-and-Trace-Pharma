<script setup lang="ts">
import { Search } from "@vicons/ionicons5"
import { useMessage, type SelectOption } from "naive-ui"
import type { AxiosError } from "axios"
import { serializeStore } from "@/models/produksi/serialisasi"
import { serializeModel } from "@/models/produksi/serialisasi"
import { packingModel } from "@/models/produksi/pengemasan"
import { auth } from "@/models/auth"
import Buzz from "@/assets/sound/beep.wav"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()
const authData = ref<any>()

const options = ref<SelectOption[]>([
  { label: "Semua", value: "" },
  { label: "Terpacking", value: 1 },
  { label: "Belum Terpacking", value: 0 },
  { label: "Void", value: "void" },
  { label: "Print Void", value: "print_void" },
])

const store = serializeStore()
const isLoading = ref(false)
const isBtnLoading = ref(false)
const isTableLoading = ref(false)
const detailDataRes = ref<any>({})
const serializeLevelDataRes = ref<any>({})
const serializeLevelDataResAll = ref<any>({})
const checkAll = ref(false)
const arrIdSerialize = ref<any>([])
const pages = ref<any>({})
const idsVoid = ref<string[]>()
const filter = ref<any>({})
  const params = ref({
  reception_id: route.params.id,
  with_void_on: 'packaging',
  level: 1,
  page: 1,
  limit: 10,
})
const levelParams = ref({
  reception_id: route.params.id,
  with_void_on: 'packaging',
  level: 1,
  page: 1,
  limit: 10,
})

onMounted(async () => {
  authData.value = auth.getAuth()
  await getData()
})

const voidItems = computed<any>(() => {
  return idsVoid.value?.map((id) => {
    return (serializeLevelDataRes.value?.list ?? []).find(
      (v: any) => v.id == id
    )
  })
})

const levels = computed(() => {
  const serialize = detailDataRes.value?.serialize
  if (Array.isArray(serialize)) {
    return serialize
  }
  return []
})

async function getData() {
  isLoading.value = true
  await getDetailSerialize()
  if (!route.query.level) {
    for (let idx = 0; idx < detailDataRes.value.serialize.length; idx++) {
      if (detailDataRes.value.serialize[idx].generated === detailDataRes.value.serialize[idx].packaging.total_qty_packed) {
        router.push({ query: { level: detailDataRes.value.serialize[idx+2].level} })
        break
      }
      
      if (idx === 0 ) {
        router.push({ query: { level: 2 } })
      }
    }
  }


  tabModel.value =
    parseInt(route.query.level as string) ?? levels.value[0].level
  levelParams.value.level =
    parseInt(route.query.level as string) ?? levels.value[0].level
  params.value.level =
    parseInt(route.query.level as string) ?? levels.value[0].level
  await getSerializeLevel()
  await getSerializeLevelAll()
  // getListHigestLevel()
  isLoading.value = false
}

async function getDetailSerialize() {
  const id = route.params.id as string
  await serializeModel
    .getDetailSerialize(id)
    .then((res) => {
      detailDataRes.value = res.data
      if (String(detailDataRes.value.serialize[0].level) !== route.query.level && ['ready_to_pack', 'process_packing', 'released'].includes(res.data.status.global.value)) {
        handleScan('Scan Level ' + route.query.level)
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getSerializeLevel(level?: number) {
  isTableLoading.value = true
  isBtnLoading.value = true
  if (level) {
    levelParams.value.level = level
    pages.value[level] = levelParams.value.page
  }

  if (filter.value.data_temp === 1 || filter.value.data_temp === 0) {
    filter.value.is_packed = filter.value.data_temp 
    delete filter.value.status
  } else {
    filter.value.status = filter.value.data_temp 
    delete filter.value.is_packed
  }

  await serializeModel
    .getSerializeLevel({ ...levelParams.value, ...filter.value })
    .then((res) => {
      serializeLevelDataRes.value = res.data
      serializeLevelDataRes.value.list.forEach((el: any) => {
        return (el.checked = false)
      })
      isTableLoading.value = false
      isBtnLoading.value = false
      // reset data
      checkAll.value = false
      arrIdSerialize.value = []
    })
    .catch((err: any) => {
      isTableLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getSerializeLevelAll(level?: number) {
  isTableLoading.value = true
  isBtnLoading.value = true
  
  if (level) {
    params.value.level = level
    pages.value[level] = params.value.page
  }

  await serializeModel
    .getSerializeLevel({ ...params.value, ...filter.value })
    .then((res) => {
      serializeLevelDataResAll.value = res.data
      serializeLevelDataResAll.value.list.forEach((el: any) => {
        return (el.checked = false)
      })
      isTableLoading.value = false
      isBtnLoading.value = false
      // reset data
      checkAll.value = false
      arrIdSerialize.value = []
    })
    .catch((err: any) => {
      isTableLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function getAllData() {
  levelParams.value.page = 1
  getSerializeLevel()
  getSerializeLevelAll()
}

const showVoid = ref(false)
const showVoidConfirm = ref(false)
const showScan = ref(false)
const checkPartial = ref(false)
const checkResultPartial = ref(false)
const tabModel = ref()

function handleTabChanged(val: string) {
  filter.value = { q: "", status: "", is_prined: 0 }
  levelParams.value.page = 1
  serializeLevelDataRes.value = {}
  router.push({ query: { level: val } })
  getSerializeLevel(parseInt(val))
  getSerializeLevelAll(parseInt(val))
}

function handlePageChanged(level: number) {
  getSerializeLevel(level)
  getSerializeLevelAll(level)
}

function handleVoid(ids: string[]) {
  idsVoid.value = ids
  showVoid.value = true
}

const isVoidLoading = ref(false)
const voidMessage = ref("")

async function handleConfirmVoid(e: any) {
  isVoidLoading.value = true

  const mappedData = new FormData()
  e.ids.forEach((id: string) => {
    mappedData.append("ids[]", id)
  })
  e.files.forEach((el: any) => {
    mappedData.append("media_id[]", el.id)
  })
  mappedData.append("reason", e.reason)

  await packingModel.voidPack(mappedData).catch((e) => {
    isVoidLoading.value = false
    const data = e.response.data
    tMessage.error(data.message)
    throw e
  })

  voidMessage.value = `${e.ids.length} serialisasi telah dikonfirmasi void`

  getSerializeLevel()
  getSerializeLevelAll()

  isVoidLoading.value = false
  showVoid.value = false
  showVoidConfirm.value = true
}

const scanCode = ref()
const modalScanTitle = ref()

function playSound() {
  const data = { soundurl : Buzz} 
  const audio = new Audio(data.soundurl)
      audio.play()
}

function handleScan(title: string) {
  scanCode.value = ""
  modalScanTitle.value = title
  showScan.value = true
}

async function handleScanned(code: string) {
  isBtnLoading.value = true
  const { data } = await packingModel
    .detailKemasan({
      code,
      level: tabModel.value,
      reception_id: route.params.id as string,
    })
    .catch((e: AxiosError) => {
      let msg = e.message
      const data: any = e.response?.data
      if (data) msg = data.message
      playSound()
      tMessage.error(msg)
      throw e
    })
    .finally(() => {
      isBtnLoading.value = false
      scanCode.value = ""
    })

  if (!["ready_to_pack", "process_packing"].includes(data.status)) {
    tMessage.error("Status kemas tidak ready to pack")
    playSound()
    return
  }
  if (!data?.print?.is_printed) {
    tMessage.error("Label item belum tercetak")
    return
  }

  store.detail = data

  
  router.push({
    name: `produksi-pengemasan-id-level-code`,
    params: { code: data.code, level: data.serialize.level },
    query: { is_bundling: detailDataRes.value.is_bundling ?? false }
  })

  showScan.value = false
}

const codeTimeout = ref()
function handleFilterCodeChanged() {
  clearTimeout(codeTimeout.value)
  codeTimeout.value = undefined
  codeTimeout.value = setTimeout(() => {
    getSerializeLevel()
    getSerializeLevelAll()
  }, 3e2)
}

function setTotalIsFull(data: any) {
  if (levels.value[0].level !== data.level) {
    if ('total_is_full' in data) {
      return data.total_is_full
    } else {
      return '?'
    }
  } else {
    return data.packaging.total_qty_packed
  }
}

function showModalPartial() {
  checkPartial.value = true
}

async function handlePartial() {
  isLoading.value = true
  const id = route.params.id as string
  const params = authData?.value?.users?.user_type?.id || authData.value["xx-usertype-access"].company_id

  await serializeModel
    .putPartialCheck(id, params)
    .then((res) => {
      if (res.message === "success") {
        isLoading.value = true
        setTimeout(() => {
          router.push({
            name: "produksi-pengecekan-tahap1-id",
            params: { id: res?.data?.id },
          })
        }, 2000)
      isLoading.value = false
      }
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  isLoading.value = false
}

function countLevelQty(level: any) {
  const qty = level.qty
  const total_void = level.total_void
  const total_print_void = level.total_print_void
  const results = qty - total_void - total_print_void

  return results
}

function countTotalPacked() {
  let num = 0

  for (let index = 0; index < serializeLevelDataResAll.value.list.length; index++) {
    if (serializeLevelDataResAll.value.list[index] && serializeLevelDataResAll.value.list[index].is_packed) {
      num += 1
    }
  }
  return num
}
</script>
<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-h2 style="margin-bottom: 16px">{{
        detailDataRes.product?.long_name
      }}</n-h2>
      <n-grid cols="3" item-responsive responsive="screen" x-gap="16" y-gap="16">
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Perintah Kemas : </span>
                <span style="font-weight: 500">{{
                  detailDataRes.pk_id
                }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Kode Produk : </span>
                <span style="font-weight: 500">{{
                  detailDataRes.product?.item_code
                }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Status : </span>
                <n-tag type="success" round :bordered="false" style="font-weight: 500">{{
                  $filters.toStatus(detailDataRes?.status?.global?.value)
                }}</n-tag>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Batch Produksi : </span>
                <span style="font-weight: 500">{{
                  detailDataRes.batch_number
                }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Qty Item : </span>
                <span style="font-weight: 500">{{
                  detailDataRes.serialize ? detailDataRes.serialize[0].qty : ''
                }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
      </n-grid>
      <n-space vertical>
        <n-space vertical :size="10">
          <n-h6 style="font-size: 14px; margin-bottom: 0; margin-top: 2rem;">
            Packaging
          </n-h6>

          <n-tabs
            class="tab-pengemasan"
            v-model:value="tabModel"
            animated
            size="small"
            type="segment"
            @update:value="handleTabChanged"
            tab-style="border-radius: 8px;"
          >
            <n-tab-pane
              v-for="level in levels"
              :key="level.name"
              :name="level.level"
              :tab="`${level.name} (${setTotalIsFull(level)}/${countLevelQty(level)})`"
              style="border-radius: 10px;"
            >
              <t-packaging-table
                :type="level.name"
                :loading="isTableLoading"
                :detail-data="detailDataRes"
                :content="serializeLevelDataRes"
                :levels="levels"
                v-model:page="levelParams.page"
                v-model:limit="levelParams.limit"
                @update:page="handlePageChanged(level.level)"
                @click:void="handleVoid"
              >
                <template #filter>
                  <n-input v-if="false" v-model:value="filter.q" :placeholder="
                    'Cari ID Level ' + level.level
                  " style="width: 400px; max-width: 100%" @input="handleFilterCodeChanged">
                    <template #suffix>countTotalPacked
                      <n-icon :component="Search" />
                    </template>
                  </n-input>
                  <n-tag 
                    style="width: 400px; max-width: 100%; padding: 10px;">
                    <n-text style="text-align: center">
                      Qty:
                      {{
                        `${countTotalPacked()}/${serializeLevelDataRes.total_data}`
                      }}
                    </n-text>
                  </n-tag>
                  <n-select 
                    v-model:value="filter.data_temp" 
                    default-value=""
                    :options="options" placeholder="Status"
                    @update:value="getAllData()" 
                    style="width: 400px; max-width: 100%" />

                  <n-button v-if="level.level != 1" type="primary" color="rgb(11, 143, 157)" class="button-tnt" @click="
                    handleScan(
                      'Scan Level ' + level.level
                    )
                  ">Scan level {{ level.level }}</n-button>
                </template>
              </t-packaging-table>
            </n-tab-pane>
          </n-tabs>
        </n-space>
      </n-space>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'produksi-pengemasan' }" class="text-decoration-none">
          <n-button
            color="#828282"
            class="button-tnt"
            style="width: 120px"
          >
            <span style="margin-left: 5px;">Kembali</span>
          </n-button>
        </router-link>
        <n-button
          v-if="detailDataRes?.status?.global?.value !== 'ready_to_pack'"
          type="primary"
          class="button-tnt"
          @click="showModalPartial"
        >
          <span style="margin-left: 5px;">Parsial Pengecekan</span>
        </n-button>
      </div>
    </div>
  </div>

  <t-void-modal :loading="isVoidLoading" v-model:show="showVoid" :items="voidItems"
    @click:void="handleConfirmVoid"></t-void-modal>

  <t-modal-confirm
    v-model:show="checkPartial"
    v-model:result="checkResultPartial"
    v-model:loading="isBtnLoading"
    title="Partial Pengecekan"
    @handlePartial="handlePartial"
  ></t-modal-confirm>

  <t-scan-modal
    v-model:show="showScan"
    v-model:code="scanCode"
    :title="modalScanTitle"
    :loading="isBtnLoading"
    @scanned="handleScanned"
  ></t-scan-modal>

  <t-feedback v-model:show="showVoidConfirm" title="Void Terkonfirmasi" :subtitle="voidMessage">
    <n-space justify="center">
      <n-button type="primary" @click="showVoidConfirm = false">Selesai</n-button>
    </n-space>
  </t-feedback>

  <t-loading-modal v-model:show="isVoidLoading"></t-loading-modal>
</template>

<style>
.tab-pengemasan .n-tabs-tab {
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin-right: 1rem;
}

.tab-pengemasan .n-tabs-tab--active {
  background: #219653 !important;
  color: white !important;
}
</style>


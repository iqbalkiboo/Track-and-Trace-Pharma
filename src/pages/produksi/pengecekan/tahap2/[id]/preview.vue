<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ArrowBackOutline } from "@vicons/ionicons5"
import moment from "moment"
import { checkingModel } from '@/models/produksi/pengecekan'

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const isTableLoading = ref(false)
const detailDataRes = ref<any>({})
const detailProductDataRes = ref<any>({})
const serializeLevelDataRes = ref<any>({})
const scanDataRes = ref<any>({})
const tahapTableRef = ref()
const arrCode = ref<any>([])

const levelParams = ref({
  reception_id: route.params.id,
  status: "released,pre_release,void",
  level: 1,
  page: 1,
  limit: 10,
})

const levelParamsNow = ref({
  level: 1,
})

onMounted(() => {
  getData()
})

async function getData() {
  getDetailCheckingProduct()
  await getDetailChecking()
}

async function getDetailChecking() {
  isLoading.value = true
  const id = route.params.id
  await checkingModel.getDetailChecking(id).then((res) => {
    detailDataRes.value = res.data
    getCheckingLevel(detailDataRes.value?.serialize[detailDataRes.value?.serialize.length - 1].level)
  })
  .catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function getDetailCheckingProduct() {
  const id = route.params.id
  checkingModel.getDetailCheckingProduct(id)
  .then((res) => {
    detailProductDataRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getCheckingLevel(level: number) {
  const tempIndex = detailDataRes.value?.serialize.length - 1
  if (level === detailDataRes.value?.serialize[tempIndex].level) {
    isBtnLoading.value = true
    levelParams.value.level = level
    await checkingModel.getCheckingLevel(levelParams.value)
    .then((res) => {
      serializeLevelDataRes.value = res.data
      serializeLevelDataRes.value.list.forEach((el: any) => {
        el.active = false
        el.checked = false
      })
      isLoading.value = false
      isTableLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isTableLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else {
    getCheckingItems(scanDataRes.value.id, false)
  }
}

async function getDetailByCode(code: string) {
  isLoading.value = true
  isBtnLoading.value = true
  levelParamsNow.value.level = levelParams.value.level
  levelParams.value.page = 1

  const reception_id = route.params.id
  const level = levelParams.value.level
  return await checkingModel.getDetailByCode(code, reception_id, level)
  .then((res) => {
    if (!arrCode.value.includes(res.data.code)) {
      if (typeof arrCode.value[(detailDataRes.value?.serialize.length) - levelParams.value.level] !== 'undefined') {
        arrCode.value.splice((detailDataRes.value?.serialize.length) - levelParams.value.level, 1)
        arrCode.value.push(res.data.code)
      } else {
        arrCode.value.push(res.data.code)
      }
    }
    scanDataRes.value = res.data
    getCheckingItems(scanDataRes.value.id, true)
  })
  .catch((err: any) => {
    isLoading.value = false
    isTableLoading.value = false
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getCheckingItems(id: string, subtraction: boolean) {
  isBtnLoading.value = true
  const params = ref<any>({})
  params.value = {...levelParams.value}
  delete params.value["reception_id"]
  delete params.value["level"]
  delete params.value["status"]
  return await checkingModel.getCheckingItems(id, params.value)
  .then((res) => {
    if (subtraction) {
      levelParams.value.level = levelParams.value.level - 1
    }
    serializeLevelDataRes.value = res.data
    serializeLevelDataRes.value.list.forEach((el: any) => {
      el.active = false
      el.checked = false
    })
    isLoading.value = false
    isTableLoading.value = false
    isBtnLoading.value = false
  })
  .catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function setQtyItem(value: any) {
  let qty_item = 0
  value.forEach((el: any) => {
    el.generates.forEach((al: any) => {
      qty_item += al.qty_check_pass + al.qty_check_void
    })
  })
  return qty_item
}
function setQtyPass(value: any) {
  let qty_pass = 0
  value.forEach((el: any) => {
    qty_pass += el.checking.total_qty_passed
  })
  return qty_pass
}
function setQtyVoid(value: any) {
  let qty_void = 0
  value.forEach((el: any) => {
    if ('total_check_void' in el) {
      qty_void += el.total_check_void
    }
  })
  return qty_void
}

function getBack() {
  if (detailDataRes.value.serialize?.length - 1 === levelParams.value.level) {
    isLoading.value = true
    arrCode.value = []
    getCheckingLevel(detailDataRes.value?.serialize[detailDataRes.value?.serialize.length - 1].level)
  } else {
    const code = arrCode.value[(detailDataRes.value?.serialize.length - 1) - levelParamsNow.value.level]
    levelParams.value.level += 2
    getDetailByCode(code)
  }
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
      <n-h2 style="margin-bottom: 16px">
        <template v-if="detailDataRes.serialize?.length === levelParams.level">
          No PK : {{ detailDataRes.pk_id }}
        </template>
        <template v-else>
          Kode Level {{ levelParamsNow.level }} : {{ scanDataRes.code }}
        </template>
      </n-h2>
      <n-grid cols="3" item-responsive responsive="screen" x-gap="16" y-gap="16">
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space
              v-if="detailDataRes.serialize?.length !== levelParams.level"
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <span>No Pk : </span>
                <span style="font-weight: 500">{{ detailDataRes.pk_id }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Nama Produk : </span>
                <span style="font-weight: 500">{{ detailDataRes.product?.long_name }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Kode Produk : </span>
                <span style="font-weight: 500">{{ detailDataRes.product?.item_code }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Batch Produksi : </span>
                <span style="font-weight: 500">{{ detailDataRes.batch_number }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Exp. Date : </span>
                <span style="font-weight: 500">{{ moment(detailDataRes.date?.expired_date).format("yyyy-MM-DD") }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>UOM : </span>
                <span style="font-weight: 500">{{ detailProductDataRes.uom?.name }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Qty Level Terendah : </span>
                <span style="font-weight: 500">{{ detailDataRes.serialize ? detailDataRes.serialize[0]?.qty : '0' }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
      </n-grid>
      <!-- <n-grid
        cols="3"
        item-responsive
        responsive="screen"
        x-gap="16"
        y-gap="16"
        style="margin-top: 18px;"
      >
        <n-grid-item span="3 m:1">
          <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 8px; text-align: center;">
            <n-text
              v-if="detailDataRes.serialize?.length === levelParams.level"
              style="font-size: 13px; margin-bottom: 0"
            >
              Semua ({{ detailDataRes.serialize ? setQtyItem(detailDataRes.serialize) : 0 }})
            </n-text>
            <n-text v-else>
              Semua ({{ detailDataRes.serialize ? setQtyItem(detailDataRes.serialize) : 0 }})
            </n-text>
          </div>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 8px; text-align: center;">
            <n-text style="font-size: 13px; margin-bottom: 0">
              Pass ({{ detailDataRes.serialize ? setQtyPass(detailDataRes.serialize) : 0 }})
            </n-text>
          </div>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 8px; text-align: center;">
            <n-text style="font-size: 13px; margin-bottom: 0">
              Void ({{ detailDataRes.serialize ? setQtyVoid(detailDataRes.serialize) : 0 }})
            </n-text>
          </div>
        </n-grid-item>
      </n-grid> -->
      

      <div class="card-tnt">
        <t-preview-list
          ref="tahapTableRef"
          v-model:detail-data="detailDataRes"
          v-model:scan-data="scanDataRes"
          v-model:value="serializeLevelDataRes"
          v-model:params="levelParams"
          type="semua"
          @click:get-checking-level="getCheckingLevel"
          @click:get-detail-by-code="getDetailByCode"
        />
      </div>

    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'produksi-pengecekan-tahap2-id' }" class="text-decoration-none">
          <n-button
            color="#828282"
            class="button-tnt"
            style="width: 120px"
          >
            <n-icon :component="ArrowBackOutline" />
            <span style="margin-left: 5px;">Kembali</span>
          </n-button>
        </router-link>
        <n-button
          v-if="detailDataRes.serialize?.length ? detailDataRes.serialize?.length !== levelParams.level : false"
          :loading="isBtnLoading"
          color="#828282"
          ghost
          class="button-tnt"
          @click="getBack"
        >
          <n-icon :component="ArrowBackOutline" />
          <span style="margin-left: 5px;">Level Sebelumnya</span>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ArrowBackOutline } from "@vicons/ionicons5"
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
const parentLevel = ref<any>([])

const levelParams = ref({
  reception_id: route.params.id,
  with_void_on: 'checking',
  status: "packing_done,pre_release,pass,void",
  level: 1,
  page: 1,
  limit: 1000,
})

const levelParamsNow = ref({
  level: 1,
})

onMounted(() => {
  getData()
})

async function getData() {
  getDetailCheckingProduct()
  await getDetailChecking(true)
}

async function getDetailChecking(getLevel: boolean) {
  isLoading.value = true
  const id = route.params.id
  await checkingModel.getDetailChecking(id).then((res) => {
    detailDataRes.value = res.data
    if (getLevel) {
      getCheckingLevel(detailDataRes.value?.serialize[detailDataRes.value?.serialize.length - 1].level)
    } else {
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    }
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

async function getDetailByCode(code: string, level: number, subtraction: boolean) {
  parentLevel.value.push({
    code,
    level,
  })
  isLoading.value = true
  isBtnLoading.value = true
  levelParamsNow.value.level = level

  const reception_id = route.params.id
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
    getCheckingItems(scanDataRes.value.id, subtraction)
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
    const gIdx = el.generates.findIndex((item: any) => {
      return item.is_released == false || !item.is_released
    })
    qty_item += el.generates[gIdx] ? el.generates[gIdx].qty_packed : 0 
  })
  return qty_item
}
function setQtyPass(value: any) {
  // let qty_pass = 0
  // value.forEach((el: any) => {
  //   const gIdx = el.generates.findIndex((item: any) => {
  //     return item.is_released == false || !item.is_released
  //   })
  //   qty_pass += el.generates[gIdx] ? el.generates[gIdx].qty_check_pass : 0 
  // })
  // return qty_pass
  let qty_pass = 0
  qty_pass += value[0].generates.reduce((a: any,b: any) => a + b.qty, 0)
  return qty_pass
}
function setQtyVoid(value: any) {
  // let qty_void = 0
  // value.forEach((el: any) => {
  //   // if ('total_check_void' in el) {
  //     const gIdx = el.generates.findIndex((item: any) => {
  //       return item.is_released == false || !item.is_released
  //     })
  //     qty_void += el.generates[gIdx] ? el.generates[gIdx].qty_check_void : 0
  //   // }
  // })
  // return qty_void
  let qty_pass = 0
  qty_pass += value[0].generates.reduce((a: any,b: any) => a + b.qty_pack_void, 0)
  return qty_pass
}

function getBack() {
  if (detailDataRes.value.serialize?.length - 1 === levelParams.value.level) {
    isLoading.value = true
    arrCode.value = []
    getCheckingLevel(detailDataRes.value?.serialize[detailDataRes.value?.serialize.length - 1].level)
  } else {
    const code = arrCode.value[(detailDataRes.value?.serialize.length - 1) - levelParamsNow.value.level]
    levelParams.value.level += 2
    getDetailByCode(code, levelParams.value.level, true)
  }
  delete parentLevel.value[parentLevel.value.length - 1]
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
      <n-grid
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
              Semua ({{ detailDataRes.serialize ? detailDataRes.serialize[0].generates[0].qty : 0 }})
            </n-text>
            <n-text v-else>
              Semua ({{ detailDataRes.serialize ? detailDataRes.serialize[0].generates[0].qty : 0 }})
            </n-text>
          </div>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 8px; text-align: center;">
            <n-text style="font-size: 13px; margin-bottom: 0">
              Pass ({{ detailDataRes.serialize ? detailDataRes.serialize[0].generates[0].qty_check_pass : 0 }})
            </n-text>
          </div>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <div class="card-tnt" style="border: 1px solid #E5E5E5; margin-top: 0; padding: 8px; text-align: center;">
            <n-text style="font-size: 13px; margin-bottom: 0">
              Void ({{ detailDataRes.serialize ? detailDataRes.serialize[0].generates[0].qty_check_void : 0 }})
            </n-text>
          </div>
        </n-grid-item>
      </n-grid>

      <div class="card-tnt">
        <t-tahap-table
          ref="tahapTableRef"
          v-model:detail-data="detailDataRes"
          v-model:scan-data="scanDataRes"
          v-model:value="serializeLevelDataRes"
          v-model:params="levelParams"
          v-model:level-params-now="levelParamsNow"
          v-model:parent-level="parentLevel"
          type="semua"
          @click:getCheckingLevel="getCheckingLevel"
          @click:get-detail-by-code="getDetailByCode"
          @click:get-detail-checking="getDetailChecking"
        />
      </div>

    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'produksi-pengecekan-tahap1' }" class="text-decoration-none">
          <n-button
            color="#828282"
            class="button-tnt"
          >
            <n-icon :component="ArrowBackOutline" />
            <span style="margin-left: 5px;">Beranda</span>
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

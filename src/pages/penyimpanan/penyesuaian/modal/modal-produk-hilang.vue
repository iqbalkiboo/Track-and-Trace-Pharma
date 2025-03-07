<script setup lang="ts">
import { useMessage } from 'naive-ui'
import moment from "moment"
import { adjustmentModel } from '@/models/penyimpanan/adjustment'

const props = withDefaults(
  defineProps<{
    show: boolean
    product?: any
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
  (e: "click:input", value: any): void
}>()

const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const checkedRef = ref(false)
const checkGroupValue = ref<any>([])

watch(() => props.show, (value) => {
  if (value) {
    if (Object.keys(dataRes.value).length === 0) {
      getListMissingProduct()
    }
  }
})

async function getListMissingProduct() {
  if (Object.keys(props.product?.from?.room).length > 0) {
    dataRes.value = {}
  } else {
    isLoading.value = true
    isBtnLoading.value = true
    const params = {
      warehouse_code: props.product?.from?.warehouse?.code,
      product_code: props.product?.product?.item_code,
      limit: 1000,
      status: 'missing',
    }
    await adjustmentModel.getListMissingProduct(params).then((res) => {
      isLoading.value = false
      isBtnLoading.value = false
      dataRes.value = res.data
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  }
}

function updateCheckGroupValue(value: (string | number)[]) {
  checkGroupValue.value = value
}

function handleCheckedChange(checked: boolean) {
  if (checked) {
    dataRes.value?.list.map((item: any) => {
      checkGroupValue.value?.push(item)
    })
  } else {
    checkGroupValue.value = []
  }
}

function handleInput() {
  emit('click:input', checkGroupValue.value)
  emit('click:close', false)
}

function handleClose() {
  emit('click:close', false)
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    title="Warehouse Produk Hilang"
    :bordered="false"
    style="width: 1100px; max-width: 100%; border-radius: 10px"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="handleClose"
  >
    <n-scrollbar x-scrollable style="max-height: 450px;">
      <n-space vertical :size="14" style="padding-left: 10px; padding-right: 10px;">
        <n-space vertical :size="0">
          <n-text>Kode Produk : {{ props?.product?.product?.item_code }}</n-text>
          <n-text>Nama Produk : {{ props?.product?.product?.short_name }}</n-text>
          <n-text>Batch : {{ props?.product?.batch }}</n-text>
        </n-space>
        <n-space justify="space-between">
          <n-checkbox
            label="Pilih Semua"
            v-model:checked="checkedRef"
            @update:checked="handleCheckedChange"
          ></n-checkbox>
          <n-button
            :disabled="checkGroupValue.length === 0"
            :loading="isBtnLoading"
            type="primary"
            class="button-tnt"
            style="width: 120px"
            @click.prevent="handleInput"
          >
            Input
          </n-button>
        </n-space>
        <div class="table-tnt" style="margin-top: 0;">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-checkbox-group
              v-model:value="checkGroupValue"
              @update:value="updateCheckGroupValue"
            >
              <n-scrollbar x-scrollable>
                <n-table :single-line="false">
                  <thead>
                    <tr>
                      <th></th>
                      <th style="text-align: center">No</th>
                      <th>Kode Produk</th>
                      <th>Nama Produk</th>
                      <th>Room</th>
                      <th>Rack</th>
                      <th>Batch</th>
                      <th>Exp Date</th>
                      <th>Qty</th>
                      <th>Kode DO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="dataRes?.list?.length === 0">
                      <tr>
                        <td colspan="10" style="text-align: center">Belum ada data tersedia</td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr v-for="list, i in dataRes.list" :key="i">
                        <td>
                          <n-checkbox :value="list" label="" />
                        </td>
                        <td style="text-align: center">{{ i + 1 }}</td>
                        <td>{{ list.product?.code }}</td>
                        <td>{{ list.product?.name }}</td>
                        <td>{{ '?' }}</td>
                        <td>{{ '?' }}</td>
                        <td>{{ list.batch_number }}</td>
                        <td>{{ moment(list.expired_date).format("yyyy-MM-DD") }}</td>
                        <td>{{ list.qty }}</td>
                        <td>{{ list.do?.code }}</td>
                      </tr>
                    </template>
                  </tbody>
                </n-table>
              </n-scrollbar>
            </n-checkbox-group>
          </template>
        </div>
      </n-space>
    </n-scrollbar>
  </n-modal>
</template>
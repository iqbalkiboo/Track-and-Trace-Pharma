<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { stockModel } from '@/models/penyimpanan/penyimpanan-stok'

const props = withDefaults(
  defineProps<{
    show: boolean
    code: string
    params: any
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
}>()

const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})

watch(() => props.show, (value) => {
  if (value) {
    getListSerialize()
  }
})

async function getListSerialize() {
  const params = {
    sort: 'desc',
    sort_field: 'created_at',
    warehouse_id: props.params.warehouse_id,
    batch_number: props.params.batch_number,
    parent_code: props.params.parent_code,
    un_nested_wh: 1,
    page: 1,
    limit: -1,
  }
  isLoading.value = true
  isBtnLoading.value = true
  await stockModel.getListSerialize(params).then((res) => {
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

function handleClose() {
  emit('click:close', false)
}

function handleCopyCode(index: number) {
  const copyText = document.getElementById("copyCode" + index) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode serialisasi tersalin")
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    title="Detail Serial"
    :bordered="false"
    style="width: 1000px; max-width: 100%; border-radius: 10px"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="handleClose"
  >
    <n-scrollbar x-scrollable style="max-height: 450px;">
      <n-space vertical :size="14" style="padding-left: 10px; padding-right: 10px;">
        <n-h6 style="font-size: 13px; margin-bottom: 0">Kode Serialisasi : {{ props?.params?.parent_code }}</n-h6>
        <div class="table-tnt" style="margin-top: 0;">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Serialisasi</th>
                    <th style="text-align: right">Level</th>
                    <th style="text-align: center;">Status</th>
                    <th style="text-align: right;">Total Qty</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="dataRes?.list.length === 0">
                    <tr>
                      <td colspan="5" style="text-align: center">Belum ada data tersedia</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="list, i in dataRes.list" :key="i">
                      <td>{{ i + 1 }}</td>
                      <td>
                        <n-space>
                          <n-text
                            strong
                          >
                            {{ list.code }}
                          </n-text>
                          <div
                            style="border-radius: 5px; padding-left: 4px; padding-right: 4px; border: 1px solid #000; cursor: pointer;"
                            @click.prevent="handleCopyCode(i)"
                          >
                            Copy
                          </div>
                        </n-space>
                        <div v-show="false">
                          <input v-show="false" type="text" :value="list.code" :id="'copyCode' + i">
                        </div>
                      </td>
                      <td style="text-align: right;">{{ list.serialize?.level }}</td>
                      <td style="text-align: center;">
                        <n-tag type="success" :bordered="false" round>
                          {{ list.status ? list.status : "-" }}
                        </n-tag>
                      </td>
                      <td style="text-align: right;">{{ list.serialize?.first_level_qty }}</td>
                    </tr>
                  </template>
                </tbody>
              </n-table>
            </n-scrollbar>
          </template>
        </div>
      </n-space>
    </n-scrollbar>
  </n-modal>
</template>
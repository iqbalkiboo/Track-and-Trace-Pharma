<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { checkingModel } from '@/models/produksi/pengecekan'

const props = withDefaults(
  defineProps<{
    show: boolean
    id: string
    code?: string
    level?: string
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
    getVoidItems()
  }
})

async function getVoidItems() {
  isLoading.value = true
  isBtnLoading.value = true
  const params = {
    limit: -1
  }
  await checkingModel.getVoidItems(props?.id, params).then((res) => {
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
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    title="List Void"
    :bordered="false"
    style="width: 900px; max-width: 100%; border-radius: 10px"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="handleClose"
  >
    <n-scrollbar x-scrollable style="max-height: 450px;">
      <n-space vertical :size="14" style="padding-left: 10px; padding-right: 10px;">
        <n-h6 style="font-size: 13px; margin-bottom: 0">Kode Level {{ props?.level }} : {{ props?.code }}</n-h6>
        <div class="table-tnt" style="margin-top: 0;">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th style="text-align: center">No</th>
                    <th>Kode Serialisasi</th>
                    <th style="text-align: center">Level</th>
                    <th>Reason</th>
                    <th style="text-align: center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="dataRes?.list?.length === 0">
                    <tr>
                      <td colspan="99" style="text-align: center">Belum ada data tersedia</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="list, i in dataRes.list" :key="i">
                      <td style="text-align: center">{{ i + 1 }}</td>
                      <td>{{ list.code }}</td>
                      <td style="text-align: center">{{ list.serialize?.level }}</td>
                      <td>{{ list.reason || '-' }}</td>
                      <td style="text-align: center">
                        <n-tag type="error" :bordered="false" round>
                          {{ list.status }}
                        </n-tag>
                      </td>
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
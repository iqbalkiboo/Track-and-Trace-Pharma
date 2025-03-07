<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { serializeModel } from '@/models/produksi/serialisasi'

const tMessage = useMessage()

const props = defineProps<{
  isShowModal?: boolean
  type?: string
  id?: string
}>()

const emits = defineEmits<{
  (e: 'update:isShowModal', type: boolean): void
  (e: 'hideModal'): void
  (e: 'getData'): void
}>()

const isBtnLoading = ref(false)
const sapDate = ref(null)

function handleSubmit() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("query", String(sapDate.value))

  serializeModel.syncWithSap(formData).then(() => {
    isBtnLoading.value = false
    tMessage.success('Berhasil Sync With SAP')
    emits('getData')
    hideModal()
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
    isBtnLoading.value = false
  })
}

const hideModal = () => {
  sapDate.value = null
  setTimeout(() => {
    emits('hideModal')
  }, 100)
}
</script>

<template>
  <n-modal
    :show="props.isShowModal"
    @update:show="$emit('update:isShowModal', $event)"
  >
    <n-card
      style="width: 470px; --n-border-radius: 10px"
      content-style="padding: 15px 20px 28px 20px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical :size="25">
        <n-h6 style="margin-bottom: 0">Sync With SAP</n-h6>
        <n-space vertical :size="14">
          <n-space vertical :size="8">
            <p style="font-size: 13px; margin-top: 0; margin-bottom: 0">Pilih Tanggal</p>
            <n-date-picker
              v-model:formatted-value="sapDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="Tentukan Tanggal"
              style="width: 100%"
              clearable
            />
          </n-space>
        </n-space>

        <n-space justify="center">
          <n-button
            :loading="isBtnLoading"
            color="#828282"
            class="button-tnt"
            @click="hideModal"
          >
            Batalkan
          </n-button>
          <n-button
            :disabled="sapDate === null"
            :loading="isBtnLoading"
            color="#219653"
            class="button-tnt"
            style="width: 110px"
            @click="handleSubmit"
          >
            Submit
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>
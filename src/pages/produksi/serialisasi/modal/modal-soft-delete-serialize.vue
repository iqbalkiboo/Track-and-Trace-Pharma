<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { serializeModel } from '@/models/produksi/serialisasi'

const tMessage = useMessage()

const props = defineProps<{
  isShowModal?: boolean
  idSerialize?: string
}>()

const emits = defineEmits<{
  (e: 'update:isShowModal', type: boolean): void
  (e: 'hideModal'): void
  (e: 'getData'): void
}>()

const isBtnLoading = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: 'Alasan tidak boleh kosong',
    trigger: ['blur', 'change'],
  },
}

const hideModal = () => {
  formValue.value.reason = ""
  setTimeout(() => {
    emits('hideModal')
  }, 100)
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  deleteSerialize()
}

function deleteSerialize() {
  if (!props.idSerialize) return
  
  isBtnLoading.value = true
  const formData = new FormData()
  if ( formValue.value.reason !== "") {
    formData.append("reason", formValue.value.reason)
      serializeModel.softDeleteSerialize(props.idSerialize, formData).then(() => {
      isBtnLoading.value = false
      emits('getData')
      hideModal()
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
  }
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
        <n-h6 style="margin-bottom: 0">Hapus Serialisasi</n-h6>
        <div>
          <n-form
            ref="formRef"
            class="form-tnt"
            :show-require-mark="false"
            :label-width="80"
            :model="formValue"
            :rules="rules"
          >
            <n-form-item label="Alasan" path="reason">
              <n-input
                v-model:value="formValue.reason"
                placeholder="Alasan"
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 5
                }"
              />
            </n-form-item>
          </n-form>
        </div>

        <n-space justify="center">
          <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideModal">
            Tutup
          </n-button>
          <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" @click="handleValidateClick">
            Lanjutkan
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>
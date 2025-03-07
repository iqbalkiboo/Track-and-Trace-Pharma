<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { UploadInst, UploadFileInfo } from 'naive-ui'
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
const fileListLengthRef = ref(0)
const uploadExcelRef = ref<UploadInst | null>(null)
const excelValue = ref<any>({})
const reason = ref("")

function handleChange(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]
  if (allowedTypes.indexOf(String(data.file.file?.type)) === -1) {
    tMessage.error('File yang diupload bukan excel, silakan upload ulang')
  } else {
    excelValue.value.name = data.file.name
    excelValue.value.file = data.file.file
    fileListLengthRef.value = data.fileList.length
  }
}

function handleSubmit() {
  isBtnLoading.value = true

  if (props.type === 'bon') {
    const formData = new FormData()
    formData.append("reception_id", String(props.id))
    formData.append("file", excelValue.value.file)
    formData.append("reason_of_adding_qty", reason.value)

    serializeModel.importSerialize(formData).then(() => {
      isBtnLoading.value = false
      tMessage.success('Berhasil import data bon serialisasi')
      emits('getData')
      hideModal()
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
  } else {
    const formData = new FormData()
    formData.append("file", excelValue.value.file)

    serializeModel.importSerialize(formData).then(() => {
      isBtnLoading.value = false
      tMessage.success('Berhasil import data serialisasi')
      emits('getData')
      hideModal()
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
  }
}

const hideModal = () => {
  excelValue.value = {}
  fileListLengthRef.value = 0
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
        <n-h6 style="margin-bottom: 0">{{ props.type === 'bon' ? 'Upload Serialisasi Tambahan' : 'Upload Data Excel' }}</n-h6>
        <n-space vertical :size="14">
          <n-space vertical :size="8">
            <p style="font-size: 13px; margin-top: 0; margin-bottom: 0">Unggah File</p>
            <n-space>
              <n-input
                v-model:value="excelValue.name"
                type="text"
                placeholder="File excel.."
                :readonly="true"
                style="width: 16rem"
              />
              <n-upload
                ref="uploadExcelRef"
                action=""
                :default-upload="false"
                :show-file-list="false"
                @change="handleChange"
              >
                <n-button
                  :loading="isBtnLoading"
                  color="#219653"
                  class="button-tnt"
                >
                  Pilih Excel
                </n-button>
              </n-upload>
            </n-space>
            <a v-if="props.type !== 'bon'" href="/assets/xlsx/serialisasi.xlsx" download style="font-size: 13px; color: #219653">Download Contoh File</a>
            <a v-if="props.type === 'bon'" href="/assets/xlsx/serialisasi-bon.xlsx" download style="font-size: 13px; color: #219653">Download Contoh File</a>
          </n-space>
          <n-space v-if="props.type === 'bon'" vertical :size="0">
            <p style="font-size: 13px; margin-top: 0; margin-bottom: 8px">Alasan</p>
            <n-input
              v-model:value="reason"
              type="text"
              placeholder="Alasan"
              style="width: 100%"
            />
          </n-space>
        </n-space>

        <n-space justify="center">
          <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideModal">
            Batalkan
          </n-button>
          <n-button :disabled="fileListLengthRef === 0" :loading="isBtnLoading" color="#219653" class="button-tnt" style="width: 110px" @click="handleSubmit">
            Upload
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

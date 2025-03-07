<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst, UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'
import { auth } from "@/models/auth"
import { storageModel } from '@/models/storage'
import type { THeader } from "./components"

const props = withDefaults(
  defineProps<{
    loading: boolean;
    show: boolean;
    items: any[]
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (
    e: "click:void",
    value: {
      ids: string[]
      files: File[]
      reason: string
    }
  ): void
}>()

const tMessage = useMessage()
const authData = auth.getAuth()

const isBtnLoading = ref(false)
const formRef = ref<FormInst>()
const formValue = ref<any>({})
const previewFileList = ref<UploadFileInfo[]>([])
const previewImageUrl = ref('')
const showModalImage = ref(false)
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: 'Alasan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
}

const headers = ref<THeader[]>([
  { label: "No" },
  { label: "ID Primer" },
  { label: "No Batch" },
])

function handlePreview(file: UploadFileInfo) {
  const { url } = file
  previewImageUrl.value = url as string
  showModalImage.value = true
}

function deleteImage(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  previewFileList.value = previewFileList.value.filter(function(item) {
    return item.id !== data.file.id
  })
}

function beforeUploadImage(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  const allowedTypes = ["image/png", "image/jpeg"]
  if (allowedTypes.indexOf(String(data.file.file?.type)) === -1) {
    tMessage.error('Format gambar harus png atau jpg, tolong upload ulang')
    return false
  }
  return true
}

function uploadImage({
  file,
  onFinish,
}: UploadCustomRequestOptions) {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("file", file.file as File)
  formData.append("source", "upload")
  formData.append("title", file.name)
  formData.append("caption", file.name)
  formData.append("alt", file.name)

  storageModel.uploadStorage(formData).then((response:any) => {
    if (response.data.status === 200) {
      previewFileList.value.push({
        id: response.data.data.id,
        name: response.data.data.title,
        status: 'finished',
        url: response.data.data.public_url
      })
      isBtnLoading.value = false
      onFinish()
    }
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function handleConfirm() {
  formValue.value.imageList = previewFileList.value
  await formRef.value?.validate().then(() => {
    emit("click:void", {
      ids: props.items.map((v: any) => v.id),
      files: formValue.value.imageList,
      reason: formValue.value.reason,
    })
    emit("update:show", false)
    previewFileList.value = []
    formValue.value.reason = ""
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}

function handleClose() {
  emit("update:show", false)
  formValue.value = {}
  previewFileList.value = []
}
</script>

<template>
  <n-modal :mask-closable="false" :show="show" @update:show="handleClose">
    <n-card
      style="width: 800px; max-width: 100vw; border-radius: 10px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      title="Konfirmasi Void"
    >
      <n-scrollbar x-scrollable style="height: 450px;">
        <n-space vertical :size="16">
          <n-p style="margin-bottom: 0">
            <n-text strong>Jumlah Void</n-text> <br />
            <n-text>{{ items.length }}</n-text>
          </n-p>

          <t-table :headers="headers">
            <n-tr v-for="(item, index) in items" :key="item.id">
              <n-td>{{ index + 1 }}</n-td>
              <n-td>{{ item.code }}</n-td>
              <n-td>{{ item.reception?.batch_number }}</n-td>
            </n-tr>
          </t-table>

          <n-p style="margin-bottom: 0">
            <n-text strong>Packer</n-text> <br />
            <n-text>{{ authData.xxtype == "ju5tU53r" ? authData.users.namen : authData.user.name }}</n-text>
          </n-p>

          <n-form
            ref="formRef"
            class="form-tnt"
            :show-require-mark="false"
            :label-width="80"
            :model="formValue"
            :rules="rules"
          >
            <n-form-item label="Alasan Void" path="reason">
              <n-input
                v-model:value="formValue.reason"
                placeholder="Masukkan Alasan"
              >
              </n-input>
            </n-form-item>
            <n-form-item label="Upload Gambar Bukti" path="imageList">
              <n-upload
                v-if="!isBtnLoading"
                action=""
                :default-file-list="previewFileList"
                list-type="image-card"
                @preview="handlePreview"
                @remove="deleteImage"
                @before-upload="beforeUploadImage"
                :custom-request="uploadImage"
              >
              </n-upload>
              <n-space v-else :size="8">
                <n-skeleton height="90px" width="96px" />
                <n-skeleton height="90px" width="96px" />
              </n-space>
            </n-form-item>
            <n-space style="margin-top: -10px; margin-left: 3px;">
              <n-text style="font-size: 11px;">Format gambar harus png atau jpg. Max ukuran 2Mb</n-text>
            </n-space>
          </n-form>

        </n-space>
      </n-scrollbar>
      <n-space justify="center">
        <n-button
          :disabled="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="handleClose"
          >Batal</n-button
        >
        <n-button
          :loading="isBtnLoading"
          type="primary"
          class="button-tnt"
          @click="handleConfirm"
          >Konfirmasi</n-button
        >
      </n-space>
    </n-card>
  </n-modal>

  <n-modal
    v-model:show="showModalImage"
    preset="card"
    style="width: 600px"
    title=""
  >
    <img :src="previewImageUrl" style="width: 100%" />
  </n-modal>
</template>

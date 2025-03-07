<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst, UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'
import { auth } from "@/models/auth"
import { storageModel } from '@/models/storage'

const props = withDefaults(
  defineProps<{
    show: boolean
    value: any
    level: number
    selectedData: any
    title?: string
  }>(),
  {
    show: false,
    value: () => ({}),
    level: 1,
    selectedData: () => ([]),
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:value", value: any): void
  (e: "click:close", value: boolean): void
  (e: "click:confirm", value: boolean): void
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

watch(formValue, (value) => emit('update:value', value), { deep: true })

onMounted(() => {
  formValue.value = props.value
})

onUpdated(() => {
  formValue.value = props.value
})

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

async function handleValidateClick() {
  formValue.value.imageList = previewFileList.value
  await formRef.value?.validate().then(() => {
    emit('click:confirm', true)
    emit('update:value', formValue.value)
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}

function handleClose() {
  emit('click:close', false)
  formValue.value = {}
  previewFileList.value = []
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    title="Void"
    :bordered="false"
    style="width: 800px; max-width: 100%; border-radius: 10px"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="handleClose"
  >
    <n-scrollbar x-scrollable style="height: 500px;">
      <n-space vertical :size="14" style="padding-left: 10px; padding-right: 10px;">
        <n-space vertical :size="0">
          <n-text v-if="false">Lokasi Kode Level {{ props.level }} : <n-text>?</n-text></n-text>
          <n-text>Nama QA : 
            <n-text>{{ authData.xxtype == "ju5tU53r" ? authData.users.name : authData.user.name }}</n-text>
          </n-text>
        </n-space>
        <div class="table-tnt" style="margin-top: 0px;">
          <n-scrollbar x-scrollable>
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Level {{ props.level }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, i in props.selectedData" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.code }}</td>
                </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </div>
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
              placeholder="Masukkan Alasan"
            />
          </n-form-item>
          <n-form-item label="Upload Bukti" path="imageList">
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

    <n-space justify="center" size="large" style="padding-top: 20px;">
      <n-button
        :loading="isBtnLoading"
        color="#828282"
        class="button-tnt"
        style="padding: 1rem 2rem"
        @click="handleClose"
        >Batalkan</n-button
      >
      <n-button
        :loading="isBtnLoading"
        class="button-tnt"
        type="primary"
        style="padding: 1rem 2rem"
        @click.prevent="handleValidateClick"
        >Konfirmasi</n-button
      >
    </n-space>
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

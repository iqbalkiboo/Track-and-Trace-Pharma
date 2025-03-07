<script setup lang="ts">
import type { UploadFileInfo, NInput } from "naive-ui"
import { AddOutline } from "@vicons/ionicons5"
import { storageModel } from "@/models/storage"
import { useMessage } from "naive-ui"
withDefaults(
  defineProps<{
    show: boolean
    data: any
  }>(),
  { show: false }
)

const emits = defineEmits<{
  (e: "click:close", value: boolean): void
  (e: "handleChangeForm", value: any): void
  (e: "handleDeleteImage", value: string): void
}>()

const input = ref<typeof NInput | null>(null)
const tMessage = useMessage()
async function beforeUploadImage(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  const allowedTypes = ["image/png", "image/jpeg"]
  if (allowedTypes.indexOf(String(data.file.file?.type)) === -1) {
    tMessage.error("Format gambar harus png atau jpg, tolong upload ulang")
    return false
  }
  return true
}
function uploadImage(data: any) {
  const formImage = new FormData()
  formImage.append("file", data.file.file)
  formImage.append("source", "upload")
  formImage.append("title", data.file.name)
  formImage.append("caption", data.file.name)
  formImage.append("alt", data.file.name)

  storageModel
    .uploadStorage(formImage)
    .then((res: any) => {
      emits("handleChangeForm", { url: res.data.data.public_url })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function handleClick() {
  emits("click:close", true)
}
onUpdated(() => {
  input.value?.focus()
})
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 600px; max-width: 100%; border-radius: 8px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space
      vertical
      :size="24"
    >
      <n-h4 style="margin-bottom: 0">Update Status Diterima</n-h4>
      <n-form>
        <n-form-item label="Upload Bukti Delivered">
          <template v-if="data?.status_image_url">
            <n-space vertical>
              <n-image
                width="300"
                height="300"
                :src="data?.status_image_url"
              />
              <n-button
                size="small"
                type="primary"
                strong
                secondary
                @click="$emit('handleDeleteImage', 'status_image')"
                >hapus</n-button
              >
            </n-space>
          </template>
          <template v-else>
            <n-upload
              @before-upload="beforeUploadImage"
              :show-file-list="false"
              :custom-request="uploadImage"
            >
              <n-upload-dragger style="width: 100px">
                <n-icon
                  size="40"
                  style="opacity: 0.8"
                  :depth="3"
                >
                  <add-outline />
                </n-icon>
              </n-upload-dragger>
            </n-upload>
          </template>
        </n-form-item>
        <n-form-item label="Deskripsi">
          <n-input
            ref="input"
            type="textarea"
            placeholder=""
            :value="data.description"
            @input="$emit('handleChangeForm', { description: $event })"
          />
        </n-form-item>
      </n-form>
      <n-space justify="space-between">
        <n-button
          type="primary"
          @click="handleClick"
          >Submit</n-button
        >
      </n-space>
    </n-space>
  </n-modal>
</template>

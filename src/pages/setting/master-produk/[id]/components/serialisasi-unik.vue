<script setup lang="ts">
import { useMessage } from "naive-ui"
import type {
  FormInst,
  UploadFileInfo,
  UploadCustomRequestOptions,
} from "naive-ui"
import { storageModel } from "@/models/storage"
import TFeedback from "~/components/t-feedback.vue"

const route = useRoute()
const tMessage = useMessage()
const model = ref<any>({})
const isBtnLoading = ref(false)

const props = defineProps<{
  value?: any
}>()

onMounted(async () => {
  isBtnLoading.value = true
  model.value = props.value
  previewFileList.value = (await props.value.images_arr)
    ? props.value.images_arr
    : []
  isBtnLoading.value = false
})

const emit = defineEmits<{
  (e: 'hideForm', value: string): void
  (e: "click:save", value: any): void
}>()

const hideForm = () => {
  setTimeout(() => {
    emit("hideForm", model.value.packaging_method)
  }, 100)
}

const formRef = ref<FormInst | null>(null)
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: "Nama tipe kemasan tidak boleh kosong",
    trigger: "blur",
  },
  dimention_length: {
    type: "number",
    required: true,
    message: "Tidak boleh kosong",
    trigger: "blur",
  },
  dimention_wide: {
    type: "number",
    required: true,
    message: "Tidak boleh kosong",
    trigger: "blur",
  },
  dimention_height: {
    type: "number",
    required: true,
    message: "Tidak boleh kosong",
    trigger: "blur",
  },
  dimention_weight: {
    type: "number",
    required: true,
    message: "Tidak boleh kosong",
    trigger: "blur",
  },
}

const showModalImage = ref(false)
const previewImageUrl = ref("")
const previewFileList = ref<UploadFileInfo[]>([])
function handlePreview(file: UploadFileInfo) {
  const { url } = file
  previewImageUrl.value = url as string
  showModalImage.value = true
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate()
  model.value.images_arr = previewFileList.value
  model.value.images = []
  if (model.value.images_arr.length > 0) {
    model.value.images_arr.forEach((item: any) => {
      model.value.images.push(item.id)
    })
  } else {
    model.value.images = []
    model.value.images_arr = []
  }

  model.value.packaging_method = "unique"
  emit("click:save", model.value)
}

const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "#36A630",
  hideIcon: false,
  title: "Selamat",
  subtitle: "Tipe kemasan kolektif berhasil ditambahkan",
})
function handleHideFeedback() {
  tFeedbackRef.value.show = false
}

function deleteImage(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  previewFileList.value = previewFileList.value.filter(function (item) {
    return item.id !== data.file.id
  })
}

function beforeUploadImage(data: {
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

function calculateVolumes() {
  if (model.value.dimention_length && model.value.dimention_wide && model.value.dimention_height) {
    const volumeTemp = parseFloat(model.value.dimention_length) * parseFloat(model.value.dimention_wide) * parseFloat(model.value.dimention_height)
    model.value.dimention_volume = Math.round(volumeTemp * 1000) / 1000
  } else {
    model.value.dimention_volume = 0
  }
}

function uploadImage({ file, onFinish }: UploadCustomRequestOptions) {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("file", file.file as File)
  formData.append("source", "upload")
  formData.append("title", file.name)
  formData.append("caption", file.name)
  formData.append("alt", file.name)

  storageModel.uploadStorage(formData).then((response: any) => {
    if (response.data.status === 200) {
      previewFileList.value.push({
        id: response.data.data.id,
        name: response.data.data.title,
        status: "finished",
        url: response.data.data.public_url,
      })
      model.value.images_arr = previewFileList.value
      isBtnLoading.value = false
      onFinish()
    }
  })
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Unique Packaging</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          :to="`/setting/master-produk/${route.params.id}`"
          @click="hideForm"
          class="text-decoration-none"
        >
          Detail Produk
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>Unique Packaging</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="model"
        :rules="rules"
      >
        <n-space
          vertical
          :size="0"
        >
          <n-space
            vertical
            :size="0"
          >
            <n-form-item
              label="Nama Packaging"
              path="name"
            >
              <n-input
                v-model:value="model.name"
                placeholder="Example : Primary"
              />
            </n-form-item>
          </n-space>
          <n-space
            vertical
            :size="0"
          >
            <n-text
              style="
                font-weight: 500;
                display: block;
                padding-bottom: 6px;
                padding-left: 2px;
              "
              >Dimensi</n-text
            >
            <n-grid
              cols="5"
              item-responsive
              responsive="screen"
              x-gap="16"
              y-gap="0"
            >
              <n-grid-item span="5 m:1">
                <n-form-item
                  label="Panjang (cm)"
                  path="dimention_length"
                >
                  <n-input-number
                    v-model:value="model.dimention_length"
                    placeholder="0"
                    @input="calculateVolumes"
                    min="0"
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item span="5 m:1">
                <n-form-item
                  label="Lebar (cm)"
                  path="dimention_wide"
                >
                  <n-input-number
                    v-model:value="model.dimention_wide"
                    placeholder="0"
                    @input="calculateVolumes"
                    min="0"
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item span="5 m:1">
                <n-form-item
                  label="Tinggi (cm)"
                  path="dimention_height"
                >
                  <n-input-number
                    v-model:value="model.dimention_height"
                    placeholder="0"
                    @input="calculateVolumes"
                    min="0"
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item span="5 m:1">
                <n-form-item
                  label="Volume (cm3)"
                  path="dimention_volume"
                >
                  <n-input-number
                    v-model:value="model.dimention_volume"
                    placeholder="0"
                    min="0"
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item span="5 m:1">
                <n-form-item
                  label="Berat (gram)"
                  path="dimention_weight"
                >
                  <n-input-number
                    v-model:value="model.dimention_weight"
                    placeholder="0"
                    min="0"
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>
          </n-space>
          <n-space
            vertical
            :size="0"
          >
            <n-text
              style="font-weight: 500; display: block; padding-bottom: 6px; padding-left: 2px;"
              >Upload Photo</n-text
            >
            <n-upload
              v-if="!isBtnLoading"
              action=""
              :default-file-list="previewFileList"
              list-type="image-card"
              @preview="handlePreview"
              @remove="deleteImage"
              @before-upload="beforeUploadImage"
              :custom-request="uploadImage"
            />
            <n-space
              v-else
              :size="8"
            >
              <n-skeleton
                height="90px"
                width="96px"
              />
              <n-skeleton
                height="90px"
                width="96px"
              />
            </n-space>
          </n-space>
          <n-space
            vertical
            :size="0"
            style="margin-top: 24px"
          >
            <n-form-item
              :label="`Jumlah Maksimum Qty Level ${model.level}`"
              path="pMaxQty"
            >
              <n-input-number
                :disabled="model.level == 1"
                v-model:value="model.maximum"
                placeholder="Masukkan jumlah maksimum"
                min="0"
              />
            </n-form-item>
          </n-space>
        </n-space>
      </n-form>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideForm"
        >
          Batalkan
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#219653"
          class="button-tnt"
          @click="handleValidateClick"
        >
          Submit
        </n-button>
      </div>
    </div>
  </div>

  <n-modal
    v-model:show="showModalImage"
    preset="card"
    style="width: 600px"
    title=""
  >
    <img
      :src="previewImageUrl"
      style="width: 100%"
    />
  </n-modal>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <n-button
        :loading="isBtnLoading"
        color="#828282"
        class="button-tnt"
        @click="hideForm"
      >
        Kembali ke Beranda
      </n-button>
      <n-button
        :loading="isBtnLoading"
        color="#219653"
        class="button-tnt"
        @click.prevent="handleHideFeedback"
      >
        Tambah Lainnya
      </n-button>
    </n-space>
  </t-feedback>
</template>

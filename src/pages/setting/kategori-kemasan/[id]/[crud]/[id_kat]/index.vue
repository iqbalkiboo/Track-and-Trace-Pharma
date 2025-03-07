<script setup lang="ts">
import { CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import type { FormInst, FormItemRule, UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { masterPackagingCollectifModel } from '@/models/setting/master-kemasan-kolektif'
import { masterPackagingCategoryCollectifModel } from '@/models/setting/master-kemasan-kategori-kolektif'
import { storageModel } from '@/models/storage'

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const crudType = ref('')
const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailRes = ref<any>({})
const formValue = ref<any>({
  selling_packaging_id: '',
  name: '',
  dimention_long: 0,
  dimention_wide: 0,
  dimention_height: 0,
  dimention_weight: 0,
  dimention_volume: 0,
  image_ids: []
})
const formRef = ref<FormInst>()
const rules = ref()
const permissionModal = ref<any>({
  show: false
})

onMounted(() => {
  authData.value = auth.getAuth()
  if (route.params.crud == 'create') {
    crudType.value = 'create'
    if (filters.isGranted(constants.accessSettings.settingKemasanKolektif + ".create")) {
      getDetailKemasan()
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = 'update'
    if (filters.isGranted(constants.accessSettings.settingKemasanKolektif + ".edit")) {
      getDetailKemasan()
      getData()
    } else {
      permissionModal.value.show = true
    }
  }
})

function hidePermissionModal() {
  permissionModal.value.show = false
}

// FUNCTION FOR REQUEST API
async function getData() {
  if (crudType.value == 'update') {
    isLoading.value = true
    await masterPackagingCategoryCollectifModel.getDetailPackagingCategoryCollectif(route.params.id_kat).then((res) => {
      setFormValue(res.data)
      isLoading.value = false
    }).catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  }
}

async function getDetailKemasan() {
  isLoading.value = true
  
  await masterPackagingCollectifModel.getDetailPackagingCollectif(route.params.id).then((res) => {
    detailRes.value = res.data
    isLoading.value = false
    tFeedbackRef.value.show = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function calculateVolumes() {
  if (formValue.value.dimention_long && formValue.value.dimention_wide && formValue.value.dimention_height) {
    const volumeTemp = parseFloat(formValue.value.dimention_long) * parseFloat(formValue.value.dimention_wide) * parseFloat(formValue.value.dimention_height)
    formValue.value.dimention_volume = Math.round(volumeTemp * 1000) / 1000
  } else {
    formValue.value.dimention_volume = 0
  }
}

function onProcessSubmitData() {
  isLoading.value = true
  isBtnLoading.value = true

  let holding_id = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    holding_id = authData.value["xx-usertype-access"].holding_id
  } else {
    holding_id = authData.value.users.user_type.id
  }

  previewFileList.value.forEach((item: any) => {
    formValue.value.image_ids.push(item.id)
  })

  const formData = {
    selling_packaging_id: route.params.id,
    holding_id: holding_id,
    name: formValue.value.name,
    dimention: {
      long : Number(formValue.value.dimention_long),
      wide : Number(formValue.value.dimention_wide),
      height : Number(formValue.value.dimention_height),
      weight : Number(formValue.value.dimention_weight),
      volume : Number(formValue.value.dimention_volume)
    },
    image_ids: formValue.value.image_ids
  }

  if (crudType.value == 'create') {
    masterPackagingCategoryCollectifModel.createPackagingCategoryCollectif(formData)
    .then(() => {
      isLoading.value = false
      isBtnLoading.value = false
      resetFormValue()
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    }).catch((err: any) => {
      const data = err.response.data
      isLoading.value = false
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showFailedFeedback(data)
      }, 300)
    })
  } else {
    const id = route.params.id_kat
    masterPackagingCategoryCollectifModel.updatePackagingCategoryCollectif(id, formData)
    .then(() => {
      isLoading.value = false
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    }).catch((err: any) => {
      const data = err.response.data
      isLoading.value = false
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showFailedFeedback(data)
      }, 300)
    })
  }
}

// FUNCTION FOR REQUEST API END

// FUNCTION HANDLE FORM

function setFormValue(data: any) {
  formValue.value = {
    name: data.name,
    dimention_long: String(data.dimention.long),
    dimention_wide: String(data.dimention.wide),
    dimention_height: String(data.dimention.height),
    dimention_weight: String(data.dimention.weight),
    dimention_volume: String(data.dimention.volume),
    image_ids: []
  }

  data.images.forEach((item: any) => {
    previewFileList.value.push({
      id: item.id,
      name: item.type,
      url: item.url,
      status: "finished"
    })
  })
}

function resetFormValue() {
  previewFileList.value = []
  formValue.value = {
    selling_packaging_id: '',
    name: '',
    dimention_long: 0,
    dimention_wide: 0,
    dimention_height: 0,
    dimention_weight: 0,
    dimention_volume: 0,
    image_ids: []
  }
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate()
  showConfirmFeedback()
}

const tFeedbackRef = ref({
  type: '',
  show: ref(false),
  icon: shallowRef(),
  iconColor:  '#36A630',
  hideIcon: false,
  title: 'Selamat',
  subtitle: 'Tipe kemasan kolektif berhasil ditambahkan'
})
function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  if (crudType.value == 'create') {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menambah tipe kemasan?'
  }else {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk mengubah tipe kemasan?'
  }
  tFeedbackRef.value.show = true
}

function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = 'failed'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#EB5757',
  tFeedbackRef.value.icon = AlertCircleOutline
  tFeedbackRef.value.title = 'Gagal'
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  if (crudType.value == 'create') {
    tFeedbackRef.value.title = 'Berhasil Tambah Data'
    tFeedbackRef.value.subtitle = 'Data tipe kemasan berhasil ditambahkan'
  }else {
    tFeedbackRef.value.title = 'Berhasil Ubah Data'
    tFeedbackRef.value.subtitle = 'Data tipe kemasan berhasil diubah'
  }
  tFeedbackRef.value.show = true
}

// FUNCTION HANDLE FORM

const showModalImage = ref(false)
const previewImageUrl = ref('')
const previewFileList = ref<UploadFileInfo[]>([])

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

rules.value = {
  name: {
    required: true,
    message: 'Nama tipe kemasan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  dimention_long: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex = /,/
      if (!value) {
        return new Error('Panjang tidak boleh kosong')
      } else if (regex.test(value)) {
        return new Error('Tidak boleh menggunakan koma')
      } else if (value === '0') {
        return new Error('Panjang harus lebih dari 0')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  dimention_wide: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex = /,/
      if (!value) {
        return new Error('Lebar tidak boleh kosong')
      } else if (regex.test(value)) {
        return new Error('Tidak boleh menggunakan koma')
      } else if (value === '0') {
        return new Error('Lebar harus lebih dari 0')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  dimention_height: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex = /,/
      if (!value) {
        return new Error('Tinggi tidak boleh kosong')
      } else if (regex.test(value)) {
        return new Error('Tidak boleh menggunakan koma')
      } else if (value === '0') {
        return new Error('Tinggi harus lebih dari 0')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  dimention_weight: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex = /,/
      if (!value) {
        return new Error('Berat tidak boleh kosong')
      } else if (regex.test(value)) {
        return new Error('Tidak boleh menggunakan koma')
      } else if (value === '0') {
        return new Error('Berat harus lebih dari 0')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  dimention_volume: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex = /,/
      if (!value) {
        return new Error('Volume tidak boleh kosong')
      } else if (regex.test(value)) {
        return new Error('Tidak boleh menggunakan koma')
      } else if (value === '0') {
        return new Error('Volume harus lebih dari 0')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">{{ crudType === 'create' ? 'Tambah' : 'Edit' }} Tipe Kemasan Kolektif</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/kategori-kemasan" class="text-decoration-none">
          Kategori Kemasan
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link :to="`/setting/kategori-kemasan/${route.params.id}`" class="text-decoration-none">
          {{ detailRes.name }}
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>{{ crudType === 'create' ? 'Tambah' : 'Edit' }} Tipe Kemasan Kolektif</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-form
          ref="formRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-space vertical :size="0">
            <n-space vertical :size="0">
              <n-form-item label="Nama Kemasan" path="name">
                <n-input
                  v-model:value="formValue.name"
                  placeholder="Masukkan Nama Kemasan"
                />
              </n-form-item>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="font-weight: 500; display: block; padding-bottom: 6px; padding-left: 2px;">Dimensi</n-text>
              <n-grid
                cols="5"
                item-responsive
                responsive="screen"
                x-gap="16"
                y-gap="16"
              >
                <n-grid-item span="5 m:1">
                  <n-form-item label="Panjang (cm)" path="dimention_long">
                    <n-input
                      v-model:value="formValue.dimention_long"
                      placeholder="0"
                      @input="calculateVolumes"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="5 m:1">
                  <n-form-item label="Lebar (cm)" path="dimention_wide">
                    <n-input
                      v-model:value="formValue.dimention_wide"
                      placeholder="0"
                      @input="calculateVolumes"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="5 m:1">
                  <n-form-item label="Tinggi (cm)" path="dimention_height">
                    <n-input
                      v-model:value="formValue.dimention_height"
                      placeholder="0"
                      @input="calculateVolumes"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="5 m:1">
                  <n-form-item label="Volume (cm³)" path="dimention_volume">
                    <n-input
                      v-model:value="formValue.dimention_volume"
                      placeholder="0"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="5 m:1">
                  <n-form-item label="Berat (gram)" path="dimention_weight">
                    <n-input
                      v-model:value="formValue.dimention_weight"
                      placeholder="0"
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="font-weight: 500; display: block; padding-bottom: 6px; padding-left: 2px;">Upload Photo</n-text>
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
              <n-space style="margin-top: 5px; margin-left: 3px;">
                <n-text style="font-size: 11px;">Format gambar harus png atau jpg. Max ukuran 2Mb</n-text>
              </n-space>
            </n-space>
          </n-space>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="`/setting/kategori-kemasan/${route.params.id}`" class="text-decoration-none">
          <n-button :loading="isBtnLoading" color="#828282" class="button-tnt"> Kembali </n-button>
        </router-link>
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.edit')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
      </div>
    </div>
  </div>

  <n-modal
    v-model:show="showModalImage"
    preset="card"
    style="width: 600px"
    title=""
  >
    <img :src="previewImageUrl" style="width: 100%" />
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
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="onProcessSubmitData">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button v-if="crudType == 'create'" color="#828282" class="button-tnt" @click="hideFeedback">
          Tambah Lainya
        </n-button>
        <router-link
          :to="`/setting/kategori-kemasan/${route.params.id}`"
          class="text-decoration-none"
        >
          <n-button color="#219653" class="button-tnt">
            Kembali ke Beranda
          </n-button>
        </router-link>
      </template>
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-permission-modal
    v-model:show="permissionModal.show"
    @click:close="hidePermissionModal"
  />

</template>

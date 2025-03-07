<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst, FormItemRule, UploadFileInfo } from 'naive-ui'
import { CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import constants from "@/helpers/constant"
import { optionModel } from '@/models/option'
import { storageModel } from '@/models/storage'
import { masterCompanyModel } from '@/models/setting/master-perusahaan'

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const provinceOptions = ref<any>([])
const districtOptions = ref<any>([])
const subDistrictOptions = ref<any>([])
const urbanVillageOptions = ref<any>([])
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({ image: { id: '', url: '' } })
const rules = ref()
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor:  '',
  hideIcon: false,
  title: '',
  subtitle: '',
  type: '',
})
const permissionModal = ref<any>({
  show: false
})

onMounted(() => {
  if (filters.isGranted(constants.accessSettings.settingCabangPlan + ".Detail")) {
    getData()
  } else {
    permissionModal.value.show = true
  }
})

function hidePermissionModal() {
  permissionModal.value.show = false
}

async function getData() {
  isLoading.value = true
  const id = route.params.id
  await getProvinces()
  await getDistricts()
  await getSubDistricts()
  await getUrbanVillages()
  await masterCompanyModel.getDetailCompany(id).then((res) => {
    setFormValue(res.data)
    isLoading.value = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getProvinces() {
  formValue.value.province = null
  const params = {
    limit: 1000
  }
  await optionModel.getProvinces(params).then((res) => {
    provinceOptions.value = []
    const listProvinces = res.data.list
    listProvinces.forEach((el: any) => {
      provinceOptions.value.push({
        label: el.name,
        value: el.id
      })
    })
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getDistricts() {
  formValue.value.district = null
  const params = {
    limit: 1000,
    province_id: formValue.value.province,
  }
  await optionModel.getDistricts(params).then((res) => {
    districtOptions.value = []
    const listDistrics = res.data.list
    listDistrics.forEach((el: any) => {
      districtOptions.value.push({
        label: el.name,
        value: el.id
      })
    })
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getSubDistricts() {
  formValue.value.subDistrict = null
  const params = {
    limit: 1000,
    district_id: formValue.value.district,
  }
  await optionModel.getSubDistricts(params).then((res) => {
    subDistrictOptions.value = []
    const listSubDistricts = res.data.list
    listSubDistricts.forEach((el: any) => {
      subDistrictOptions.value.push({
        label: el.name,
        value: el.id
      })
    })
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getUrbanVillages() {
  formValue.value.urbanVillage = null
  const params = {
    limit: 1000,
    sub_district_id: formValue.value.subDistrict,
  }
  await optionModel.getUrbanVillages(params).then((res) => {
    urbanVillageOptions.value = []
    const listUrbanVillages = res.data.list
    listUrbanVillages.forEach((el: any) => {
      urbanVillageOptions.value.push({
        label: el.name,
        value: el.id
      })
    })
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function beforeUploadImage(data: {
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

function uploadImage(data: any) {
  isBtnLoading.value = true

  const formImage = new FormData()
  formImage.append("file", data.file.file)
  formImage.append("source", "upload")
  formImage.append("title", data.file.name)
  formImage.append("caption", data.file.name)
  formImage.append("alt", data.file.name)

  storageModel.uploadStorage(formImage).then((res: any) => {
    formValue.value.image.id = res.data.data.id
    formValue.value.image.url = res.data.data.public_url
    isBtnLoading.value = false
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
    isBtnLoading.value = false
  })
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate().then(() => {
    showConfirmFeedback()
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}

function updateCompany() {
  isBtnLoading.value = true

  const formData = {
    name: formValue.value.name,
    address: {
      detail: formValue.value.address,
      // province_id: formValue.value.province,
      // district_id: formValue.value.district,
      // sub_district_id: formValue.value.subDistrict,
      // urban_village_id: formValue.value.urbanVillage,
    },
    latitude: parseFloat(formValue.value.latitude),
    longitude: parseFloat(formValue.value.longitude),
    erp_code: formValue.value.erpCode,
    pbf_permisson_number: parseInt(formValue.value.pbfNumber),
    pak_permisson_number: parseInt(formValue.value.pakNumber),
    image_id: formValue.value.image.id,
    setting : {
        under_maintenance : false
    }
  }

  const id = route.params.id
  masterCompanyModel.updateCompany(id, formData).then(() => {
    isBtnLoading.value = false
    hideFeedback()
    setTimeout(() => {
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
    hideFeedback()
    setTimeout(() => {
      showFailedFeedback(data)
    }, 300)
  })
}

function setFormValue(data: any) {
  formValue.value = {
    name: data.name,
    province: data.address.province.id,
    district: data.address.district.id,
    subDistrict: data.address.sub_district.id,
    urbanVillage: data.address.urban_village.id,
    address: data.address.detail,
    longitude: String(data.location.coordinates[1]),
    latitude: String(data.location.coordinates[0]),
    erpCode: data.erp_code,
    serializationPrefiks: data.prefix,
    pbfNumber: String(data.pbf_permission_numer),
    pakNumber: String(data.pak_permission_numer),
    image: {
      id: data.image.id,
      url: data.image.url,
    },
  }
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk mengedit data perusahaan?'
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.title = 'Berhasil Edit Data'
  tFeedbackRef.value.subtitle = 'Data perusahaan berhasil diedit'
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

rules.value = {
  name: {
    required: true,
    message: 'Nama perusahaan tidak boleh kosong',
    trigger: 'blur',
  },
  province: {
    required: true,
    message: 'Provinsi tidak boleh kosong',
    trigger: 'blur',
  },
  district: {
    required: true,
    message: 'Kota/Kabupaten tidak boleh kosong',
    trigger: 'blur',
  },
  subDistrict: {
    required: true,
    message: 'Kecamatan tidak boleh kosong',
    trigger: 'blur',
  },
  urbanVillage: {
    required: true,
    message: 'Kelurahan tidak boleh kosong',
    trigger: 'blur',
  },
  address: {
    required: true,
    message: 'Keterangan alamat tidak boleh kosong',
    trigger: 'blur',
  },
  longitude: {
    required: true,
    validator(_rule:FormItemRule, value:string) {
      if(!value) {
        return new Error('Longitude tidak boleh kosong')
      }
      if (value.includes(',')) {
        return new Error('Longitude tidak boleh menggunakan tanda koma')
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error('Longitude harus angka atau tidak valid')
      }
    },
    trigger: ['input', 'blur'],
  },
  latitude: {
    required: true,
    validator(_rule:FormItemRule, value:string) {
      if(!value) {
        return new Error('Latitude tidak boleh kosong')
      }
      if (value.includes(',')) {
        return new Error('Latitude tidak boleh menggunakan tanda koma')
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error('Latitude harus angka atau tidak valid')
      }
    },
    trigger: ['input', 'blur'],
  },
  erpCode: {
    required: true,
    message: 'Kode ERP tidak boleh kosong',
    trigger: 'blur',
  },
  serializationPrefiks: {
    required: true,
    message: 'Prefiks serialisasi tidak boleh kosong',
    trigger: 'blur',
  },
  pbfNumber: {
    required: true,
    message: 'Nomor izin PBF tidak boleh kosong',
    trigger: 'blur',
  },
  pakNumber: {
    required: true,
    message: 'Nomor izin PAK tidak boleh kosong',
    trigger: 'blur',
  },
  imageUrl: {
    required: false,
  },
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Edit Info Perusahaan</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/master-perusahaan" class="text-decoration-none">
          Master Perusahaan
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>Edit Info Perusahaan</n-breadcrumb-item>
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
          <n-form-item label="Nama Perusahaan" path="name">
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan nama perusahaan"
            />
          </n-form-item>
          <div class="divider-horizontal-tnt" style="border-color: #DFDFDF; margin-top: 5px"></div>
          <n-text style="display: block; font-weight: 500; margin: 10px 0 15px 0">Alamat Perusahaan</n-text>
          <n-form-item label="Provinsi" path="province" v-if="false">
            <n-select
              v-model:value="formValue.province"
              :options="provinceOptions"
              filterable
              placeholder="Pilih provinsi"
              @update:value="getDistricts"
            />
          </n-form-item>
          <n-form-item label="Kota/Kabupaten" path="city" v-if="false">
            <n-select
              v-model:value="formValue.district"
              :options="districtOptions"
              filterable
              placeholder="Pilih kota/kabupaten"
              @update:value="getSubDistricts"
            />
          </n-form-item>
          <n-form-item label="Kecamatan" path="districts" v-if="false">
            <n-select
              v-model:value="formValue.subDistrict"
              :options="subDistrictOptions"
              filterable
              placeholder="Pilih kecamatan"
              @update:value="getUrbanVillages"
            />
          </n-form-item>
          <n-form-item label="Kelurahan" path="ward" v-if="false">
            <n-select
              v-model:value="formValue.urbanVillage"
              :options="urbanVillageOptions"
              filterable
              placeholder="Pilih kelurahan"
            />
          </n-form-item>
          <n-form-item label="Keterangan Alamat (Nama jalan dan No. Bangunan)" path="address">
            <n-input
              v-model:value="formValue.address"
              placeholder="Masukkan keterangan alamat"
            />
          </n-form-item>
          <n-form-item label="Longitude" path="longitude">
            <n-input
              v-model:value="formValue.longitude"
              placeholder="Masukkan longitude"
            />
          </n-form-item>
          <n-form-item label="Latitude" path="latitude">
            <n-input
              v-model:value="formValue.latitude"
              placeholder="Masukkan latitude"
            />
          </n-form-item>
          <n-form-item label="Kode ERP" path="erpCode">
            <n-input
              v-model:value="formValue.erpCode"
              placeholder="Masukkan kode ERP"
            />
          </n-form-item>
          <n-form-item label="Prefiks Serialisasi" path="serializationPrefiks">
            <n-input
              v-model:value="formValue.serializationPrefiks"
              placeholder="Masukkan prefiks serialisasi"
            />
          </n-form-item>
          <n-form-item label="Nomor Izin PBF" path="pbfNumber">
            <n-input
              v-model:value="formValue.pbfNumber"
              placeholder="Masukkan nomor izin PBF"
            />
          </n-form-item>
          <n-form-item label="Nomor Izin PAK" path="pakNumber">
            <n-input
              v-model:value="formValue.pakNumber"
              placeholder="Masukkan nomor izin PAK"
            />
          </n-form-item>
          <n-form-item label="Ubah Logo" path="imageUrl">
            <n-upload
              action=""
              @before-upload="beforeUploadImage"
              :show-file-list="false"
              :custom-request="uploadImage"
            >
              <n-button :loading="isBtnLoading" color="#219653" class="button-tnt">
                Ubah Logo
              </n-button>
            </n-upload>
          </n-form-item>
          <n-image
            v-if="!isBtnLoading"
            width="110"
            :src="formValue.image.url"
            style="margin-top: 10px; border-radius: 12px;"
          />
          <n-space v-else :size="8">
            <n-skeleton height="90px" width="96px" />
          </n-space>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link to="/setting/master-perusahaan" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">
            Kembali
          </n-button>
        </router-link>
        <template v-if="$filters.isGranted(constants.accessSettings.settingCabangPlan + '.Detail')">
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
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="updateCompany">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <router-link
          :to="{ name: 'setting-master-perusahaan' }"
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

<script setup lang="ts">
import type {
  FormInst,
  FormItemRule,
  UploadCustomRequestOptions,
  UploadFileInfo,
} from "naive-ui"
import { useMessage } from "naive-ui"
import { AlertCircleOutline, CheckmarkCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { optionModel } from "@/models/option"
import { masterCompanyModel } from "@/models/setting/master-company"
import { storageModel } from "@/models/storage"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const crudType = ref("")

const districtsOptions = ref<any>([])
const subdistrictsOptions = ref<any>([])
const provinceOptions = ref<any>([])
const urbanVillagesOptions = ref<any>([])
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})
const formValue = ref<any>({
  image: {
    id: "",
    url: "",
  },
  setting: {
    under_maintenance: false,
  },
})
const kindOptions = [
  { label: "Manufacture", value: "manufacture" },
  { label: "Distributor", value: "distribution" },
]
const formRef = ref<FormInst>()
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: "Nama Perusahaan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  kind: {
    required: true,
    message: "Kind tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  province_id: {
    required: true,
    message: "Provinsi tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  district_id: {
    required: true,
    message: "Kota/Kabupaten tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  sub_district_id: {
    required: true,
    message: "Kecamatan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  urban_village_id: {
    required: true,
    message: "Kelurahan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  address: {
    required: true,
    message: "Keterangan alamat tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  longitude: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Longitude tidak boleh kosong")
      }
      if (value.includes(",")) {
        return new Error("Longitude tidak boleh menggunakan tanda koma")
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error("Longitude harus angka atau tidak valid")
      }
    },
    trigger: ["input", "blur"],
  },
  latitude: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Latitude tidak boleh kosong")
      }
      if (value.includes(",")) {
        return new Error("Latitude tidak boleh menggunakan tanda koma")
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error("Latitude harus angka atau tidak valid")
      }
    },
    trigger: ["input", "blur"],
  },
  erp_code: {
    required: true,
    message: "Kode ERP tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}

const permissionModal = ref<any>({
  show: false,
})

onMounted(() => {
  authData.value = auth.getAuth()
  if (route.params.crud == "create") {
    crudType.value = "create"
    if (filters.isGranted(constants.accessSettings.settingPerusahaan + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = "update"
    if (filters.isGranted(constants.accessSettings.settingPerusahaan + ".update")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  }
})

function hidePermissionModal() {
  permissionModal.value.show = false
}

async function getData() {
  if (crudType.value == "update") {
    isLoading.value = true
    const id = route.params.id
    await masterCompanyModel
      .getDetailCompany(id)
      .then(async (res) => {
        setFormValue(res.data)
        await getProvinces()
        await getDistricts()
        await getSubDistricts()
        await getUrbanVillages()
        isLoading.value = false
      })
      .catch((err: any) => {
        isLoading.value = false
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else {
    getProvinces()
  }
}

async function getProvinces() {
  const params = {
    limit: 1000,
  }
  await optionModel
    .getProvinces(params)
    .then((res) => {
      provinceOptions.value = []
      const listProvinces = res.data.list
      listProvinces.forEach((el: any) => {
        provinceOptions.value.push({
          label: el.name,
          value: el.id,
        })
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDistricts(reset = false) {
  if (reset)
    formValue.value.district_id = null
  const params = {
    limit: 1000,
    province_id: formValue.value.province_id,
  }
  await optionModel
    .getDistricts(params)
    .then((res) => {
      districtsOptions.value = []
      const listDistrics = res.data.list
      listDistrics.forEach((el: any) => {
        districtsOptions.value.push({
          label: el.name,
          value: el.id,
        })
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getSubDistricts(reset = false) {
  if (reset)
    formValue.value.sub_district_id = null
  const params = {
    limit: 1000,
    district_id: formValue.value.district_id,
  }
  await optionModel
    .getSubDistricts(params)
    .then((res) => {
      subdistrictsOptions.value = []
      const listSubDistricts = res.data.list
      listSubDistricts.forEach((el: any) => {
        subdistrictsOptions.value.push({
          label: el.name,
          value: el.id,
        })
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getUrbanVillages(reset = false) {
  if (reset)
    formValue.value.urban_village_id = null
  const params = {
    limit: 1000,
    sub_district_id: formValue.value.sub_district_id,
  }
  await optionModel
    .getUrbanVillages(params)
    .then((res) => {
      urbanVillagesOptions.value = []
      const listUrbanVillages = res.data.list
      listUrbanVillages.forEach((el: any) => {
        urbanVillagesOptions.value.push({
          label: el.name,
          value: el.id,
        })
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function onProcessSubmitData() {
  isBtnLoading.value = true

  const formData = {
    name: formValue.value.name,
    address: {
      province_id: formValue.value.province_id,
      district_id: formValue.value.district_id,
      sub_district_id: formValue.value.sub_district_id,
      urban_village_id: formValue.value.urban_village_id,
      detail: formValue.value.address,
    },
    latitude: parseInt(formValue.value.latitude),
    longitude: parseInt(formValue.value.longitude),
    erp_code: formValue.value.erp_code,
    pbf_permisson_number: formValue.value.pbf_permisson_numer,
    pak_permisson_number: formValue.value.pak_permisson_numer,
    nie_alert: formValue.value.nie_alert,
    kind: formValue.value.kind,
    image_id: formValue.value.image.id,
    setting: {
      under_maintenance: formValue.value.setting.under_maintenance,
    },
  }

  if (crudType.value == "create") {
    masterCompanyModel
      .createCompany(formData)
      .then(() => {
        isBtnLoading.value = false
        resetFormValue()
        hideFeedback()
        setTimeout(() => {
          showSuccessFeedback()
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showFailedFeedback(data)
        }, 300)
      })
  } else {
    const id = route.params.id
    masterCompanyModel
      .updateCompany(id, formData)
      .then(() => {
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showSuccessFeedback()
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showFailedFeedback(data)
        }, 300)
      })
  }
}

function setFormValue(data: any) {
  formValue.value = {
    name: data.name,
    province_id: data.address.province.id,
    district_id: data.address.district.id,
    sub_district_id: data.address.sub_district.id,
    urban_village_id: data.address.urban_village.id,
    address: data.address.detail,
    latitude: String(data.location.coordinates.at(0)),
    longitude: String(data.location.coordinates.at(1)),
    erp_code: data.erp_code,
    pbf_permisson_numer: data.pbf_permission_numer,
    pak_permisson_numer: data.pak_permission_numer,
    nie_alert: data.nie_alert,
    image: {
      id: data.image.id,
      url: data.image.url,
    },
    kind: data.kind,
    setting: {
      under_maintenance: data.setting.under_maintenance,
    },
  }
}

function resetFormValue() {
  formValue.value = {
    name: "",
    province_id: null,
    district_id: null,
    sub_district_id: null,
    urban_village_id: null,
    address: "",
    longitude: "",
    latitude: "",
    erp_code: "",
    pbf_permisson_number: null,
    pak_permisson_number: null,
    nie_alert: null, 
    image: {
      id: "",
      url: "",
    },
    kind: "",
  }
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  if (crudType.value == "create") {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk menambah data company?"
  } else {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk mengubah data company?"
  }
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  if (crudType.value == "create") {
    tFeedbackRef.value.title = "Berhasil Tambah Data"
    tFeedbackRef.value.subtitle = "Data company berhasil ditambahkan"
  } else {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = "Data company berhasil diubah"
  }
  tFeedbackRef.value.show = true
}

function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = "failed"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#EB5757"),
    (tFeedbackRef.value.icon = AlertCircleOutline)
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value
    ?.validate()
    .then(() => {
      showConfirmFeedback()
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

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

function uploadImage({ file, onFinish }: UploadCustomRequestOptions) {
  isBtnLoading.value = true

  const formImage = new FormData()
  formImage.append("file", file.file as File)
  formImage.append("source", "upload")
  formImage.append("title", file.name)
  formImage.append("caption", file.name)
  formImage.append("alt", file.name)

  storageModel
    .uploadStorage(formImage)
    .then((res: any) => {
      formValue.value.image.id = res.data.data?.id
      formValue.value.image.url = res.data.data?.public_url
      isBtnLoading.value = false
      onFinish()
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
      onFinish()
    })
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == "create" ? "Tambah Perusahaan" : "Edit Perusahaan" }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/master-company"
          class="text-decoration-none"
        >
          Master Perusahaan
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == "create" ? "Tambah Perusahaan" : "Edit Perusahaan" }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          :show-require-mark="false"
          class="form-tnt"
        >
          <n-form-item
            path="name"
            label="Nama Perusahaan"
          >
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama Perusahaan"
            />
          </n-form-item>
          <n-form-item
            path="kind"
            label="Kelompok Perusahaan"
          >
            <n-select
              v-model:value="formValue.kind"
              :options="kindOptions"
              placeholder="Masukkan Kelompok Perusahaan"
            />
          </n-form-item>
          <n-form-item
            label="Provinsi"
            path="province_id"
          >
            <n-select
              v-model:value="formValue.province_id"
              :options="provinceOptions"
              filterable
              placeholder="Pilih provinsi"
              @update:value="getDistricts(true)"
            />
          </n-form-item>
          <n-form-item
            label="Kota/Kabupaten"
            path="district_id"
          >
            <n-select
              v-model:value="formValue.district_id"
              :options="districtsOptions"
              filterable
              placeholder="Pilih kota/kabupaten"
              @update:value="getSubDistricts(true)"
            />
          </n-form-item>
          <n-form-item
            label="Kecamatan"
            path="sub_district_id"
          >
            <n-select
              v-model:value="formValue.sub_district_id"
              :options="subdistrictsOptions"
              filterable
              placeholder="Pilih kecamatan"
              @update:value="getUrbanVillages(true)"
            />
          </n-form-item>
          <n-form-item
            label="Kelurahan"
            path="urban_village_id"
          >
            <n-select
              v-model:value="formValue.urban_village_id"
              :options="urbanVillagesOptions"
              filterable
              placeholder="Pilih kecamatan"
            />
          </n-form-item>
          <n-form-item
            label="Keterangan Alamat (Nama jalan dan No. Bangunan)"
            path="address"
          >
            <n-input
              v-model:value="formValue.address"
              placeholder="Masukkan keterangan alamat"
            />
          </n-form-item>
          <n-form-item
            label="Longitude"
            path="longitude"
          >
            <n-input
              v-model:value="formValue.longitude"
              placeholder="Masukkan longitude"
            />
          </n-form-item>
          <n-form-item
            label="Latitude"
            path="latitude"
          >
            <n-input
              v-model:value="formValue.latitude"
              placeholder="Masukkan latitude"
            />
          </n-form-item>
          <n-form-item
            path="erp_code"
            label="Kode ERP"
          >
            <n-input
              v-model:value="formValue.erp_code"
              placeholder="Masukkan Kode ERP"
            />
          </n-form-item>
          <n-form-item
            path="pbf_permisson_numer"
            label="PBF Permisson Numer"
          >
            <n-input-number
              style="width: 100%"
              v-model:value="formValue.pbf_permisson_numer"
              placeholder="Masukkan PBF Permisson Numer"
            />
          </n-form-item>
          <n-form-item
            path="pak_permisson_numer"
            label="PAK Permisson Numer"
          >
            <n-input-number
              style="width: 100%"
              v-model:value="formValue.pak_permisson_numer"
              placeholder="Masukkan PAK Permisson Numer"
            />
          </n-form-item>
          <n-form-item
            path="nie_alert"
            label="Notifikasi NIE (Bulan)"
          >
            <n-input-number
              style="width: 100%"
              v-model:value="formValue.nie_alert"
              placeholder="Masukkan Notifikasi NIE"
            />
          </n-form-item>
          <n-form-item label="Setting">
            <n-form-item label="Under Maintenance">
              <n-switch v-model:value="formValue.setting.under_maintenance" />
            </n-form-item>
          </n-form-item>
          <n-form-item
            label="Upload Logo"
            :show-feedback="false"
          >
            <n-upload
              action=""
              @before-upload="beforeUploadImage"
              :show-file-list="false"
              :custom-request="uploadImage"
            >
              <n-button
                :loading="isBtnLoading"
                color="#219653"
                class="button-tnt"
              >
                {{ crudType == "create" ? "Upload Logo" : "Ubah Logo" }}
              </n-button>
            </n-upload>
          </n-form-item>
          <n-image
            v-if="!isBtnLoading"
            width="110"
            :src="formValue.image.url"
            style="margin-top: 10px; border-radius: 12px"
          />
          <n-space
            v-else
            :size="8"
          >
            <n-skeleton
              height="90px"
              width="96px"
            />
          </n-space>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-master-company' }"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            >Kembali
          </n-button>
        </router-link>
        <template
          v-if="
            crudType === 'create' &&
            $filters.isGranted(constants.accessSettings.settingPerusahaan + '.create')
          "
        >
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template
          v-if="
            crudType === 'update' &&
            $filters.isGranted(constants.accessSettings.settingPerusahaan + '.update')
          "
        >
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
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#219653"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="onProcessSubmitData"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          v-if="crudType == 'create'"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tambah Lainya
        </n-button>
        <router-link
          :to="{ name: 'setting-master-company' }"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            Kembali ke Beranda
          </n-button>
        </router-link>
      </template>
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
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
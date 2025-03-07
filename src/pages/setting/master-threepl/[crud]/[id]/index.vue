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
import { storageModel } from "@/models/storage"
import { masterThreeplModel } from "@/models/setting/master-threepl"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const crudType = ref("")
const provinceOptions = ref<any>([])
const districtOptions = ref<any>([])
const subDistrictOptions = ref<any>([])
const urbanVillageOptions = ref<any>([])
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({ image: { id: "", url: "" }, status: 1 })
const readOnlyEmail = ref(true)
const statusOptions = [
  { label: "Aktif", value: 1 },
  { label: "Tidak Aktif", value: 0 },
]
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})
const rules = ref()
const permissionModal = ref<any>({
  show: false,
})

onMounted(() => {
  authData.value = auth.getAuth()
  if (route.params.crud == "create") {
    crudType.value = "create"
    if (filters.isGranted(constants.accessSettings.setting3pl + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = "update"
    if (filters.isGranted(constants.accessSettings.setting3pl + ".update")) {
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
    await getProvinces()
    await getDistricts()
    await getSubDistricts()
    await getUrbanVillages()
    await masterThreeplModel
      .getDetailThreepl(id)
      .then((res) => {
        setFormValue(res.data)
        isLoading.value = false
      })
      .catch((err: any) => {
        isLoading.value = false
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else {
    await getProvinces()
  }
}

async function getProvinces() {
  formValue.value.province = null
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

async function getDistricts() {
  formValue.value.district = null
  const params = {
    limit: 1000,
    province_id: formValue.value.province,
  }
  await optionModel
    .getDistricts(params)
    .then((res) => {
      districtOptions.value = []
      const listDistrics = res.data.list
      listDistrics.forEach((el: any) => {
        districtOptions.value.push({
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

async function getSubDistricts() {
  formValue.value.subDistrict = null
  const params = {
    limit: 1000,
    district_id: formValue.value.district,
  }
  await optionModel
    .getSubDistricts(params)
    .then((res) => {
      subDistrictOptions.value = []
      const listSubDistricts = res.data.list
      listSubDistricts.forEach((el: any) => {
        subDistrictOptions.value.push({
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

async function getUrbanVillages() {
  formValue.value.urbanVillage = null
  const params = {
    limit: 1000,
    sub_district_id: formValue.value.subDistrict,
  }
  await optionModel
    .getUrbanVillages(params)
    .then((res) => {
      urbanVillageOptions.value = []
      const listUrbanVillages = res.data.list
      listUrbanVillages.forEach((el: any) => {
        urbanVillageOptions.value.push({
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
      formValue.value.image.id = res.data.data.id
      formValue.value.image.url = res.data.data.public_url
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

function crudThreepl() {
  isBtnLoading.value = true

  let holding_id = ""
  if (authData.value.xxtype === "5up3r4dm1n") {
    holding_id = authData.value["xx-usertype-access"].holding_id
  } else {
    holding_id = authData.value.users.user_type.id
  }

  const formData = new FormData()
  formData.append("holding_id", holding_id)
  formData.append("media_id", formValue.value.image.id)
  formData.append("name", formValue.value.name)
  formData.append("api_key", formValue.value.apiKey)
  formData.append("phone", formValue.value.phone)
  formData.append("email", formValue.value.email)
  formData.append("province_id", formValue.value.province)
  formData.append("district_id", formValue.value.district)
  formData.append("sub_district_id", formValue.value.subDistrict)
  formData.append("urban_village_id", formValue.value.urbanVillage)
  formData.append("address", formValue.value.address)
  formData.append("langitude", formValue.value.longitude)
  formData.append("latitude", formValue.value.latitude)
  formData.append("pic_name", formValue.value.pic)
  formData.append("status", formValue.value.status)
  formData.append("erp_code", formValue.value.erp_code)
  if (crudType.value == "create") {
    masterThreeplModel
      .createThreepl(formData)
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
    masterThreeplModel
      .updateThreepl(id, formData)
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
    apiKey: data.api_key,
    phone: data.phone,
    email: data.email,
    province: data.address.province.id,
    district: data.address.district.id,
    subDistrict: data.address.sub_district.id,
    urbanVillage: data.address.urban_village.id,
    address: data.address.detail,
    longitude: data.location.coordinates[1],
    latitude: data.location.coordinates[0],
    image: {
      id: data.image?.id || '',
      url: data.image?.url || '',
    },
    pic: data.pic_name,
    status: data.status.value,
    erp_code: data.erp_code,
  }
}

function resetFormValue() {
  formValue.value = {
    name: "",
    apiKey: "",
    phone: "",
    email: "",
    province: null,
    district: null,
    subDistrict: null,
    urbanVillage: null,
    address: "",
    longitude: 0,
    latitude: 0,
    image: {
      id: "",
      url: "",
    },
    pic: "",
    status: null,
    erp_code: "",
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
    tFeedbackRef.value.subtitle = "Apakah Anda yakin untuk menambah data 3PL?"
  } else {
    tFeedbackRef.value.subtitle = "Apakah Anda yakin untuk mengubah data 3PL?"
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
    tFeedbackRef.value.subtitle = "Data 3PL berhasil ditambahkan"
  } else {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = "Data 3PL berhasil diubah"
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

rules.value = {
  name: {
    required: true,
    message: "Nama 3PL tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  apiKey: {
    required: true,
    message: "API key tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  phone: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("No. Hp tidak boleh kosong")
      } else if (!/^\d*$/.test(value)) {
        return new Error("No. Hp harus angka")
      } else if (value.length < 8) {
        return new Error("No. Hp kurang dari 8 angka")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  email: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!value) {
        return new Error("Email tidak boleh kosong")
      } else if (!value.match(regex)) {
        return new Error("Email tidak valid")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  province: {
    required: true,
    message: "Provinsi tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  district: {
    required: true,
    message: "Kota/Kabupaten tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  subDistrict: {
    required: true,
    message: "Kecamatan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  urbanVillage: {
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
    validator(_rule: FormItemRule, value: any) {
      if (!value) {
        return new Error("Longitude tidak boleh kosong")
      }
      if (String(value).includes(",")) {
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
    validator(_rule: FormItemRule, value: any) {
      if (!value) {
        return new Error("Latitude tidak boleh kosong")
      }
      if (String(value).includes(",")) {
        return new Error("Latitude tidak boleh menggunakan tanda koma")
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error("Latitude harus angka atau tidak valid")
      }
    },
    trigger: ["input", "blur"],
  },
  pic: {
    required: true,
    message: "PIC tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  status: {
    type: "number",
    required: true,
    message: "Status tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  erp_code: {
    required: true,
    message: "Kode ERP tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == "create" ? "Tambah 3PL" : "Ubah 3PL" }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/master-threepl"
          class="text-decoration-none"
        >
          Master 3PL
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == "create" ? "Tambah 3PL" : "Ubah 3PL" }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-form
          ref="formRef"
          class="form-tnt"
          :model="formValue"
          :rules="rules"
          :show-require-mark="false"
        >
          <n-form-item
            path="name"
            label="Nama 3PL"
          >
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan nama 3PL"
            />
          </n-form-item>
          <n-form-item
            path="apiKey"
            label="API Key"
          >
            <n-input
              v-model:value="formValue.apiKey"
              placeholder="Masukkan API key"
            />
          </n-form-item>
          <n-form-item
            label="No. Hp"
            path="phone"
          >
            <n-input
              v-model:value="formValue.phone"
              placeholder="Masukkan nomer handphone"
            />
          </n-form-item>
          <n-form-item
            label="Email"
            path="email"
          >
            <n-input
              :readonly="readOnlyEmail"
              @focus="readOnlyEmail = false"
              v-model:value="formValue.email"
              placeholder="Masukkan email"
            />
          </n-form-item>
          <div
            class="divider-horizontal-tnt"
            style="border-color: #dfdfdf; margin-top: 5px"
          ></div>
          <n-text
            style="display: block; font-weight: 500; margin: 10px 0 15px 0"
            >Alamat
          </n-text>
          <n-form-item
            label="Provinsi"
            path="province"
          >
            <n-select
              v-model:value="formValue.province"
              :options="provinceOptions"
              filterable
              placeholder="Pilih provinsi"
              @update:value="getDistricts"
            />
          </n-form-item>
          <n-form-item
            label="Kota/Kabupaten"
            path="district"
          >
            <n-select
              v-model:value="formValue.district"
              :options="districtOptions"
              filterable
              placeholder="Pilih kota/kabupaten"
              @update:value="getSubDistricts"
            />
          </n-form-item>
          <n-form-item
            label="Kecamatan"
            path="subDistrict"
          >
            <n-select
              v-model:value="formValue.subDistrict"
              :options="subDistrictOptions"
              filterable
              placeholder="Pilih kecamatan"
              @update:value="getUrbanVillages"
            />
          </n-form-item>
          <n-form-item
            label="Kelurahan"
            path="urbanVillage"
          >
            <n-select
              v-model:value="formValue.urbanVillage"
              :options="urbanVillageOptions"
              filterable
              placeholder="Pilih kelurahan"
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
              style="width: 100%"
              placeholder="Masukkan longitude"
            />
          </n-form-item>
          <n-form-item
            label="Latitude"
            path="latitude"
          >
            <n-input
              v-model:value="formValue.latitude"
              style="width: 100%"
              placeholder="Masukkan latitude"
            />
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
          <n-form-item
            label="PIC"
            path="pic"
            style="margin-top: 15px"
          >
            <n-input
              v-model:value="formValue.pic"
              placeholder="Masukkan PIC"
            />
          </n-form-item>
          <n-form-item
            label="Kode ERP"
            path="erp_code"
            style="margin-top: 15px"
          >
            <n-input
              v-model:value="formValue.erp_code"
              placeholder="Kode ERP"
            />
          </n-form-item>
          <n-form-item
            label="Status"
            path="status"
          >
            <n-select
              v-model:value="formValue.status"
              :options="statusOptions"
              filterable
              placeholder="Pilih Status"
            />
          </n-form-item>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-master-threepl' }"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            >Kembali</n-button
          >
        </router-link>
        <template
          v-if="
            crudType === 'create' &&
            $filters.isGranted(constants.accessSettings.setting3pl + '.create')
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
            $filters.isGranted(constants.accessSettings.setting3pl + '.update')
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
          @click.prevent="crudThreepl"
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
        <n-button
          v-if="crudType == 'update'"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <router-link
          :to="{ name: 'setting-master-threepl' }"
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
<script setup lang="ts">
import type { FormInst, FormItemRule } from "naive-ui"
import { useMessage } from "naive-ui"
import type { SelectMixedOption } from "naive-ui/es/select/src/interface"
import { AlertCircleOutline, CheckmarkCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { masterVendorModel } from "@/models/setting/master-vendor"
import { optionModel } from "@/models/option"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"

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
const plantOptions = ref<any>([])
const statusOption = ref<SelectMixedOption[]>([
  { label: "Aktif", value: 1 },
  { label: "Tidak Aktif", value: 0 },
])
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})
const formValue = ref<any>({ status: 1 })
const formRef = ref<FormInst>()
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: "Nama vendor tidak boleh kosong",
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
  warehouse_id: {
    type: "array",
    required: true,
    message: "Nama plant/cabang tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  erp_code: {
    required: true,
    message: "Kode ERP tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  pic_name: {
    required: true,
    message: "Nama PIC tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  pic_phone: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("No. Telp tidak boleh kosong")
      } else if (!/^\d*$/.test(value)) {
        return new Error("No. Telp harus angka")
      } else if (value.length < 8) {
        return new Error("No. Hp kurang dari 8 angka")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  pic_email: {
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
  npwp: {
    required: true,
    message: "NPWP tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  status: {
    type: "number",
    required: true,
    message: "Status tidak boleh kosong",
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
    if (filters.isGranted(constants.accessSettings.settingVendor + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = "update"
    if (filters.isGranted(constants.accessSettings.settingVendor + ".update")) {
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
    await getWarehouse()
    await masterVendorModel
      .getDetailVendor(id)
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
    getWarehouse()
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

async function getWarehouse() {
  const params = {
    limit: 10000,
  }
  await masterWarehouseModel
    .getWarehouse(params)
    .then((res) => {
      const listWarehouse = res.data.list
      listWarehouse.forEach((el: any) => {
        plantOptions.value.push({
          key: el.key,
          value: el.id,
          label: el.name,
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

  const arrWarehouse: any = []
  formValue.value.warehouse_id.forEach((el: string) => {
    arrWarehouse.push(el)
  })

  const formData = {
    name: formValue.value.name,
    province_id: formValue.value.province_id,
    district_id: formValue.value.district_id,
    sub_district_id: formValue.value.sub_district_id,
    urban_village_id: formValue.value.urban_village_id,
    detail: formValue.value.address,
    latitude: parseInt(formValue.value.latitude),
    longitude: parseInt(formValue.value.longitude),
    erp_code: formValue.value.erp_code,
    pic_name: formValue.value.pic_name,
    pic_phone: formValue.value.pic_phone,
    pic_email: formValue.value.pic_email,
    npwp: formValue.value?.npwp,
    status: formValue.value.status,
    warehouse_id: arrWarehouse,
  }

  if (crudType.value == "create") {
    masterVendorModel
      .createVendor(formData)
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
    masterVendorModel
      .updateVendor(id, formData)
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
    latitude: String(data.location.coordinates[0]),
    longitude: String(data.location.coordinates[1]),
    erp_code: data.erp_code,
    pic_name: data.pic.name,
    pic_phone: data.pic.phone,
    pic_email: data.pic.email,
    status: data.status.value,
    npwp: data.npwp,
    warehouse_id: [],
  }

  data.warehouse?.forEach((el: any) => {
    formValue.value.warehouse_id.push(el.id)
  })
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
    warehouse_id: [],
    erp_code: "",
    pic_name: "",
    pic_phone: "",
    pic_email: "",
    npwp: "",
    status: 1,
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
      "Apakah Anda yakin untuk menambah data vendor?"
  } else {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk mengubah data vendor?"
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
    tFeedbackRef.value.subtitle = "Data vendor berhasil ditambahkan"
  } else {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = "Data vendor berhasil diubah"
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
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == "create" ? "Tambah Vendor" : "Edit Vendor" }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/master-vendor"
          class="text-decoration-none"
        >
          Master Vendor
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == "create" ? "Tambah vendor" : "Edit vendor" }}
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
            label="Nama Vendor"
          >
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama Vendor"
            />
          </n-form-item>
          <div
            class="divider-horizontal-tnt"
            style="border-color: #dfdfdf; margin-top: 10px"
          ></div>
          <n-text
            style="display: block; font-weight: 500; margin: 10px 0 15px 0"
            >Alamat</n-text
          >
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
            path="warehouse_id"
            label="Nama Plant/Cabang"
          >
            <n-select
              multiple
              v-model:value="formValue.warehouse_id"
              :options="plantOptions"
              placeholder="Pilih Plant/Cabang"
              style="width: 100%"
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
            path="pic_name"
            label="Nama PIC"
          >
            <n-input
              v-model:value="formValue.pic_name"
              placeholder="Masukkan Nama PIC"
            />
          </n-form-item>
          <n-form-item
            path="pic_phone"
            label="No. Telp PIC"
          >
            <n-input
              v-model:value="formValue.pic_phone"
              placeholder="Masukkan No. Telp"
            />
          </n-form-item>
          <n-form-item
            path="pic_email"
            label="Email PIC"
          >
            <n-input
              v-model:value="formValue.pic_email"
              placeholder="Masukkan Email"
            />
          </n-form-item>
          <n-form-item
            path="npwp"
            label="NPWP"
          >
            <n-input
              v-model:value="formValue.npwp"
              placeholder="Masukkan NPWP"
            />
          </n-form-item>
          <n-form-item
            path="status"
            label="Status"
          >
            <n-select
              v-model:value="formValue.status"
              :options="statusOption"
              placeholder="Pilih Status User"
              style="width: 100%"
            />
          </n-form-item>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-master-vendor' }"
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
            $filters.isGranted(constants.accessSettings.settingVendor + '.create')
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
            $filters.isGranted(constants.accessSettings.settingVendor + '.update')
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
          :to="{ name: 'setting-master-vendor' }"
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
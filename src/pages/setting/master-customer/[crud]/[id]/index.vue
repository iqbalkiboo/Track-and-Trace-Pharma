<script setup lang="ts">
import { NIcon, useMessage } from 'naive-ui'
import type { FormInst, FormItemRule } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { Add, CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { masterCustomerModel } from '@/models/setting/master-customer'
import { masterCustomerCategoryModel } from '@/models/setting/master-customer-category'
import { optionModel } from '@/models/option'
import ModalAddCustomerCategory from '../../modal/modal-add-customer-category.vue'

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const crudType = ref('')

const districtsOptions = ref<any>([])
const subdistrictsOptions = ref<any>([])
const provinceOptions = ref<any>([])
const urbanVillagesOptions = ref<any>([])
const statusOption = ref<SelectMixedOption[]>([
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 },
])
const formValue = ref<any>({
  status: 1
})
const formRef = ref<FormInst>()
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: 'Nama customer tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  customer_category: {
    required: true,
    message: 'Tipe customer tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  province_id: {
    required: true,
    message: 'Provinsi tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  district_id: {
    required: true,
    message: 'Kota/Kabupaten tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  sub_district_id: {
    required: true,
    message: 'Kecamatan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  urban_village_id: {
    required: true,
    message: 'Kelurahan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  address: {
    required: true,
    message: 'Keterangan alamat tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  zipcode: {
    required: true,
    message: 'Kode pos tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  langitude: {
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
  erp_code: {
    required: true,
    message: 'Kode ERP tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  bpom_destination_id: {
    required: true,
    message: 'Tujuan BPOM tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  pic_name: {
    required: true,
    message: 'Nama PIC tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  pic_phone: {
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('No. Telp tidak boleh kosong')
      } else if (!/^\d*$/.test(value)) {
        return new Error('No. Telp harus angka')
      } else if (value.length < 8) {
        return new Error('No. Hp kurang dari 8 angka')
      }
      return true
    },
    trigger: ['input', 'blur']
  },
  pic_email: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!value) {
        return new Error('Email tidak boleh kosong')
      } else if (!value.match(regex)) {
        return new Error('Email tidak valid')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  status: {
    type: 'number',
    required: true,
    message: 'Status tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  standart_sla: {
    required: true,
    validator(_rule:FormItemRule, value:string) {
      if(!value) {
        return new Error('Standar SLA tidak boleh kosong')
      }
      if (!/^[0-9]*$/.test(value)) {
        return new Error('Standar SLA harus angka atau tidak valid')
      }
    },
    trigger: ['input', 'blur'],
  }
}

const userTypeOptions = ref<SelectMixedOption[]>([])
const isShowModalCustomerCategory = ref(false)
const lastUserTypeSelected = ref<string>()

const permissionModal = ref<any>({
  show: false
})

onMounted(() => {
  authData.value = auth.getAuth()
  if (route.params.crud == 'create') {
    crudType.value = 'create'
    if (filters.isGranted(constants.accessSettings.settingCustomer + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = 'update'
    if (filters.isGranted(constants.accessSettings.settingCustomer + ".update")) {
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
  if (crudType.value == 'update') {
    isLoading.value = true
    const id = route.params.id
    await getProvinces()
    await getDistricts()
    await getSubDistricts()
    await getUrbanVillages()
    await getCustomerCategory('')
    await masterCustomerModel.getDetailCustomer(id).then((res) => {
      setFormValue(res.data)
      isLoading.value = false
    }).catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else {
    await getProvinces()
    await getCustomerCategory('')
  }
}

async function getProvinces() {
  formValue.value.province_id = null
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

async function getDistricts () {
  formValue.value.district_id = null
  const params = {
    limit: 1000,
    province_id: formValue.value.province_id,
  }
  await optionModel.getDistricts(params).then((res) => {
    districtsOptions.value = []
    const listDistrics = res.data.list
    listDistrics.forEach((el: any) => {
      districtsOptions.value.push({
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
  formValue.value.sub_district_id = null
  const params = {
    limit: 1000,
    district_id: formValue.value.district_id,
  }
  await optionModel.getSubDistricts(params).then((res) => {
    subdistrictsOptions.value = []
    const listSubDistricts = res.data.list
    listSubDistricts.forEach((el: any) => {
      subdistrictsOptions.value.push({
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
  formValue.value.urban_village_id = null
  const params = {
    limit: 1000,
    sub_district_id: formValue.value.sub_district_id,
  }
  await optionModel.getUrbanVillages(params).then((res) => {
    urbanVillagesOptions.value = []
    const listUrbanVillages = res.data.list
    listUrbanVillages.forEach((el: any) => {
      urbanVillagesOptions.value.push({
        label: el.name,
        value: el.id
      })
    })
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getCustomerCategory(type: any) {
  formValue.value.customer = null
  const params = {
    limit: 1000
  }
  await masterCustomerCategoryModel.getCustomerCategory(params).then((res) => {
    userTypeOptions.value = [
      {
        key: 'add',
        value: 'add',
        label: () =>
          h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
            h(NIcon, { component: Add }),
            'Tambah Tipe Customer',
          ]),
      }
    ]
    const listCustomerCategory = res.data.data.list
    
    listCustomerCategory.forEach((el: any) => {
      userTypeOptions.value.push({
        key: el.name,
        label: el.name,
        value: el.id
      })
    })
    if (type === "after_create") {
      formValue.value.customer_category = listCustomerCategory[res.data.data.list.length - 1].id
    }
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function onProcessSubmitData () {
  isBtnLoading.value = true

  let company_id = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"].company_id
  } else {
    company_id = authData.value.users.user_type.id
  }

  const formData = new FormData()
  formData.append("company_id", company_id)
  formData.append("name", formValue.value.name)
  formData.append("customer_category", formValue.value.customer_category)
  formData.append("province_id", formValue.value.province_id)
  formData.append("district_id", formValue.value.district_id)
  formData.append("sub_district_id", formValue.value.sub_district_id)
  formData.append("urban_village_id", formValue.value.urban_village_id)
  formData.append("address", formValue.value.address)
  formData.append("zipcode", formValue.value.zipcode)
  formData.append("latitude", formValue.value.latitude)
  formData.append("langitude", formValue.value.langitude)
  formData.append("erp_code", formValue.value.erp_code)
  formData.append("bpom_destination_id", formValue.value.bpom_destination_id)
  formData.append("pic_name", formValue.value.pic_name)
  formData.append("pic_phone", formValue.value.pic_phone)
  formData.append("pic_email", formValue.value.pic_email)
  formData.append("status", formValue.value.status)
  formData.append("standart_sla", formValue.value.standart_sla)

  if (crudType.value == 'create') {
    masterCustomerModel.createCustomer(formData).then(() => {
      isBtnLoading.value = false
      resetFormValue()
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    }).catch((err: any) => {
      const data = err.response.data
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showFailedFeedback(data)
      }, 300)
    })
  } else {
    const id = route.params.id
    masterCustomerModel.updateCustomer(id, formData).then(() => {
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    }).catch((err: any) => {
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
    customer_category: data.customers_category.id,
    province_id: data.address.province.id,
    district_id: data.address.district.id,
    sub_district_id: data.address.sub_district.id,
    urban_village_id: data.address.urban_village.id,
    zipcode: data.address.urban_village.zipcode.toString(),
    address: data.address.detail,
    latitude: String(data.location.coordinates[0]),
    langitude: String(data.location.coordinates[1]),
    erp_code: data.erp_code,
    bpom_destination_id: data.bpom_destination_id,
    pic_name: data.pic.name,
    pic_phone: data.pic.phone,
    pic_email: data.pic.email,
    status: data.status.value,
    standart_sla: data.standart_sla
  }
}

function resetFormValue() {
  formValue.value = {
    name: '',
    customer_category: null,
    province_id: null,
    district_id: null,
    sub_district_id: null,
    urban_village: null,
    address: '',
    langitude: '',
    latitude: '',
    imageUrl: '',
    erp_code: '',
    bpom_destination_id: '',
    pic_name: '',
    pic_phone: '',
    pic_email: '',
    status: null,
    standart_sla: ''
  }
}

function hideModalCustomerCategory() {
  isShowModalCustomerCategory.value = false
}

const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor:  '',
  hideIcon: false,
  title: '',
  subtitle: '',
  type: '',
})
function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  if (crudType.value == 'create') {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menambah data customer?'
  }else {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk mengubah data customer?'
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
    tFeedbackRef.value.subtitle = 'Data customer berhasil ditambahkan'
  }else {
    tFeedbackRef.value.title = 'Berhasil Ubah Data'
    tFeedbackRef.value.subtitle = 'Data customer berhasil diubah'
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

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate().then(() => {
    showConfirmFeedback()
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}

function handleUserTypeShow(value: boolean) {
  if (value) lastUserTypeSelected.value = formValue.value.userType
}

function handleUserTypeSelected(value: string) {
  if (value == 'add') handleShowTypeForm()
}

function handleShowTypeForm() {
  isShowModalCustomerCategory.value = true
}

</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == 'create' ? 'Tambah Customer' : 'Edit Customer' }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/master-customer" class="text-decoration-none">
          Master Customer
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == 'create' ? 'Tambah Customer' : 'Edit Customer' }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space>
        <n-button color="#2D9CDB" class="button-tnt" v-if="false">
          <template #icon>
            <n-icon><add /></n-icon>
          </template>
          Sync dengan ERP
        </n-button>
      </n-space>
      <div class="divider-horizontal-tnt"  v-if="false" style="border-color: #DFDFDF; margin-top: 24px; margin-bottom: 24px;"></div>
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-form ref="formRef" :model="formValue" :rules="rules" :show-require-mark="false" class="form-tnt">
          <n-form-item path="name" label="Nama Customer">
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama Customer"
            />
          </n-form-item>
          <n-form-item path="customerType" label="Tipe Customer">
            <n-select
              v-model:value="formValue.customer_category"
              :options="userTypeOptions"
              placeholder="Tentukan Tipe Customer"
              @update:show="handleUserTypeShow"
              @update:value="handleUserTypeSelected"
            />
          </n-form-item>
          <div class="divider-horizontal-tnt" style="border-color: #DFDFDF; margin-top: 10px"></div>
          <n-text style="display: block; font-weight: 500; margin: 10px 0 15px 0">Alamat Customer</n-text>
          <n-form-item label="Provinsi" path="province_id">
            <n-select
              v-model:value="formValue.province_id"
              :options="provinceOptions"
              filterable
              placeholder="Pilih provinsi"
              @update:value="getDistricts"
            />
          </n-form-item>
          <n-form-item label="Kota/Kabupaten" path="district_id">
            <n-select
              v-model:value="formValue.district_id"
              :options="districtsOptions"
              filterable
              placeholder="Pilih kota/kabupaten"
              @update:value="getSubDistricts"
            />
          </n-form-item>
          <n-form-item label="Kecamatan" path="sub_district_id">
            <n-select
              v-model:value="formValue.sub_district_id"
              :options="subdistrictsOptions"
              filterable
              placeholder="Pilih kecamatan"
              @update:value="getUrbanVillages"
            />
          </n-form-item>
          <n-form-item label="Kelurahan" path="urban_village_id">
            <n-select
              v-model:value="formValue.urban_village_id"
              :options="urbanVillagesOptions"
              filterable
              placeholder="Pilih kecamatan"
            />
          </n-form-item>
          <n-form-item label="Keterangan Alamat (Nama jalan dan No. Bangunan)" path="address">
            <n-input
              v-model:value="formValue.address"
              placeholder="Masukkan keterangan alamat"
            />
          </n-form-item>
          <n-form-item label="Kode Pos" path="zipcode">
            <n-input
              v-model:value="formValue.zipcode"
              placeholder="Masukkan kode pos"
            />
          </n-form-item>
          <n-form-item label="Longitude" path="langitude">
            <n-input
              v-model:value="formValue.langitude"
              placeholder="Masukkan longitude"
            />
          </n-form-item>
          <n-form-item label="Latitude" path="latitude">
            <n-input
              v-model:value="formValue.latitude"
              placeholder="Masukkan latitude"
            />
          </n-form-item>
          <n-form-item path="erp_code" label="Kode ERP">
            <n-input
              v-model:value="formValue.erp_code"
              placeholder="Masukkan Kode ERP"
            />
          </n-form-item>
          <n-form-item path="bpom_destination_id" label="ID Tujuan BPOM">
            <n-input
              v-model:value="formValue.bpom_destination_id"
              placeholder="Masukkan Kode ERP"
            />
          </n-form-item>
          <n-form-item path="pic_name" label="Nama PIC">
            <n-input
              v-model:value="formValue.pic_name"
              placeholder="Masukkan Nama PIC"
            />
          </n-form-item>
          <n-form-item path="pic_phone" label="No. Telp PIC">
            <n-input
              v-model:value="formValue.pic_phone"
              placeholder="Masukkan No. Telp"
            />
          </n-form-item>
          <n-form-item path="pic_email" label="Email PIC">
            <n-input
              v-model:value="formValue.pic_email"
              placeholder="Masukkan Email"
            />
          </n-form-item>
          <n-form-item path="status" label="Status">
            <n-select
              v-model:value="formValue.status"
              :options="statusOption"
              placeholder="Pilih Status User"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item path="standart_sla" label="Standart Sla">
            <n-input
              v-model:value="formValue.standart_sla"
              placeholder="Masukkan Standart Sla"
              style="width: 50%"
            >
              <template #suffix>
                hari
              </template>
            </n-input>
          </n-form-item>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'setting-master-customer' }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">Kembali</n-button>
        </router-link>
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingCustomer + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingCustomer + '.update')">
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

  <modal-add-customer-category
    :is-show-modal="isShowModalCustomerCategory"
    @fetch-data="getCustomerCategory('after_create')"
    @hide-modal="hideModalCustomerCategory"
  >
  </modal-add-customer-category>

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
          :to="{ name: 'setting-master-customer' }"
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

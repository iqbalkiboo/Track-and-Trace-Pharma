<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst, FormItemRule } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { Add, TrashOutline, CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { optionModel } from '@/models/option'
import { masterThreeplModel } from '@/models/setting/master-threepl'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const crudType = ref('')
const provinceOptions = ref<any>([])
const districtOptions = ref<any>([])
const subDistrictOptions = ref<any>([])
const urbanVillageOptions = ref<any>([])
const threeplOptions = ref<any>([])
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({
  status: 1,
  account: {},
  // printer: [{ name: '' }],
})
const statusOption = ref<SelectMixedOption[]>([
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 },
])
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
  authData.value = auth.getAuth()
  if (route.params.crud == 'create') {
    crudType.value = 'create'
    if (filters.isGranted(constants.accessSettings.settingCabangPlan + ".Create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = 'update'
    if (filters.isGranted(constants.accessSettings.settingCabangPlan + ".Create")) {
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
    await getThreepl()
    await masterWarehouseModel.getDetailWarehouse(id).then((res) => {
      setFormValue(res.data)
      isLoading.value = false
    }).catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else {
    await getProvinces()
    await getThreepl()
  }
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

async function getThreepl() {
  formValue.value.threepl = null
  const params = {
    limit: 1000
  }
  await masterThreeplModel.getThreepl(params).then((res) => {
    threeplOptions.value = []
    const listThreepl = res.data.list
    listThreepl.forEach((el: any) => {
      threeplOptions.value.push({
        label: el.name,
        value: el.id
      })
    })
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleAddPrinterForm() {
  formValue.value.printer.push({
    printer_name: '',
    id: '',
    url: ''
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

function crudWarehouse() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("name", formValue.value.name)
  formData.append("description", formValue.value.description)
  formData.append("province_id", formValue.value.province)
  formData.append("district_id", formValue.value.district)
  formData.append("sub_district_id", formValue.value.subDistrict)
  formData.append("urban_village_id", formValue.value.urbanVillage)
  formData.append("zipcode", formValue.value.zipcode)
  formData.append("address", formValue.value.address)
  formData.append("langitude", formValue.value.longitude)
  formData.append("latitude", formValue.value.latitude)
  formData.append("pic_name", formValue.value.pic)
  formData.append("pic_phone", formValue.value.picContact)
  formData.append("erp_code", formValue.value.erpCode)
  formData.append("status", formValue.value.status)
  formData.append("bpom", `{"account":{"username":"${ formValue.value.account.username }","password":"${ formValue.value.account.password }"}}`)

  formValue.value.threepl.forEach((el: any) => {
    formData.append('pl_id[]', el)
  })

  if (crudType.value == 'create') {
    masterWarehouseModel.createWarehouse(formData).then(() => {
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
    masterWarehouseModel.updateWarehouse(id, formData).then(() => {
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
  const arrThreeplId = ref<any>([])
  data['3pl'].forEach((el: any) => {
    arrThreeplId.value.push(el.id)
  })
  formValue.value = {
    name: data?.name,
    description: data?.description,
    province: data?.address?.province?.id,
    district: data?.address?.district?.id,
    subDistrict: data?.address?.sub_district?.id,
    urbanVillage: data?.address?.urban_village?.id,
    address: data?.address?.detail,
    zipcode: data?.address?.urban_village?.zipcode,
    longitude: String(data?.location?.coordinates[1]),
    latitude: String(data?.location?.coordinates[0]),
    pic: data?.pic?.value,
    picContact: data?.pic?.contact,
    erpCode: data?.erp_code,
    threepl: arrThreeplId?.value,
    status: data?.status?.value,
    account: {
      username: data?.bpom?.account?.username,
      password: data?.bpom?.account?.password,
    },
    // printer: []
  }
}

function resetFormValue() {
  formValue.value = {
    name: '',
    description: '',
    province: null,
    district: null,
    subDistrict: null,
    urbanVillage: '',
    address: '',
    zipcode: '',
    longitude: '',
    latitude: '',
    pic: '',
    picContact: '',
    erpCode: '',
    threepl: null,
    status: 1,
    accoount: {
      username: '',
      password: ''
    },
    // printer: []
  }
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  if (crudType.value == 'create') {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menambah data plant/cabang?'
  } else {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk mengubah data plant/cabang?'
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
    tFeedbackRef.value.subtitle = 'Data plant/cabang berhasil ditambahkan'
  } else {
    tFeedbackRef.value.title = 'Berhasil Ubah Data'
    tFeedbackRef.value.subtitle = 'Data plant/cabang berhasil diubah'
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

rules.value = {
  name: {
    required: true,
    message: 'Nama plant/cabang tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  description: {
    required: true,
    message: 'Keterangan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  province: {
    required: true,
    message: 'Provinsi tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  district: {
    required: true,
    message: 'Kota/Kabupaten tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  subDistrict: {
    required: true,
    message: 'Kecamatan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  urbanVillage: {
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
  pic: {
    required: true,
    message: 'PIC tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  picContact: {
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('Kontak PIC tidak boleh kosong')
      } else if (!/^\d*$/.test(value)) {
        return new Error('Kontak PIC harus angka')
      } else if (value.length < 8) {
        return new Error('Kontak PIC kurang dari 8 angka')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  erpCode: {
    required: true,
    message: 'Kode ERP tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  threepl: {
    type: 'array',
    required: true,
    message: '3PL tidak boleh kosong',
    trigger: ['blur', 'input'],
  },
  status: {
    type: 'number',
    required: true,
    message: 'Status tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == 'create' ? 'Tambah Plant/Cabang' : 'Edit Plant/Cabang' }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/master-perusahaan" class="text-decoration-none">
          Master Perusahaan
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == 'create' ? 'Tambah Plant/Cabang' : 'Edit Plant/Cabang' }}
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
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item label="Nama Plant/Cabang" path="name">
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan nama plant/cabang"
            />
          </n-form-item>
          <n-form-item label="Keterangan" path="description">
            <n-input
              v-model:value="formValue.description"
              placeholder="Masukkan keterangan"
            />
          </n-form-item>
          <div class="divider-horizontal-tnt" style="border-color: #DFDFDF; margin-top: 5px"></div>
          <n-text style="display: block; font-weight: 500; margin: 10px 0 15px 0">Alamat Plant/Cabang</n-text>
          <n-form-item label="Provinsi" path="province">
            <n-select
              v-model:value="formValue.province"
              :options="provinceOptions"
              filterable
              placeholder="Pilih provinsi"
              @update:value="getDistricts"
            />
          </n-form-item>
          <n-form-item label="Kota/Kabupaten" path="district">
            <n-select
              v-model:value="formValue.district"
              :options="districtOptions"
              filterable
              placeholder="Pilih kota/kabupaten"
              @update:value="getSubDistricts"
            />
          </n-form-item>
          <n-form-item label="Kecamatan" path="subDistrict">
            <n-select
              v-model:value="formValue.subDistrict"
              :options="subDistrictOptions"
              filterable
              placeholder="Pilih kecamatan"
              @update:value="getUrbanVillages"
            />
          </n-form-item>
          <n-form-item label="Kelurahan" path="urbanVillage">
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
          <n-form-item label="Kode Pos" path="zipcode">
            <n-input
              v-model:value="formValue.zipcode"
              placeholder="Masukkan kode pos"
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
          <n-form-item label="PIC" path="pic">
            <n-input
              v-model:value="formValue.pic"
              placeholder="Masukkan PIC"
            />
          </n-form-item>
          <n-form-item label="Kontak PIC" path="picContact">
            <n-input
              v-model:value="formValue.picContact"
              placeholder="Masukkan kontak PIC"
            />
          </n-form-item>
          <n-form-item label="Kode ERP" path="erpCode">
            <n-input
              v-model:value="formValue.erpCode"
              placeholder="Masukkan kode ERP"
            />
          </n-form-item>
          <n-form-item label="Pilih 3PL" path="threepl">
            <n-select
              multiple
              v-model:value="formValue.threepl"
              :options="threeplOptions"
              filterable
              placeholder="Pilih 3PL"
            />
          </n-form-item>
          <n-form-item path="status" label="Status">
            <n-select
              v-model:value="formValue.status"
              :options="statusOption"
              placeholder="Pilih Status Plant/Cabang"
              style="width: 100%"
            />
          </n-form-item>
          <div class="divider-horizontal-tnt" style="border-color: #DFDFDF; margin-top: 5px"></div>
          <n-text style="display: block; font-weight: 500; margin: 10px 0 15px 0">Akun BPOM</n-text>
          <n-form-item label="Username">
            <n-input
              v-model:value="formValue.account.username"
              placeholder="Masukkan kode ERP"
            />
          </n-form-item>
          <n-form-item label="Password">
            <n-input
              type="password"
              show-password-on="click"
              v-model:value="formValue.account.password"
              placeholder="Masukkan kode ERP"
            />
          </n-form-item>
          <div v-if="false" class="divider-horizontal-tnt" style="border-color: #DFDFDF; margin-top: 5px"></div>
          <n-text v-if="false" style="display: block; font-weight: 500; margin: 10px 0 15px 0">Printer</n-text>
          <n-space v-if="false" vertical :size="14">
            <n-card
              v-for="v, k in formValue.printer"
              :key="v.name + k"
              content-style="padding: 20px;"
              style="border-radius: 10px;"
            >
              <n-space
                justify="space-between"
                style="margin-bottom: 10px;"
              >
                <n-text strong depth="3">Printer {{ k + 1 }}</n-text>
                <n-button
                  secondary
                  circle
                  type="error"
                  @click.prevent="formValue.printer.splice(k, 1)"
                >
                  <template #icon>
                    <n-icon><TrashOutline /></n-icon>
                  </template>
                </n-button>
              </n-space>
              <n-form-item label="Nama Printer">
                <n-input
                  v-model:value="formValue.printer[k].printer_name"
                  placeholder="Masukkan Nama Printer"
                />
              </n-form-item>
              <n-form-item label="ID Printer">
                <n-input
                  v-model:value="formValue.printer[k].id"
                  placeholder="Masukkan ID Printer"
                />
              </n-form-item>
              <n-form-item label="IP Address URL">
                <n-input
                  v-model:value="formValue.printer[k].url"
                  placeholder="Masukkan IP Address URL"
                />
              </n-form-item>
            </n-card>
            <n-button
              v-if="false"
              size="tiny"
              text
              type="primary"
              class="button-tnt"
              @click.prevent="handleAddPrinterForm"
            >
              <template #icon>
                <n-icon><Add /></n-icon>
              </template>
              Tambah Printer
            </n-button>
          </n-space>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link to="/setting/master-perusahaan" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">Kembali</n-button>
        </router-link>
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingCabangPlan + '.Create')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingCabangPlan + '.Create')">
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
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="crudWarehouse">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button v-if="crudType == 'create'" color="#828282" class="button-tnt" @click="hideFeedback">
          Tambah Lainya
        </n-button>
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

<script setup lang="ts">
import { NIcon, useMessage } from 'naive-ui'
import type { FormInst, FormItemRule } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import { Add, CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { masterVehicleModel } from '@/models/setting/master-kendaraan'
import { masterVehicleCategoryModel } from '@/models/setting/master-kategori-kendaraan'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'
import ModalAddTipeKendaraan from '../../modal/modal-add-tipe-kendaraan.vue'

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const crudType = ref('')
const formRef = ref<FormInst>()
const rules = ref()
rules.value = {
  plate_number: {
    required: true,
    message: 'Plat nomor kendaraan tidak boleh kosong',
    trigger: 'blur',
  },
  vehicle_category_id: {
    required: true,
    message: 'Kategori kendaraan tidak boleh kosong',
    trigger: 'blur',
  },
  volume: {
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('Volume tidak boleh kosong')
      } else if (!/^\d*$/.test(value)) {
        return new Error('Volume harus angka')
      }
      return true
    },
    trigger: ['input', 'blur']
  },
  maximum_weight: {
    required: true,
    validator (rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('Berat maksimum tidak boleh kosong')
      } else if (!/^\d*$/.test(value)) {
        return new Error('Berat maksimum harus angka')
      }
      return true
    },
    trigger: ['input', 'blur']
  },
  warehouse_ids: {
    type: 'array',
    required: true,
    message: 'Plant/Cabang tidak boleh kosong',
    trigger: 'blur',
  },
  apikey_iot: {
    required: true,
    message: 'Api key IoT tidak boleh kosong',
    trigger: 'blur',
  },
  status: {
    type: 'number',
    required: true,
    message: 'Status tidak boleh kosong',
    trigger: 'blur',
  },
}
const formValue = ref<any>({
  status: 1
})
const vehicleTypeOptions = ref<SelectMixedOption[]>([])
const warehouseOptions = ref<SelectMixedOption[]>([])
const statusOption = ref<SelectMixedOption[]>([
  { label: 'Aktif', value: 1 },
  { label: 'Tidak Aktif', value: 0 },
])
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
    if (filters.isGranted(constants.accessSettings.settingKendaraan + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = 'update'
    if (filters.isGranted(constants.accessSettings.settingKendaraan + ".update")) {
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

    // UPDATE ACTION
    isLoading.value = true
    
    const id = route.params.id
    await getVehicleCategory('')
    await getWarehouse()
    await masterVehicleModel.getDetailVehicle(id).then((res) => {
      setFormValue(res.data)
      isLoading.value = false
    }).catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else {

  // CREATE ACTION
    await getVehicleCategory('')
    await getWarehouse()
  }
}

async function getVehicleCategory(type: any) {
  formValue.value.vehicle_category_id = ""
  const params = {
    limit: 1000
  }
  await masterVehicleCategoryModel.getVehicleCategory(params).then((res) => {
    vehicleTypeOptions.value = [
      {
        key: 'add',
        value: 'add',
        label: () =>
          h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
            h(NIcon, { component: Add }),
            'Tambah Kategori Kendaraan',
          ]),
      }
    ]
    const listVehicleCategory = res.data.data.list
    
    listVehicleCategory.forEach((el: any) => {
      vehicleTypeOptions.value.push({
        key: el.name,
        label: el.name,
        value: el.id
      })
    })
    if (type === "after_create") {
      formValue.value.vehicle_category_id = listVehicleCategory[res.data.data.list.length - 1].id
    }
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getWarehouse() {
  formValue.value.warehouse_ids = []
  const params = {
    limit: 1000
  }
  await masterWarehouseModel.getWarehouse(params).then((res) => {
    const listWarehouse = res.data.list
    listWarehouse.forEach((el: any) => {
      warehouseOptions.value.push({
        key: el.name,
        label: el.name,
        value: el.id
      })
    })
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

// FUNCTION FOR REQUEST API END

// FUNCTION HANDLE FORM

function setFormValue(data: any) {
  const arrPlantId = ref<any>([])
  data.warehouses.forEach((el: any) => {
    arrPlantId.value.push(el.id)
  })

  formValue.value = {
    vehicle_category_id: data.vehicle_categories.id,
    warehouse_ids: arrPlantId.value,
    plate_number: data.plate_number,
    volume: data.volume,
    maximum_weight: data.maximum_weight,
    apikey_iot: data.apikey_iot,
    status: data.status.value,
  }
}

function resetFormValue() {
  formValue.value = {
    vehicle_category_id: null,
    plate_number: "",
    volume: "",
    maximum_weight: "",
    warehouse_ids: null,
    apikey_iot: "",
    status: null,
  }
}

function onProcessSubmitData () {
  isBtnLoading.value = true

  let company_id = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"].company_id
  } else {
    company_id = authData.value.users.user_type.id
  }

  const formData = {
    company_id: company_id,
    vehicle_category_id: formValue.value.vehicle_category_id,
    plate_number: formValue.value.plate_number,
    volume: parseInt(formValue.value.volume),
    maximum_weight: parseInt(formValue.value.maximum_weight),
    warehouse_ids: formValue.value.warehouse_ids,
    apikey_iot: formValue.value.apikey_iot,
    status: formValue.value.status,
  }

  if (crudType.value == 'create') {
    masterVehicleModel.createVehicle(formData).then(() => {
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
    masterVehicleModel.updateVehicle(id, formData).then(() => {
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
  }
  
}

// FUNCTION HANDLE FORM END

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate().then(() => {
    showConfirmFeedback()
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  if (crudType.value == 'create') {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menambah kendaraan?'
  }else {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk mengubah data kendaraan?'
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
    tFeedbackRef.value.subtitle = 'Data kendaraan berhasil ditambahkan'
  }else {
    tFeedbackRef.value.title = 'Berhasil Ubah Data'
    tFeedbackRef.value.subtitle = 'Data kendaraan berhasil diubah'
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

// SECTION HANDLE TIPE KENDARAAN
const isShowModalVehicleCategory = ref(false)
const lastUserTypeSelected = ref<any>()

const typeRules = ref()
typeRules.value = {
  name: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string | undefined) => {
        if (!value || value.length < 1)
          return new Error('Nama Tipe User tidak boleh kosong')
      },
      trigger: ['input', 'blur'],
    },
  ],
}

function handleVehicleCategoryShow(value: boolean) {
  if (value) lastUserTypeSelected.value = formValue.value.vehicle_category_id
}

function handleVehicleCategorySelected(value: string) {
  if (value == 'add') handleShowModalVehicleCategory()
}

function handleShowModalVehicleCategory() {
  isShowModalVehicleCategory.value = true
}

function handleCloseModalVehicleCategory() {
  isShowModalVehicleCategory.value = false
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == 'create' ? 'Tambah Kendaraan' : 'Edit Kendaraan' }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/master-kendaraan" class="text-decoration-none">
          Master Kendaraan
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == 'create' ? 'Tambah Kendaraan' : 'Edit Kendaraan' }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-form ref="formRef" :model="formValue" :rules="rules" :show-require-mark="false" class="form-tnt">
          <n-form-item path="plate_number" label="Plat Nomor Kendaraan">
            <n-input
              v-model:value="formValue.plate_number"
              placeholder="Masukkan Plat Nomor Kendaraan"
            />
          </n-form-item>
          <n-form-item path="vehicleType" label="Kategori Kendaraan">
            <n-select
              v-model:value="formValue.vehicle_category_id"
              :options="vehicleTypeOptions"
              placeholder="Pilih Kategori Kendaraan"
              @update:show="handleVehicleCategoryShow"
              @update:value="handleVehicleCategorySelected"
            />
          </n-form-item>
          <n-form-item path="volume" label="Volume (m3)">
            <n-input
              v-model:value="formValue.volume"
              placeholder="Masukkan Volume"
            />
          </n-form-item>
          <n-form-item path="maxWeight" label="Berat Maksimum (gram)">
            <n-input
              v-model:value="formValue.maximum_weight"
              placeholder="Masukkan Berat Maksimum"
            />
          </n-form-item>
          <n-form-item path="plant" label="Nama Plant/Cabang">
            <n-select
              multiple
              v-model:value="formValue.warehouse_ids"
              :options="warehouseOptions"
              placeholder="Pilih Plant/Cabang"
            />
          </n-form-item>
          <n-form-item path="iot" label="Api key IoT">
            <n-input
              v-model:value="formValue.apikey_iot"
              placeholder="Masukkan Api key IoT"
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
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-master-kendaraan' }"
          style="text-decoration: none"
        >
          <n-button color="#828282" class="button-tnt">Kembali</n-button>
        </router-link>
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingKendaraan + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingKendaraan + '.update')">
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

  <modal-add-tipe-kendaraan
    :is-show-modal="isShowModalVehicleCategory"
    @fetch-data="getVehicleCategory('after_create')"
    @hide-modal="handleCloseModalVehicleCategory"
  >
  </modal-add-tipe-kendaraan>

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
        <n-button v-if="crudType === 'create'" color="#828282" class="button-tnt" @click="hideFeedback">
          Tambah Lainya
        </n-button>
        <router-link
          :to="{ name: 'setting-master-kendaraan' }"
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
 

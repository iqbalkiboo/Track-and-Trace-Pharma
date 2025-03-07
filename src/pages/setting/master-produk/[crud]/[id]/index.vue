<script setup lang="ts">
import { NIcon, useMessage } from 'naive-ui'
import type { FormInst, FormItemRule } from 'naive-ui'
import { Add, CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { masterProdukModel } from '@/models/setting/master-produk'
import { principalModel } from '@/models/setting/master-produk/principal'
import { typeModel } from '@/models/setting/master-produk/type'
import { uomModel } from '@/models/setting/master-produk/uom'
import moment from 'moment'
import ModalAddUom from '../../modal/modal-add-uom.vue'
import ModalAddPrincipal from '../../modal/modal-add-principal.vue'
import ModalAddType from '../../modal/modal-add-type.vue'

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const crudType = ref('')
const isLoading = ref(false)
const isShowModalUOM = ref(false)
const isShowModalPrincipal = ref(false)
const isShowModalTipeProduk = ref(false)

const lastUserTypeSelected = ref<string>()
const formValue = ref<any>({})
const formRef = ref<FormInst | null>(null)
const rules = ref()
rules.value = {
  principal_id: {
    required: true,
    message: 'Principal tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  product_type_id: {
    required: true,
    message: 'Tipe Produk tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  short_name: {
    required: true,
    message: 'Nama Singkat tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  long_name: {
    required: true,
    message: 'Nama Panjang tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  unit_of_mearusement: {
    required: true,
    message: 'Unit of Measurement tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  item_code: {
    required: true,
    message: 'Kode Item tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  nie_number: {
    required: true,
    message: 'NIE tidak boleh kosong',
    trigger: 'blur'
  },
  nie_expired_date: {
    required: true,
    message: 'Tanggal Kedaluwarsa tidak boleh kosong',
    trigger: ['blur', 'change'],
  },
  gross_weight: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return true
      }
      if (value.includes(',')) {
        return new Error('Berat Kotor tidak boleh menggunakan tanda koma')
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error('Berat Kotor harus angka atau tidak valid')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  master_coli: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return true
      }
      if (value.includes(',')) {
        return new Error('Master Coli tidak boleh menggunakan tanda koma')
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error('Master Coli harus angka atau tidak valid')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  volume: {
    required: true,
    validator(_rule: FormItemRule, value: string) {
      if (!value) {
        return true
      }
      if (value.includes(',')) {
        return new Error('Volume tidak boleh menggunakan tanda koma')
      }
      if (!/^[-]?[0-9]*\.?[0-9]*$/.test(value)) {
        return new Error('Volume harus angka atau tidak valid')
      }
      return true
    },
    trigger: ['input', 'blur'],
  },
  gross_value: {
    required: true,
    message: 'Gross tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  gross_unit: {
    required: true,
    message: 'Gross tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  volume_value: {
    required: true,
    message: 'Volume tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  volume_unit: {
    required: true,
    message: 'Volume tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
}

const uomOptions = ref<SelectMixedOption[]>([
  {
    key: 'add',
    value: 'add',
    label: () =>
      h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
        h(NIcon, { component: Add }),
        'Tambah Unit of Measurement',
      ]),
  },
])

const principalOptions = ref<SelectMixedOption[]>([
  {
    key: 'add',
    value: 'add',
    label: () =>
      h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
        h(NIcon, { component: Add }),
        'Tambah Principal',
      ]),
  },
])

const productTypeOptions = ref<SelectMixedOption[]>([
  {
    key: 'add',
    value: 'add',
    label: () =>
      h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
        h(NIcon, { component: Add }),
        'Tambah Tipe Produk',
      ]),
  },
])

const permissionModal = ref<any>({
  show: false
})

onMounted(() => {
  authData.value = auth.getAuth()
  if (route.params.crud == 'create') {
    crudType.value = 'create'
    if (filters.isGranted(constants.accessSettings.settingProduk + '.create')) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = 'update'
    if (filters.isGranted(constants.accessSettings.settingProduk + '.update')) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  }
})

function hidePermissionModal() {
  permissionModal.value.show = false
}

function getData() {
  getDetailProduct()
  getDataPrincipal('')
  getDataTypeProduct('')
  getDataUoM('')
}

async function getDetailProduct() {
  if (crudType.value == 'update') {
    // UPDATE ACTION
    isLoading.value = true
    const id = route.params.id
    await masterProdukModel.getDetailProduct(id).then((res) => {
      setFormValue(res.data)
      isLoading.value = false
    }).catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else {
    // CREATE ACTION
  }
}

async function getDataPrincipal(type: any) {
  isLoading.value = true
  const params = {
    limit: 10000
  }
  await principalModel.getPrincipal(params).then((res) => {
    principalOptions.value = [
      {
        key: 'add',
        value: 'add',
        label: () =>
          h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
            h(NIcon, { component: Add }),
            'Tambah Principal',
          ]),
      },
    ]

    const listPrincipal = res.data.data.list

    listPrincipal.forEach((item: any) => {
      principalOptions.value.push({
        key: item.name,
        label: item.name + ' - ' + item.erp_code,
        value: item.id
      })
    })
    if (type === "after_create") {
      formValue.value.principal_id = listPrincipal[res.data.data.list.length - 1].id
    }
    isLoading.value = false
    tFeedbackRef.value.show = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getDataTypeProduct(type: any) {
  isLoading.value = true
  const params = {
    limit: 10000
  }
  await typeModel.getType(params).then((res) => {
    productTypeOptions.value = [
      {
        key: 'add',
        value: 'add',
        label: () =>
          h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
            h(NIcon, { component: Add }),
            'Tambah Tipe Produk',
          ]),
      },
    ]

    const listProductTypeOptions = res.data.data.list

    listProductTypeOptions.forEach((item: any) => {
      productTypeOptions.value.push({
        key: item.name,
        label: item.name + ' - ' + item.erp_code,
        value: item.id
      })
    })
    if (type === "after_create") {
      formValue.value.product_type_id = listProductTypeOptions[res.data.data.list.length - 1].id
    }
    isLoading.value = false
    tFeedbackRef.value.show = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getDataUoM(type: any) {
  isLoading.value = true
  const params = {
    limit: 10000
  }
  await uomModel.getUom(params).then((res) => {
    uomOptions.value = [
      {
        key: 'add',
        value: 'add',
        label: () =>
          h('span', { style: { color: '#0B8F9D', fontWeight: 600 } }, [
            h(NIcon, { component: Add }),
            'Tambah Unit of Measurement',
          ]),
      },
    ]

    const listUoM = res.data.data.list
    
    listUoM.forEach((el: any) => {
      uomOptions.value.push({
        key: el.name,
        label: el.name + ' - ' + el.code,
        value: el.id
      })
    })
    if (type === "after_create") {
      formValue.value.unit_of_mearusement = listUoM[res.data.data.list.length - 1].id
    }
    isLoading.value = false
    tFeedbackRef.value.show = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleUoMShow(value: boolean) {
  if (value) lastUserTypeSelected.value = formValue.value.userType
}

function handlePrincipalShow(value: boolean) {
  if (value) lastUserTypeSelected.value = formValue.value.userType
}

function handleTipeProdukShow(value: boolean) {
  if (value) lastUserTypeSelected.value = formValue.value.userType
}

function handleUomSelected(value: string) {
  if (value == 'add') handleModalUoMForm()
}

function handlePrincipalSelected(value: string) {
  if (value == 'add') handleModalPrincipalForm()
}

function handleTipeProdukSelected(value: string) {
  if (value == 'add') handleModalTipeProdukForm()
}

function handleModalUoMForm() {
  isShowModalUOM.value = true
}

function handleModalPrincipalForm() {
  isShowModalPrincipal.value = true
}

function handleModalTipeProdukForm() {
  isShowModalTipeProduk.value = true
}

function hideModalUoM() {
  isShowModalUOM.value = false
}

function hideModalPrincipal() {
  isShowModalPrincipal.value = false
}

function hideModalTipeProduk() {
  isShowModalTipeProduk.value = false
}

function setDifferentDate(value: number) {
  const thisDate = moment(new Date()).format("yyyy-MM-DD")
  const exDate = moment(value).format("yyyy-MM-DD")
  const diffDate = moment(exDate).diff(thisDate, 'months')
  
  if (diffDate > 0) {
    formValue.value.nie_different_date = String(diffDate)
  } else {
    formValue.value.nie_different_date = "0"
  }
}

const isBtnLoading = ref(false)
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

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate().then(() => {
    showConfirmFeedback()
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}

function addMasterProduct() {
  isBtnLoading.value = true

  let holding_id: string = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    holding_id = authData.value["xx-usertype-access"].holding_id
  } else {
    holding_id = authData.value.users.user_type.id
  }

  const formData = {
    holding_id: holding_id,
    principal_id : formValue.value.principal_id,
    product_type_id : formValue.value.product_type_id,
    short_name : formValue.value.short_name,
    long_name : formValue.value.long_name,
    unit_of_mearusement : formValue.value.unit_of_mearusement,
    item_code : formValue.value.item_code,
    nie :  {
      number : formValue.value.nie_number,
      expired_date : formValue.value.nie_expired_date,
      different_date : Number(formValue.value.nie_different_date)
    },
    gross_weight : Number(formValue.value.gross_weight),
    master_coli : Number(formValue.value.master_coli),
    volume : Number(formValue.value.volume),
  }

  if (crudType.value === "create") {
    masterProdukModel.createProduct(formData).then(() => {
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
    masterProdukModel.updateProduct(route.params.id, formData).then(() => {
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

function resetFormValue() {
  formValue.value = {
    principal_id : null,
    product_type_id : null,
    short_name : "",
    long_name : "",
    unit_of_mearusement : null,
    item_code : "",
    nie_number : "",
    nie_expired_date : null,
    nie_different_date : "",
    gross_weight : "",
    master_coli : "",
    volume : "",
    gross_value : "",
    gross_unit : "",
    volume_value : "",
    volume_unit : "",
  }
}

function setFormValue(data: any) {
  formValue.value = {
    principal_id : data.principal.id,
    product_type_id : data.product_types.id,
    short_name : data.short_name,
    long_name : data.long_name,
    unit_of_mearusement : data.uom.id,
    item_code : data.item_code,
    nie_number : data.nie.number,
    nie_expired_date : moment(data.nie.expired_date).format("YYYY-MM-DD"),
    nie_different_date : data.nie.different_date,
    gross_weight : String(data.gross_weight),
    master_coli : String(data.master_coli),
    volume : String(data.volume),
  }
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  if (crudType.value === "create") {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menambah produk?'
  }else {
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk mengubah produk?'
  }
  tFeedbackRef.value.show = true
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  if (crudType.value === "create") {
    tFeedbackRef.value.title = 'Berhasil Tambah Data'
    tFeedbackRef.value.subtitle = 'Data master produk berhasil ditambahkan'  
  }else{
    tFeedbackRef.value.title = 'Berhasil Ubah Data'
    tFeedbackRef.value.subtitle = 'Data master produk berhasil diubah'
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
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">{{ crudType === 'create' ? 'Tambah' : 'Ubah' }} Produk</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/master-produk" class="text-decoration-none">
          Master Produk
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>{{ crudType === 'create' ? 'Tambah' : 'Ubah' }} Produk</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-h3 style="font-size: 16px; margin-top: 24px">Tambah Produk Manual</n-h3>
        <n-form
          ref="formRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item label="Principal" path="principal_id">
            <n-select
              v-model:value="formValue.principal_id"
              :options="principalOptions"
              :disabled="isLoading"
              filterable
              placeholder="Pilih Principal"
              @update:show="handlePrincipalShow"
              @update:value="handlePrincipalSelected"
            />
          </n-form-item>
          <n-form-item label="Tipe Produk (Material Group)" path="product_type_id">
            <n-select
              v-model:value="formValue.product_type_id"
              :options="productTypeOptions"
              :disabled="isLoading"
              filterable
              placeholder="Pilih Tipe Produk"
              @update:show="handleTipeProdukShow"
              @update:value="handleTipeProdukSelected"
            />
          </n-form-item>
          <n-form-item label="Nama Singkat (Short Text)" path="short_name">
            <n-input
              v-model:value="formValue.short_name"
              placeholder="Masukkan Nama Singkat"
            />
          </n-form-item>
          <n-form-item label="Nama Panjang (Long Text)" path="long_name">
            <n-input
              v-model:value="formValue.long_name"
              placeholder="Masukkan Nama Panjang"
            />
          </n-form-item>
          <n-form-item label="Unit of Measurement" path="unit_of_mearusement">
            <n-select
              v-model:value="formValue.unit_of_mearusement"
              :options="uomOptions"
              placeholder="Masukkan Unit of Measurement"
              filterable
              @update:show="handleUoMShow"
              @update:value="handleUomSelected"
            />
          </n-form-item>
          <n-form-item label="Kode Item" path="item_code">
            <n-input
              :disabled="crudType == 'update'"
              v-model:value="formValue.item_code"
              placeholder="Masukkan Kode Item"
            />
          </n-form-item>
          <n-form-item label="Nomor Ijin Edar (NIE)" path="nie_number">
            <n-input
              v-model:value="formValue.nie_number"
              placeholder="Masukkan NIE"
            />
          </n-form-item>
          <n-form-item label="Tanggal Kedaluwarsa (NIE)" path="nie_expired_date">
            <n-date-picker
              v-model:formatted-value="formValue.nie_expired_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="Tentukan Tanggal"
              @update:value="setDifferentDate"
            />
          </n-form-item>
          <n-form-item label="Selisih Bulan NIE">
            <n-input
              disabled
              v-model:value="formValue.nie_different_date"
              placeholder="Tentukan Jumlah Bulan"
            >
              <template #suffix>
                bulan
              </template>
            </n-input>
          </n-form-item>
          <n-form-item label="Berat (gram)" path="gross_weight">
            <n-input
              v-model:value="formValue.gross_weight"
              placeholder="Masukkan Berat Kotor"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item label="Master Coli (gram)" path="master_coli">
            <n-input
              v-model:value="formValue.master_coli"
              placeholder="Masukkan Master Coli"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item label="Volume (cm³)" path="volume">
            <n-input
              v-model:value="formValue.volume"
              placeholder="Masukkan Volume"
            />
          </n-form-item>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link to="/setting/master-produk" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">
            Kembali
          </n-button>
        </router-link>
        <!-- <router-link :to="{name: 'setting-master-produk-id'}" class="text-decoration-none">
          <n-button type="warning" class="button-tnt" style="width: 120px" :loading="isBtnLoading">
            Detail Data
          </n-button>
        </router-link> -->
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingProduk + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingProduk + '.update')">
          <n-button
            color="#219653"
            class="button-tnt"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
      </div>
    </div>
  </div>

  <modal-add-type
    :is-show-modal="isShowModalTipeProduk"
    @fetch-data="getDataTypeProduct('after_create')"
    @hide-modal="hideModalTipeProduk"
  >
  </modal-add-type>

  <modal-add-uom
    :is-show-modal="isShowModalUOM"
    @fetch-data="getDataUoM('after_create')"
    @hide-modal="hideModalUoM"
  >
  </modal-add-uom>

  <modal-add-principal
    :is-show-modal="isShowModalPrincipal"
    @fetch-data="getDataPrincipal('after_create')"
    @hide-modal="hideModalPrincipal"
  >
  </modal-add-principal>

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
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click.prevent="hideFeedback">
          Batalkan
        </n-button>
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="addMasterProduct">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button v-if="crudType == 'create'" color="#828282" class="button-tnt" @click="hideFeedback">
          Tambah Lainya
        </n-button>
        <n-button v-if="crudType == 'update'" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <router-link
          :to="{ name: 'setting-master-produk' }"
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

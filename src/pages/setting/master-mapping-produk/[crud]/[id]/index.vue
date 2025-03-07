<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { useMessage } from "naive-ui"
import { AlertCircleOutline, CheckmarkCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { mappingProdukModel } from "@/models/setting/master-mapping-produk"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const crudType = ref("")
const dataRes = ref<any>({})
const productDataRes = ref<any>({})
const companyOptions = ref<any>([])
const vendorOptions = ref<any>([])
const formValue = ref<any>({})
const formRef = ref<FormInst>()
const rules = ref()
rules.value = {
  company_id: {
    required: true,
    message: "Company tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  vendor_id: {
    required: true,
    message: "Vendor tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  code: {
    required: true,
    message: "Kode Produk Vendor tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  description: {
    required: true,
    message: "Deskripsi tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})

const permissionModal = ref<any>({
  show: false,
})

onMounted(() => {
  authData.value = auth.getAuth()
  if (route.params.crud == "create") {
    crudType.value = "create"
    if (
      filters.isGranted(constants.accessSettings.settingMappingProduk + ".create")
    ) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = "update"
    if (
      filters.isGranted(constants.accessSettings.settingMappingProduk + ".update")
    ) {
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
    getVendorList()
    getCompanyList()
    await getProductDetail()
    await getMappingProductDetail()
  } else {
    getProductDetail()
    getVendorList()
    getCompanyList()
  }
}

async function getMappingProductDetail() {
  isLoading.value = true
  isBtnLoading.value = true

  const id = route.query.mapping_id as string
  await mappingProdukModel
    .getMappingProductDetail(id)
    .then((res) => {
      dataRes.value = res.data
      setFormValue(res.data)
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getProductDetail() {
  isLoading.value = true
  isBtnLoading.value = true

  const id = route.params.id as string
  await mappingProdukModel
    .getProductDetail(id)
    .then((res) => {
      productDataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getVendorList() {
  await mappingProdukModel
    .getVendorList({ limit: 10000 })
    .then((res) => {
      res.data.list.forEach((item: any) => {
        vendorOptions.value.push({
          label: item.name + " - " + item.erp_code,
          value: item.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getCompanyList() {
  await mappingProdukModel
    .getCompany({ limit: 10000 })
    .then((res) => {
      res.data.list.forEach((item: any) => {
        companyOptions.value.push({
          label: item.name + " - " + item.erp_code,
          value: item.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function setFormValue(data: any) {
  formValue.value = {
    company_id: data.company_id,
    vendor_id: data.vendor.id,
    code: data.code,
    description: data.description,
  }
}

function onProcessSubmitData() {
  isBtnLoading.value = true

  if (crudType.value == "create") {
    const formData = {
      product_id: route.params.id as string,
      company_id: formValue.value.company_id,
      vendor_id: formValue.value.vendor_id,
      code: formValue.value.code,
      description: formValue.value.description,
    }
    mappingProdukModel
      .saveMappingProduk(formData)
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
  } else {
    const id = route.query.mapping_id as string
    const formData = {
      code: formValue.value.code,
      description: formValue.value.description,
    }
    mappingProdukModel
      .updateMappingProduk(id, formData)
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

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate()
  showConfirmFeedback()
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  if (crudType.value == "create") {
    tFeedbackRef.value.subtitle = "Apakah Anda yakin untuk mapping produk?"
  } else {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk mengubah mapping produk?"
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

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  if (crudType.value == "create") {
    tFeedbackRef.value.title = "Berhasil"
    tFeedbackRef.value.subtitle = "Berhasil Mapping Produk"
  } else {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = "Berhasil Ubah Data Mapping Produk"
  }
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <n-space
      vertical
      :size="0"
    >
      <n-h3 style="margin-bottom: 4px">{{ productDataRes.short_name }}</n-h3>
      <n-text>{{ productDataRes.item_code }}</n-text>
    </n-space>

    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-space vertical>
          <n-space>
            <n-text
              strong
              style="font-size: 15px"
              >Mapping Vendor</n-text
            >
          </n-space>
          <n-space
            v-if="false"
            style="margin-top: 14px"
          >
            <n-text>Nama Company : {{ "-" }}</n-text>
          </n-space>
          <n-form
            ref="formRef"
            class="form-tnt"
            :show-require-mark="false"
            :label-width="80"
            :model="formValue"
            :rules="rules"
            style="margin-top: 14px"
          >
            <n-form-item
              label="Pilih Company"
              path="company_id"
            >
              <n-select
                v-model:value="formValue.company_id"
                :options="companyOptions"
                :disabled="crudType == 'update'"
                filterable
                clearable
                placeholder="Pilih Company"
                class="select-tnt"
              />
            </n-form-item>
            <n-form-item
              label="Pilih Vendor"
              path="vendor_id"
            >
              <n-select
                v-model:value="formValue.vendor_id"
                :options="vendorOptions"
                :disabled="crudType == 'update'"
                filterable
                clearable
                placeholder="Pilih Vendor"
                class="select-tnt"
              />
            </n-form-item>
            <n-form-item
              label="Kode Produk Vendor"
              path="code"
            >
              <n-input
                v-model:value="formValue.code"
                placeholder="Masukkan Kode Produk Vendor"
              />
            </n-form-item>
            <n-form-item
              label="Deskripsi"
              path="description"
            >
              <n-input
                v-model:value="formValue.description"
                placeholder="Ketikkan Deskripsi"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 5 }"
              />
            </n-form-item>
          </n-form>
        </n-space>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          to="/setting/master-mapping-produk"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
          >
            Kembali</n-button
          >
        </router-link>
        <template
          v-if="
            crudType === 'create' &&
            $filters.isGranted(
              constants.accessSettings.settingMappingProduk + '.create'
            )
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
            $filters.isGranted(
              constants.accessSettings.settingMappingProduk + '.update'
            )
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
        <router-link
          :to="{ name: 'setting-master-mapping-produk' }"
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
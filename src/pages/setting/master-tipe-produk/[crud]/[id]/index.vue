<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { useMessage } from "naive-ui"
import { CheckmarkCircleOutline, AlertCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { typeModel } from "@/models/setting/master-produk/type"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const crudType = ref("")
const isLoading = ref(false)
const isBtnLoading = ref(false)

const formValue = ref<any>({})
const formRef = ref<FormInst>()
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: "Nama Tipe Produk tidak boleh kosong",
    trigger: "blur",
  },
  description: {
    required: true,
    message: "Deskripsi tidak boleh kosong",
    trigger: "blur",
  },
  erp_code: {
    required: true,
    message: "Kode ERP tidak boleh kosong",
    trigger: "blur",
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
  show: false
})

onMounted(() => {
  authData.value = auth.getAuth()
  if (route.params.crud == "create") {
    crudType.value = "create"
    if (filters.isGranted(constants.accessSettings.settingTipeProduk + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = "update"
    if (filters.isGranted(constants.accessSettings.settingTipeProduk + ".create")) {
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
    // UPDATE ACTION
    isLoading.value = true
    isBtnLoading.value = true

    const id = route.params.id
    await typeModel
      .getDetailType(id)
      .then((res) => {
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
  } else {
    // CREATE ACTION
  }
}

function onProcessSubmitData() {
  isBtnLoading.value = true

  let holding_id: string = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    holding_id = authData.value["xx-usertype-access"].holding_id
  } else {
    holding_id = authData.value.users.user_type.id
  }

  const formData = {
    holding_id: holding_id,
    name: formValue.value.name,
    description: formValue.value.description,
    erp_code: formValue.value.erp_code,
  }

  if (crudType.value == "create") {
    typeModel
      .createType(formData)
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
    typeModel
      .updateType(id, formData)
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
  }
}

function setFormValue(data: any) {
  formValue.value = {
    name: data.name,
    description: data.description,
    erp_code: data.erp_code,
  }
}

function resetFormValue() {
  formValue.value = {
    name: "",
    description: "",
    erp_code: "",
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
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk menambah tipe produk?"
  } else {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk mengubah tipe produk?"
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
    tFeedbackRef.value.title = "Berhasil Tambah Data"
    tFeedbackRef.value.subtitle = "Data tipe produk berhasil ditambahkan"
  } else {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = "Data tipe produk berhasil diubah"
  }
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <n-h3 style="margin-bottom: 4px">
      {{  
        $route.params.crud == "create"
          ? "Tambah Tipe Produk"
          : "Edit Tipe Produk" 
      }}
    </n-h3>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/master-tipe-produk"
          class="text-decoration-none"
        >
          Tipe Produk
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{
          $route.params.crud == "create"
            ? "Tambah Tipe Produk"
            : "Edit Tipe Produk"
        }}
      </n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-form
          ref="productTypeFormRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item label="Nama Tipe Produk" path="name">
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama Tipe Produk"
            />
          </n-form-item>
          <n-form-item label="Kode ERP" path="erp_code">
            <n-input
              v-model:value="formValue.erp_code"
              :disabled="crudType == 'update'"
              placeholder="Masukkan Kode ERP"
            />
          </n-form-item>
          <n-form-item label="Deskripsi" path="description">
            <n-input
              v-model:value="formValue.description"
              placeholder="Ketikkan Deskripsi Tipe Produk"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
            />
          </n-form-item>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          to="/setting/master-tipe-produk"
          class="text-decoration-none"
        >
          <n-button color="#828282" class="button-tnt"> Kembali </n-button>
        </router-link>
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingTipeProduk + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingTipeProduk + '.create')">
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
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tambah Lainya
        </n-button>
        <router-link
          :to="{ name: 'setting-master-tipe-produk' }"
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

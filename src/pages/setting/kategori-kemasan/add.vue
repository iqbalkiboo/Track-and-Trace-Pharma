<script setup lang="ts">
import { CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import { ref, shallowRef } from 'vue'
import type { FormInst } from 'naive-ui'
import { auth } from "@/models/auth"
import { masterPackagingCollectifModel } from '@/models/setting/master-kemasan-kolektif'

const authData = ref<any>()

const isBtnLoading = ref(false)
const formValue = ref<any>({})
const formRef = ref<FormInst>()
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: 'Nama kategori kemasan tidak boleh kosong',
    trigger: 'blur',
  },
}

onMounted(() => {
  authData.value = auth.getAuth()
})

function onProcessSubmitData () {
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
    erp_code: formValue.value.erp_code
  }

  masterPackagingCollectifModel.createPackagingCollectif(formData).then(() => {
    isBtnLoading.value = false
    resetFormValue()
    handleHideFeedback()
    setTimeout(() => {
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    const data = err.response.data
    isBtnLoading.value = false
    handleHideFeedback()
    setTimeout(() => {
      showFailedFeedback(data)
    }, 300)
  })
}

function resetFormValue() {
  formValue.value = {
    name: '',
  }
}

const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor:  '#36A630',
  hideIcon: false,
  title: 'Selamat',
  subtitle: 'Nama kategori kemasan berhasil ditambahkan',
  type: '',
})
function handleHideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menambah kategori kemasan?'
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

function showSuccessFeedback() {
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.title = 'Berhasil Tambah Data'
  tFeedbackRef.value.subtitle = 'Data kategori Kemasan berhasil ditambahkan'
  tFeedbackRef.value.show = true
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate()
  showConfirmFeedback()
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Kategori Kemasan</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/kategori-kemasan" class="text-decoration-none">
          Kategori Kemasan
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>Tambah Kategori Kemasan</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item label="Nama Kategori" path="name">
          <n-input
            v-model:value="formValue.name"
            placeholder="Masukkan Nama Kategori"
          />
        </n-form-item>
      </n-form>
    </div>
    <n-space justify="center" style="margin-top: 24px">
      <router-link to="/setting/kategori-kemasan" class="text-decoration-none">
        <n-button color="#828282" class="button-tnt"> Batalkan </n-button>
      </router-link>
      <n-button color="#219653" class="button-tnt" @click="handleValidateClick">
        Simpan
      </n-button>
    </n-space>
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
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleHideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="onProcessSubmitData">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <router-link to="/setting/kategori-kemasan" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">
            Kembali ke Beranda
          </n-button>
        </router-link>
        <n-button color="#219653" class="button-tnt" @click.prevent="handleHideFeedback">
          Tambah Lainnya
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button color="#828282" class="button-tnt" @click="handleHideFeedback">
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

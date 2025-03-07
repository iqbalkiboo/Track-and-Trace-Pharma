<script setup lang="ts">
import type { FormRules, FormItemRule } from 'naive-ui'
import { auth } from "@/models/auth"
import { masterCustomerCategoryModel } from '@/models/setting/master-customer-category'

const props = defineProps<{
  isShowModal?: boolean
}>()

const emits = defineEmits<{
  (e: 'hideModal'): void
  (e: 'fetchData'): void
  (e: 'update:isShowModal', type: boolean): void
}>()

const authData = ref<any>()

const formValue = ref<any>({})
// const formRef = ref<FormInst>()
const isBtnLoading = ref(false)
const typeRules = ref<FormRules>({
  name: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string | undefined) => {
        if (!value || value.length < 1)
          return new Error('Nama Kategori Customer tidak boleh kosong')
      },
      trigger: ['input', 'blur'],
    },
  ],
})

onMounted(() => {
  authData.value = auth.getAuth()
})

const hideModal = () => {
  setTimeout(() => {
    emits('hideModal')
  }, 100)
}

function handleAddUserType() {
  isBtnLoading.value = true

  let company_id: string = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"].company_id
  } else {
    company_id = authData.value.users.user_type.id
  }

  const formData = new FormData()
  formData.append("company_id", company_id)
  formData.append("name", formValue.value.name)

  
  masterCustomerCategoryModel.createCustomerCategory(formData).then(() => {
    isBtnLoading.value = false
    resetFormValue()
    hideModal()
    emits('fetchData')
  }).catch(() => {
    // const data = err.response.data
    isBtnLoading.value = false
  })

  function resetFormValue() {
    formValue.value.name = ""
  }
}
</script>

<template>
  <n-modal 
    :show="props.isShowModal"
    @update:show="$emit('update:isShowModal', $event)">
    <n-card
      style="width: 470px; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      title="Tambah Tipe Customer"
      aria-modal="true"
    >
      <n-space vertical :size="24" style="width: 100%">
        <n-form ref="typeFormRef" class="form-tnt" :show-require-mark="false" :model="formValue" :rules="typeRules">
          <n-form-item path="name" label="Nama Tipe Customer">
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama Tipe Customer"
            />
          </n-form-item>
        </n-form>
      </n-space>

      <n-space justify="center" style="margin-top: 10px">
        <n-button color="#828282" class="button-tnt" :loading="isBtnLoading"  @click="hideModal">Batalkan</n-button>
        <n-button color="#219653" class="button-tnt" :loading="isBtnLoading" @click="handleAddUserType">Tambah</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import type { FormInst, FormRules, FormItemRule } from 'naive-ui'
import { auth } from "@/models/auth"
import { uomModel } from '@/models/setting/master-produk/uom'

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
const formRef = ref<FormInst>()
const isBtnLoading = ref(false)
const rules = ref<FormRules>({
  name: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string | undefined) => {
        if (!value || value.length < 1)
          return new Error('Nama Unit of Measurement tidak boleh kosong')
      },
      trigger: ['input', 'blur'],
    },
  ],
  code: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string | undefined) => {
        if (!value || value.length < 1)
          return new Error('Kode Customer tidak boleh kosong')
      },
      trigger: ['input', 'blur'],
    }
  ],
  description: [
    {
      required: true,
      validator: (rule: FormItemRule, value: string | undefined) => {
        if (!value || value.length < 1)
          return new Error('Deskripsi tidak boleh kosong')
      },
      trigger: ['input', 'blur'],
    }
  ]
})

onMounted(() => {
  authData.value = auth.getAuth()
})

const hideModal = () => {
  setTimeout(() => {
    emits('hideModal')
  }, 100)
}

function handleAddUoM() {
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
    code: formValue.value.code
  }

  uomModel.createUom(formData).then(() => {
    isBtnLoading.value = false
    resetFormValue()
    hideModal()
    emits('fetchData')
  }).catch(() => {
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
      content-style="padding: 15px 20px 28px 20px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical :size="25">
        <n-h3 style="margin-bottom: 0">Tambah Unit of Measurement</n-h3>
        <n-form ref="formRef" class="form-tnt" :model="formValue" :rules="rules" :show-require-mark="false">
          <n-form-item path="name" label="Nama UoM">
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama uom"
            />
          </n-form-item>
          <n-form-item path="code" label="Kode UoM">
            <n-input
              v-model:value="formValue.code"
              placeholder="Masukkan kode uom"
            />
          </n-form-item>
          <n-form-item label="Deskripsi" path="description">
            <n-input
              v-model:value="formValue.description"
              placeholder="Masukkan deskripsi"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
            />
          </n-form-item>
        </n-form>

        <n-space justify="center">
          <n-button color="#828282" class="button-tnt" :loading="isBtnLoading" @click="hideModal"
            >Batalkan</n-button
          >
          <n-button color="#219653" class="button-tnt" :loading="isBtnLoading" @click="handleAddUoM"
            >Simpan</n-button
          >
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

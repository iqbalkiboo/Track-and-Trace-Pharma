<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'

const props = withDefaults(
  defineProps<{
    show: boolean
    value: any
    loading: boolean
  }>(),
  {
    show: false,
    value: () => ({}),
    loading: false
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:value", value: any): void
  (e: "click:close", value: boolean): void
  (e: "click:confirm", value: boolean): void
}>()

const tMessage = useMessage()

const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})
const rules = ref()
rules.value = {
  serialize_code: {
    required: true,
    message: 'Kode serialisasi tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
}

watch(formValue, (value) => emit('update:value', value), { deep: true })

onMounted(() => {
  formValue.value = props.value
})

onUpdated(() => {
  formValue.value = props.value
})

async function handleValidateClick() {
  await formRef.value?.validate().then(() => {
    emit('click:confirm', true)
    emit('update:value', formValue.value)
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 470px; max-width: 100%; border-radius: 10px"
    title="Edit Serialisasi"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical style="padding-left: 10px; padding-right: 10px;">
      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item label="Masukkan Kode Serialisasi" path="serialize_code">
          <n-input
            v-model:value="formValue.serialize_code"
            filterable
            placeholder="Masukkan Kode Serialisasi"
          />
        </n-form-item>
        <n-space justify="center">
          <n-button :loading="props.loading" type="primary" class="button-tnt" @click="handleValidateClick">Simpan</n-button>
        </n-space>
      </n-form>
    </n-space>
  </n-modal>
</template>

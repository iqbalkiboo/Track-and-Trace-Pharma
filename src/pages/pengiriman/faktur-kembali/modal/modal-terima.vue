<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'

const props = withDefaults(
  defineProps<{
    show: boolean
    data?: any
    form?: any
    loading?: boolean
  }>(),
  {
    show: false,
    form: () => ({}),
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
  (e: "click:confirm", value: any): void
}>()

const tMessage = useMessage()

const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})

const rules = ref()
rules.value = {
}

onMounted(() => {
  formValue.value = props.form
})

onUpdated(() => {
  formValue.value = props.form
})

async function handleValidateClick() {
  await formRef.value?.validate().then(() => {
    emit('click:confirm', formValue.value)
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
    title="Faktur Kembali"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical :size="15" style="padding-left: 10px; padding-right: 10px;">
      <n-text strong>No. DO : {{ props?.data?.code }}</n-text>
      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
<!--        
        <n-form-item label="Tanggal Terima Invoice" path="date">
          <n-date-picker
            v-model:formatted-value="formValue.date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="Tentukan Tanggal"
            style="width: 100%"
            :disabled="props.loading"
          />
        </n-form-item>
        <n-form-item label="Jam" path="hour">
          <n-time-picker
            v-model:formatted-value="formValue.hour"
            default-formatted-value="00:00:00"
            style="width: 100%"
            :disabled="props.loading"
          />
        </n-form-item>
        <n-form-item label="Rayon Customer" path="rayon">
          <n-select
            v-model:value="formValue.rayon"
            :options="rayonOptions"
            filterable
            placeholder="Pilih Rayon Customer"
            :disabled="props.loading"
          />
        </n-form-item>
        -->
      </n-form>
      <n-space justify="center">
        <n-button :loading="props.loading" type="primary" class="button-tnt" @click="handleValidateClick">Konfirmasi Diterima</n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'

const tMessage = useMessage()

const props = withDefaults(
  defineProps<{
    isShow: boolean
    value: any
    loading: boolean
  }>(),
  {
    show: false,
    value: () => ({}),
    loading: false,
  }
)

const emits = defineEmits<{
  (e: 'update:isShow', type: boolean): void
  (e: 'update:value', value: any): void
  (e: 'click:submit', value: any): void
}>()

const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})

const rules = ref()
rules.value = {
  qty: {
    type: 'number',
    required: true,
    message: 'Qty tidak boleh kosong',
    trigger: ['blur', 'change'],
  },
}

const hideModal = () => {
  emits('update:value', {})
  formValue.value = {}
  emits('update:isShow', false)
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value?.validate().then(() => {
    emits('click:submit', formValue.value)
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
  })
}

watch(formValue, (value) => emits('update:value', value), { deep: true })

onMounted(() => {
  formValue.value = props.value
})

onUpdated(() => {
  formValue.value = props.value
})
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.isShow"
    @update:show="$emit('update:isShow', $event)"
  >
    <n-card
      style="width: 470px; --n-border-radius: 10px"
      content-style="padding: 15px 20px 28px 20px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical :size="25">
        <n-h6 style="margin-bottom: 0">Tambah Level {{ formValue.level }}</n-h6>
        <div>
          <n-form
            ref="formRef"
            class="form-tnt"
            :show-require-mark="false"
            :label-width="80"
            :model="formValue"
            :rules="rules"
          >
            <n-form-item label="Masukkan Qty" path="qty">
              <n-input-number
                v-model:value="formValue.qty"
                :min="1"
                placeholder="Masukkan Qty"
                style="width: 100%;"
              />
            </n-form-item>
          </n-form>
        </div>

        <n-space justify="center">
          <n-button :loading="props.loading" color="#828282" class="button-tnt" @click="hideModal">
            Batalkan
          </n-button>
          <n-button :loading="props.loading" color="#219653" class="button-tnt" @click="handleValidateClick">
            Generate
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>
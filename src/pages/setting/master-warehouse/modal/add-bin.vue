<script setup lang="ts">
  import { useMessage } from 'naive-ui'
  import type { FormInst } from 'naive-ui'

  const tMessage = useMessage()

  const props = withDefaults(
    defineProps<{
      show: boolean
      value: any
      loading: boolean
    }>(),
    {
      show: false,
      value: () => ({}),
      loading: false,
    }
  )

  defineExpose({ handleCancelCrudBin })

  const emit = defineEmits<{
    (e: 'update:show', value: boolean): void
    (e: 'update:value', value: any): void
    (e: 'click:save', value: any): void
  }>()

  const formRef = ref<FormInst | null>(null)
  const model = ref<any>({})

  const rules = ref()
  rules.value = {
    bin_name: {
      required: true,
      message: 'Nama bin tidak boleh kosong',
      trigger: 'blur',
    },
    bin_id: {
      required: true,
      message: 'ID Bin tidak boleh kosong',
      trigger: 'blur',
    },
  }

  function handleCancelCrudBin() {
    emit('update:value', {})
    model.value = {}
    emit('update:show', false)
  }

  async function handleCrudBin(e: MouseEvent) {
    e.preventDefault()
    await formRef.value?.validate().then(() => {
      emit('click:save', model.value)
    }).catch(() => {
      tMessage.error('Form tidak valid, tolong periksa kembali')
    })
  }

  watch(model, (value) => emit('update:value', value), { deep: true })

  onMounted(() => {
    model.value = props.value
  })

  onUpdated(() => {
    model.value = props.value
  })
</script>

<template>
  <n-modal :mask-closable="false" :show="show" @update:show="$emit('update:show', $event)">
    <n-card
      style="width: 600px; max-width: 100%; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      title="Warehouse Bin"
      aria-modal="true"
    >
      <n-form ref="formRef" :model="model" class="form-tnt" :rules="rules" :show-require-mark="false">
        <n-grid
          cols="2"
          item-responsive
          responsive="screen"
          :x-gap="16"
          :y-gap="16"
        >
          <n-grid-item span="2 m:1">
            <n-form-item path="bin_name" label="Nama Bin">
              <n-input
                v-model:value="model.bin_name"
                placeholder="Masukkan Nama Bin"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:1">
            <n-form-item path="id" label="ID Bin">
              <n-input
                v-model:value="model.bin_id"
                placeholder="Masukkan ID Bin"
              ></n-input>
            </n-form-item>
          </n-grid-item>
        </n-grid>
      </n-form>

      <n-space justify="center">
        <n-button color="#828282" class="button-tnt" @click="handleCancelCrudBin"
          >Batalkan</n-button
        >
        <n-button color="#219653" class="button-tnt" @click="handleCrudBin">Simpan</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

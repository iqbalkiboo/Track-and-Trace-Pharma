<script setup lang="ts">
import { NInput, useMessage } from "naive-ui"

const props = withDefaults(
  defineProps<{
    code: string
    show: boolean
    title?: string
    isBtnLoading?: boolean
  }>(),
  {
    show: false,
    isBtnLoading: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:code", value: string): void
  (e: "click:scan", value: string): void
  (e: "click:close", value: boolean): void
}>()

const tMessage = useMessage()
const codeScan = ref('')

watch(codeScan, (value) => emit('update:code', value), { deep: true })

onMounted(() => {
  codeScan.value = props.code
})

onUpdated(() => {
  codeScan.value = props.code
  input.value?.focus()
})

const input = ref<typeof NInput | null>(null)

function handleEnter() {
  if (!props.code) {
    tMessage.error('Kode tidak boleh kosong')
  } else {
    emit("click:scan", codeScan.value)
    setTimeout(() => {
      emit('click:close', false)
    }, 400)
  }
}

function handleClick() {
  if (!props.code) {
    tMessage.error('Kode tidak boleh kosong')
  } else {
    emit("click:scan", codeScan.value)
    setTimeout(() => {
      emit('click:close', false)
    }, 400)
  }
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 480px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical align="center" justify="center" :size="14">
      <n-h3 v-if="title" style="margin-bottom: 0">{{ title }}</n-h3>

      <n-space vertical align="center">
        <n-text>Silakan masukkan Kode</n-text>
        <n-space>
          <n-input
            ref="input"
            :value="codeScan"
            placeholder=""
            clearable
            style="width: 16rem"
            @keyup.enter="handleEnter"
            @update:value="$emit('update:code', $event)"
          ></n-input>
          <n-button
            v-if="false"
            :loading="isBtnLoading"
            :disabled="codeScan == ''"
            strong
            secondary
            type="primary"
            class="button-tnt"
            @click="handleClick"
            >Cari</n-button
          >
        </n-space>
      </n-space>
      <n-p v-if="false" style="font-size: 0.8rem">Atau Scan Kode</n-p>

      <n-button
        :disabled="codeScan == ''"
        :loading="isBtnLoading"
        type="primary"
        class="button-tnt"
        @click="handleClick"
        >Scan Kode</n-button
      >
    </n-space>
  </n-modal>
</template>

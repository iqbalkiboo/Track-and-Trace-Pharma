<script setup lang="ts">
  import { AlertCircleOutline } from '@vicons/ionicons5'

  const props = defineProps<{
    isShowModal?: boolean
    modalTitle: string
    modalMessage: string
  }>()

  const emits = defineEmits<{
    (e: 'hideModal'): void
    (e: 'update:isShowModal', value: boolean): void
  }>()

  const hideModal = () => {
    setTimeout(() => {
      emits('hideModal')
    }, 300)
  }
</script>

<template>
  <n-modal
    :show="props.isShowModal"
    @update:show="$emit('update:isShowModal', $event)"
  >
    <n-card
      style="width: 470px; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical align="center">
        <n-icon :size="64" color="#9D1614" :component="AlertCircleOutline" />
        <n-h3 v-if="props.modalTitle" style="margin-bottom: 0">{{
          props.modalTitle
        }}</n-h3>
        <p
          v-if="props.modalMessage"
          style="text-align: center; font-weight: 500; margin-top: 0"
        >
          {{ props.modalMessage }}
        </p>

        <n-space justify="center">
          <n-button color="#219653" class="button-tnt" @click="hideModal"
            >Pilih File Lainnya</n-button
          >
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

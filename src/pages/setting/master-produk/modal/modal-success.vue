<script setup lang="ts">
  import { CheckmarkCircleOutline } from '@vicons/ionicons5'

  withDefaults(
    defineProps<{
      isShowModal: boolean
      modalTitle?: string
      modalMessage?: string
    }>(),
    { isShowModal: false, icon: () => CheckmarkCircleOutline }
  )

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
    :show="isShowModal"
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
        <n-icon
          :size="64"
          color="#18a058"
          :component="CheckmarkCircleOutline"
        />
        <n-h3 v-if="modalTitle" style="margin-bottom: 0">{{ modalTitle }}</n-h3>
        <p v-if="modalMessage" style="font-weight: 500; margin-top: 0">
          {{ modalMessage }}
        </p>

        <n-space justify="center">
          <n-button color="#828282" class="button-tnt" @click="hideModal"
            >Tambah Lainya</n-button
          >
          <router-link
            :to="{ name: 'setting-master-produk' }"
            class="text-decoration-none"
          >
            <n-button color="#219653" class="button-tnt"
              >Kembali ke Beranda</n-button
            >
          </router-link>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

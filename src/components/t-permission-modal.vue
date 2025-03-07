<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
}>()

function handleClose() {
  emit('click:close', false)
}
</script>

<template>
  <n-modal
    :show="props.show"
    :mask-closable="false"
    @update:show="handleClose"
  >
    <n-card
      style="width: 450px; --n-border-radius: 10px"
      content-style="padding: 15px 20px 28px 20px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-scrollbar x-scrollable style="max-height: 450px;">
        <n-space vertical :size="14">
          <p style="text-align: center; font-weight: 500;">Maaf, Anda tidak memiliki hak akses untuk melihat halaman ini</p>
        </n-space>
      </n-scrollbar>
      <n-space justify="center">
        <router-link to="/" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt" style="">Kembali ke Home</n-button>
        </router-link>
      </n-space>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
.text-decoration-none:focus-visible {
  outline: none;
}
</style>
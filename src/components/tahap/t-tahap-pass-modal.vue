<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    title?: string
    to?: string
  }>(),
  { show: false, to: "" }
)

defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "scanned", value: string): void
  (e: "click:close", value: boolean): void
}>()
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 500px; max-width: 100%; border-radius: 8px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical align="center" :size="0" style="text-align: center">
      <div>
        <n-h3 style="margin-bottom: 0">Konfirmasi</n-h3>
        <div>Pass 3 ID Level 1</div>
      </div>
      <n-grid cols="2" x-gap="5" style="margin-top: 1rem">
        <n-gi>
          <n-button style="padding: 1rem 3rem">Batalkan</n-button>
        </n-gi>
        <n-gi>
          <n-button style="padding: 1rem 3rem" type="primary"
            >Lanjutkan</n-button
          >
        </n-gi>
      </n-grid>
    </n-space>
  </n-modal>
</template>
<style></style>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
    level: number
    detailData?: any
    selectedData?: any
  }>(),
  {
    show: false,
    level: 1,
    detailData: () => ({}),
    selectedData: () => [],
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
  (e: "click:pass", value: boolean): void
  (e: "click:void", value: boolean): void
  (e: "click:moveto", value: boolean): void
}>()

function handleShowPass() {
  emit("click:close", true)
  emit("click:pass", true)
}

function handleShowVoid() {
  emit("click:close", true)
  emit("click:void", true)
}

function handleShowMove() {
  emit("click:close", true)
  emit("click:moveto", true)
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
    style="width: 470px; max-width: 100%; border-radius: 8px"
    header-style="padding-bottom: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical>
      <n-h4 style="text-align: center; margin-bottom: 10px">
        Bulk Aksi {{ props.selectedData.length }} Kode Level
        {{ props.level }}
      </n-h4>
      <n-grid y-gap="14" :cols="3" class="button-grub">
        <n-gi span="3">
          <n-button type="primary" @click="handleShowPass">Pass</n-button>
        </n-gi>
        <n-gi span="3">
          <n-button type="error" @click="handleShowVoid">Void</n-button>
        </n-gi>
        <n-gi
          v-if="props.detailData.serialize[props.detailData.serialize.length - 1].level !== props.level"
          span="3"
        >
          <n-button type="warning" @click="handleShowMove">Move To</n-button>
        </n-gi>
      </n-grid>
    </n-space>
  </n-modal>
</template>

<style>
.button-grub button {
  width: 500px;
  max-width: 100%;
  border-radius: 5px;
}
</style>

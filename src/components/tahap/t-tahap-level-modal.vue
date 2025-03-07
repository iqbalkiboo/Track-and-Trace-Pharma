<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
    level: number
    detailData?: any
    selectedData?: any
    levelDetail?: any
    parentData?: any
    isValid?: boolean
  }>(),
  {
    show: false,
    level: 1,
    detailData: () => ({}),
    selectedData: () => ({}),
    levelDetail: () => ([]),
    parentData: () => ({}),
    isValid: true,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
  (e: "click:detail", value: boolean): void
  (e: "click:pass", value: boolean): void
  (e: "click:void", value: boolean): void
  (e: "click:moveto", value: boolean): void
}>()

function handleClickDetail() {
  emit("click:close", true)
  emit("click:detail", true)
}

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
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 490px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical>
      <div style="text-align: center;">
        <p v-if="!isValid" class="text-danger text-sm -mt-4">
          Kode yang di-scan tidak sesuai dengan kode parent
        </p>
        <n-h4 v-if="props.parentData?.level" class="font-semibold" style=" margin-bottom: 0">
          Kode Parent Level {{ props.parentData.level }} : {{ props.parentData.code }}
        </n-h4>
        <n-h4 class="font-semibold mt-0" style=" margin-bottom: 0">
          Kode Level {{ props.level }} : {{ props.selectedData.code }}
        </n-h4>
        <n-space vertical :size="0">
          <n-text v-if="false" style="font-size: 14px">Lokasi Level {{ props.level }} : ?</n-text>
          <n-text v-if="props.level !== props.detailData?.serialize[0]?.level" style="font-size: 14px">Qty : {{ props?.selectedData?.serialize?.current }} Level {{ (props.level - 1) }}</n-text>
        </n-space>
      </div>
      <n-grid v-if="isValid" y-gap="6" :cols="3" class="button-grub">
        <n-gi v-if="props.level !== props.detailData?.serialize[0]?.level" span="3">
          <n-button type="primary" @click="handleClickDetail">Detail</n-button>
        </n-gi>
        <n-gi span="3">
          <n-button color="#219653" @click="handleShowPass">Pass</n-button>
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

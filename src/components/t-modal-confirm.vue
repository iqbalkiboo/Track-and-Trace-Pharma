<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    show: boolean
    result?: any
    handlePartial: any
    loading: boolean
  }>(),
  {
    show: false,
    loading: false
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:result", value: boolean): void
  (e: "handlePartial"): void
}>()

async function handleEnter() {
  emit("update:result", true)
  emit("handlePartial")
  emit("update:show", false)
}

function handleClose() {
  emit("update:show", false)
}
</script>

<template>
  <n-modal
    :show="props.show"
    :bordered="false"
    preset="card"
    style="width: 500px; --n-border-radius: 10px"
    content-style="padding: 15px 20px 28px 20px;"
    @update:show="handleClose"
  >
    <n-space
      vertical
      align="center"
    >
        <n-text>Apakah Anda Yakin ?</n-text>

        <div>
            <n-button
              :loading="props.loading"
              style="margin: 0 10px;"
              color="#828282"
              class="button-tnt"
              @click.prevent="handleClose"
            >
                Tidak
            </n-button>
            <n-button
              :loading="props.loading"
              type="primary"
              class="button-tnt"
              @click.prevent="handleEnter"
            >
              Yakin
            </n-button>
        </div>
    </n-space>
  </n-modal>
</template>

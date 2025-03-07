<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
    images: any
    type: string
  }>(),
  {
    show: false,
  }
)

defineEmits<{
  (e: "click:close", value: boolean): void
}>()
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 600px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <n-image-group>
      <n-space
        vertical
        align="center"
      >
        <n-image
          v-for="(item, i) in images"
          :key="i"
          :src="type === 'multi' ? item.public_url : item.url"
          :width="400"
          style="max-width: 100%"
        ></n-image>
      </n-space>
    </n-image-group>
  </n-modal>
</template>

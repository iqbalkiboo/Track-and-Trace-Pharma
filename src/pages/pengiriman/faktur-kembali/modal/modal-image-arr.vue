<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
    data?: any
    loading?: boolean
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "click:close", value: boolean): void
}>()
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 500px; max-width: 100%; border-radius: 10px"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical :size="15" style="padding-left: 10px; padding-right: 10px;">
      <n-space vertical v-for="manifest, i in props?.data" :key="i">
        <n-text strong>ID Manifest : {{ manifest.manifest_id }}</n-text>
        <n-image-group>
          <n-space>
            <n-image
              v-for="image, i in manifest.images"
              :key="i"
              width="100"
              :previewed-img-props="{ style: { border: '8px solid white' } }"
              :src="image.url"
            />
          </n-space>
        </n-image-group>
      </n-space>
    </n-space>
  </n-modal>
</template>

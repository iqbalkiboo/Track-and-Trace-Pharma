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
  (e: "doLogin"): void
}>()

const router = useRouter()

async function handleEnter() {
  emit("doLogin")
  emit("update:show", false)
}

async function handleClose() {
  emit("update:show", false)
}

</script>

<template>
  <n-modal
    :close-on-esc="false"
    :show="props.show"
    :bordered="false"
    preset="card"
    title="Akun anda sedang digunakan di perangkat lain, yakin masuk?"
    style="width: 500px; --n-border-radius: 10px"
    content-style="padding: 15px 20px 28px 20px;"
    @update:show="handleClose"
  >
    <template #header-extra></template>
    <n-space
      vertical
      align="center"
    >
        <div>
          <n-button
            style="margin: 0 10px;"
            color="#828282"
            class="button-tnt"
            @click.prevent="handleClose"
          >
            Tidak
          </n-button>
          <n-button
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

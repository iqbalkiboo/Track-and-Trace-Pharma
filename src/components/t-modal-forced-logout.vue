<script setup lang="ts">

import { auth } from "@/models/auth"

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
}>()

const router = useRouter()

async function handleClose() {
  emit("update:show", false)
  auth.forceLogout()
  router.push({ name: "login" })
}

</script>

<template>
  <n-modal
    :close-on-esc="false"
    :show="props.show"
    :bordered="false"
    preset="card"
    title="Akun anda sudah digunakan di perangkat lain."
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
              type="error"
              class="button-tnt"
              @click.prevent="handleClose"
            >
              OK
            </n-button>
        </div>
    </n-space>
  </n-modal>
</template>

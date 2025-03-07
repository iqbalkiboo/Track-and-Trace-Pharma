<script setup lang="ts">
import { NInput } from "naive-ui"

const props = withDefaults(
  defineProps<{
    show: boolean
    data?: any
    result?: any
    loading?: boolean
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:result", value: boolean): void
  (e: "click:submit", value: string): void
  (e: "click:continue"): void
  (e: "click:close", value: boolean): void
  (e: "click:get"): void
  (e: "click:broken", value: string): void
  (e: "click:approve", value: string): void
}>()

const search = ref("")
const input = ref<typeof NInput | null>(null)

onUpdated(() => {
  input.value?.focus()
})

const showModal = computed({
  get: () => props.show,
  set: (val) => emit("update:show", val),
})

watch(showModal, (val) => {
  if (!val) {
    emit("click:get")
    emit("update:result", false)
    search.value = ""
  }
})
function handleApprove() {
  emit("click:approve", search.value)
  search.value = ""
}

async function handleSumbmit() {
  // emit("click:submit", search.value)
  input.value?.focus()
  handleApprove()
}

function handleEnter() {
  input.value?.focus()
  handleSumbmit()
  setTimeout(() => {
    search.value = ""
  }, 200)
}

function handleClose() {
  emit("click:close", false)
}
</script>

<template>
  <n-modal
    :show="show"
    :bordered="false"
    preset="card"
    style="width: 500px; --n-border-radius: 10px"
    content-style="padding: 15px 20px 28px 20px;"
    @update:show="$emit('click:close', $event)"
  >
    <n-space
      vertical
      align="center"
    >
      <n-h3 style="margin-bottom: 0">Scan Serialisasi</n-h3>
      <n-space
        vertical
        align="center"
      >
        <n-text>Silakan masukkan Kode</n-text>
        <n-form>
          <n-space>
            <n-input
              ref="input"
              :disabled="loading"
              placeholder="Kode Serialisasi"
              v-model:value="search"
              style="width: 300px; max-width: 100%"
              @keyup.enter="handleEnter"
            />
          </n-space>
        </n-form>
        <n-p style="font-size: 0.8rem">Atau Scan Kode</n-p>
        <n-button
          type="primary"
          class="button-tnt"
          @click.prevent="handleSumbmit"
        >
          Scan Kode
        </n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

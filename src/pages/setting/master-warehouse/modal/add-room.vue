<script setup lang="ts">
import type { FormInst, FormItemRule } from "naive-ui"
import { useMessage } from "naive-ui"

const tMessage = useMessage()

const props = withDefaults(
  defineProps<{
    show: boolean
    value: any
    loading: boolean
  }>(),
  {
    show: false,
    value: () => ({}),
    loading: false,
  }
)

defineExpose({ handleCancelCrudRoom })

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:value", value: any): void
  (e: "click:save", value: any): void
}>()

const formRef = ref<FormInst | null>(null)
const model = ref<any>({})

const rules = ref()
rules.value = {
  name: {
    required: true,
    message: "Nama warehouse room tidak boleh kosong",
    trigger: "blur",
  },
  erp_code: {
    required: true,
    message: "Kode warehouse room tidak boleh kosong",
    trigger: "blur",
  },
  description: {
    required: true,
    message: "Deskripsi tidak boleh kosong",
    trigger: "blur",
  },
  minimum: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Suhu minimum tidak boleh kosong")
      } else if (!/^\d*$/.test(value)) {
        return new Error("Suhu minimum harus angka")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  maximum: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Suhu maximum tidak boleh kosong")
      } else if (!/^\d*$/.test(value)) {
        return new Error("Suhu maximum harus angka")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  warning_max_capacity: {
    required: true,
    validator(_: any, value: any) {
      if (Number(value) < 0) {
        return new Error("warning_max_capacity harus lebih dari 0%")
      } else if (Number(value) > 100) {
        return new Error("warning_max_capacity harus kurang dari 100%")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
}

function handleCancelCrudRoom() {
  emit("update:value", {})
  model.value = {}
  emit("update:show", false)
}

async function handleCrudRoom(e: MouseEvent) {
  e.preventDefault()
  await formRef.value
    ?.validate()
    .then(() => {
      emit("click:save", model.value)
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

function formatTooltip(value: number) {
  return `${value}%`
}

watch(model, (value) => emit("update:value", value), { deep: true })

onMounted(() => {
  model.value = props.value
})

onUpdated(() => {
  model.value = props.value
})
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    @update:show="$emit('update:show', $event)"
  >
    <n-card
      style="width: 650px; max-width: 100%; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      title="Warehouse Room"
      aria-modal="true"
    >
      <n-form
        ref="formRef"
        :model="model"
        class="form-tnt"
        :rules="rules"
        :show-require-mark="false"
      >
        <n-grid
          cols="2"
          item-responsive
          responsive="screen"
          :x-gap="16"
          :y-gap="0"
        >
          <n-grid-item span="2 m:1">
            <n-form-item
              path="name"
              label="Nama Warehouse Room"
            >
              <n-input
                v-model:value="model.name"
                placeholder="Masukkan Nama Warehouse Room"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:1">
            <n-form-item
              path="erp_code"
              label="Kode ERP Room"
            >
              <n-input
                v-model:value="model.erp_code"
                placeholder="Masukkan Kode ERP Room"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:2">
            <n-form-item
              path="description"
              label="Deskripsi"
            >
              <n-input
                v-model:value="model.description"
                placeholder="Masukkan Deskripsi"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:1">
            <n-form-item label="Suhu Minimum (°C)">
              <n-input
                v-model:value="model.minimum"
                placeholder="Masukkan Suhu Minimum"
                style="width: 100%"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:1">
            <n-form-item label="Suhu Maksimum (°C)">
              <n-input
                v-model:value="model.maximum"
                placeholder="Masukkan Suhu Maksimum"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:2">
            <n-form-item label="Volume Warehouse Room">
              <n-input-number
                :show-button="false"
                v-model:value="model.volume"
                placeholder="Masukkan Volume Warehouse Room"
                style="width: 100%"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:2">
            <n-form-item
              label="Warning Max Kapasitas"
              path="warning_max_capacity"
            >
              <n-space
                vertical
                style="width: 50%"
              >
                <n-slider
                  v-model:value="model.warning_max_capacity"
                  :step="1"
                  :format-tooltip="formatTooltip"
                />
                <n-input-number
                  size="small"
                  :show-button="false"
                  v-model:value="model.warning_max_capacity"
                  placeholder=""
                  style="width: 100%"
                >
                  <template #suffix> % </template>
                </n-input-number>
              </n-space>
            </n-form-item>
          </n-grid-item>
        </n-grid>
      </n-form>

      <n-space justify="center">
        <n-button
          :loading="loading"
          color="#828282"
          class="button-tnt"
          @click="handleCancelCrudRoom"
        >
          Batalkan
        </n-button>
        <n-button
          :loading="loading"
          color="#219653"
          class="button-tnt"
          @click="handleCrudRoom"
          >Simpan</n-button
        >
      </n-space>
    </n-card>
  </n-modal>
</template>

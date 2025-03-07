<script setup lang="ts">
import type { FormInst, SelectOption } from "naive-ui"
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

defineExpose({ handleCancelCrudRack, handleChangeTypeModal })

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:value", value: any): void
  (e: "click:save", value: any): void
}>()

const formRef = ref<FormInst | null>(null)
const model = ref<any>({
  volume: 0,
  warning_max_capacity: 0,
})
const typeOptions = ref<SelectOption[]>([
  { label: "Rack", value: "rack" },
  { label: "Pallete", value: "pallete" },
])
const modalType = ref("create")

const rules = ref()
rules.value = {
  rack_pallete_kind: {
    required: true,
    message: "Tipe tidak boleh kosong",
    trigger: "blur",
  },
  rack_pallete_name: {
    required: true,
    message: "Nama rack tidak boleh kosong",
    trigger: "blur",
  },
  rack_pallete_erp_code: {
    required: true,
    message: "Kode ERP tidak boleh kosong",
    trigger: "blur",
  },
  rack_pallete_id: {
    required: true,
    message: "ID pallete tidak boleh kosong",
    trigger: "blur",
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

function handleCancelCrudRack() {
  emit("update:value", {})
  model.value = {
    volume: 0,
    warning_max_capacity: 0,
  }
  modalType.value = "create"
  emit("update:show", false)
}

async function handleCrudRack(e: MouseEvent) {
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

function handleChangeTypeModal() {
  modalType.value = "update"
}

function formatTooltip(value: number) {
  return `${value}%`
}

watch(model, (value) => emit("update:value", value), { deep: true })

onMounted(() => {
  model.value = props.value
  if (model.value.volume === null) {
    model.value.volume = 0
  }
  if (model.value.warning_max_capacity === null) {
    model.value.warning_max_capacity = 0
  }
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
      style="width: 600px; max-width: 100%; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      title="Warehouse Rack/Pallete"
      aria-modal="true"
    >
      <n-form
        ref="formRef"
        :model="model"
        class="form-tnt"
        :rules="rules"
        :show-require-mark="false"
      >
        <n-form-item
          path="rack_pallete_kind"
          label="Pilih Tipe"
        >
          <n-select
            v-if="modalType == 'create'"
            v-model:value="model.rack_pallete_kind"
            :options="typeOptions"
          ></n-select>
          <n-input
            v-if="modalType == 'update'"
            readonly
            v-model:value="model.rack_pallete_kind"
            placeholder="Tipe"
          ></n-input>
        </n-form-item>

        <n-grid
          v-if="model.rack_pallete_kind"
          cols="2"
          item-responsive
          responsive="screen"
          :x-gap="16"
          :y-gap="0"
        >
          <n-grid-item span="2 m:1">
            <n-form-item
              path="rack_pallete_name"
              :label="'Nama ' + model.rack_pallete_kind"
            >
              <n-input
                v-model:value="model.rack_pallete_name"
                :placeholder="'Masukkan Nama ' + model.rack_pallete_kind"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:1">
            <n-form-item
              path="rack_pallete_erp_code"
              :label="'Kode ERP ' + model.rack_pallete_kind"
            >
              <n-input
                v-model:value="model.rack_pallete_erp_code"
                :placeholder="'Masukkan kode ERP ' + model.rack_pallete_kind"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item
            v-if="model.rack_pallete_kind == 'pallete'"
            span="2 m:1"
          >
            <n-form-item
              path="rack_pallete_id"
              :label="'ID ' + model.rack_pallete_kind"
            >
              <n-input
                v-model:value="model.rack_pallete_id"
                :placeholder="'Masukkan ID ' + model.rack_pallete_kind"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item span="2 m:1">
            <n-form-item label="Volume">
              <n-input-number
                :show-button="false"
                v-model:value="model.volume"
                placeholder="Masukkan Volume"
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
          @click="handleCancelCrudRack"
          >Batalkan</n-button
        >
        <n-button
          :loading="loading"
          color="#219653"
          class="button-tnt"
          @click="handleCrudRack"
          >Simpan</n-button
        >
      </n-space>
    </n-card>
  </n-modal>
</template>

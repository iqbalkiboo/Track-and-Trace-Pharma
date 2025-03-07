<script setup lang="ts">
import type { SelectOption } from "naive-ui"
import { Add } from "@vicons/ionicons5"

const props = withDefaults(
  defineProps<{
    show: boolean
    value: any
  }>(),
  {
    show: false,
    value: () => ({}),
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:value", value: any): void
  (e: "click:save", value: any): void
}>()

const model = ref<any>({})
const typeOptions = ref<SelectOption[]>([
  { label: "Rack", value: "rack" },
  { label: "Pallete", value: "pallete" },
])

function formatTooltip(value: number) {
  return `${value}%`
}

function handleAddBin() {
  if (Array.isArray(model.value.bin)) return model.value.bin.push({})
  return (model.value.bin = [{}])
}

function handleCancelAddRack() {
  emit("update:value", {})
  model.value = {}
  emit("update:show", false)
}

function handleAddRack() {
  emit("click:save", model.value)
  model.value = {}
}

watch(model, (value) => emit("update:value", value), { deep: true })

onMounted(() => {
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
      title="Setting Rack/Pallete"
      aria-modal="true"
    >
      <n-form
        ref="formRef"
        :model="model"
        class="form-tnt"
      >
        <n-form-item
          path="type"
          label="Pilih Tipe"
        >
          <n-select
            v-model:value="model.rack_pallete_kind"
            :options="typeOptions"
          ></n-select>
        </n-form-item>

        <n-grid
          v-if="model.rack_pallete_kind"
          cols="2"
          item-responsive
          responsive="screen"
          :x-gap="16"
          :y-gap="16"
        >
          <n-grid-item span="2 m:1">
            <n-form-item
              path="name"
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
                :placeholder="'Masukkan Kode ERP ' + model.rack_pallete_kind"
              ></n-input>
            </n-form-item>
          </n-grid-item>
          <n-grid-item
            v-if="model.rack_pallete_kind == 'pallete'"
            span="2 m:1"
          >
            <n-form-item
              path="rack_pallete_erp_code"
              :label="'ID ' + model.rack_pallete_kind"
            >
              <n-input
                v-model:value="model.rack_pallete_id"
                :placeholder="'Masukkan ID ' + model.rack_pallete_kind"
              ></n-input>
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-form-item
          v-if="model.rack_pallete_kind"
          :label="'Volume ' + model.rack_pallete_kind"
        >
          <n-input-number
            :show-button="false"
            v-model:value="model.volume"
            :placeholder="'Masukkan Volume ' + model.rack_pallete_kind"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item
          v-if="model.rack_pallete_kind"
          label="Warning Max Kapasitas"
        >
          <n-space
            vertical
            style="width: 100%"
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

        <n-form-item
          v-if="model.rack_pallete_kind == 'rack'"
          label="Bin"
        >
          <n-space
            vertical
            style="width: 100%"
          >
            <n-card
              v-for="bin in model.bin"
              :key="bin"
            >
              <n-form
                :model="bin"
                class="form-tnt"
              >
                <n-grid
                  cols="2"
                  item-responsive
                  responsive="screen"
                  :x-gap="16"
                  :y-gap="16"
                >
                  <n-grid-item span="2 m:1">
                    <n-form-item
                      path="bin_name"
                      label="Nama Bin"
                    >
                      <n-input
                        v-model:value="bin.bin_name"
                        placeholder="Masukkan Nama Bin"
                      ></n-input>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="2 m:1">
                    <n-form-item
                      path="bin_id"
                      label="ID Bin"
                    >
                      <n-input
                        v-model:value="bin.bin_id"
                        placeholder="Masukkan ID Bin"
                      ></n-input>
                    </n-form-item>
                  </n-grid-item>
                </n-grid>
              </n-form>
            </n-card>

            <n-button @click="handleAddBin()">
              <n-icon :component="Add"></n-icon>
              Tambah Bin
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>

      <n-space justify="center">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="handleCancelAddRack"
          >Batalkan</n-button
        >
        <n-button
          color="#219653"
          class="button-tnt"
          @click="handleAddRack"
          >Simpan</n-button
        >
      </n-space>
    </n-card>
  </n-modal>
</template>

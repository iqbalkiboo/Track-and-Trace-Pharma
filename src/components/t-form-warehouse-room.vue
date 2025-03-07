<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { Add } from "@vicons/ionicons5"

const props = withDefaults(
  defineProps<{
    value: any
  }>(),
  {
    value: () => ({}),
  }
)

const emit = defineEmits<{
  (e: "update:value", value: any): void
}>()

const formRef = ref<FormInst>()
const model = ref<any>({})
const modelRack = ref<any>({})
const showRackForm = ref(false)

function formatTooltip(value: number) {
  return `${value}%`
}

function handleShowRackForm() {
  showRackForm.value = true
}

function handleAddRack(value: any) {
  showRackForm.value = false
  modelRack.value = {}
  if (Array.isArray(model.value.rack_pallete))
    return model.value.rack_pallete.push(value)
  return (model.value.rack_pallete = [value])
}

watch(model, (value) => emit("update:value", value), { deep: true })

onMounted(() => {
  model.value = props.value
})
</script>

<template>
  <n-form
    ref="formRef"
    :model="model"
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
          path="room_name"
          label="Nama Warehouse Room"
        >
          <n-input
            v-model:value="model.room_name"
            placeholder="Masukkan Nama Warehouse Room"
          ></n-input>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="2 m:1">
        <n-form-item
          path="erp_code"
          label="Kode ERP Warehouse Room"
        >
          <n-input
            v-model:value="model.erp_code"
            placeholder="Masukkan Nama Warehouse Room"
          ></n-input>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="2 m:2">
        <n-form-item
          path="room_desc"
          label="Deskripsi"
        >
          <n-input
            v-model:value="model.room_desc"
            placeholder="Masukkan Deskripsi"
          ></n-input>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="2 m:1">
        <n-form-item
          path="minimum"
          label="Suhu Minimum (°C)"
        >
          <n-input-number
            :show-button="false"
            v-model:value="model.minimum"
            placeholder="Masukkan Suhu Minimum"
            style="width: 100%"
          ></n-input-number>
        </n-form-item>
      </n-grid-item>
      <n-grid-item span="2 m:1">
        <n-form-item
          path="maximum"
          label="Suhu Maksimum (°C)"
        >
          <n-input-number
            :show-button="false"
            v-model:value="model.maximum"
            placeholder="Masukkan Suhu Maksimum"
            style="width: 100%"
          ></n-input-number>
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
        <n-form-item label="Warning Max Kapasitas">
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

    <n-form-item label="Rack/Pallete">
      <n-space
        vertical
        :size="14"
        style="width: 100%"
      >
        <n-card
          style="border-radius: 12px"
          v-for="(rack, index) in model.rack_pallete"
          :key="rack"
          :content-style="{
            backgroundColor: '#FAFAFA',
            borderRadius: '12px',
          }"
        >
          <n-grid
            cols="4"
            item-responsive
            responsive="screen"
            :x-gap="16"
            :y-gap="16"
          >
            <n-grid-item span="4 m:1">
              <n-space
                vertical
                :size="0"
                align="start"
              >
                <n-text style="font-size: 13px; margin-bottom: 0"
                  >Nama {{ rack.rack_pallete_kind }}</n-text
                >
                <n-h6 style="font-size: 13px; margin-bottom: 0">{{
                  rack.rack_pallete_name
                }}</n-h6>
              </n-space>
            </n-grid-item>
            <n-grid-item span="4 m:1">
              <n-space
                vertical
                :size="0"
                align="start"
              >
                <n-text style="font-size: 13px; margin-bottom: 0"
                  >Kode {{ rack.rack_pallete_kind }}</n-text
                >
                <n-h6 style="font-size: 13px; margin-bottom: 0">{{
                  rack.rack_pallete_erp_code
                }}</n-h6>
              </n-space>
            </n-grid-item>
            <n-grid-item
              v-if="rack.rack_pallete_kind == 'rack'"
              span="4 m:1"
            >
              <n-space
                vertical
                :size="0"
                align="start"
              >
                <n-text style="font-size: 13px; margin-bottom: 0"
                  >Jumlah Bin</n-text
                >
                <n-h6 style="font-size: 13px; margin-bottom: 0">{{
                  rack.bin?.length ? rack.bin?.length : "0"
                }}</n-h6>
              </n-space>
            </n-grid-item>
            <n-grid-item
              :span="rack.rack_pallete_kind == 'rack' ? '4 m:1' : '4 m:2'"
            >
              <n-space
                align="center"
                justify="end"
                style="height: 100%"
              >
                <n-button
                  type="error"
                  class="button-tnt"
                  @click="model.rack_pallete.splice(index, 1)"
                >
                  Hapus
                </n-button>
              </n-space>
            </n-grid-item>
          </n-grid>
        </n-card>
        <n-button
          class="button-tnt"
          @click="handleShowRackForm()"
        >
          <n-icon :component="Add"></n-icon>
          Tambah Rack/Pallete
        </n-button>
      </n-space>
    </n-form-item>
  </n-form>

  <t-form-modal-rack
    v-model:show="showRackForm"
    v-model:value="modelRack"
    @click:save="handleAddRack($event)"
  ></t-form-modal-rack>
</template>

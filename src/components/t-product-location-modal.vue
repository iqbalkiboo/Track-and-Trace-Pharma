<script setup lang="ts">
import { ref } from "vue"
import { getWarehouseBuilding } from "@/models/penerimaan/reception"
import type { SelectOption } from "naive-ui"

const props = defineProps<{
  show: boolean
  name?: string
  code?: string
  warehouse_id: any
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: "update:show", type: boolean): void
  (e: "click:submit", type: string): void
}>()

const dataBuilding = ref<any>(null)
const building = ref<string>()
const page = ref(1)
const buildingOptions = ref<SelectOption[]>([])
const isShow = computed({
  get() {
    return props.show
  },
  set(val: boolean) {
    emit("update:show", val)
  },
})

watch(isShow, (val: boolean) => {
  if (val) {
    getBuildings()
  }
})

async function handleSubmit() {
  emit("click:submit", building.value as string)
}

async function getBuildings() {
  const res = await getWarehouseBuilding({
    limit: 1,
    page: page.value,
    sort: "desc",
    sort_field: "created_at",
    company_id: "",
  })

  const res2 = await getWarehouseBuilding({
    limit: res.data.total_data,
    page: page.value,
    sort: "desc",
    sort_field: "created_at",
    warehouse_id: props?.warehouse_id,
    company_id: "",
  })

  dataBuilding.value = res2.data
  res2.data.list.forEach((item: any) => {
    buildingOptions.value.push({
      label: item.name,
      value: item.id,
    })
  })
}
</script>

<template>
  <n-modal
    :show="props.show"
    @update:show="$emit('update:show', $event)"
  >
    <n-card
      style="width: 700px; --n-border-radius: 10px"
      content-style="padding: 15px 20px 28px 20px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical>
        <n-space
          vertical
          align="center"
          :size="0"
        >
          <n-h5 style="margin-bottom: 0"> Edit Lokasi </n-h5>
          <n-text style="margin-top: 0">
            Produk:
            <span style="font-weight: normal">
              {{ name }}
            </span>
          </n-text>
          <n-text style="margin-top: 0">
            Code:
            <span style="font-weight: normal">
              {{ code }}
            </span>
          </n-text>
        </n-space>

        <n-space vertical>
          <n-select
            :disabled="loading"
            v-model:value="building"
            :options="buildingOptions"
            placeholder="Pilih Warehouse"
          />
        </n-space>

        <n-space justify="center" style="margin-top: 10px;">
          <n-button
            :disabled="loading"
            type="tertiary"
            class="button-tnt"
            @click="$emit('update:show', false)"
          >
            Batalkan
          </n-button>
          <n-button
            :loading="loading"
            @click="handleSubmit()"
            type="primary"
            class="button-tnt"
          >
            Simpan
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

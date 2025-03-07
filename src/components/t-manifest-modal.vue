<script setup lang="ts">
import { ref } from "vue"
import { getWarehouseBuilding } from "@/models/penerimaan/reception"
import type { SelectOption } from "naive-ui"

const props = defineProps<{
  show: boolean
  data?: any
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: "update:show", type: boolean): void
  (e: "hideModal"): void
  (e: "click:submit", type: any): void
}>()

const isBtnLoading = ref(false)
const dataBuilding = ref<any>(null)
const building = ref<string>()
const step = ref(0)
const page = ref(1)
const buildingOptions = ref<SelectOption[]>([])

function handleCancel() {
  if (step.value != 0) {
    step.value = 0
  } else {
    emit("update:show", false)
  }
}

async function handleContinue() {
  if (step.value == 0) {
    await getBuildings()
    if (props.data.is_set_location) {
      emit("click:submit", {
        warehouse_building_id: building.value as string,
        is_set_location: props.data.is_set_location as boolean,
      })
    } else {
      step.value = 1
    }
  } else {
    emit("click:submit", {
      warehouse_building_id: building.value as string,
      is_set_location: props.data.is_set_location as boolean,
    })
  }
}

async function getBuildings() {
  isBtnLoading.value = true
  const res = await getWarehouseBuilding({
    limit: 1,
    page: page.value,
    sort: "desc",
    sort_field: "created_at",
    company_id: ""
  })

  const res2 = await getWarehouseBuilding({
    limit: res.data.total_data,
    page: page.value,
    sort: "desc",
    sort_field: "created_at",
    warehouse_id: props?.data?.do?.destination?.id,
    company_id: ""
  })

  isBtnLoading.value = false
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
          <n-space :size="3">
            <n-text> ID Manifest : </n-text>
            <n-text>{{ data?.manifest.code }}</n-text>
          </n-space>
          <n-space :size="3">
            <n-text> ID DO : </n-text>
            <n-text>{{ data?.do.code }}</n-text>
          </n-space>
          <n-space :size="3">
            <n-text> Tujuan : </n-text>
            <n-text>
              {{ data?.do.destination?.name || "-" }}
            </n-text>
          </n-space>
        </n-space>

        <n-space
          v-if="step == 0"
          vertical
        >
          <n-space :size="0" vertical>
            <n-space :size="2">
              <n-text>Qty Packing : </n-text>
              <n-text>{{ $filters.toNumber(data?.total.packing) }} </n-text>
            </n-space>
            <n-space :size="2">
              <n-text>Qty SKU : </n-text>
              <n-text>{{ $filters.toNumber(data?.total.product) }} </n-text>
            </n-space>
            <n-space :size="2">
              <n-text>Qty Pesan : </n-text>
              <n-text>{{ $filters.toNumber(data?.total.qty) }} </n-text>
            </n-space>
          </n-space>
          <n-space vertical>
            <n-card
              v-for="product in data?.products ?? []"
              :key="product.id"
            >
              <n-space
                vertical
                :size="0"
              >
                <n-space :size="3">
                  <n-text>Produk : </n-text>
                  <n-text>{{ product.name }}</n-text>
                </n-space>
                <n-space :size="3">
                  <n-text>ID Produk : </n-text>
                  <n-text>{{ product.code }}</n-text>
                </n-space>
                <n-space :size="3">
                  <n-text>Asal Produk : </n-text>
                  <n-text>
                    {{ product.superholding.name }}
                  </n-text>
                </n-space>
              </n-space>
            </n-card>
          </n-space>
        </n-space>

        <n-space
          vertical
          v-else
        >
          <n-select
            :disabled="loading"
            :options="buildingOptions"
            v-model:value="building"
            filterable
            placeholder="Pilih Warehouse"
          />
          <n-space>
            <!-- <n-switch v-model:value="isDefault" /> -->
            <!-- <n-text>Default</n-text> -->
          </n-space>
        </n-space>

        <n-space justify="center">
          <n-button
            :disabled="loading || isBtnLoading"
            type="primary"
            ghost
            class="button-tnt"
            @click="handleCancel()"
          >
            Batalkan
          </n-button>
          <n-button
            :loading="loading || isBtnLoading"
            type="primary"
            class="button-tnt"
            @click="handleContinue()"
          >
            Lanjutkan
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

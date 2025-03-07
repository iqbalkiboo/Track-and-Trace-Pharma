<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { useMessage } from "naive-ui"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"

const props = withDefaults(
  defineProps<{
    show: boolean
    value: any
    isBulk?: boolean
    level: number
    detailData?: any
    selectedData?: any
  }>(),
  {
    show: false,
    value: () => ({}),
    level: 1,
    detailData: () => ({}),
    selectedData: () => ({}),
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:value", value: any): void
  (e: "click:close", value: boolean): void
  (e: "click:confirm", value: boolean): void
}>()

const tMessage = useMessage()

const isLoading = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})
const plantOptions = ref<any>([])
const buildingOptions = ref<any>([])
const rules = ref()
rules.value = {
  plant: {
    required: true,
    message: "Warehouse plant/cabang tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  building: {
    required: true,
    message: "Warehouse building tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}

watch(formValue, (value) => emit("update:value", value), { deep: true })
watch(
  () => props.show,
  (value) => {
    if (value) {
      getData()
    }
  }
)

onMounted(() => {
  formValue.value = props.value
})

onUpdated(() => {
  formValue.value = props.value
})

async function getData() {
  isLoading.value = true
  await getWarehouse()
  isLoading.value = false
}

async function getWarehouse() {
  formValue.value.plant = null
  formValue.value.building = null
  plantOptions.value = []
  buildingOptions.value = []
  const params = {
    sort: "desc",
    sort_field: "created_at",
    page: 1,
    limit: -1,
  }
  await masterWarehouseModel
    .getWarehouse(params)
    .then((res) => {
      const listWarehouse = res.data.list
      listWarehouse.forEach((el: any) => {
        plantOptions.value.push({
          key: el.key,
          value: el.id,
          label: el.name,
        })
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getBuilding(idWarehouse: string) {
  isLoading.value = true
  formValue.value.building = null
  buildingOptions.value = []
  const params = {
    warehouse_id: idWarehouse,
    sort: "desc",
    sort_field: "created_at",
    page: 1,
    limit: -1,
    type: "good",
  }
  await masterWarehouseModel
    .getBuilding(params)
    .then((res) => {
      const listBuilding = res.data.list
      listBuilding.forEach((el: any) => {
        buildingOptions.value.push({
          key: el.key,
          value: el.id,
          label: el.name,
        })
      })
      isLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function handleValidateClick() {
  await formRef.value
    ?.validate()
    .then(() => {
      emit("click:confirm", true)
      emit("update:value", formValue.value)
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 470px; max-width: 100%; border-radius: 10px"
    :header-style="{
      paddingLeft: '30px',
      paddingRight: '30px',
      paddingBottom: '15px',
    }"
    :content-style="{
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '20px',
    }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space
      vertical
      style="padding-left: 10px; padding-right: 10px"
    >
      <div style="text-align: start; margin-bottom: 20px">
        <template v-if="$route.name === 'produksi-pengecekan-tahap2-id'">
          <n-h4 style="margin-bottom: 0">
            No PK : {{ props.detailData.pk_id }}
          </n-h4>
        </template>
        <template v-else>
          <n-h4
            v-if="!props.isBulk"
            style="margin-bottom: 0"
          >
            Kode Level {{ props.level }} : {{ props.selectedData.code }}
          </n-h4>
          <n-h4
            v-else
            style="margin-bottom: 0"
          >
            Bulk Penyimpanan {{ props.detailData.pk_id }}
          </n-h4>
        </template>
        <n-space
          vertical
          :size="0"
        >
          <n-text style="font-size: 14px">{{
            props.detailData.product.long_name
          }}</n-text>
        </n-space>
      </div>
      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item
          label="Pilih Warehouse Plant/Cabang"
          path="plant"
        >
          <n-select
            v-model:value="formValue.plant"
            :options="plantOptions"
            filterable
            placeholder="Pilih Warehouse Plant/Cabang"
            :disabled="isLoading"
            @update-value="getBuilding($event)"
          />
        </n-form-item>
        <n-form-item
          label="Pilih Warehouse Bulding"
          path="building"
        >
          <n-select
            v-model:value="formValue.building"
            :options="buildingOptions"
            filterable
            placeholder="Pilih Warehouse Bulding"
            :disabled="isLoading"
          />
        </n-form-item>
        <n-space justify="center">
          <n-button
            :loading="isLoading"
            type="primary"
            class="button-tnt"
            @click="handleValidateClick"
            >Simpan</n-button
          >
        </n-space>
      </n-form>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { masterWarehouseModel } from '@/models/setting/master-warehouse'

const props = withDefaults(
  defineProps<{
    show: boolean
    value: any
    loading: boolean
  }>(),
  {
    show: false,
    value: () => ({}),
    loading: false
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
    message: 'Plant tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  building: {
    required: true,
    message: 'Building tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
  reason: {
    required: true,
    message: 'Alasan tidak boleh kosong',
    trigger: ['input', 'blur'],
  },
}

watch(formValue, (value) => emit('update:value', value), { deep: true })
watch(() => props.show, (value) => {
  if (value) {
    getData()
  }
})

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
  isLoading.value = true
  formValue.value.building = null
  plantOptions.value = []
  const params = {
    sort: 'desc',
    sort_field: 'created_at',
    page: 1,
    limit: -1
  }
  await masterWarehouseModel.getWarehouse(params).then((res) => {
    const listBuilding = res.data.list
    listBuilding.forEach((el: any) => {
      plantOptions.value.push({
        key: el.key,
        value: el.id,
        label: el.name,
      })
    })
    isLoading.value = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getBuilding(id: string) {
  isLoading.value = true
  formValue.value.building = null
  buildingOptions.value = []
  const params = {
    warehouse_id: id,
    sort: 'desc',
    sort_field: 'created_at',
    page: 1,
    limit: -1
  }
  await masterWarehouseModel.getBuilding(params).then((res) => {
    const listBuilding = res.data.list
    listBuilding.forEach((el: any) => {
      buildingOptions.value.push({
        key: el.key,
        value: el.id,
        label: el.name,
      })
    })
    isLoading.value = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function handleValidateClick() {
  await formRef.value?.validate().then(() => {
    emit('click:confirm', true)
    emit('update:value', formValue.value)
  }).catch(() => {
    tMessage.error('Form tidak valid, tolong periksa kembali')
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
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical style="padding-left: 10px; padding-right: 10px;">
      <div style="text-align: start; margin-bottom: 20px;">
        <n-h4 style=" margin-bottom: 0">
          Pilih Warehouse Tujuan
        </n-h4>
      </div>
      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
      <n-form-item label="Pilih Plant" path="plant">
          <n-select
            v-model:value="formValue.plant"
            :options="plantOptions"
            filterable
            placeholder="Pilih Plant"
            :disabled="isLoading"
            @update-value="getBuilding($event)"
          />
        </n-form-item>
        <n-form-item label="Pilih Bulding" path="building">
          <n-select
            v-model:value="formValue.building"
            :options="buildingOptions"
            filterable
            placeholder="Pilih Warehouse Bulding"
            :disabled="isLoading"
          />
        </n-form-item>
        <n-form-item label="Alasan" path="reason">
          <n-input
            v-model:value="formValue.reason"
            placeholder="Masukkan Alasan"
            :disabled="isLoading"
          />
        </n-form-item>
        <n-space justify="center">
          <n-button
            :loading="isLoading || props.loading"
            type="primary"
            class="button-tnt"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </n-space>
      </n-form>
    </n-space>
  </n-modal>
</template>

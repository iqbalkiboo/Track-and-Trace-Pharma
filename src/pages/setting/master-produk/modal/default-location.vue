<script setup lang="ts">
  import { useMessage } from 'naive-ui'
  import type { FormInst } from 'naive-ui'
  import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
  import { masterWarehouseModel } from '@/models/setting/master-warehouse'

  // const route = useRoute()
  const tMessage = useMessage()
  // const model = ref({})

  const props = defineProps<{
    isShowModal?: boolean,
    value?: any,
  }>()

  const emits = defineEmits<{
    (e: 'hideModal'): void
    (e: 'click:save', value: any): void
    (e: 'update:isShowModal', type: boolean): void
  }>()

  const detailResBuilding = ref<any>({})
  const formValue = ref<any>({})
  const formRef = ref<FormInst | null>(null)
  const rules = ref()
  rules.value = {
    building_id: {
      required: true,
      message: 'Building tidak boleh kosong',
      trigger: 'blur',
    },
    room_id: {
      required: true,
      message: 'Room tidak boleh kosong',
      trigger: 'blur',
    },
  }

  const buildingOptions = ref<SelectMixedOption[]>([])
  const roomOptions = ref<SelectMixedOption[]>([])

  const hideModal = () => {
    setTimeout(() => {
      emits('hideModal')
    }, 100)
  }

  onMounted(() => {
    formValue.value = props.value
    getDataBuilding()
  })

  async function getDataBuilding() {
    buildingOptions.value = []
    await masterWarehouseModel.getBuilding({limit: -1}).then((res: any) => {
      const dataBuilding = res.data.list
      dataBuilding.forEach((data: any) => {
        buildingOptions.value.push({
          value: data.id,
          label: data.name
        })
      })
      
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  }

  async function handleSelctedBuilding(id: any){
    formValue.value.room_id = ""
    await masterWarehouseModel.getDetailBuilding(id).then((res: any) => {
      detailResBuilding.value = res.data
      formValue.value.warehouse_name = detailResBuilding.value.warehouse.name
      formValue.value.warehouse_id = detailResBuilding.value.warehouse.id
      getDataRoom(detailResBuilding.value.warehouse.id, detailResBuilding.value.id)
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  }

  async function getDataRoom(warehouse_id: any, building_id: any) {
    roomOptions.value = []
    await masterWarehouseModel.getRoom({
      limit: -1,
      warehouse_id,
      building_id
    }).then((res: any) => {
      const dataRoom = res.data.list
      dataRoom.forEach((data: any) => {
        roomOptions.value.push({
          value: data.id,
          label: data.name
        })
      })
      
    }).catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
  }

  function saveData() {
    emits('click:save', formValue.value)
    // emits("dataWarehouse", formValue.value)
  }
</script>

<template>
  <n-modal
    :show="props.isShowModal"
    @update:show="$emit('update:isShowModal', $event)"
  >
    <n-card
      style="width: 470px; --n-border-radius: 10px"
      content-style="padding: 15px 20px 28px 20px;"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical :size="25">
        <n-h3 style="font-size: 16px; margin-bottom: 0">Edit Default Location</n-h3>
        <n-form ref="formRef" class="form-tnt" :model="formValue" :rules="rules" :show-require-mark="false">
          <n-form-item path="building" label="Pilih Warehouse Building">
            <n-select
              v-model:value="formValue.building_id"
              :options="buildingOptions"
              placeholder="Pilih Warehouse Building"
              style="width: 100%"
              @update:value="handleSelctedBuilding"
            />
          </n-form-item>
          <n-form-item path="room" label="Pilih Warehouse Room">
            <n-select
              v-model:value="formValue.room_id"
              :disabled="roomOptions.length == 0"
              :options="roomOptions"
              placeholder="Pilih Warehouse Room"
              style="width: 100%"
            />
          </n-form-item>
        </n-form>

        <n-space justify="center">
          <n-button color="#828282" class="button-tnt" @click="hideModal"
            >Batalkan</n-button
          >
          <n-button color="#219653" class="button-tnt" @click="saveData"
            >Simpan</n-button
          >
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>
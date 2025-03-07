<script setup lang="ts">
  import type { FormInst } from 'naive-ui'
  import { Add } from '@vicons/ionicons5'

  const props = withDefaults(
    defineProps<{
      value: any
    }>(),
    {
      value: () => ({}),
    }
  )

  const emit = defineEmits<{
    (e: 'update:value', value: any): void
  }>()

  const formRef = ref<FormInst>()
  const model = ref<any>({})

  function handleAddRoom() {
    if (Array.isArray(model.value.rooms)) return model.value.rooms.push()
    return (model.value.rooms = [{}])
  }

  watch(model, (value) => emit('update:value', value), { deep: true })

  onMounted(() => {
    model.value = props.value
  })
</script>

<template>
  <n-form ref="formRef" :model="model">
    <n-form-item path="name" label="Nama Warehouse Building">
      <n-input
        v-model:value="model.name"
        placeholder="Masukkan Nama Warehouse Plant/Cabang"
      />
    </n-form-item>

    <n-form-item path="location" label="Lokasi Warehouse Building">
      <n-input
        v-model:value="model.location"
        placeholder="Masukkan Lokasi Warehouse Plant/Cabang"
      />
    </n-form-item>

    <n-form-item path="code" label="Kode Warehouse Building">
      <n-input
        v-model:value="model.code"
        placeholder="Masukkan Kode Warehouse Plant/Cabang"
      />
    </n-form-item>

    <n-form-item label="Warehouse Room">
      <n-space vertical :size="14" style="margin-top: 5px; width: 100%">
        <n-card style="border-radius: 12px" v-for="(room, index) in model.rooms" :key="room">
          <t-form-warehouse-room
            v-model:value="model.rooms[index]"
          ></t-form-warehouse-room>
        </n-card>

        <n-button class="button-tnt" @click="handleAddRoom()">
          <n-icon :component="Add"></n-icon>
          Tambah Warehouse Room
        </n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

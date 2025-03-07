<script setup lang="ts">
  import { CheckmarkCircleOutline } from '@vicons/ionicons5'
  import type {
    FormInst,
    FormItemRule,
    FormRules,
    SelectOption,
  } from 'naive-ui'

  const showModal = ref(false)
  const formRef = ref<FormInst>()
  const model = ref({ serialisasi: '' })
  const options = ref<SelectOption[]>([
    { label: 'BPOM', value: 'BPOM' },
    { label: 'GS-1', value: 'GS-1' },
  ])

  const rules = ref<FormRules>({
    serialisasi: [
      {
        required: true,
        validator: (rule: FormItemRule, value: string) => {
          if (value.length < 1)
            return new Error('Serialisasi tidak boleh kosong')
        },
        trigger: ['input', 'blur'],
      },
    ],
  })

  async function handleSubmit() {
    await formRef.value?.validate()
    showModal.value = true
  }

  // function handleAddOther() {
  //   model.value = { serialisasi: '' }
  //   showModal.value = false
  // }
</script>
<template>
  <n-space vertical style="padding: 1rem">
    <n-space vertical :size="0">
      <n-h1 style="margin-bottom: 0"> Edit Master Serialisasi </n-h1>
      <n-breadcrumb>
        <n-breadcrumb-item>Master Serialisasi</n-breadcrumb-item>
        <n-breadcrumb-item>Edit</n-breadcrumb-item>
      </n-breadcrumb>
    </n-space>

    <n-card style="border-radius: 10px" :bordered="false">
      <n-space vertical :size="24">
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item path="serialisasi" label="Tentukan Serialisasi">
            <n-select
              v-model:value="model.serialisasi"
              :options="options"
              placeholder="Pilih Serialisasi"
            />
          </n-form-item>
        </n-form>
      </n-space>
    </n-card>

    <n-space justify="center">
      <router-link
        :to="{ name: 'setting-kategori-kemasan' }"
        style="text-decoration: none"
      >
        <n-button type="primary" color="gray">Batalkan</n-button>
      </router-link>
      <n-button type="primary" @click="handleSubmit">Tambah</n-button>
    </n-space>
  </n-space>

  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical align="center">
        <n-icon
          :size="64"
          color="#18a058"
          :component="CheckmarkCircleOutline"
        />
        <n-h3 style="margin-bottom: 0">Selamat</n-h3>
        <n-h6 style="margin-bottom: 0">Serialisasi berhasil diubah</n-h6>

        <n-space justify="center">
          <router-link
            :to="{ name: 'setting-kategori-kemasan' }"
            style="text-decoration: none"
          >
            <n-button type="primary">Kembali ke Beranda</n-button>
          </router-link>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

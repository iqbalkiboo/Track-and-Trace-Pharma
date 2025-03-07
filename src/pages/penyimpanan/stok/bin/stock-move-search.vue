<template>
  <n-space vertical style="padding: 1rem">
    <n-row
      :cols="12"
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <n-col :span="12">
        <n-space vertical :size="0">
          <n-h1 style="margin-bottom: 0"> Penyimpanan </n-h1>
          <n-breadcrumb>
            <n-breadcrumb-item href="/penyimpanan/detail-bin"
              >Stock Move</n-breadcrumb-item
            >
            <n-breadcrumb-item>Scan</n-breadcrumb-item>
          </n-breadcrumb>
        </n-space>
      </n-col>
    </n-row>

    <n-card style="text-align: center">
      Silahkan masukkan ID Rack pada kolom yang tersedia
    </n-card>

    <n-space vertical style="text-align: center">
      <n-input
        v-model:value="value"
        type="text"
        placeholder="Masukkan ID Rack"
        style="width: 500px; max-width: 200%"
      />

      <n-button
        type="primary"
        style="margin-left: 10px"
        @click="onSaveStockIn()"
      >
        Lanjutkan
      </n-button>
    </n-space>
  </n-space>
</template>

<script>
  export default {
    methods: {
      onSaveStockIn() {
        this.$router.push('/penyimpanan/bin/stock-move-list')
      },
    },
  }
</script>

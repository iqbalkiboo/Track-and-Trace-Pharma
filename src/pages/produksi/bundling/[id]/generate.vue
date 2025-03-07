<route lang="yaml">
meta:
  layout: auth
  title: Generate Serialisasi
</route>
<script setup lang="ts">
  import { ref } from 'vue'

  const isGenerate = ref(false)
</script>

<template>
  <div class="body-tnt">
    <template v-if="isGenerate">
      <n-h2 style="margin-bottom: 4px">Generate Serialisasi</n-h2>
      <n-text style="font-weight: 500; margin-top: 0; margin-bottom: 4px"
        >Sistem sedang melakukan proses serialisasi . . . .</n-text
      >
      <div class="card-tnt">
        <n-space vertical :size="24">
          <n-space vertical :size="0">
            <n-text style="display: block; font-weight: 500; margin-bottom: 8px"
              >Generate Primer</n-text
            >
            <n-text style="display: block; font-size: 12px; margin-bottom: 5px"
              >Generate 800 dari 5.000 primer</n-text
            >
            <n-progress
              type="line"
              :color="'#2D9CDB'"
              :percentage="40"
              :indicator-placement="'inside'"
              processing
            />
          </n-space>
          <n-space vertical :size="0">
            <n-text style="display: block; font-weight: 500; margin-bottom: 8px"
              >Generate Sekunder</n-text
            >
            <n-text style="display: block; font-size: 12px; margin-bottom: 5px"
              >Generate 100 dari 5000 sekunder</n-text
            >
            <n-progress
              type="line"
              :color="'#2D9CDB'"
              :percentage="20"
              :indicator-placement="'inside'"
              processing
            />
          </n-space>
          <n-space vertical :size="0">
            <n-text style="display: block; font-weight: 500; margin-bottom: 8px"
              >Generate Tersier</n-text
            >
            <n-text style="display: block; font-size: 12px; margin-bottom: 5px"
              >Generate 100 dari 100 tersier</n-text
            >
            <n-progress
              type="line"
              :color="'#27AE60'"
              :percentage="100"
              :indicator-placement="'inside'"
              processing
            />
          </n-space>
        </n-space>
      </div>
      <n-space justify="center" style="margin-top: 24px">
        <router-link to="/penerimaan" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">
            Kembali Ke Beranda
          </n-button>
        </router-link>
      </n-space>
    </template>
    <template v-if="!isGenerate">
      <n-h2 style="margin-bottom: 4px">Generate Serialisasi Berhasil</n-h2>
      <n-text style="font-weight: 500; margin-top: 0; margin-bottom: 4px"
        >Selamat! 5.000 packaging berhasil terserialisasi</n-text
      >
      <n-space justify="start" style="margin-top: 24px">
        <router-link to="/penerimaan" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">
            Kembali Ke Beranda
          </n-button>
        </router-link>
        <router-link
          to="/penerimaan/1/serialization"
          class="text-decoration-none"
        >
          <n-button color="#219653" class="button-tnt">
            Lihat Serialisasi
          </n-button>
        </router-link>
      </n-space>
    </template>
  </div>
</template>

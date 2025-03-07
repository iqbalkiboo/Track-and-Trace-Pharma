<script setup lang="ts">
  import {} from 'vue'

  const dataTable = [
    {
      product: 'Paracetamol (500)',
      bin: 'A01.02.03',
      tersier_code: '541726 68299',
      batch: '57578865',
      qty: '215',
    },
    {
      product: 'Indovac (700)',
      bin: 'A01.02.03',
      tersier_code: '541726 68299',
      batch: '57578865',
      qty: '10',
    },
    {
      product: 'Oskadon Oye (1000)',
      bin: 'A01.02.03',
      tersier_code: '541726 68299',
      batch: '57578865',
      qty: '300',
    },
    {
      product: 'Napacin (200)',
      bin: 'A01.02.03',
      tersier_code: '541726 68299',
      batch: '57578865',
      qty: '20',
    },
    {
      product: 'Neo-remachyl (100)',
      bin: 'A01.02.03',
      tersier_code: '541726 68299',
      batch: '57578865',
      qty: '70',
    },
  ]
</script>

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
            <n-breadcrumb-item>Stock Move</n-breadcrumb-item>
            <n-breadcrumb-item>Scan</n-breadcrumb-item>
          </n-breadcrumb>
        </n-space>
      </n-col>
    </n-row>

    <n-card style="text-align: center; margin-bottom: 2rem">
      Apakah Anda akan memindahkan item berikut
    </n-card>

    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>No</th>
          <th>Bin</th>
          <th>Item</th>
          <th>Tersier Code</th>
          <th>Batch</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in dataTable" :key="key">
          <td>{{ key + 1 }}</td>
          <td>{{ item.bin }}</td>
          <td>{{ item.product }}</td>
          <td>{{ item.tersier_code }}</td>
          <td>{{ item.batch }}</td>
          <td>{{ item.qty }}</td>
        </tr>
      </tbody>
    </n-table>

    <n-card style="text-align: center; margin-bottom: 2rem">
      Dari Rack <strong>[NAMA RACK SEBELUM]</strong> ke
      <strong>[NAMA RACK SESUDAH]</strong>
      <div style="margin-top: 25px">
        <router-link
          :to="{ name: 'penyimpanan-bin-stock-move-search' }"
          style="text-decoration: none"
        >
          <n-button type="error" style="margin-right: 10px; width: 200px">
            Tidak
          </n-button>
        </router-link>
        <router-link
          :to="{ name: 'penyimpanan-bin-stock-move-success' }"
          style="text-decoration: none"
        >
          <n-button type="primary" style="margin-left: 10px; width: 200px">
            Ya, Betul
          </n-button>
        </router-link>
      </div>
    </n-card>
  </n-space>
</template>

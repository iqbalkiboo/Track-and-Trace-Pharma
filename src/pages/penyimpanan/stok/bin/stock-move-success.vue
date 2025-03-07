<script setup lang="ts">
  import {} from 'vue'

  const dataMoving = [
    {
      rack_before: '6268',
      product: 'Paramicin (500)',
      tersier_code: '541726 68299',
      qty: '214',
    },
    {
      rack_before: '6268',
      product: 'Inovac (500)',
      tersier_code: '541726 68299',
      qty: '214',
    },
    {
      rack_before: '6268',
      product: 'Caramel (500)',
      tersier_code: '541726 68299',
      qty: '214',
    },
  ]
</script>
<template>
  <n-space vertical style="padding: 1rem">
    <div
      style="
        dsiplay: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      "
    >
      <n-card size="large" style="width: 100%">
        <h1 style="margin-bottom: 0px">SELAMAT</h1>
        <h5 style="margin-top: 0px">Data berhasil dipindah</h5>
        <div
          style="
            dsiplay: flex;
            justify-content: center;
            align-items: center;
            overflow: auto;
            height: calc(100vh - 320px);
          "
        >
          <n-card
            size="large"
            v-for="(item, key) in dataMoving"
            :key="key"
            style="text-align: left !important"
          >
            <n-list>
              <template #header>
                {{ item.rack_before }}
              </template>
              <n-list-item>
                <div>{{ item.product }}</div>
                <div>{{ item.tersier_code }}</div>
                <div>{{ item.qty }}</div>
              </n-list-item>
            </n-list>
          </n-card>
        </div>

        <router-link
          :to="{ name: 'penyimpanan-detail-bin' }"
          style="text-decoration: none"
        >
          <n-button type="primary" style="margin-top: 2rem; width: 200px">
            Selesai
          </n-button>
        </router-link>
      </n-card>
    </div>
  </n-space>
</template>

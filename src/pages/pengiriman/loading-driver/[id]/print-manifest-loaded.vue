<route lang="yaml">
meta:
  layout: auth
  title: Print Manifest
</route>
<script setup lang="ts">

const dataTable = ref([
  {
    id_packing: "08678687",
    id_product: "08678687",
    batch: "08678687",
    product: "Covid-19 Vaccine Astrazeneca",
    qty_tersier: "1",
    qty_sekunder: "1",
    qty_primer: "50",
  },
  {
    id_packing: "79659769",
    id_product: "79659769",
    batch: "79659769",
    product: "Covid-19 Vaccine Pfizer",
    qty_tersier: "1",
    qty_sekunder: "2",
    qty_primer: "150",
  },
])
</script>
<template>
  <n-space vertical style="padding: 1rem">

    <n-row
      :cols="12"
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <n-col :span="12">
        <n-space vertical :size="0">
          <n-h1 style="margin-bottom: 0"> Cetak Manifest </n-h1>
        </n-space>
      </n-col>
      <n-col :span="12">
        <n-button style="float: right;" type="primary">
          Print Manifest
        </n-button>
      </n-col>
    </n-row>
    
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <n-avatar
              round
              :size="56"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
          </div>
          <div style="margin-left: 2rem;">
            <div style="font-size: 20px;font-weight: bold;">{{ 'PT.Indofarma Global Medika' }}</div>
            <div>{{ 'Jl. Indofarma No. 17, bandung' }}</div>
          </div>
        </div>
      </div>
      <div>
        <n-card>
          <div style="margin-bottom: 10px;">ID Packing: {{ '00192932818' }}</div>
          <n-avatar
            :size="50"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </n-card>
      </div>
    </div>

    <n-row
      :cols="12"
      style="display: flex; justify-content: space-between; align-items: center">
      <n-col :span="10">
        <n-space vertical :size="0">
          <n-h4 style="margin-bottom: 0"> ID Manifest: 89098 </n-h4>
          <span>ID DO : PS0001</span>
          <span>Tanggal Pengiriman : PS0001</span>
          <p>PIC Packing : [NAMA_PIC]</p>
          <p>Total Qty Packing : 3</p>
        </n-space>
      </n-col>
      <n-col :span="10">
        <n-space vertical :size="0" >
          <n-h4 style="margin-bottom: 0"> Tujuan: Indofarma Semarang </n-h4>
          <span>Jl. Pamularsih Raya No.Kav67/60, Bongsari, Kec. Seamrang Barat, Kota Semarang Jawa Tengah</span>
          <p>Tipe Pengiriman : Direct Manual</p>
          <p>Tanggal Packing : 12 Desember 2022</p>
        </n-space>
      </n-col>
      <n-col :span="3">
        <!-- <router-link :to="{ path: '/pengiriman/loading/1/print-manifest'}">
          <n-button style="float: right;">
            Cetak Manifest
          </n-button>
        </router-link> -->
      </n-col>
    </n-row>

    <n-table :bottom-bordered="false" :bordered="false" :single-line="true" v-if="dataTable.length > 0">
      <n-thead>
        <n-tr style="border-radius: 20px">
          <n-th style="background-color: #f2994a; color: white">ID Packing</n-th>
          <n-th style="background-color: #f2994a; color: white">ID Product</n-th>
          <n-th style="background-color: #f2994a; color: white">Batch</n-th>
          <n-th style="background-color: #f2994a; color: white">Product</n-th>
          <n-th style="background-color: #f2994a; color: white">Qty Level 3</n-th>
          <n-th style="background-color: #f2994a; color: white">Qty Level 2</n-th>
          <n-th style="background-color: #f2994a; color: white">Qty Level 1</n-th>
        </n-tr>
      </n-thead>

      <n-tbody>
        <n-tr v-for="(item, key) in dataTable" :key="key">
          <n-td>{{ item.id_packing }}</n-td>
          <n-td>{{ item.id_product }}</n-td>
          <n-td>{{ item.batch }}</n-td>
          <n-td>{{ item.product }}</n-td>
          <n-td>{{ item.qty_tersier }}</n-td>
          <n-td>{{ item.qty_sekunder }}</n-td>
          <n-td>{{ item.qty_primer }}</n-td>
        </n-tr>
      </n-tbody>
    </n-table>

    <n-card>

        <n-h2 style="margin-top: 2rem;">Penerima</n-h2>
        <n-row :cols="12" style="margin-bottom: 2rem;">
          <n-col :span="12">
            <div>Nama Penerima</div>
            [Firman]
          </n-col>

          <n-col :span="12">
            <div>Tanggal</div>
            [26 Januari 2023]
          </n-col>
        </n-row>

        <n-row :cols="12" style="margin-bottom: 2rem;">
          <n-col :span="12">
            <div>No. HP Penerima</div>
            08123484839390
          </n-col>

          <n-col :span="12">
            <div>Email Penerima</div>
            <span>[firmanazizi@gmail.com]</span>
          </n-col>

        </n-row>

        <div style="margin-bottom: 2rem;">
          <div>Jabatan Penerima</div>
          <span>[PIC Penerimaan Gudang]</span>
        </div>

        <div>Foto Bukti</div>
        <n-image
          width="100"
          src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        />

        <div style="margin-top: 2rem;">Tanda Tangan Digital</div>
        <n-card style="width: 200px;">
          Tanda Tangan
        </n-card>

      </n-card>

  </n-space>
</template>
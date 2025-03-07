<route lang="yaml">
meta:
  layout: auth
  title: Detail Loaded
</route>
<script setup lang="ts">

  
  const data_index_driver = ref(null)
  // const data_index = ref(null)
  // const showDetailPacking = ref(false)

  const dataDriver = ref([
    {
      driver_name: 'Sugiono',
      plat_nomor: 'AB 6569 DE',
      vehicle_type: 'Mobil Box',
      pemilik: 'Indofarma Semarang'
    },
    {
      driver_name: 'Parmono',
      plat_nomor: 'AB 6529 DE',
      vehicle_type: 'Mobil Box',
      pemilik: 'Indofarma Semarang'
    },
  ])

  const dataTable = ref([
    {
      code: '0007272839',
      name: 'Paramex 100g',
      total_level_1: 100,
      batch:"",
      qty_level_3: 1000
    },
    {
      code: '0007272839',
      name: 'Paramex 100g',
      batch:"",
      total_level_1: 100,
      qty_level_3: 1000
    },
    {
      code: '0007272839',
      name: 'Paramex 100g',
      batch:"",
      total_level_1: 100,
      qty_level_3: 1000
    },
  ])


  const dataPacking = ref([
  {
    id_packing: '0019283829',
    level_pack: 1,
    qty_level_1: 100,
    data: [
      {
        id_serial: 'TR0001',
        level: 'Level 1',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0002',
        level: 'Level 1',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0003',
        level: 'Level 1',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0001',
        level: 'Level 1',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0001',
        level: 'Level 1',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
    ]
  },
  {
    id_packing: '0019283830',
    level_pack: 2,
    qty_level_1: 100,
    data: [
      {
        id_serial: 'TR0001',
        level: 'Level 2',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0002',
        level: 'Level 2',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0003',
        level: 'Level 2',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0001',
        level: 'Level 2',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0001',
        level: 'Level 2',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
    ]
  },
  {
    id_packing: '0019283828',
    level_pack: 2,
    qty_level_1: 100,
    data: [
      {
        id_serial: 'TR0001',
        level: 'Level 3',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0002',
        level: 'Level 3',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0003',
        level: 'Level 3',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0001',
        level: 'Level 3',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
      {
        id_serial: 'TR0001',
        level: 'Level 3',
        product: 'Paracetamol 100mg',
        qty: '100',
      },
    ]
  }
])

  function showDetailDriver(index: any) {
    data_index_driver.value === index ? data_index_driver.value = null : data_index_driver.value = index
    // if (data_index.value == String(index)) {
    //   data_index.value = ''
    // }else {
    //   data_index.value = String(index)
    // }

  }
  // function showDetail(index: any) {
  //   data_index.value === index ? data_index.value = null : data_index.value = index
  //   // if (data_index.value == String(index)) {
  //   //   data_index.value = ''
  //   // }else {
  //   //   data_index.value = String(index)
  //   // }

  // }
</script>

<template>
  <n-space vertical style="padding: 1rem">
    
    <n-row
      :cols="12"
      style="display: flex; justify-content: space-between; align-items: center">
      <n-col :span="10">
        <n-space vertical :size="0">
          <n-h1 style="margin-bottom: 0"> ID Manifest: 89098 </n-h1>
          <span>ID DO : PS0001</span>
          <span>Target Tanggal Pengiriman : PS0001</span>
        </n-space>
      </n-col>
      <n-col :span="10">
        <n-space vertical :size="0" >
          <n-h1 style="margin-bottom: 0"> Tujuan: Indofarma Semarang </n-h1>
          <span>Jl. Pamularsih Raya No.Kav67/60, Bongsari, Kec. Seamrang Barat, Kota Semarang Jawa Tengah</span>
        </n-space>
      </n-col>
      <n-col :span="3">
        <router-link :to="{ path: '/pengiriman/loading/1/print-manifest-loaded'}">
          <n-button style="float: right;">
            Cetak Manifest
          </n-button>
        </router-link>
      </n-col>
    </n-row>

    <n-h2 style="margin-top: 1rem;">Daftar Barang</n-h2>
    <n-table
      :bottom-bordered="false"
      :bordered="false"
      :single-line="true"
      v-if="dataTable.length > 0"
    >
      <n-thead>
        <n-tr style="border-radius: 20px">
          <n-th style="background-color: #f2994a; color: white">No</n-th>
          <n-th style="background-color: #f2994a; color: white">Kode Produk</n-th>
          <n-th style="background-color: #f2994a; color: white">Nama Produk</n-th>
          <n-th style="background-color: #f2994a; color: white">Batch</n-th>
          <n-th style="background-color: #f2994a; color: white">Jumalh Level 1</n-th>
          <n-th style="background-color: #f2994a; color: white">Qty Level 3</n-th>
        </n-tr>
      </n-thead>

      <n-tbody>
        <n-tr v-for="(item, key) in dataTable" :key="key">
          <n-td>{{ key + 1 }}</n-td>
          <n-td>{{ item.code }}</n-td>
          <n-td>{{ item.name }}</n-td>
          <n-td>{{ item.batch }}</n-td>
          <n-td>{{ item.total_level_1 }}</n-td>
          <n-td>{{ item.qty_level_3 }}</n-td>
        </n-tr>
      </n-tbody>
    </n-table>

    <n-card v-for="(driver, key) in dataDriver" :key="key" >

      <n-row :cols="12" @click="showDetailDriver(key)" style="cursor: pointer;">
        <n-col :span="12">
          <div>Nama Driver : {{ driver.driver_name }}</div>
          <div>Plat Nomor Kendaraan : {{ driver.plat_nomor }}</div>
        </n-col>
        <n-col :span="12">
          <div>Tipe Kendaraan : {{ driver.vehicle_type }}</div>
          <div>Pemilik : {{ driver.pemilik }}</div>
        </n-col>
      </n-row>

      <n-collapse-transition :show="data_index_driver == key">
        <n-card>
          <!-- <div v-for="(packing, index) in dataPacking" :key="index"> -->
          <div>
            <n-card style="margin-top: 10px;border-radius: 10px;">
              <n-table
                :bottom-bordered="false"
                :bordered="false"
                :single-line="true"
                v-if="dataPacking.length > 0">
                <n-thead>
                  <n-tr style="border-radius: 20px">
                    <n-th style="background-color: #f2994a; color: white">No</n-th>
                    <n-th style="background-color: #f2994a; color: white">ID Packing</n-th>
                    <n-th style="background-color: #f2994a; color: white">Qty Level 1</n-th>
                  </n-tr>
                </n-thead>

                <n-tbody>
                  <n-tr v-for="(item, key) in dataPacking" :key="key">
                    <n-td>{{ key + 1 }}</n-td>
                    <n-td>{{ item.id_packing }}</n-td>
                    <n-td>{{ item.qty_level_1 }}</n-td>
                  </n-tr>
                </n-tbody>
              </n-table>
              <!-- <template #header-extra>
                <v-button style="cursor: pointer;" @click="showDetail(index)">
                  {{ data_index == index ? 'Tampilkan lebih sedikit' : 'Lihat Detail' }}
                </v-button>
              </template>
              <n-collapse-transition :show="data_index == index">
                <n-table
                    :bottom-bordered="false"
                    :bordered="false"
                    :single-line="true"
                    v-if="packing.data.length > 0"
                  >
                    <n-thead>
                      <n-tr style="border-radius: 20px">
                        <n-th style="background-color: #f2994a; color: white">No</n-th>
                        <n-th style="background-color: #f2994a; color: white">ID Serialization</n-th>
                        <n-th style="background-color: #f2994a; color: white">Type</n-th>
                        <n-th style="background-color: #f2994a; color: white">Item</n-th>
                        <n-th style="background-color: #f2994a; color: white">Qty Level</n-th>
                      </n-tr>
                    </n-thead>

                    <n-tbody>
                      <n-tr v-for="(item, key) in packing.data" :key="key">
                        <n-td>{{ key + 1 }}</n-td>
                        <n-td>{{ item.id_serial }}</n-td>
                        <n-td>{{ item.level }}</n-td>
                        <n-td>{{ item.product }}</n-td>
                        <n-td>{{ item.qty }}</n-td>
                      </n-tr>
                    </n-tbody>
                  </n-table>
              </n-collapse-transition> -->
            </n-card>
          </div>
        </n-card>
      </n-collapse-transition>
    </n-card>

    <n-card>
      <n-space vertical style="margin-top: 20px;">
        <n-h3 style="margin-bottom: 0px;">Pengambilan</n-h3>

        <n-row :cols="12">
          <n-col :span="12">
            <n-h6>Diambil Oleh</n-h6>
            <span>[Firman Abdul]</span>
          </n-col>
          <n-col :span="12">
            <n-h4>Tanggal</n-h4>
            <span>15 Desember 2022</span>
          </n-col>
        </n-row>
      </n-space>
    </n-card>

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

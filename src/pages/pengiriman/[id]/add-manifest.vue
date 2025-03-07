<route lang="yaml">
meta:
  layout: auth
  title: Tambah Manifest
</route>
<script setup lang="ts">
  import {
    Add,
    EllipsisVertical
  } from '@vicons/ionicons5'

  const data_index = ref(null)
  const value = ref('')
  const optionsDropdown = ref([
    {
      label: 'Delete',
      key: 'delete',
      disabled: false,
    },
  ])

  const dataManifest = ref([
    {
      id_manifest: 89098,
      data_packing: [
        {
          id_packing: '00192932848',
          data: [
            {
              id: '1',
              name: 'Paramex',
              type: '',
              qty_primer: 20
            }
          ]
        }
      ]
    }
  ])
  
  const dataTable = ref([
    {
      code: '0019281718',
      name: 'Covid-19 Vaccine Astrazeneca',
      room: 50,
      rack: 'A02DD',
      batch: '2A0928D',
      exp_date: '30 September 2025',
      qty_pesan: '1.000',
      qty_packing: 0
    },
    {
      code: '0019281718',
      name: 'Covid-19 Vaccine Astrazeneca',
      room: 50,
      rack: 'A02DD',
      batch: '2A0928D',
      exp_date: '30 September 2025',
      qty_pesan: '1.000',
      qty_packing: 0
    },
    {
      code: '0019281718',
      name: 'Covid-19 Vaccine Astrazeneca',
      room: 50,
      rack: 'A02DD',
      batch: '2A0928D',
      exp_date: '30 September 2025',
      qty_pesan: '1.000',
      qty_packing: 0
    },
    {
      code: '0019281718',
      name: 'Covid-19 Vaccine Astrazeneca',
      room: 50,
      rack: 'A02DD',
      batch: '2A0928D',
      exp_date: '30 September 2025',
      qty_pesan: '1.000',
      qty_packing: 0
    },
  ])

  function showDetail(index: any) {
    data_index.value === index ? data_index.value = null : data_index.value = index
  }

  function handleSelect(key: string) {
    if (key == 'delete') {
      dataTable.value.splice(0, 1)
    }
  }

  function handleAddManifest() {
    dataManifest.value.push({
      id_manifest: 89098,
      data_packing: [
        {
          id_packing: '00192932848',
          data: [
            {
              id: '1',
              name: 'Paramex',
              type: '',
              qty_primer: 20
            }
          ]
        }
      ]
    })
  }
  
  function handleAddPacking(index: any) {
    console.log('handle add Packing', index)
    
    // dataManifest.value[index].push({
    //   id_packing: '00192932848',
    //   data: [
    //     {
    //       id: '1',
    //       name: 'Paramex',
    //     }
    //   ]
    // })
  }

  function deleteManifest(index: number) {
    dataManifest.value.splice(index, 1)
  }
</script>

<template>
  <n-space vertical style="padding: 1rem">
    <n-row :cols="12">
      <n-col :span="12">
        <n-space vertical>
          <n-h1>ID DO : PS-00001</n-h1>
          <span>PIC : Sugiono</span>
          <span>Target Tanggal Pengiriman : 11 Desember 2022</span>
          <span>Total Qty Pesan : 2.480</span>
          <span>Berat : 100 kg</span>
          <span>Volume : 200 cm<sup>3</sup></span>
          <span>PIC : Sugiono</span>
        </n-space>
      </n-col>
      <n-col :span="12">
        <n-space vertical>
          <n-h1>Tujuan : Indofarma Semarang</n-h1>
          <span>Jl. Pamularsih Raya No. Kav67/60, Bongsari, Kec. Semarang Barat, Kota Semarang, Jawa tengah 50148</span>
          <span>Status : <n-tag round>Perlu Agregasi</n-tag></span>
        </n-space>
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
          <n-th style="background-color: #f2994a; color: white">Room</n-th>
          <n-th style="background-color: #f2994a; color: white">Rack</n-th>
          <n-th style="background-color: #f2994a; color: white">Batch</n-th>
          <n-th style="background-color: #f2994a; color: white">Exp Date</n-th>
          <n-th style="background-color: #f2994a; color: white">Qty Pesan</n-th>
          <n-th style="background-color: #f2994a; color: white">Qty Packing</n-th>
        </n-tr>
      </n-thead>

      <n-tbody>
        <n-tr v-for="(item, key) in dataTable" :key="key">
          <n-td>{{ key + 1 }}</n-td>
          <n-td>{{ item.code }}</n-td>
          <n-td>{{ item.name }}</n-td>
          <n-td>{{ item.room }}</n-td>
          <n-td>{{ item.rack }}</n-td>
          <n-td>{{ item.batch }}</n-td>
          <n-td>{{ item.exp_date }}</n-td>
          <n-td>{{ item.qty_pesan }}</n-td>
          <n-td>{{ item.qty_packing }}</n-td>
        </n-tr>
      </n-tbody>
    </n-table>

    <!-- DAFTAR MANIFEST -->
    <n-h2 style="margin-top: 1rem;">Daftar Manifest</n-h2>
    <n-card v-for="(manifest, i) in dataManifest" :key="i">
      <n-space horizontal :size="0" style="display: flex; justify-content: space-between;">
        <n-h4>ID Manifest : {{ manifest.id_manifest }}</n-h4>
        <n-button style="float: right; text-align: right;" v-show="dataManifest.length > 1" @click="deleteManifest(i)">Hapus Manifest</n-button>
      </n-space>
      <n-h5 style="margin-top: 0px;">Daftar Packing</n-h5>
      <div style="display: flex; justify-content: space-between">
        <n-input
          v-model:value="value"
          type="text"
          placeholder="ID Packing"
          style="width: 500px; max-width: 200%"
        />
        <router-link :to="{ path: '/pengiriman/1/print-label-bulk' }" style="text-decoration: none;">
          <n-button type="primary"> Bulk Cetak Label Packing </n-button>
        </router-link>
      </div>

      <!-- DATA PACKING COLLAPSE  -->
      <n-card style="margin-top: 10px;">
        <div v-for="(packing, index) in manifest.data_packing" :key="index">
          <n-card :title="`ID Packing : ${packing.id_packing}`" style="cursor: pointer;margin-top: 10px;border-radius: 10px;">
            <template #header-extra>
              <v-button style="cursor: pointer; color: blue; text-decoration: underline;" @click="showDetail(index)">
                {{ data_index == index ? 'Tampilkan lebih sedikit' : 'Lihat Detail' }}
              </v-button>
            </template>
            <n-collapse-transition :show="data_index == index">
              <n-table
                :bottom-bordered="false"
                :bordered="false"
                :single-line="true"
              >
                <n-thead>
                  <n-tr style="border-radius: 20px">
                    <n-th style="background-color: #f2994a; color: white">No</n-th>
                    <n-th style="background-color: #f2994a; color: white">ID Serialization</n-th>
                    <n-th style="background-color: #f2994a; color: white">Type</n-th>
                    <n-th style="background-color: #f2994a; color: white">Item</n-th>
                    <n-th style="background-color: #f2994a; color: white">Qty Primer</n-th>
                    <n-th style="background-color: #f2994a; color: white">Aksi</n-th>
                  </n-tr>
                </n-thead>

                <n-tbody>
                  <n-tr v-for="(item, key) in packing.data" :key="key">
                    <n-td>{{ key + 1 }}</n-td>
                    <n-td>{{ item.id }}</n-td>
                    <n-td>{{ item.type }}</n-td>
                    <n-td>{{ item.name }}</n-td>
                    <n-td>{{ item.qty_primer }}</n-td>
                    <n-td>
                      <n-dropdown
                        trigger="click"
                        :options="optionsDropdown"
                        :show-arrow="true"
                        @select="handleSelect"
                      >
                        <n-icon
                          :component="EllipsisVertical"
                          style="cursor: pointer"
                        ></n-icon>
                      </n-dropdown>
                    </n-td>
                  </n-tr>
                </n-tbody>
              </n-table>

              <!-- BUTTON ADD PRODUK -->
              <n-space justify="center">
                <router-link :to="{ path: '/pengiriman/1/add-product'  }" style="text-decoration: none">
                  <n-button type="primary">
                    <n-icon :component="Add" />
                    Tambah Produk
                  </n-button>
                </router-link>
                <router-link :to="{ path: '/pengiriman/1/print-label'  }" style="text-decoration: none">
                  <n-button>
                    Cetak Label Packing
                  </n-button>
                </router-link>
              </n-space>
            </n-collapse-transition>
          </n-card>
        </div>
      </n-card>

      <!-- BUTTON ADD PACKING -->
      <div style="text-align: left; margin-top: 2rem">
        <n-button type="primary" text @click="handleAddPacking(i)">
          <n-icon :component="Add" />
          Tambah Packing
        </n-button>
      </div>
    </n-card>

    <!-- BUTTON ADD MANIFEST -->
    <div style="text-align: left; margin-top: 2rem">
      <n-button type="primary" text @click="handleAddManifest()">
        <n-icon :component="Add" />
        Tambah Manifest
      </n-button>
    </div>

    <div style="text-align: center; margin-top: 3rem">
      <router-link :to="{ path: '/pengiriman' }" style="text-decoration: none;">
        <n-button type="primary"> Selesai </n-button>
      </router-link>
    </div>

  </n-space>
</template>

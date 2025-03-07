<script setup lang="ts">
  import {
    Add,
    ChevronForward,
    EllipsisVertical,
    CheckmarkCircle,
    Hourglass,
    WarningOutline,
    ReloadOutline,
  } from '@vicons/ionicons5'
  import type { StepsProps } from 'naive-ui'

  const currentStatus =ref<StepsProps['status']>('process')
  const filter = ref({ agent: '' })
  const currentRef = ref(1)
  const current = currentRef
  const value = ref('')
  const form = ref({ user: '', date: 1183135260000, image_filename: '' })
  const status = ref('siap_dikirim')
  const optionsAgent = ref([
    {
      label: 'Siap Dikirim',
      value: 'siap_dikirim',
    },
    {
      label: 'Agregasi',
      value: 'agregasi',
    },
    {
      label: 'Loading',
      value: 'loading',
    },
    {
      label: 'Selesai',
      value: 'selesai',
    },
  ])

  const optionsDropdown = ref([
    {
      label: 'Delete',
      key: 'delete',
      disabled: false,
    },
  ])

  const dataTable = ref([
    {
      code: '0001201817',
      name: 'COvid-19 Vaccine Astrazeneca',
      qty_order: 100,
      qty_packing: 10,
    },
    {
      code: '0001201818',
      name: 'COvid-19 Vaccine Moderna',
      qty_order: 140,
      qty_packing: 100,
    },
    {
      code: '0001201819',
      name: 'COvid-19 Vaccine Sinovac',
      qty_order: 100,
      qty_packing: 80,
    },
    {
      code: '0001201820',
      name: 'COvid-19 Vaccine Pfizer',
      qty_order: 100,
      qty_packing: 0,
    },
    {
      code: '0001201821',
      name: 'COvid-19 Vaccine Sinopharm',
      qty_order: 80,
      qty_packing: 10,
    },
  ])

  const dataPackaging = ref([
    {
      id: '00192932818',
      data: [
        {
          id_serial: '0019281718',
          type: 'tertiery',
          item: 'Covid-19 Vaccine Astrazeneca',
          qty_primer: 50,
        },
        {
          id_serial: '0019281719',
          type: 'tertiery',
          item: 'Covid-19 Vaccine Moderna',
          qty_primer: 150,
        },
      ],
    },
  ])

  function handleAddPacking() {
    dataPackaging.value.push({
      id: '0019293281' + dataPackaging.value.length,
      data: [],
    })
  }

  function handleSelect(key: string) {
    if (key == 'delete') {
      dataTable.value.splice(0, 1)
    }
  }

  // function next () {
  //   if (currentRef.value === 1) currentRef.value = 1
  //   else if (currentRef.value >= 4) currentRef.value = 1
  //   else currentRef.value++
  // }

  // function prev () {
  //   if (currentRef.value === 0) currentRef.value = 1
  //   else if (currentRef.value === 1) currentRef.value = 4
  //   else currentRef.value--
  // }
</script>

<template>
  <n-space vertical style="padding: 1rem">
    <n-row :cols="12">
      <n-space vertical :size="0">
        <n-space>
          <n-h1 style="margin-bottom: 0"> ID DO : PS000019128617 </n-h1>
          <n-h1 style="margin-bottom: 0"> Tujuan : IGM PUSAT </n-h1>
        </n-space>
        <!-- <div style="display: flex; align-items: center; justify-content: center;"> -->
        <n-space style="padding-top: 1rem">
          <div style="margin-right: 10rem">
            <div>PIC : Sugiono</div>
            <div>Target Tanggal Pengiriman : 11 Desember 2022</div>
          </div>
          <div style="margin-right: 10rem">
            <div>Agen Pengiriman</div>
            <n-select
              v-model:value="filter.agent"
              :options="optionsAgent"
              placeholder="Pilih Status"
              style="width: 256px; max-width: 100%"
            />
          </div>
          <div>
            <div>Total Packing: 1/2</div>
            <div>
              Status :
              <n-tag
                round
                :bordered="false"
                :type="
                  status == 'siap_dikirim'
                    ? 'warning'
                    : status == 'agregasi'
                    ? 'error'
                    : status == 'loading'
                    ? 'info'
                    : 'success'
                "
              >
                <span style="text-transform: capitalize">{{
                  status == 'siap_dikirim' ? 'Siap Dikirim' : status
                }}</span>
                <template #icon>
                  <n-icon
                    :component="
                      status == 'siap_dikirim'
                        ? Hourglass
                        : status == 'agregasi'
                        ? WarningOutline
                        : status == 'loading'
                        ? ReloadOutline
                        : CheckmarkCircle
                    "
                  />
                </template>
              </n-tag>
            </div>
          </div>
        </n-space>
        <!-- </div> -->
      </n-space>
    </n-row>

    <n-h2>List Item</n-h2>

    <n-table :bottom-bordered="false" :bordered="false" :single-line="true">
      <n-thead>
        <n-tr style="border-radius: 20px">
          <n-th style="background-color: #f2994a; color: white">No</n-th>
          <n-th style="background-color: #f2994a; color: white"
            >Kode Barang</n-th
          >
          <n-th style="background-color: #f2994a; color: white"
            >Nama Barang</n-th
          >
          <n-th style="background-color: #f2994a; color: white"
            >Qty Pesanan</n-th
          >
          <n-th style="background-color: #f2994a; color: white"
            >Qty Packing</n-th
          >
        </n-tr>
      </n-thead>

      <n-tbody>
        <n-tr v-for="(item, key) in dataTable" :key="key">
          <n-td>{{ key + 1 }}</n-td>
          <n-td>{{ item.code }}</n-td>
          <n-td>{{ item.name }}</n-td>
          <n-td>{{ item.qty_order }}</n-td>
          <n-td>{{ item.qty_packing }}</n-td>
        </n-tr>
      </n-tbody>
    </n-table>

    <!-- ====================================================== -->
    <!-- ============= RENDER VIEW LIST PACKING =============== -->
    <!-- ====================================================== -->
    <n-h2 style="margin-top: 2rem">List Packing</n-h2>
    <n-card>
      <div style="display: flex; justify-content: space-between">
        <n-input
          v-model:value="value"
          type="text"
          placeholder="ID Primer"
          style="width: 500px; max-width: 200%"
        />

        <router-link
          :to="{ path: '/pengiriman/cetak-kemasan', query: { type: 'all' } }"
          style="text-decoration: none"
        >
          <n-button type="info"> Bulk Cetak Label Kemasan </n-button>
        </router-link>
      </div>

      <div v-if="dataPackaging.length < 1" style="text-align: center">
        <n-button type="primary">
          <n-icon :component="Add" />
          Tambah Packaging
        </n-button>
      </div>

      <div v-for="(packing, i) in dataPackaging" :key="i">
        <n-collapse style="margin-top: 2rem" arrow-placement="left">
          <n-collapse-item :title="`ID Packing : ${packing.id}`" name="1">
            <template #header-extra>
              Lihat Detail
              <n-icon :component="ChevronForward" />
            </template>
            <div style="text-align: center">
              <n-table
                :bottom-bordered="false"
                :bordered="false"
                :single-line="true"
                v-if="packing.data.length > 0"
              >
                <n-thead>
                  <n-tr style="border-radius: 20px">
                    <n-th style="background-color: #f2994a; color: white"
                      >No</n-th
                    >
                    <n-th style="background-color: #f2994a; color: white"
                      >ID Serialization</n-th
                    >
                    <n-th style="background-color: #f2994a; color: white"
                      >Type</n-th
                    >
                    <n-th style="background-color: #f2994a; color: white"
                      >Item</n-th
                    >
                    <n-th style="background-color: #f2994a; color: white"
                      >Qty Primer</n-th
                    >
                    <n-th style="background-color: #f2994a; color: white"
                      >Aksi</n-th
                    >
                  </n-tr>
                </n-thead>

                <n-tbody>
                  <n-tr v-for="(item, key) in packing.data" :key="key">
                    <n-td>{{ key + 1 }}</n-td>
                    <n-td>{{ item.id_serial }}</n-td>
                    <n-td>{{ item.type }}</n-td>
                    <n-td>{{ item.item }}</n-td>
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
              <router-link
                :to="{ name: 'pengiriman-add-kemasan' }"
                style="text-decoration: none"
              >
                <n-button type="primary" style="margin-right: 10px">
                  <n-icon :component="Add" />
                  Tambah Item
                </n-button>
              </router-link>
              <router-link
                :to="{
                  path: '/pengiriman/cetak-kemasan',
                  query: { type: 'single' },
                }"
                style="text-decoration: none"
              >
                <n-button type="info" v-if="packing.data.length > 0" ghost>
                  Cetak Label Kemasan
                </n-button>
              </router-link>
            </div>
          </n-collapse-item>
        </n-collapse>
      </div>

      <div
        v-if="dataPackaging.length > 0"
        style="text-align: left; margin-top: 2rem"
      >
        <n-button type="primary" @click="handleAddPacking">
          <n-icon :component="Add" />
          Tambah Packaging
        </n-button>
      </div>
    </n-card>

    <!-- ====================================================== -->
    <!-- ============== RENDER VIEW PENGAMBILAN =============== -->
    <!-- ====================================================== -->
    <n-h2 style="margin-top: 2rem">Pengambilan</n-h2>
    <n-card>
      <n-space style="">
        <div>
          <div>Diambil Oleh</div>
          <n-input
            v-model:value="form.user"
            type="text"
            placeholder="ID Primer"
            style="width: 500px; max-width: 200%"
          />
        </div>

        <div>
          <div>Tanggal</div>
          <n-date-picker
            v-model:value="form.date"
            type="date"
            style="width: 500px; max-width: 200%"
          />
        </div>
      </n-space>

      <n-space style="margin-top: 30px; margin-bottom: 30px">
        <div>
          <div>Upload Photo</div>
          <n-input
            v-model:value="form.image_filename"
            placeholder="Cari file"
            style="width: 1000px; max-width: 200%"
          />
        </div>
        <n-button type="success" style="margin-left: 10px; margin-top: 20px">
          <input
            type="file"
            name="file_image"
            id="file_image"
            ref="file_image"
            style="display: none"
          />
          Upload
        </n-button>
      </n-space>

      <n-image-group>
        <n-space>
          <n-image
            width="100"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
          <n-image
            width="100"
            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
          />
        </n-space>
      </n-image-group>
    </n-card>

    <!-- ====================================================== -->
    <!-- =============== RENDER VIEW PENERIMA ================= -->
    <!-- ====================================================== -->
    <n-h2 style="margin-top: 2rem">Penerima</n-h2>
    <n-card>
      <n-space style="">
        <div>
          <div>Diterima Oleh</div>
          <n-input
            v-model:value="form.user"
            type="text"
            placeholder="ID Primer"
            style="width: 500px; max-width: 200%"
          />
        </div>

        <div>
          <div>Tanggal</div>
          <n-date-picker
            v-model:value="form.date"
            type="date"
            style="width: 500px; max-width: 200%"
          />
        </div>
      </n-space>

      <n-space style="margin-top: 30px; margin-bottom: 30px">
        <div>
          <div>Upload Photo</div>
          <n-input
            v-model:value="form.image_filename"
            placeholder="Cari file"
            style="width: 1000px; max-width: 200%"
          />
        </div>
        <n-button type="success" style="margin-left: 10px; margin-top: 20px">
          <input
            type="file"
            name="file_image"
            id="file_image"
            ref="file_image"
            style="display: none"
          />
          Upload
        </n-button>
      </n-space>

      <n-image-group>
        <n-space>
          <n-image
            width="100"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
          <n-image
            width="100"
            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
          />
        </n-space>
      </n-image-group>
    </n-card>

    <div style="text-align: center; margin-bottom: 5rem">
      <router-link
        style="text-decoration: none"
        :to="{ path: '/pengiriman/serah-terima' }"
      >
        <n-button type="primary" @click="handleAddPacking" style="width: 150px">
          Kirim
        </n-button>
      </router-link>
    </div>

    <!-- ====================================================== -->
    <!-- ============== RENDER VIEW TRACKING PENGIRIMAN =============== -->
    <!-- ====================================================== -->
    <n-h2 style="margin-top: 2rem">Tracking Pengiriman</n-h2>
    <n-card>
      <n-space vertical>
        <n-steps :current="current" :status="currentStatus">
          <template #finish-icon>
            <n-icon :component="CheckmarkCircle"></n-icon>
          </template>
          <n-step>
            <div>Sedang dikemas</div>
          </n-step>
          <n-step>
            <div>Proses Pick-Up</div>
          </n-step>
          <n-step>
            <div>Dalam Perjalanan</div>
          </n-step>
          <n-step>
            <div>
              Diterima
            </div>
          </n-step>
        </n-steps>
      </n-space>
      <n-divider />
      <n-h2 style="margin-top: 2rem">Status Pengiriman</n-h2>
      <n-space vertical>
        <n-steps vertical :current="current" :status="currentStatus">
          <n-step
            title="06 Desember 2022 00:21"
            description="Sedang dalam penjemputan barang"
          />
          <n-step
            title="06 Desember 2022 22:00"
            description="Kurir menerima permintaan pengiriman barang"
          />
          <n-step
            title="07 Desember 2022 23:00"
            description="Barang masuk antrian pengiriman oleh kurir"
          />
          <n-step
            title="07 Desember 2022 10:15"
            description="Paket dalam perjalanan menuju lokasi yang tidak diketahui"
          />
        </n-steps>
      </n-space>
    </n-card>
    <div style="text-align: center; margin-bottom: 5rem">
      <router-link
        style="text-decoration: none"
        :to="{ path: '/pengiriman' }"
      >
        <n-button type="info" style="width: 200px; margin-left: 10px;">
          Kembali ke Beranda
        </n-button>
      </router-link>
    </div>
  </n-space>
</template>

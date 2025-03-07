<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import {
    EllipsisVertical
  } from '@vicons/ionicons5'

  const router = useRouter()
  const value = ref('')

  const optionsDropdown = ref([
    {
      label: 'Delete',
      key: 'delete',
      disabled: false,
    },
  ])

  const dataTable = ref([
    {
      id_serial: '0019281718',
      type: 'Tertiery',
      item: 'Covid-19 Vaccine Astrazeneca',
      qty_primer: 50,
    },
  ])

  function addDataItem() {
    dataTable.value.push({
      id_serial: '001928171' + dataTable.value.length,
      type: 'Tertiery',
      item: 'Covid-19 Vaccine Astrazeneca',
      qty_primer: 50,
    })
  }

  function handleSelect(key: string) {
    if (key == 'delete') {
      dataTable.value.splice(0, 1)
    }
  }

  function saveKemasan() {
    router.push({ name: 'pengiriman-tracking' })
  }
</script>

<template>
  <n-space vertical style="padding: 1rem">
    <n-row :cols="12">
      <n-space vertical :size="0">
        <n-space>
          <n-h1 style="margin-bottom: 0"> Tambahkan ke Kemasan </n-h1>
        </n-space>
        <n-space style="padding-top: 1rem">
          <div style="margin-right: 10rem">
            <div>ID DO : 1200035055</div>
            <div>Batch : 22AS1291, 22AS1292, 22GT3088</div>
          </div>
          <div>
            <div>Total Qty Pesan :</div>
            <div style="font-size: 26px; font-weight: bold">0/200</div>
          </div>
        </n-space>
      </n-space>
    </n-row>

    <n-card>
      <div style="text-align: center">
        <div>ID Kemasan Level 4</div>
        <div>000192932819</div>
        <n-input
          v-model:value="value"
          type="text"
          placeholder="Masukkan kata kunci"
          style="width: 500px; max-width: 200%"
        />
        <n-button style="margin-left: 1rem" type="primary" @click="addDataItem"
          >Submit</n-button
        >
        <div style="margin-top: 20px">
          <a href="" style="color: green">Scan ID</a>
        </div>
      </div>
    </n-card>

    <n-table
      :bottom-bordered="false"
      :bordered="false"
      :single-line="true"
      v-if="dataTable.length > 0"
    >
      <n-thead>
        <n-tr style="border-radius: 20px">
          <n-th style="background-color: #f2994a; color: white">No</n-th>
          <n-th style="background-color: #f2994a; color: white"
            >ID Serialization</n-th
          >
          <n-th style="background-color: #f2994a; color: white">Type</n-th>
          <n-th style="background-color: #f2994a; color: white">Item</n-th>
          <n-th style="background-color: #f2994a; color: white"
            >Qty Primer</n-th
          >
          <n-th style="background-color: #f2994a; color: white">Aksi</n-th>
        </n-tr>
      </n-thead>

      <n-tbody>
        <n-tr v-for="(item, key) in dataTable" :key="key">
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

    <div style="text-align: center; margin-top: 3rem">
      <n-button @click="saveKemasan" type="primary"> Simpan </n-button>
    </div>
  </n-space>
</template>

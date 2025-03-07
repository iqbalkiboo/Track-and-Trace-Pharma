<script setup lang="ts">
import moment from "moment"

const props = withDefaults(
  defineProps<{
    data?: any
    params?: any
  }>(),
  {
    data: () => ({}),
    params: () => ({}),
  }
)
</script>

<template>
  <n-space
    vertical
    :size="18"
  >
    <n-card
      :content-style="{
        padding: '15px',
        backgroundColor: '#eee',
        borderRadius: '10px',
      }"
      style="border-radius: 10px"
    >
      <n-scrollbar x-scrollable>
        <n-table :single-line="false">
          <thead>
            <tr>
              <th style="text-align: center">No</th>
              <th>No DO</th>
              <th>Alamat Kejadian</th>
              <th style="text-align: center">Status DO</th>
              <th>Kejadian</th>
              <th>Plat Nomor</th>
              <th>Tipe Data</th>
              <th>Suhu</th>
              <th>Tanggal Kejadian</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="props.data?.list.length > 0">
              <tr
                v-for="(list, i) in props.data?.list"
                :key="i"
              >
                <td style="text-align: center">
                  {{ params.limit * (params.page - 1) + (i + 1) }}
                </td>
                <td>{{ list.do_code }}</td>
                <td>{{ list.address }}</td>
                <td style="text-align: center">
                  <n-tag
                    :bordered="false"
                    :type="'primary'"
                    round
                    >{{ list.description_do_status }}</n-tag
                  >
                </td>
                <td>{{ list.description_data_type }}</td>
                <td>{{ list.plate_number }}</td>
                <td>{{ list.data_type }}</td>
                <td>{{ list.current_temperature }}</td>
                <td>
                  {{ moment(list.even_date).format("yyyy-MM-DD HH:mm:ss") }}
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td
                  colspan="10"
                  style="text-align: center"
                >
                  Belum ada data tersedia
                </td>
              </tr>
            </template>
          </tbody>
        </n-table>
      </n-scrollbar>
    </n-card>
  </n-space>
</template>

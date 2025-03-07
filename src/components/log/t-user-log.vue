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
  <n-space vertical :size="18">
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
              <th style="width: 2rem; text-align: center">No</th>
              <th style="width: 10rem">Tanggal</th>
              <th>Type</th>
              <th>Sub Type</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="props.data?.list.length > 0">
              <tr v-for="(list, i) in props.data?.list" :key="i">
                <td style="text-align: center">
                  {{ params.limit * (params.page - 1) + (i + 1) }}
                </td>
                <td>
                  {{
                    moment(list.created_at).format("yyyy-MM-DD-ss, HH:mm:ss")
                  }}
                </td>
                <td>{{ list.type }}</td>
                <td>{{ list.sub_type }}</td>
                <td>{{ list.description }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="5" style="text-align: center">
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

<script setup lang="ts">
import moment from "moment"

const props = withDefaults(
  defineProps<{
    data?: any
    type: "diambil" | "dikirim" | "serah-terima"
  }>(),
  {
    data: () => ({}),
    type: "diambil",
  }
)
</script>

<template>
  <n-card
    style="border-radius: 10px;"
    :content-style="{ padding: '1rem', borderRadius: '10px', backgroundColor: '#eee' }"
  >
    <n-grid cols="3" item-responsive responsive="screen">
      <n-gi span="3">
        <n-space justify="space-between">
          <n-space>
            <n-tag bordered type="primary" style="margin: 0 0 8px">
              Kode DO: {{ props.data?.id }}
            </n-tag>
            <n-tag
              v-if="false"
              bordered
              type="primary"
              style="margin: 0 0 8px; --n-border: none"
            >
              ID PS: {{ props.data?.id }}
            </n-tag>
            <n-tag
              round
              class="tag-style"
              style="margin: 0 0 8px; --n-border: none"
            >
              {{ props.data?.status }}
            </n-tag>
          </n-space>

          <n-text>{{ moment(props.data?.created_at).format("yyyy-MM-DD") }}</n-text>
        </n-space>
      </n-gi>
      <n-gi span="3">
        <n-space :size="24">
          <n-p style="margin: 0">
            <n-text strong>Created By : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name }}</n-text>
          </n-p>
        </n-space>
        <!-- <n-space v-if="type == 'diambil'" :size="24">
          <n-p style="margin: 0">
            <n-text strong> Pickup by: </n-text>
            {{ props.data?.attributes }}
          </n-p>
          <n-p style="margin: 0">
            <n-text strong> Lokasi: </n-text>
            {{ props.data?.attributes }}
          </n-p>
        </n-space>
        <n-space v-else-if="type == 'dikirim'" :size="24">
          <n-p style="margin: 0">
            <n-text strong> Send by: </n-text>
            {{ props.data?.attributes }}
          </n-p>
          <n-p style="margin: 0">
            <n-text strong> Lokasi Terakhir: </n-text>
            {{ props.data?.attributes }}
          </n-p>
        </n-space>
        <n-space v-else-if="type == 'serah-terima'" :size="24">
          <n-p style="margin: 0">
            <n-text strong> Approved by: </n-text>
            {{ props.data?.attributes }}
          </n-p>
          <n-p style="margin: 0">
            <n-text strong> Lokasi: </n-text>
            {{ props.data?.attributes }}
          </n-p>
        </n-space> -->
      </n-gi>
    </n-grid>
  </n-card>
</template>

<style>
.tag-style {
  background: #464e5f;
  color: white;
}
</style>

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
  <n-card :content-style="{ backgroundColor: '#eee' }">
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
              style="margin: 0 0 8px"
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
            <n-text strong>{{ 
              props.data?.status === 'Create Reception' ? 'Created ' : 
              props.data?.status === 'Approval Proccess' ? 'Approved' : 
              props.data?.status === 'Accepted TO' ? 'Accepted ' : '' }} By : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name 
            }}</n-text>
          </n-p>
        </n-space>
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

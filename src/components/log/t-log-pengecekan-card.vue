<script setup lang="ts">
import moment from "moment"

const props = withDefaults(
  defineProps<{
    data?: any
  }>(),
  {
    data: () => ({}),
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
              Kode Perintah Kemas : {{ props.data?.id }}
            </n-tag>
            <n-tag round style="margin: 0 0 8px; --n-border: none" class="tag-style">
              {{ props.data?.type }}
            </n-tag>
          </n-space>

          <n-text>{{ moment(props.data?.created_at).format("yyyy-MM-DD HH:mm") }}</n-text>
        </n-space>
      </n-gi>
      <n-gi span="3">
        <n-p style="margin: 0">
          <n-text strong> Marked as passed by : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name }}</n-text>
        </n-p>
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

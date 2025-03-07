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
          <n-tag bordered type="primary" style="margin: 0 0 8px">
            Kode Perintah Kemas : {{ props.data?.id }}
          </n-tag>
          <n-text>{{ moment(props.data?.created_at).format("yyyy-MM-DD HH:mm") }}</n-text>
        </n-space>
      </n-gi>
      <n-gi span="3">
        <n-space
          v-if="props.data?.status === 'import'"
        >
          <n-text strong> Created Kode By : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name }}</n-text>
        </n-space>
        <n-space
          v-if="props.data?.status === 'generate'"
          :size="0"
          vertical
        >
          <n-text strong>Generate Kode By : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name }}</n-text>
          <n-space :size="0" justify="space-between">
            <n-text
              v-for="serialize, i in props.data?.attributes?.serialize"
              :key="i"
              strong
            >
              Generated Kode Level {{ serialize.level }} : {{ serialize.qty }}
            </n-text>
          </n-space>
        </n-space>
        <n-space
          v-if="props.data?.status === 'print'"
          vertical
          :size="0"
        >
          <n-text strong>Print Kode By : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name }}</n-text>
          <n-space :size="0" justify="space-between">
            <n-text
              v-for="serialize, i in props.data?.attributes?.serialize"
              :key="i"
              strong
            >
              Generate Additional Kode Level {{ serialize.level }} : {{ serialize.qty }}
            </n-text>
          </n-space>
        </n-space>
      </n-gi>
    </n-grid>
  </n-card>
</template>

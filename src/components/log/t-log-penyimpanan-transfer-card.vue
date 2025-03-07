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

const colorType = (type: any) => {
  if (type === "asign") {
    return "warning"
  } else if (type === "move") {
    return "info"
  } else if (type === "void") {
    return "error"
  }
}
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
              Kode TO : {{ props.data?.id }}
            </n-tag>
            <n-tag
              round
              style="margin: 0 0 8px; text-transform: capitalize"
              :type="colorType(props.data?.type)"
            >
              {{ props.data?.type }}
            </n-tag>
          </n-space>

          <n-text>{{ moment(props.data?.created_at).format("yyyy-MM-DD") }}</n-text>
        </n-space>
      </n-gi>
      <n-gi span="3">
        <n-p v-if="props.data?.type != 'void'" style="margin: 0">
          <n-text strong>By : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name }}</n-text>
        </n-p>
        <n-p v-else style="margin: 0">
          <n-text strong>Marked as void by : {{ props.data?.created_by?.is_superadmin ? props.data?.created_by?.superadmin?.name : props.data?.created_by?.user?.name }}</n-text>
        </n-p>
        <n-p v-if="props.data?.type == 'asign'" style="margin: 0">
          <n-text strong>Assigned to : 
            {{ props.data?.attributes?.destination?.warehouse?.code }}
            {{ props.data?.attributes?.destination?.building?.code ? ' / ' + props.data?.attributes?.destination?.building?.code : '' }}
            {{ props.data?.attributes?.destination?.room?.code ? ' / ' + props.data?.attributes?.destination?.room?.code : '' }}
            {{ props.data?.attributes?.destination?.rack_pallete?.code ? ' / ' + props.data?.attributes?.destination?.rack_pallete?.code : '' }}
            {{ props.data?.attributes?.destination?.bin?.code ? ' / ' + props.data?.attributes?.destination?.bin?.code : '' }}
          </n-text>
        </n-p>
        <n-p v-else-if="props.data?.type == 'move'" style="margin: 0">
          <n-text strong>Moved to : 
            {{ props.data?.attributes?.destination?.warehouse?.code }}
            {{ props.data?.attributes?.destination?.building?.code ? ' / ' + props.data?.attributes?.destination?.building?.code : '' }}
            {{ props.data?.attributes?.destination?.room?.code ? ' / ' + props.data?.attributes?.destination?.room?.code : '' }}
            {{ props.data?.attributes?.destination?.rack_pallete?.code ? ' / ' + props.data?.attributes?.destination?.rack_pallete?.code : '' }}
            {{ props.data?.attributes?.destination?.bin?.code ? ' / ' + props.data?.attributes?.destination?.bin?.code : '' }}
          </n-text>
        </n-p>
        <n-p v-if="false" style="margin: 0">
          <n-text strong>Outer : {{ '?' }}</n-text>
        </n-p>
        <n-p style="margin: 0">
          <n-text strong>Source : 
            {{ props.data?.attributes?.origin?.warehouse?.code }}
            {{ props.data?.attributes?.origin?.building?.code ? ' / ' + props.data?.attributes?.origin?.building?.code : '' }}
            {{ props.data?.attributes?.origin?.room?.code ? ' / ' + props.data?.attributes?.origin?.room?.code : '' }}
            {{ props.data?.attributes?.origin?.rack_pallete?.code ? ' / ' + props.data?.attributes?.origin?.rack_pallete?.code : '' }}
            {{ props.data?.attributes?.origin?.bin?.code ? ' / ' + props.data?.attributes?.origin?.bin?.code : '' }}
          </n-text>
        </n-p>
      </n-gi>
    </n-grid>
  </n-card>
</template>

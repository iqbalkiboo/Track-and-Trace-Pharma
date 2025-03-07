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

function setDayBeforeExpired(value: number) {
  const thisDate = moment(new Date()).format("yyyy-MM-DD")
  const exDate = moment(value).format("yyyy-MM-DD")
  const dayBeforeExp = moment(exDate).diff(thisDate, 'days')

  if (dayBeforeExp > 0) {
    return dayBeforeExp
  } else {
    return 'Invalid date'
  }
}
</script>

<template>
  <n-space vertical :size="18">
    <n-card
      :content-style="{ padding: '15px', backgroundColor: '#eee', borderRadius: '10px' }"
      style="border-radius: 10px;"
      v-for="list, i in props.data.list"
      :key="i"
    >
      <n-grid cols="3" item-responsive responsive="screen">
        <n-gi span="3">
          <n-p style="margin: 0 0 8px">
            <n-text strong style="font-size: 14px;">{{ list.product?.long_name }}</n-text>
          </n-p>
        </n-gi>
        <n-gi span="3 s:2">
          <n-grid
            :x-gap="8"
            :y-gap="8"
            cols="2"
            item-responsive
            responsive="screen"
          >
            <n-gi span="2 s:1">
              <n-p style="margin: 0">
                <n-text> Batch Number : {{ list.batch_number }}</n-text>
              </n-p>
            </n-gi>
            <n-gi span="2 s:1">
              <n-p style="margin: 0">
                <n-text> Day Before Expired : {{ list ? $filters.toNumber(setDayBeforeExpired(list.date?.expired_date)) : '' }}</n-text>
              </n-p>
            </n-gi>
            <n-gi span="2 s:1">
              <n-p style="margin: 0">
                <n-text> Expired Date : {{ moment(list.date?.expired_date).format("yyyy-MM-DD") }}</n-text>
              </n-p>
            </n-gi>
          </n-grid>
        </n-gi>
      </n-grid>
    </n-card>
  </n-space>
</template>

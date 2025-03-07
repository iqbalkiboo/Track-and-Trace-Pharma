<script setup lang="ts">
import moment from "moment"
import {
  PersonOutline,
  WarningOutline,
  CheckboxOutline,
  ServerOutline,
  NavigateCircleOutline,
  FileTrayOutline
} from "@vicons/ionicons5"

const props = defineProps<{
  list: any
  pk_detail: any
}>()

const generatedLevel = computed(() => {
  return props.list.serialize.map((item: any) => ({
    name: item.name,
    qty: item.qty,
  }))
})
</script>

<template>
  <n-space
    vertical
    class="lacak-card-tnt"
  >
    <n-space vertical>
      <n-text style="margin-bottom: 0">{{
        moment(list.created_at).format("yyyy-MM-DD")
      }}</n-text>
      <n-text style="margin-top: 0">{{
        moment(list.created_at).format("HH:mm:ss")
      }}</n-text>
    </n-space>
    <n-card
      class="card-active"
      style="padding-top: 0; padding-bottom: 0;"
    >
      <n-space
        vertical
        justify="space-between"
        align="start"
      >
        <n-space
          vertical
          :size="0"
        >
          <n-space
            align="center"
            :size="2"
            v-if="list.total_pass > 0"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <CheckboxOutline />
            </n-icon>
            <n-text style="margin: 0"> Qty passed : </n-text>
            <n-text>{{ list.total_pass }}</n-text>
          </n-space>
          <n-space
            align="center"
            :size="2"
            v-if="
              `Packed Level ${list.status_label.slice(-1)}` ===
              list.status_label
            "
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <FileTrayOutline />
            </n-icon>
            <n-text style="margin: 0"
              >Kemasan Level {{ list.status_label.slice(-1) }} :
            </n-text>
            <n-text>{{ list.serialize[list.serialize.length - 1].qty }}</n-text>
          </n-space>
          <n-space
            align="center"
            :size="2"
            v-if="
              list.total_void > 0 ||
              list.status === 'ready_to_print' ||
              `Packed Level ${list.status_label.slice(-1)}` ===
                list.status_label
            "
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <WarningOutline />
            </n-icon>
            <n-text style="margin: 0"> Qty void : </n-text>
            <n-text>{{ list.total_void }}</n-text>
          </n-space>
          <n-space
            align="center"
            :size="2"
            v-if="list.allocation?.warehouse?.name"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <NavigateCircleOutline />
            </n-icon>
            <n-text style="margin: 0">Lokasi Penyimpanan : </n-text>
            <n-text>{{ list.allocation?.building?.name }}</n-text>
          </n-space>
          <div v-if="list.status_label === 'Generated'">
            <n-space
              align="center"
              :size="2"
              v-for="(item, i) in generatedLevel"
              :key="i"
            >
              <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
                <ServerOutline />
              </n-icon>
              <n-text style="margin: 0">{{
                `Qyt Serial ${item.name} : `
              }}</n-text>
              <n-text style="margin: 0">{{ item.qty }}</n-text>
            </n-space>
            <!-- <n-text style="margin: 0">Success Generated: 100%</n-text> -->
          </div>
          <n-space
            align="center"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <PersonOutline />
            </n-icon>
            <n-text style="margin: 0"> Created by : </n-text>
            <n-text>{{
              list.created_by?.is_superadmin
                ? list.created_by?.superadmin?.name
                : list.created_by?.user?.name
            }}</n-text>
          </n-space>

          <!-- <n-space
            :size="0"
            align="center"
            v-if="list.status === 'draft'"
          >
            <n-text style="margin: 0">ID PK : </n-text>
            <n-text>{{ pk_detail.pk_id }}</n-text>
          </n-space> -->
        </n-space>
        <n-space
          vertical
          align="center"
        >
          <n-tag
            :bordered="false"
            round
            type="info"
            >{{ list.status_label }}</n-tag
          >
        </n-space>
      </n-space>
    </n-card>
  </n-space>
</template>

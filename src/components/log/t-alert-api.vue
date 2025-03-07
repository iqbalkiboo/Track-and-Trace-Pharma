<script setup lang="ts">
import moment from "moment"
import type { SelectOption } from "naive-ui"

const props = withDefaults(
  defineProps<{
    data?: any
    params?: any
    isBtnLoading?: boolean
  }>(),
  {
    data: () => ({}),
    params: () => ({}),
  }
)

const emit = defineEmits<{
  (e: "update:params", value: any): void
  (e: "update:tab", value: string): void
}>()

const apiParams = ref<any>({})
const dataResResultReqOrRes = ref<any>({})
const showModalApiReqOrRes = ref(false)
const options = ref<SelectOption[]>([
  { label: "Sukses", value: "true" },
  { label: "Error", value: "false" },
])

onMounted(() => {
  apiParams.value = props.params
})

function handleTabChange(val: string) {
  emit("update:tab", val)
}

function handleFilterChange() {
  apiParams.value.status
  emit("update:params", apiParams.value)
}
function handleToggleShowModalReqOrRes(type: "req" | "res", data: any) {
  showModalApiReqOrRes.value = !showModalApiReqOrRes.value
  if (type === "req") {
    dataResResultReqOrRes.value = data.request
  }
  if (type === "res") {
    dataResResultReqOrRes.value = data.response
  }
}
</script>

<template>
  <n-space
    vertical
    :size="14"
  >
    <n-tabs
      type="line"
      v-model:value="apiParams.type"
      tab-style="border-radius: 10px"
      @update:value="handleTabChange"
    >
      <n-tab-pane
        :disabled="props.isBtnLoading"
        name=""
        tab="Semua"
      ></n-tab-pane>
      <n-tab-pane
        :disabled="props.isBtnLoading"
        name="dakota"
        tab="Dakota"
      ></n-tab-pane>
      <n-tab-pane
        :disabled="props.isBtnLoading"
        name="easygo"
        tab="Easygo"
      ></n-tab-pane>
      <n-tab-pane
        :disabled="props.isBtnLoading"
        name="bpom"
        tab="Bpom"
      ></n-tab-pane>
    </n-tabs>
    <n-row gutter="16">
      <n-col :span="6">
        <n-select
          placeholder="Status"
          :options="options"
          clearable
          v-model:value="apiParams.status"
          style="max-width: 100%"
          @update:value="handleFilterChange"
        />
      </n-col>
    </n-row>
    <n-scrollbar x-scrollable>
      <n-table
        :single-line="false"
        style="margin-top: 10px"
      >
        <thead>
          <tr>
            <th style="text-align: center">No</th>
            <th>Tanggal Dibuat</th>
            <th style="text-align: center">Tipe</th>
            <th style="text-align: center">Refrensi</th>
            <th style="text-align: center">Status</th>
            <th>Path</th>
            <th style="text-align: center">Request</th>
            <th style="text-align: center">Response</th>
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
              <td>
                {{ moment(list.CreatedAt).format("yyyy-MM-DD, h:mm:ss") }}
              </td>
              <td style="text-align: center">{{ list.vendor }}</td>
              <td style="text-align: center">
                <n-space align="center">
                  <n-text>{{ list.reference?.id }}</n-text>
                  <n-tag type="info">{{ list.reference?.from }}</n-tag>
                </n-space>
              </td>
              <td style="text-align: center">
                <n-tag
                  :bordered="false"
                  :type="list.status ? 'primary' : 'error'"
                  round
                  >{{ list.status ? "success" : "error" }}</n-tag
                >
              </td>
              <td>{{ list.endpoint }}</td>
              <td>
                <n-space
                  align="center"
                  justify="center"
                >
                  <n-button
                    @click="handleToggleShowModalReqOrRes('req', list)"
                    type="primary"
                    strong
                    secondary
                    size="tiny"
                    text
                    >Show Request</n-button
                  >
                </n-space>
              </td>
              <td>
                <n-space
                  align="center"
                  justify="center"
                >
                  <n-button
                    @click="handleToggleShowModalReqOrRes('res', list)"
                    type="primary"
                    strong
                    secondary
                    size="tiny"
                    text
                    >Show Response</n-button
                  >
                </n-space>
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
  </n-space>
  <t-modal-alert-api-req-and-res
    v-model:show="showModalApiReqOrRes"
    :data="dataResResultReqOrRes"
  />
</template>

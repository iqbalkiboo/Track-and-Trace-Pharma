<script setup lang="ts">
// import { useMessage } from "naive-ui"
import { alertModel } from "@/models/alertlog/alert"
import constants from "@/helpers/constant"

const route = useRoute()
const router = useRouter()
// const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const selectedTab = ref("")
const params = ref<any>({
  status: null,
  sort: "desc",
  sort_field: "created_at",
  q: "",
  type: "",
  page: 1,
  limit: 10,
})

onMounted(() => {
  if (!filters.checkPermission(constants.accessAlert.alertLog + ".list")) {
    return router.push('/')
  }
  selectedTab.value = "produksi"
  getData()
})

async function getData() {
  if (route.query.tab) {
    selectedTab.value = String(route.query.tab)
  }
  isLoading.value = true
  isBtnLoading.value = true

  if (selectedTab.value == "produksi") {
    params.value.is_expired = 1
    await alertModel
      .getAlert(params.value)
      .then((res) => {
        dataRes.value = res.data
        isLoading.value = false
        isBtnLoading.value = false
      })
      .catch((err: any) => {
        isLoading.value = false
        isBtnLoading.value = false
        const data = err.response.data
        // tMessage.error(data.message)
        console.log(data)
      })
  } else {
    delete params.value.is_expired
    const queryTabChild = route.query["tab-child"]
    params.value.type = queryTabChild
    if (selectedTab.value === "tracker") {
      delete params.value.q
      delete params.value.status
      delete params.value.type
      delete params.value.sort_field
      await alertModel
        .getAlertTracker(params.value)
        .then((res) => {
          dataRes.value = res.data
          isLoading.value = false
          isBtnLoading.value = false
        })
        .catch((err: any) => {
          isLoading.value = false
          isBtnLoading.value = false
          const data = err.response.data
          // tMessage.error(data.message)
          console.log(data)
        })
    }
    if (selectedTab.value === "api") {
      params.value.q = queryTabChild
      params.value.sort = "created_at"
      params.value.dir = "desc"
      await alertModel
        .getAlertResponseApi(params.value)
        .then((res) => {
          dataRes.value = res.data
          isLoading.value = false
          isBtnLoading.value = false
        })
        .catch((err: any) => {
          isLoading.value = false
          isBtnLoading.value = false
          const data = err.response.data
          // tMessage.error(data.message)
          console.log(data)
        })
    }
  }
}

function handleTabChanged(val: string) {
  router.push({ query: { tab: val } })
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

function handleTabApiChanged(val: string) {
  const queryTab = route.query.tab
  router.push({ query: { tab: queryTab, "tab-child": val } })
}
</script>

<template>
  <div class="body-tnt">
    <n-space
      vertical
      :size="14"
    >
      <n-space
        vertical
        :size="0"
      >
        <n-h2 style="margin-bottom: 0">Alert</n-h2>
      </n-space>

      <n-tabs
        type="bar"
        v-model:value="selectedTab"
        tab-style="border-radius: 10px"
        @update:value="handleTabChanged"
      >
        <n-tab-pane
          :disabled="isBtnLoading"
          name="produksi"
          tab="Produksi"
        ></n-tab-pane>
        <n-tab-pane
          :disabled="isBtnLoading"
          name="tracker"
          tab="Tracker"
        ></n-tab-pane>
        <n-tab-pane
          :disabled="isBtnLoading"
          name="api"
          tab="Api"
        ></n-tab-pane>
      </n-tabs>

      <n-card style="border-radius: 10px">
        <n-space
          vertical
          :size="18"
        >
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <template v-if="selectedTab === 'produksi'">
              <t-log-alert-card v-model:data="dataRes" />
            </template>
            <template v-if="selectedTab === 'tracker'">
              <t-log-tracker-table
                v-model:data="dataRes"
                v-model:params="params"
              />
            </template>
            <template v-if="selectedTab === 'api'">
              <t-alert-api
                v-model:data="dataRes"
                v-model:params="params"
                :alert-api-tab="params"
                :is-btn-loading="isBtnLoading"
                @update:tab="handleTabApiChanged"
                @update:params="getData"
              />
            </template>
          </template>

          <div style="display: flex; justify-content: center">
            <n-pagination
              v-model:page="params.page"
              v-model:page-size="params.limit"
              :page-count="dataRes.total_page"
              :page-slot="7"
              :show-size-picker="dataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getData"
              @update:page-size="updatePageSize"
            />
          </div>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

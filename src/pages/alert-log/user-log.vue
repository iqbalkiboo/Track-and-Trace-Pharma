<script setup lang="ts">
import { useMessage } from "naive-ui"
import { userLogModel } from "@/models/alertlog/user-log"
import { masterUserModel } from "@/models/setting/master-user"
import constants from "@/helpers/constant"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const selectedTab = ref('')
const filterUserOptions = ref<any>([])
const params = ref<any>({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  user_id: null,
  provider: null,
  page: 1,
  limit: 10,
})

onMounted(() => {
  if (!filters.checkPermission(constants.accessAlert.alertLogUserLog + ".list")) {
    return router.push('/')
  }
  selectedTab.value = 'all'
  getUser()
  getData()
})

async function getData() {
  if (route.query.tab) {
    selectedTab.value = String(route.query.tab)
    if (selectedTab.value !== 'all') {
      params.value.provider = selectedTab.value
    } else {
      params.value.provider = null
    }
  }
  isLoading.value = true
  isBtnLoading.value = true

  await userLogModel.getUserLog(params.value)
  .then((res) => {
    dataRes.value = res.data
    isLoading.value = false
    isBtnLoading.value = false
  })
  .catch((err: any) => {
    isLoading.value = false
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getUser() {
  isLoading.value = true
  const params = {
    limit: 1000
  }
  await masterUserModel
    .getUser(params)
    .then((res) => {
      res.data.list.forEach((item: any) => {
        filterUserOptions.value.push({
          label: item.name + ' ' + '(' + item.email + ')',
          value: item.id,
        })
      })
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function handleTabChanged(val: string) {
  router.push({ query: { tab: val } })
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}
</script>

<template>
  <div class="body-tnt">
    <n-space vertical :size="14">
      <n-space vertical :size="0">
        <n-h2 style="margin-bottom: 0">User Log</n-h2>
      </n-space>

      <n-tabs
        type="bar"
        v-model:value="selectedTab"
        tab-style="border-radius: 10px"
        @update:value="handleTabChanged"
      >
        <n-tab-pane :disabled="isBtnLoading" name="all" tab="Semua"></n-tab-pane>
        <n-tab-pane :disabled="isBtnLoading" name="web" tab="Web"></n-tab-pane>
        <n-tab-pane :disabled="isBtnLoading" name="mobile" tab="Mobile"></n-tab-pane>
      </n-tabs>

      <n-card style="border-radius: 10px;">
        <n-space vertical :size="18">
          <n-row gutter="16">
            <n-col :span="6">
              <n-select
                v-model:value="params.user_id"
                :options="filterUserOptions"
                filterable
                clearable
                placeholder="Pilih User"
                class="select-tnt"
                @update:value="getData()"
              />
            </n-col>
          </n-row>
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <t-user-log
              v-model:data="dataRes"
              v-model:params="params"
            />
          </template>
  
          <div style="display: flex; justify-content: center;">
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

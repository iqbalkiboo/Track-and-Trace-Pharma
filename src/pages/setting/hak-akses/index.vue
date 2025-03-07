<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import {
  Add,
  CheckmarkCircleOutline,
  EllipsisVertical,
  HelpCircleOutline,
  Pencil,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { accessRightsModel } from "@/models/setting/hak-akses"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
})
const tFeedbackRef = ref({
  show: ref(false),
  type: "",
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
})
const selectedValue = ref({
  id: "",
  name: "",
})
const actionOptions = ref<any>([])

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

onMounted(() => {
  setIsGranted()
  if (
    filters.isGranted(constants.accessSettings.settingHakAkses + ".list")
  ) {
    getData()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (
    filters.isGranted(constants.accessSettings.settingHakAkses + ".update")
  ) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
}

async function getData() {
  isLoading.value = true
  await accessRightsModel
    .getRole(params.value)
    .then((res) => {
      let number = (params.value.page - 1) * params.value.limit + 1
      res.data.list.forEach((item: any) => {
        const data_temp = item
        data_temp.number = number
        number++
      })
      dataRes.value = res.data
      isLoading.value = false
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function searchData() {
  //reset param page
  params.value.page = 1
  const timer = ref<any>()
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    getData()
  }, 1000)
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

function handleSelectDropdown(key: string | number, id: any, name: any) {
  switch (key) {
    case "edit":
      router.push({
        path: `/setting/hak-akses/update/${id}`,
      })
      break
    case "delete":
      selectedValue.value.id = id
      selectedValue.value.name = name
      showDeleteFeedback()
      break

    default:
      break
  }
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data hak akses"
  tFeedbackRef.value.show = true
}
function showDeleteFeedback() {
  tFeedbackRef.value.type = "delete"
  tFeedbackRef.value.icon = HelpCircleOutline
  tFeedbackRef.value.iconColor = "#EB5757"
  tFeedbackRef.value.title = "Perhatian"
  tFeedbackRef.value.subtitle = `Apakah Anda yakin untuk menghapus ${selectedValue.value.name} ?`
  tFeedbackRef.value.show = true
}
function deleteRole() {
  isBtnLoading.value = true
  accessRightsModel
    .deleteRole(selectedValue.value.id)
    .then(() => {
      tFeedbackRef.value.show = false
      setTimeout(() => {
        showSuccessFeedback()
        isBtnLoading.value = false
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Hak Akses</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Hak Akses</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space
        v-if="
          $filters.isGranted(
            constants.accessSettings.settingHakAkses + '.create'
          )
        "
      >
        <router-link
          :to="{ path: '/setting/hak-akses/create/1' }"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <n-icon :component="Add" />
            Tambah Hak Akses
          </n-button>
        </router-link>
      </n-space>

      <template
        v-if="
          $filters.isGranted(
            constants.accessSettings.settingHakAkses + '.list'
          )
        "
      >
        <n-row
          gutter="16"
          style="margin-top: 24px"
        >
          <n-col :span="6">
            <n-input
              v-model:value="params.search"
              @keyup="searchData"
              type="text"
              placeholder="Cari hak akses"
            />
          </n-col>
        </n-row>
        <div class="table-tnt">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table
                :bordered="false"
                :single-line="true"
              >
                <n-thead>
                  <n-tr>
                    <n-th style="text-align: center">No</n-th>
                    <n-th style="width: 80%">Nama Hak Akses</n-th>
                    <n-th style="text-align: center">Aksi</n-th>
                  </n-tr>
                </n-thead>
                <n-tbody>
                  <n-tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <n-td
                      data-label="No"
                      style="text-align: center"
                      >{{ params.limit * (params.page - 1) + (i + 1) }}</n-td
                    >
                    <n-td data-label="Nama Hak Akses">{{ list.name }}</n-td>
                    <n-td
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        placement="bottom-end"
                        :options="actionOptions"
                        :show-arrow="true"
                        @select="
                          handleSelectDropdown($event, list.id, list.name)
                        "
                      >
                        <n-button tertiary>
                          <template #icon>
                            <n-icon><ellipsis-vertical /></n-icon>
                          </template>
                        </n-button>
                      </n-dropdown>
                    </n-td>
                  </n-tr>
                </n-tbody>
              </n-table>
            </n-scrollbar>
          </template>
          <div class="table-footer">
            <n-pagination
              v-model:page="params.page"
              :page-count="dataRes.total_page"
              :page-slot="10"
              :show-size-picker="dataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getData"
              @update:page-size="updatePageSize"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <t-not-granted></t-not-granted>
      </template>
    </div>
  </div>
  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click.prevent="getData"
        >
          Tutup
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'delete'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
        >
          Tidak
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#EB5757"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="deleteRole"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, type SelectOption, useMessage } from "naive-ui"
import {
  Add,
  CheckmarkCircleOutline,
  EllipsisVertical,
  HelpCircleOutline,
  Pencil,
  SettingsOutline,
  Trash,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterUserModel } from "@/models/setting/master-user"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import TModalResetPassword from "@/components/t-modal-reset-password.vue"
import { auth } from "@/models/auth"
import ModalImportExcel from "@/pages/setting/master-driver/modal/modal-import-excel.vue"

const router = useRouter()
const tMessage = useMessage()
const authData = auth.getAuth()

const isLoading = ref(true)
const showResetPassword = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
  role: "driver",
  status: null,
  plant: null,
})
const options = ref<SelectOption[]>([
  { label: "Aktif", value: 1 },
  { label: "Tidak Aktif", value: 0 },
])
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

onMounted(async () => {
  setIsGranted()
  if (filters.isGranted(constants.accessSettings.settingDriver + ".list")) {
    await getData()
    getWarehouseType()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (authData.xxtype === "5up3r4dm1n") {
    actionOptions.value.unshift({
      label: "Reset Password",
      key: "reset-password",
      icon: renderIcon(SettingsOutline),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingDriver + ".update")) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingDriver + ".delete")) {
    actionOptions.value.push({
      label: "Hapus Data",
      key: "delete",
      icon: renderIcon(Trash),
    })
  }
}

async function getDataStatus(status: any) {
  if (status) {
    params.value.status = status
  }
  getData()
}

async function getData() {
  isLoading.value = true
  await masterUserModel
    .getUser(params.value)
    .then((res) => {
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

const filterWharehouseOptions = ref<any>([])
async function getWarehouseType() {
  isLoading.value = true
  masterWarehouseModel.getWarehouse({ limit: 100 }).then((res: any) => {
    res.data.list.forEach((item: any) => {
      filterWharehouseOptions.value.push({
        label: item.name,
        value: item.id,
      })
    })
  })
  isLoading.value = false
}

async function getDataWharehouse(wharehouse: any) {
  if (wharehouse) {
    params.value.plant = wharehouse
  }
  getData()
}
const timerSearch = ref<any>(0)
function searchData() {
  //reset param page
  params.value.page = 1
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getData()
  }, 600 || 0)
}
function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}
function handleToggleShowResetPassword() {
  showResetPassword.value = !showResetPassword.value
}

function handleSelectDropdown(key: string | number, id: any, name: any) {
  switch (key) {
    case "edit":
      router.push({
        path: `/setting/master-driver/update/${id}`,
      })
      break
    case "delete":
      selectedValue.value.id = id
      selectedValue.value.name = name
      showDeleteFeedback()
      break

    case "reset-password":
      selectedValue.value.id = id
      selectedValue.value.name = name
      handleToggleShowResetPassword()
      break
    default:
      break
  }
}

function deleteDriver() {
  isBtnLoading.value = true
  masterUserModel
    .deleteUser(selectedValue.value.id)
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

const isBtnLoading = ref(false)
const tFeedbackRef = ref({
  show: ref(false),
  type: "",
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
})
function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data driver"
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

const isShowModalImport = ref(false)
function showModalImport(e: MouseEvent) {
  e.preventDefault()
  isShowModalImport.value = true
}
function hideModalImport() {
  isShowModalImport.value = false
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Master Driver</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Master Driver</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space
        v-if="$filters.isGranted(constants.accessSettings.settingDriver + '.create')"
      >
        <router-link
          :to="'/setting/master-driver/create/1'"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <n-icon :component="Add" />
            Tambah Driver
          </n-button>
        </router-link>
        <n-button
          color="#219653"
          class="button-tnt"
          @click="showModalImport"
        >
          <template #icon>
            <n-icon><add /></n-icon>
          </template>
          Import Data Excel
        </n-button>
      </n-space>

      <template
        v-if="$filters.isGranted(constants.accessSettings.settingDriver + '.list')"
      >
        <n-row
          gutter="16"
          style="margin-top: 24px"
        >
          <n-col :span="6">
            <n-input
              v-model:value="params.search"
              @keyup="searchData"
              placeholder="Cari nama Driver"
            />
          </n-col>
          <n-col :span="6">
            <n-select
              placeholder="Status"
              :options="options"
              clearable
              v-model:value="params.status"
              style="max-width: 100%"
              @update:value="getDataStatus($event)"
            />
          </n-col>
          <n-col :span="6">
            <n-select
              placeholder="Plant/Cabang"
              :options="filterWharehouseOptions"
              clearable
              style="max-width: 100%"
              v-model:value="params.plant"
              @update:value="getDataWharehouse($event)"
            />
          </n-col>
        </n-row>
        <div class="table-tnt">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th style="text-align: center">No</th>
                    <th>Username</th>
                    <th>Nama Driver</th>
                    <th>Jabatan</th>
                    <th>Plant/Cabang</th>
                    <th style="text-align: center">Status</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="dataRes?.list?.length > 0">
                    <tr
                      v-for="(list, i) in dataRes.list"
                      :key="i"
                    >
                      <td
                        data-label="No"
                        style="text-align: center"
                      >
                        {{ params.limit * (params.page - 1) + (i + 1) }}
                      </td>
                      <td data-label="Username">
                        {{ list.username }}
                      </td>
                      <td data-label="Nama Driver">
                        {{ list.name }}
                      </td>
                      <td data-label="Jabatan">
                        {{ list.position }}
                      </td>
                      <td data-label="Plant/Cabang">
                        <n-scrollbar style="max-height: 100px">
                          <div
                            v-for="(warehouse, i) in list.warehouses"
                            :key="i"
                          >
                            {{ warehouse.name }}
                          </div>
                        </n-scrollbar>
                      </td>
                      <td
                        data-label="Status"
                        style="text-align: center"
                      >
                        <n-tag
                          :bordered="false"
                          :type="list.status.value === 1 ? 'success' : 'error'"
                          >{{
                            list.status.label == "active"
                              ? "Aktif"
                              : "Tidak Aktif"
                          }}</n-tag
                        >
                      </td>
                      <td
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
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td
                        colspan="8"
                        style="text-align: center"
                      >
                        Belum ada data tersedia
                      </td>
                    </tr>
                  </template>
                </tbody>
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

  <modal-import-excel
    :is-show-modal="isShowModalImport"
    @hide-modal="hideModalImport"
    @get-data="getData"
  >
  </modal-import-excel>

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
          @click.prevent="deleteDriver"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-modal-reset-password
    v-model:show="showResetPassword"
    :user_id="selectedValue.id"
  />
</template>

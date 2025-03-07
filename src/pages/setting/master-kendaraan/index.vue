<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import {
  Add,
  CheckmarkCircleOutline,
  EllipsisVertical,
  HelpCircleOutline,
  Pencil,
  Trash,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterVehicleModel } from "@/models/setting/master-kendaraan"
import { masterVehicleCategoryModel } from "@/models/setting/master-kategori-kendaraan"
import ModalImportExcel from "@/pages/setting/master-kendaraan/modal/modal-import-excel.vue"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const filterOptions = ref<any>([])
const selectedValue = ref({
  id: "",
  name: "",
})
const tFeedbackRef = ref({
  type: "",
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
})
const params = ref<any>({
  q: "",
  dir: "desc",
  sort: "created_at",
  page: 1,
  limit: 10,
  vehicle_categories: null,
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
  if (filters.isGranted(constants.accessSettings.settingKendaraan + ".list")) {
    getData()
    getDataTipeKendaraan()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (filters.isGranted(constants.accessSettings.settingKendaraan + ".update")) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingKendaraan + ".delete")) {
    actionOptions.value.push({
      label: "Hapus Data",
      key: "delete",
      icon: renderIcon(Trash),
    })
  }
}

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await masterVehicleModel
    .getVehicle(params.value)
    .then((res) => {
      dataRes.value = res.data.data
      isLoading.value = false
      isBtnLoading.value = false
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDataTipeKendaraan() {
  isLoading.value = true
  await masterVehicleCategoryModel
    .getVehicleCategory({ limit: 100 })
    .then((res) => {
      const listCustomerCategory = res.data.data.list

      listCustomerCategory.forEach((el: any) => {
        filterOptions.value.push({
          label: el.name,
          value: el.id,
        })
      })
      isLoading.value = false
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function dataTipeKendaraan(tipe: string) {
  if (tipe) {
    params.vehicle_categories = tipe
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
  params.value.limit = pageSize
  getData()
}

function handleSelectDropdown(key: string | number, id: any) {
  switch (key) {
    case "edit":
      router.push({
        path: `/setting/master-kendaraan/update/${id}`,
      })
      break
    case "delete":
      selectedValue.value.id = id
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
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data kendaraan"
  tFeedbackRef.value.show = true
}
function showDeleteFeedback() {
  tFeedbackRef.value.type = "delete"
  tFeedbackRef.value.icon = HelpCircleOutline
  tFeedbackRef.value.iconColor = "#EB5757"
  tFeedbackRef.value.title = "Perhatian"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk menghapus data kendaraan?"
  tFeedbackRef.value.show = true
}
async function deleteVehicle() {
  isBtnLoading.value = true
  await masterVehicleModel
    .deleteVehicle(selectedValue.value.id)
    .then(() => {
      tFeedbackRef.value.show = false
      setTimeout(() => {
        getData().then(() => {
          showSuccessFeedback()
        })
        isBtnLoading.value = false
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
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
    <n-h2 style="margin-bottom: 4px">Master Kendaraan</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Master Kendaraan</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space
        v-if="
          $filters.isGranted(constants.accessSettings.settingKendaraan + '.create')
        "
      >
        <router-link
          :to="{ path: '/setting/master-kendaraan/create/1' }"
          style="text-decoration: none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <n-icon :component="Add" />
            Tambah Kendaraan
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
        v-if="$filters.isGranted(constants.accessSettings.settingKendaraan + '.list')"
      >
        <n-row
          gutter="16"
          style="margin-top: 24px"
        >
          <n-col :span="6">
            <n-input
              v-model:value="params.q"
              @update:value="searchData"
              clearable
              placeholder="Cari Plat Kendaraan"
            />
          </n-col>
          <n-col :span="6">
            <n-select
              v-model:value="params.vehicle_categories"
              @update:value="dataTipeKendaraan($event)"
              :options="filterOptions"
              clearable
              placeholder="Pilih Jenis Kendaraan"
              style="width: 256px; max-width: 100%"
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
                :bottom-bordered="false"
                :bordered="false"
                :single-line="true"
              >
                <n-thead>
                  <n-tr style="border-radius: 20px">
                    <n-th>No</n-th>
                    <n-th>Apikey IoT</n-th>
                    <n-th>Plat</n-th>
                    <n-th>Tipe Kendaraan</n-th>
                    <n-th>Plant/Cabang</n-th>
                    <n-th style="text-align: center">Status</n-th>
                    <n-th style="width: 4rem; text-align: center">Aksi</n-th>
                  </n-tr>
                </n-thead>
                <n-tbody>
                  <template v-if="dataRes?.list?.length > 0">
                    <n-tr
                      v-for="(list, i) in dataRes.list"
                      :key="i"
                    >
                      <n-td data-label="No">{{
                        params.limit * (params.page - 1) + (i + 1)
                      }}</n-td>
                      <n-td data-label="ID Kendaraan">{{
                        list.apikey_iot
                      }}</n-td>
                      <n-td data-label="Plat">{{ list.plate_number }}</n-td>
                      <n-td data-label="Tipe Kendaraan">{{
                        list.vehicle_categories.name
                      }}</n-td>
                      <n-td data-label="Plant/Cabang">
                        <div
                          v-for="(item, key) in list.warehouses"
                          :key="key"
                        >
                          {{ item.name + "-" + item.code }}
                        </div>
                      </n-td>
                      <n-td
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
                      </n-td>
                      <n-td
                        data-label="Aksi"
                        style="text-align: center"
                      >
                        <n-dropdown
                          placement="bottom-end"
                          :options="actionOptions"
                          :show-arrow="true"
                          @select="handleSelectDropdown($event, list.id)"
                        >
                          <n-button tertiary>
                            <template #icon>
                              <n-icon><ellipsis-vertical /></n-icon>
                            </template>
                          </n-button>
                        </n-dropdown>
                      </n-td>
                    </n-tr>
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
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
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
          @click.prevent="deleteVehicle"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

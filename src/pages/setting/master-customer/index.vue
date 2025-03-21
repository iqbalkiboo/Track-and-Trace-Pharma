<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, type SelectOption, useMessage } from "naive-ui"
import {
  Add,
  CheckmarkCircleOutline,
  EllipsisVertical,
  HelpCircleOutline,
  Pencil,
  Trash,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterCustomerModel } from "@/models/setting/master-customer"
import ModalImportExcel from "./modal/modal-import-excel.vue"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const isShowModalImport = ref(false)
const params = ref({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
  status: null,
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

onMounted(() => {
  setIsGranted()
  if (filters.isGranted(constants.accessSettings.settingCustomer + ".list")) {
    getData()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (filters.isGranted(constants.accessSettings.settingCustomer + ".update")) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingCustomer + ".delete")) {
    actionOptions.value.push({
      label: "Hapus Data",
      key: "delete",
      icon: renderIcon(Trash),
    })
  }
}

async function getData() {
  isLoading.value = true
  await masterCustomerModel
    .getCustomer(params.value)
    .then((res) => {
      dataRes.value = res.data.data
      isLoading.value = false
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDataStatus(status: any) {
  if (status) {
    params.value.status = status
  }
  getData()
}

function searchData() {
  setTimeout(() => {
    getData()
  }, 800)
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
        path: `/setting/master-customer/update/${id}`,
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

async function deleteCustomer() {
  isBtnLoading.value = true
  await masterCustomerModel
    .deleteSoftCustomer(selectedValue.value.id)
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

function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data customer"
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
    <n-h2 style="margin-bottom: 4px">Master Customer</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Master Customer</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space>
        <template
          v-if="
            $filters.isGranted(constants.accessSettings.settingCustomer + '.create')
          "
        >
          <router-link
            :to="{ path: '/setting/master-customer/create/1' }"
            class="text-decoration-none"
          >
            <n-button
              color="#219653"
              class="button-tnt"
            >
              <n-icon :component="Add" />
              Tambah Customer
            </n-button>
          </router-link>
        </template>
        <template
          v-if="
            $filters.isGranted(constants.accessSettings.settingCustomer + '.import')
          "
        >
          <n-button
            color="#219653"
            class="button-tnt"
            @click="showModalImport"
          >
            <n-icon :component="Add" />
            Import Data Excel
          </n-button>
        </template>
      </n-space>

      <template
        v-if="$filters.isGranted(constants.accessSettings.settingCustomer + '.list')"
      >
        <n-row
          gutter="16"
          style="margin-top: 24px"
        >
          <n-col :span="6">
            <n-input
              v-model:value="params.search"
              @input="searchData"
              type="text"
              placeholder="Cari nama customer"
            />
          </n-col>
          <n-col :span="6">
            <n-select
              placeholder="status"
              :options="options"
              clearable
              v-model:value="params.status"
              style="max-width: 100%"
              @update:value="getDataStatus($event)"
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
                    <th>Nama Customer</th>
                    <th>Tipe</th>
                    <th>Alamat</th>
                    <th>Kode ERP</th>
                    <th>PIC</th>
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
                      <td style="text-align: center">
                        {{ params.limit * (params.page - 1) + (i + 1) }}
                      </td>
                      <td>{{ list.name }}</td>
                      <td>{{ list.customers_category.name }}</td>
                      <td>{{ $filters.setAddress(list.address) }}</td>
                      <td>{{ list.erp_code }}</td>
                      <td>{{ list.pic.name }}</td>
                      <td style="text-align: center">
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
                      <td style="text-align: center">
                        <n-dropdown
                          placement="bottom-end"
                          :show-arrow="true"
                          :options="actionOptions"
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
  />

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
          @click.prevent="deleteCustomer"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

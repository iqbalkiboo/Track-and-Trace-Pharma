<script setup lang="ts">
import { NIcon, type SelectOption, useMessage } from "naive-ui"
import type { Component } from "vue"
import {
  Add,
  CheckmarkCircleOutline,
  EllipsisVertical,
  HelpCircleOutline,
  Pencil,
  Trash,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterThreeplModel } from "@/models/setting/master-threepl"
import ModalImportExcel from "@/pages/setting/master-threepl/modal/modal-import-excel.vue"
import { debounce } from "lodash-es"

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
  q: '',
})
const options = ref<SelectOption[]>([
  { label: "Aktif", value: 1 },
  { label: "Tidak Aktif", value: 0 },
])
const selectedValue = ref({
  id: "",
  name: "",
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
  if (filters.isGranted(constants.accessSettings.setting3pl + ".list")) {
    getData()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (filters.isGranted(constants.accessSettings.setting3pl + ".update")) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (filters.isGranted(constants.accessSettings.setting3pl + ".delete")) {
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
  
  params.value.q = params.value.search
  
  await masterThreeplModel
    .getThreepl(params.value)
    .then((res) => {
      dataRes.value = res.data
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

const searchData = debounce(() => {
  getData()
}, 600)

async function getDataStatus(status: any) {
  if (status) {
    params.value.status = status
  }
  getData()
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
        path: `/setting/master-threepl/update/${id}`,
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

function deleteThreepl() {
  isBtnLoading.value = true
  masterThreeplModel
    .deleteThreepl(selectedValue.value.id)
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
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data 3PL"
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
    <n-h2 style="margin-bottom: 4px">Master 3PL</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Master 3PL</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space
        v-if="
          $filters.isGranted(constants.accessSettings.setting3pl + '.create')
        "
      >
        <router-link
          :to="'/setting/master-threepl/create/1'"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <n-icon :component="Add" />
            Tambah 3PL
          </n-button>
        </router-link>
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
        v-if="$filters.isGranted(constants.accessSettings.setting3pl + '.list')"
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
              placeholder="Cari nama 3pl"
            />
          </n-col>
          <n-col :span="6">
            <n-select
              placeholder="status"
              :options="options"
              v-model:value="params.status"
              clearable
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
                    <th>Nama 3PL</th>
                    <th>Kode ERP</th>
                    <th>API Key</th>
                    <th style="text-align: center">Status</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
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
                    <td data-label="Nama 3PL">
                      {{ list.name }}
                    </td>
                    <td data-label="Kode ERP">
                      {{ list.erp_code }}
                    </td>
                    <td data-label="API Key">
                      {{ list.api_key }}
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
                        }}
                      </n-tag>
                    </td>
                    <td
                      data-label="Aksi"
                      style="text-align: center"
                    >
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
                            <n-icon>
                              <ellipsis-vertical />
                            </n-icon>
                          </template>
                        </n-button>
                      </n-dropdown>
                    </td>
                  </tr>
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
          :loading="isBtnLoading"
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
          @click.prevent="deleteThreepl"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>
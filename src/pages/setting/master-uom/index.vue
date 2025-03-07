<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import {
  Add,
  EllipsisVertical,
  Pencil,
  Trash,
  HelpCircleOutline,
  CheckmarkCircleOutline,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { uomModel } from "@/models/setting/master-produk/uom"
import ModalImportExcel from "@/pages/setting/master-uom/modal/modal-import-excel.vue"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
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
const params = ref({
  q: "",
  dir: "desc",
  sort: "created_at",
  page: 1,
  limit: 10,
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
  if (filters.isGranted(constants.accessSettings.settingUOM + ".list")) {
    getData()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (filters.isGranted(constants.accessSettings.settingUOM + ".detail")) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingUOM + ".detail")) {
    actionOptions.value.push({
      label: "Hapus Data",
      key: "delete",
      icon: renderIcon(Trash),
    })
  }
}

async function getData() {
  isLoading.value = true
  await uomModel
    .getUom(params.value)
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

function handleSelectDropdown(key: string | number, id: any) {
  switch (key) {
    case "edit":
      router.push({
        path: `/setting/master-uom/update/${id}`,
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
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data UOM"
  tFeedbackRef.value.show = true
}
function showDeleteFeedback() {
  tFeedbackRef.value.type = "delete"
  tFeedbackRef.value.icon = HelpCircleOutline
  tFeedbackRef.value.iconColor = "#EB5757"
  tFeedbackRef.value.title = "Perhatian"
  tFeedbackRef.value.subtitle = "Apakah Anda yakin untuk menghapus data UOM?"
  tFeedbackRef.value.show = true
}
function deleteUom() {
  isBtnLoading.value = true
  uomModel.deleteUom(selectedValue.value.id).then(() => {
    isBtnLoading.value = false
    getData()
    setTimeout(() => {
      showSuccessFeedback()
    }, 300)
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
    <n-h2 style="margin-bottom: 4px">Unit of Measurement</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Unit of Measurement</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space
        v-if="$filters.isGranted(constants.accessSettings.settingUOM + '.create')"
      >
        <router-link
          :to="'/setting/master-uom/create/1'"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <n-icon :component="Add" />
            Tambah UoM
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
        v-if="$filters.isGranted(constants.accessSettings.settingUOM + '.list')"
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
              placeholder="Cari Nama UoM"
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
                    <th>Kode UoM</th>
                    <th>Nama UoM</th>
                    <th>Deskripsi</th>
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
                    <td data-label="Kode UoM">
                      {{ list.code }}
                    </td>
                    <td data-label="Nama UoM">
                      {{ list.name }}
                    </td>
                    <td data-label="Deskripsi">
                      {{ list.description ? list.description : "-" }}
                    </td>
                    <td
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        placement="bottom-end"
                        :show-arrow="true"
                        :options="actionOptions"
                        @select="handleSelectDropdown($event, list.id)"
                      >
                        <n-button tertiary>
                          <template #icon>
                            <n-icon><ellipsis-vertical /></n-icon>
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
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
        >
          Tidak
        </n-button>
        <n-button
          color="#EB5757"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="deleteUom"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

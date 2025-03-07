<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
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
import { auth } from "@/models/auth"
import { masterCompanyModel } from "@/models/setting/master-perusahaan"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import ModalImportExcel from "@/pages/setting/master-perusahaan/modal/modal-import-excel.vue"

const router = useRouter()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isTableLoading = ref(false)
const isBtnLoading = ref(false)
const companyDataRes = ref<any>({})
const warehouseDataRes = ref<any>({})
const isShowModalImport = ref(false)
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
  authData.value = auth.getAuth()
  setIsGranted()
  if (filters.isGranted(constants.accessSettings.settingCabangPlan + ".list")) {
    getData()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (filters.isGranted(constants.accessSettings.settingCabangPlan + ".Detail")) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingCabangPlan + ".Detail")) {
    actionOptions.value.push({
      label: "Hapus Data",
      key: "delete",
      icon: renderIcon(Trash),
    })
  }
}

async function getData() {
  isBtnLoading.value = true
  isLoading.value = true
  isTableLoading.value = true
  await getCompany()
  await getWarehouse()
  isBtnLoading.value = false
  isLoading.value = false
  isTableLoading.value = false
  tFeedbackRef.value.show = false
}

async function getCompany() {
  let company_id: string = ""
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"].company_id
  } else {
    company_id = authData.value.users.user_type.id
  }

  await masterCompanyModel
    .getDetailCompany(company_id)
    .then((res) => {
      companyDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getWarehouse() {
  isTableLoading.value = true
  await masterWarehouseModel
    .getWarehouse(params.value)
    .then((res) => {
      warehouseDataRes.value = res.data
      isTableLoading.value = false
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

const timerSearch = ref<any>(0)
function searchData() {
  clearTimeout(timerSearch.value)
  timerSearch.value = setTimeout(function () {
    getWarehouse()
  }, 600 || 0)
}

function updatePageSize(pageSize: number) {
  params.value.limit = pageSize
  getWarehouse()
}

function handleSelectDropdown(key: string | number, id: any, name: any) {
  switch (key) {
    case "edit":
      router.push({
        path: `/setting/master-perusahaan/update/${id}/plant-area`,
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

function deleteWarehouse() {
  isBtnLoading.value = true
  masterWarehouseModel
    .deleteWarehouse(selectedValue.value.id)
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
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data plant/cabang"
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
    <n-h2 style="margin-bottom: 4px">Master Profil Plant/Cabang</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Master Profil Plant/Cabang</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <template
          v-if="
            $filters.isGranted(constants.accessSettings.settingCabangPlan + '.Detail')
          "
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: start;
            "
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div>
                <n-avatar
                  round
                  :style="{
                    color: 'yellow',
                    backgroundColor: 'grey',
                  }"
                  :size="120"
                  :src="
                    companyDataRes.image?.url ? companyDataRes.image?.url : ''
                  "
                >
                </n-avatar>
              </div>
              <div style="margin-left: 2rem">
                <div style="font-size: 16px; font-weight: 600">
                  {{ companyDataRes.name }}
                </div>
                <n-text>{{ companyDataRes?.address?.detail }}</n-text>
              </div>
            </div>
            <template
              v-if="
                $filters.isGranted(
                  constants.accessSettings.settingCabangPlan + '.Detail'
                )
              "
            >
              <div>
                <router-link
                  :to="{
                    path: `/setting/master-perusahaan/update/${companyDataRes.id}/perusahaan`,
                  }"
                  style="text-decoration: none"
                >
                  <n-button
                    color="#F2C94C"
                    text-color="#1E1E1E"
                    class="button-tnt"
                  >
                    Edit
                  </n-button>
                </router-link>
              </div>
            </template>
          </div>
        </template>
      </template>
    </div>

    <div class="card-tnt">
      <n-space
        v-if="
          $filters.isGranted(constants.accessSettings.settingCabangPlan + '.Create')
        "
      >
        <router-link
          to="/setting/master-perusahaan/create/1/plant-area"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <template #icon>
              <n-icon><add /></n-icon>
            </template>
            Tambah Plant/Cabang
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
        v-if="$filters.isGranted(constants.accessSettings.settingCabangPlan + '.list')"
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
              placeholder="Cari nama plant/cabang"
            />
          </n-col>
        </n-row>
        <div class="table-tnt">
          <template v-if="isTableLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th style="text-align: center">No</th>
                    <th>Nama</th>
                    <th>3PL</th>
                    <th>Alamat</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="warehouseDataRes?.list?.length > 0">
                    <tr
                      v-for="(list, i) in warehouseDataRes.list"
                      :key="i"
                    >
                      <td
                        data-label="No"
                        style="text-align: center"
                      >
                        {{ params.limit * (params.page - 1) + (i + 1) }}
                      </td>
                      <td data-label="Nama">{{ list.name }}</td>
                      <td data-label="3PL">
                        <div
                          v-for="(threepl, idx) in list['3pl']"
                          :key="idx"
                        >
                          {{ threepl.name }}
                        </div>
                      </td>
                      <td data-label="Alamat">
                        {{ $filters.setAddress(list.address) }}
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
                        colspan="5"
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
              :page-count="warehouseDataRes.total_page"
              :page-slot="10"
              :show-size-picker="warehouseDataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getWarehouse"
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
          @click.prevent="getWarehouse"
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
          @click.prevent="deleteWarehouse"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

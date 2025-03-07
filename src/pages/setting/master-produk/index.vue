<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import {
  Add,
  EllipsisVertical,
  DocumentText,
  Pencil,
  CheckmarkCircleOutline,
  HelpCircleOutline,
  Archive,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterProdukModel } from "@/models/setting/master-produk"
import { typeModel } from "@/models/setting/master-produk/type"
import ModalImportExcel from "@/pages/setting/master-produk/modal/modal-import-excel.vue"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const selectedValue = ref({
  id: "",
  name: "",
})
const params = ref<any>({
  q: "",
  dir: "desc",
  sort: "created_at",
  page: 1,
  limit: 10,
  product_type: null,
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
const filterOptions = ref<any>([])

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const actionOptions = ref<any>([])

onMounted(() => {
  setIsGranted()
  if (filters.isGranted(constants.accessSettings.settingProduk + ".list")) {
    getData()
    getProductType()
  } else {
    return router.push('/')
  }
})

function setIsGranted() {
  if (filters.isGranted(constants.accessSettings.settingProduk + ".detail")) {
    actionOptions.value.push({
      label: "Detail",
      key: "detail",
      icon: renderIcon(DocumentText),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingProduk + ".update")) {
    actionOptions.value.push({
      label: "Edit",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (filters.isGranted(constants.accessSettings.settingProduk + ".archive")) {
    actionOptions.value.push({
      label: "Arsip",
      key: "delete",
      icon: renderIcon(Archive),
    })
  }
}

async function getData() {
  isLoading.value = true
  await masterProdukModel
    .getProduct(params.value)
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

async function getProductType() {
  await typeModel
    .getType({ limit: 100 })
    .then((res) => {
      res.data.data.list.forEach((item: any) => {
        filterOptions.value.push({
          label: item.name,
          value: item.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
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
    case "detail":
      router.push({
        name: "setting-master-produk-id",
        params: { id: id },
      })
      break
    case "edit":
      router.push({
        path: `/setting/master-produk/update/${id}`,
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
  tFeedbackRef.value.subtitle = "Anda berhasil mengarsipkan data Produk"
  tFeedbackRef.value.show = true
}
function showDeleteFeedback() {
  tFeedbackRef.value.type = "delete"
  tFeedbackRef.value.icon = HelpCircleOutline
  tFeedbackRef.value.iconColor = "#EB5757"
  tFeedbackRef.value.title = "Perhatian"
  tFeedbackRef.value.subtitle = "Apakah Anda yakin untuk mengarsipkan data Produk?"
  tFeedbackRef.value.show = true
}
function deleteProduct() {
  isBtnLoading.value = true
  masterProdukModel.deleteProduct(selectedValue.value.id).then(() => {
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
    <n-h2 style="margin-bottom: 4px">Master Produk</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Master Produk</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <n-space
        v-if="
          $filters.isGranted(constants.accessSettings.settingProduk + '.create')
        "
      >
        <router-link
          to="/setting/master-produk/create/1"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <template #icon>
              <n-icon><add /></n-icon>
            </template>
            Tambah Produk
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
        v-if="$filters.isGranted(constants.accessSettings.settingProduk + '.list')"
      >
        <n-row
          gutter="16"
          style="margin-top: 24px"
        >
          <n-col :span="6">
            <n-input
              v-model:value="params.q"
              @input="searchData"
              type="text"
              placeholder="Cari Nama Produk"
            />
          </n-col>
          <n-col :span="6">
            <n-select
              v-model:value="params.product_type"
              :options="filterOptions"
              filterable
              clearable
              placeholder="Pilih Tipe Produk"
              class="select-tnt"
              @update:value="getData()"
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
                    <th>Kode Item</th>
                    <th>Nama Produk</th>
                    <th>Nama Panjang</th>
                    <th>Toll In</th>
                    <th>Tipe produk</th>
                    <th>UOM</th>
                    <th style="text-align: center">Serialisasi</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <td style="text-align: center">
                      {{ params.limit * (params.page - 1) + (i + 1) }}
                    </td>
                    <td>{{ (list as any).item_code }}</td>
                    <td>{{ (list as any).short_name }}</td>
                    <td>{{ $filters.isEmpty((list as any).long_name) }}</td>
                    <td :style="{
                          'text-transform': 'uppercase',
                          'color': (list as any).is_toll_in === true ? 'green' : 'red',
                        }">{{ (list as any).is_toll_in }}
                    </td>
                    <td>{{ (list as any).product_types.name }}</td>
                    <td>{{ (list as any).uom.name }}</td>
                    <td style="text-align: center">
                      <n-tag
                        :bordered="false"
                        :type="'primary'"
                        >{{
                          (list as any).serialize.kind?.value ==
                          "authentication_bpom"
                            ? "Authentication BPOM"
                            : (list as any).serialize.kind?.value ==
                              "authentication_gtin"
                            ? "Authentication GTIN"
                            : (list as any).serialize.kind?.value ==
                              "identification_bpom"
                            ? "Identifikasi BPOM"
                            : (list as any).serialize.kind?.value ==
                              "without_serialization"
                            ? "Tanpa Serialisasi"
                            : "-"
                        }}</n-tag
                      >
                    </td>
                    <td style="text-align: center">
                      <n-dropdown
                        placement="bottom-end"
                        :options="actionOptions"
                        @select="handleSelectDropdown($event, (list as any).id)"
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
              :page-slot="7"
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
          @click.prevent="hideFeedback"
        >
          Tutup
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'delete'">
        <n-button
          color="#828282"
          class="button-tnt"
          :loading="isBtnLoading"
          @click.prevent="hideFeedback"
        >
          Tidak
        </n-button>
        <n-button
          color="#EB5757"
          class="button-tnt"
          :loading="isBtnLoading"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="deleteProduct"
        >
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

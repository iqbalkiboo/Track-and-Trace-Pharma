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
import { mappingProdukModel } from "@/models/setting/master-mapping-produk"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(false)
const isProductLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const productDataRes = ref<any>({})
const searchValue = ref<any>("")
const params = ref({
  page: 1,
  sort: "desc",
  limit: 10,
})
const productParams = ref<any>({
  q: null,
  limit: 10000,
})
const selectedValue = ref({
  id: "",
  name: "",
})
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})

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
  if (filters.isGranted(constants.accessSettings.settingMappingProduk + ".list")) {
    getData()
  } else {
    return router.push('/')
  }
})

async function getData() {
  isLoading.value = true
  await mappingProdukModel
    .getMappingProductList(params.value)
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

function setIsGranted() {
  if (
    filters.isGranted(constants.accessSettings.settingMappingProduk + ".update")
  ) {
    actionOptions.value.push({
      label: "Edit Data",
      key: "edit",
      icon: renderIcon(Pencil),
    })
  }
  if (
    filters.isGranted(constants.accessSettings.settingMappingProduk + ".delete")
  ) {
    actionOptions.value.push({
      label: "Hapus Data",
      key: "delete",
      icon: renderIcon(Trash),
    })
  }
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

function handleSelectDropdown(key: string | number, data: any) {
  switch (key) {
    case "edit":
      const id = data.product?.id
      const mapping_id = data.id
      router.push({
        path: `/setting/master-mapping-produk/update/${id}`,
        query: { mapping_id: mapping_id },
      })
      break
    case "delete":
      selectedValue.value.id = data.id
      selectedValue.value.name = data.product?.short_name
      showDeleteFeedback()
      break

    default:
      break
  }
}

async function handleClickSearch() {
  isProductLoading.value = true
  isBtnLoading.value = true

  productParams.value.q = searchValue.value
  await mappingProdukModel
    .getProductList(productParams.value)
    .then((res) => {
      productDataRes.value = res.data
      isProductLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isProductLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function handleClickMapping(id: string) {
  router.push({
    path: `/setting/master-mapping-produk/create/${id}`,
  })
}

function deletemappingProduct() {
  isBtnLoading.value = true
  mappingProdukModel
    .deleteMappingProduk(selectedValue.value.id)
    .then(() => {
      isBtnLoading.value = false
      getData()
      setTimeout(() => {
        showSuccessFeedback()
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
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data mapping produk"
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
</script>

<template>
  <div class="body-tnt">
    <n-h3 style="margin-bottom: 4px">Mapping Produk</n-h3>
    <n-breadcrumb>
      <n-breadcrumb-item>Mapping Produk</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <template v-if="false">
        <n-space
          v-if="
            $filters.isGranted(
              constants.accessSettings.settingMappingProduk + '.create'
            )
          "
        >
          <router-link
            to="/setting/master-tipe-produk/create/1"
            class="text-decoration-none"
          >
            <n-button
              color="#219653"
              class="button-tnt"
            >
              <template #icon>
                <n-icon>
                  <add />
                </n-icon>
              </template>
              Tambah Tipe Produk
            </n-button>
          </router-link>
        </n-space>
      </template>

      <template
        v-if="
          $filters.isGranted(
            constants.accessSettings.settingMappingProduk + '.list'
          )
        "
      >
        <div
          class="card-tnt"
          style="margin-top: 0; background-color: #eeeeee"
        >
          <n-space
            vertical
            align="center"
          >
            <n-space>
              <n-input
                ref="input"
                v-model:value="searchValue"
                placeholder="Cari Nama Produk atau Kode Produk"
                clearable
                @keyup.enter="handleClickSearch"
                style="width: 35rem"
              ></n-input>
              <n-button
                :loading="isBtnLoading"
                :disabled="searchValue === ''"
                strong
                secondary
                type="primary"
                class="button-tnt"
                @click="handleClickSearch"
                >Cari</n-button
              >
            </n-space>
          </n-space>
        </div>
        <template v-if="isProductLoading">
          <div class="card-tnt">
            <t-loading></t-loading>
          </div>
        </template>
        <template v-else>
          <div
            v-if="Object.keys(productDataRes).length > 0"
            v-for="(product, i) in productDataRes.list"
            :key="i"
            class="card-tnt"
            style="background-color: #eeeeee"
          >
            <n-row
              :cols="12"
              gutter="10"
              align-items="center"
            >
              <n-col :span="1">
                <n-text strong>{{ i + 1 }}</n-text>
              </n-col>
              <n-col :span="5">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text strong>Nama Produk</n-text>
                  <n-text>{{ product.short_name }}</n-text>
                </n-space>
              </n-col>
              <n-col :span="4">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text strong>Kode Produk</n-text>
                  <n-text>{{ product.item_code }}</n-text>
                </n-space>
              </n-col>
              <n-col :span="6">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text strong>Principal</n-text>
                  <n-text>{{ product.principal?.name }}</n-text>
                </n-space>
              </n-col>
              <n-col :span="5">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text strong>UoM</n-text>
                  <n-text>{{ product.uom?.name }}</n-text>
                </n-space>
              </n-col>
              <n-col :span="3">
                <n-space
                  align="center"
                  justify="end"
                >
                  <n-button
                    strong
                    type="primary"
                    class="button-tnt"
                    @click="handleClickMapping(product.id)"
                    >Mapping</n-button
                  >
                </n-space>
              </n-col>
            </n-row>
          </div>
        </template>
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
                    <th>Nama Produk</th>
                    <th>Kode Produk</th>
                    <th>Nama Vendor</th>
                    <th>Kode Produk Vendor</th>
                    <th>Principal</th>
                    <th>UoM</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="dataRes?.list?.length > 0">
                    <tr
                      v-for="(item, i) in dataRes.list"
                      :key="i"
                    >
                      <td
                        data-label="No"
                        style="text-align: center"
                      >
                        {{ params.limit * (params.page - 1) + (i + 1) }}
                      </td>
                      <td data-label="Nama Produk">
                        {{ item.product?.short_name }}
                      </td>
                      <td data-label="Kode Produk">
                        {{ item.product?.item_code }}
                      </td>
                      <td data-label="Nama Vendor">{{ item.vendor?.name }}</td>
                      <td data-label="Kode Produk Vendor">{{ item.code }}</td>
                      <td data-label="Principal">{{ item.principal?.name }}</td>
                      <td data-label="UoM">{{ item.uom?.name }}</td>
                      <td
                        data-label="Aksi"
                        style="text-align: center"
                      >
                        <n-dropdown
                          placement="bottom-end"
                          :options="actionOptions"
                          @select="handleSelectDropdown($event, item)"
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
              show-size-picker
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
          @click="hideFeedback"
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
          @click.prevent="deletemappingProduct"
        >
          Yakin
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

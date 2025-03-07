<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import type { FormInst } from "naive-ui"
import {
  CheckmarkCircleOutline,
  EllipsisVertical,
  SearchOutline,
} from "@vicons/ionicons5"
import { transferOrderModel } from "@/models/penyimpanan/transfer-order"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const productDataRes = ref<any>({})
const params = ref<any>({
  search: "",
  status: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
})
const formRef = ref<FormInst>()
const formValue = ref<any>({})
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: "Alasan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}
const timerSearch = ref<any>(0)
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}
const actionOptions = [
  { label: "Scan", key: "scan", icon: renderIcon(SearchOutline) },
]
const tFeedbackRef = ref({
  show: ref(false),
  type: "",
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  align: "center",
})

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  await getDetailTO()
  await getListDetailProduct()
  isLoading.value = false
}

async function getDetailTO() {
  const id = route.params.id
  await transferOrderModel
    .getDetailTO(id)
    .then((res) => {
      detailDataRes.value = res.data
      setFormValue(detailDataRes.value)
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getListDetailProduct() {
  params.value.to_id = route.params.id
  await transferOrderModel
    .getListDetailProduct(params.value)
    .then((res) => {
      productDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function setFormValue(data: any) {
  formValue.value["reason"] = data.reason
}

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

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "scan":
      localStorage.setItem("product_id", id)
      router.push({
        name: "penyimpanan-transfer-id-scan",
      })
      break

    default:
      break
  }
}

function handleShowConfirm() {
  formRef.value
    ?.validate()
    .then(() => {
      showConfirmFeedback()
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

function handleClickConfirm() {
  isBtnLoading.value = true
  const id = route.params.id
  const formData = new FormData()

  formData.append("to_id", id as string)
  formData.append("reason", formValue.value.reason)

  transferOrderModel
    .finishTO(formData)
    .then(() => {
      isBtnLoading.value = false
      setTimeout(() => {
        tFeedbackRef.value.title = "Berhasil Transfer Order"
        tFeedbackRef.value.subtitle = `${productDataRes.value.list?.length} produk berhasil ditransfer`
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

function hideSuccessFeedback() {
  getData()
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk melakukan transfer order?"
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-space justify="space-between">
        <n-space
          vertical
          :size="0"
        >
          <n-h2 style="margin-bottom: 4px"
            >Kode Transfer Order : {{ detailDataRes.to_number }}</n-h2
          >
          <n-text
            >Qty Transfer Order :
            {{ $filters.toNumber(detailDataRes.qty) }}</n-text
          >
        </n-space>
        <n-tag
          round
          :bordered="false"
          strong
          :type="detailDataRes.status === 'complete' ? 'success' : 'warning'"
          size="large"
        >
          {{ detailDataRes.status }}
        </n-tag>
      </n-space>

      <div class="card-tnt">
        <n-row
          v-if="false"
          gutter="16"
        >
          <n-col :span="6">
            <n-input
              v-model:value="params.search"
              @update:value="searchData"
              clearable
              type="text"
              placeholder="Cari Kode Transfer Order"
            />
          </n-col>
        </n-row>
        <div
          class="table-tnt"
          style="margin-top: 0"
        >
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>Batch</th>
                    <th>Qty</th>
                    <th>Wh Building</th>
                    <th>Wh Room</th>
                    <th>Rack</th>
                    <th>Bin</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="productDataRes.list.length > 0">
                    <tr
                      v-for="(list, i) in productDataRes.list"
                      :key="i"
                    >
                      <td data-label="No">
                        {{ params.limit * (params.page - 1) + (i + 1) }}
                      </td>
                      <td data-label="Kode Produk">
                        {{ list.product?.item_code }}
                      </td>
                      <td data-label="Nama Produk">
                        {{ list.product?.short_name }}
                      </td>
                      <td data-label="Batch">
                        {{ list.batch }}
                      </td>
                      <td data-label="Qty">
                        {{
                          $filters.toNumber(list.current_qty) +
                          " / " +
                          $filters.toNumber(list.qty)
                        }}
                      </td>
                      <td data-label="Wh Building">
                        {{ list.to?.building.name }}
                      </td>
                      <td data-label="Wh Room">
                        {{ $filters.isEmpty(list.to?.room?.name) }}
                      </td>
                      <td data-label="Rack">
                        {{ $filters.isEmpty(list.to?.rack_pallete?.name) }}
                      </td>
                      <td data-label="Bin">
                        {{ $filters.isEmpty(list.to?.bin?.name) }}
                      </td>
                      <td
                        data-label="Aksi"
                        style="text-align: center"
                      >
                        <n-dropdown
                          placement="bottom-end"
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
                  </template>
                  <template v-else>
                    <tr>
                      <td
                        colspan="10"
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
              v-model:page-size="params.limit"
              :page-count="productDataRes.total_page"
              :page-slot="7"
              :show-size-picker="productDataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getData"
              @update:page-size="updatePageSize"
            />
          </div>
        </div>

        <n-form
          v-if="
            detailDataRes.status
              ? detailDataRes.status !== 'cancel' &&
                detailDataRes.status !== 'complete'
              : false
          "
          ref="formRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item
            label="Alasan"
            path="reason"
          >
            <n-input
              v-model:value="formValue.reason"
              placeholder="Masukkan Alasan"
            />
          </n-form-item>
        </n-form>
      </div>
    </template>
    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'penyimpanan-transfer' }"
          class="text-decoration-none"
        >
          <n-button
            :loading="isBtnLoading"
            color="#828282"
            class="button-tnt"
            style="width: 120px"
            >Kembali</n-button
          >
        </router-link>
        <n-button
          v-if="
            detailDataRes.status
              ? detailDataRes.status !== 'cancel' &&
                detailDataRes.status !== 'complete'
              : false
          "
          :loading="isBtnLoading"
          type="primary"
          class="button-tnt"
          style="width: 120px"
          @click="handleShowConfirm"
        >
          Konfirmasi
        </n-button>
      </div>
    </div>
  </div>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
    :align="tFeedbackRef.align"
  >
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          type="primary"
          class="button-tnt"
          @click="handleClickConfirm"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideSuccessFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

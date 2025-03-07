<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import type { FormInst } from "naive-ui"
import {
  CheckmarkCircleOutline,
  EllipsisVertical,
  SearchOutline,
} from "@vicons/ionicons5"
import { adjustmentModel } from "@/models/penyimpanan/adjustment"

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
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}
const timerSearch = ref<any>(0)
const actionOptions = [
  { label: "Scan", key: "scan", icon: renderIcon(SearchOutline) },
]

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  await getDetailAdjustment()
  await getListDetailProduct()
  isLoading.value = false
}

async function getDetailAdjustment() {
  const id = route.params.id
  await adjustmentModel
    .getDetailAdjustment(id)
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
  params.value.adjustment_id = route.params.id
  await adjustmentModel
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
        name: "penyimpanan-penyesuaian-id-scan",
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

  formData.append("adjustment_id", id as string)
  // formData.append('adjustment_code', detailDataRes.value.adjustment_code)
  formData.append("reason", formValue.value.reason)

  adjustmentModel
    .finishAdjustment(formData)
    .then(() => {
      isBtnLoading.value = false
      setTimeout(() => {
        tFeedbackRef.value.title = "Berhasil Melakukan Adjustmen"
        tFeedbackRef.value.subtitle = `${productDataRes.value.list?.length} produk berhasil diadjust`
        showSuccessFeedback()
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

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
  tFeedbackRef.value.subtitle = "Apakah Anda yakin untuk melakukan adjustment?"
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
            >Kode Adjustmen : {{ detailDataRes.adjustment_code }}</n-h2
          >
          <n-text>Qty Adjustmen : {{ detailDataRes.total_qty }}</n-text>
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
              placeholder="Cari Kode Adjustment"
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
                      <td>{{ params.limit * (params.page - 1) + (i + 1) }}</td>
                      <td>{{ (list as any).product?.item_code }}</td>
                      <td>{{ (list as any).product?.short_name }}</td>
                      <td>{{ (list as any).batch }}</td>
                      <td>
                        {{
                          $filters.toNumber((list as any).current_qty) +
                          " / " +
                          $filters.toNumber((list as any).qty)
                        }}
                      </td>
                      <td>
                        {{
                          $filters.isEmpty((list as any).from?.building.name)
                        }}
                      </td>
                      <td>
                        {{ $filters.isEmpty((list as any).from?.room?.name) }}
                      </td>
                      <td>
                        {{
                          $filters.isEmpty(
                            (list as any).from?.rack_pallete?.name
                          )
                        }}
                      </td>
                      <td>
                        {{ $filters.isEmpty((list as any).from?.bin?.name) }}
                      </td>
                      <td style="text-align: center">
                        <n-dropdown
                          placement="bottom-end"
                          :options="actionOptions"
                          @select="
                            handleSelectDropdown($event, (list as any).id)
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
          :to="{ name: 'penyimpanan-penyesuaian' }"
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
          Adjust
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

<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
import type { FormInst } from "naive-ui"
import type { Component } from "vue"
import {
  Add,
  EllipsisVertical,
  SearchOutline,
  CloseOutline,
  CheckmarkCircleOutline,
} from "@vicons/ionicons5"
import moment from "moment"
import { adjustmentModel } from "@/models/penyimpanan/adjustment"
import ModalImportExcel from "./modal/modal-import-excel.vue"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  status: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
})
const modalImport = ref<any>({
  show: false,
})
const modalCancel = ref<any>({
  show: false,
})
const selectedValue = ref({
  id: "",
  code: "",
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

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const actionOptions = [
  { label: "Detail", key: "detail", icon: renderIcon(SearchOutline) },
]
const actionPendingOptions = [
  { label: "Detail", key: "detail", icon: renderIcon(SearchOutline) },
  { label: "Batalkan", key: "cancel", icon: renderIcon(CloseOutline) },
]

function handleSelectDropdown(key: string | number, id: string, code: string) {
  switch (key) {
    case "detail":
      router.push({
        name: "penyimpanan-penyesuaian-id",
        params: { id: id },
      })
      break
    case "cancel":
      selectedValue.value.id = id
      selectedValue.value.code = code
      showModalCancel()

      break
    default:
      break
  }
}

onMounted(() => {
  localStorage.removeItem("product_id")
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await adjustmentModel
    .getAdjustment(params.value)
    .then((res) => {
      dataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
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

function showModalImport() {
  modalImport.value.show = true
}
function hideModalImport() {
  modalImport.value.show = false
}

function showModalCancel() {
  modalCancel.value.show = true
}
function hideModalCancel() {
  formValue.value.reason = ""
  modalCancel.value.show = false
}
async function cancelAdjustment() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("adjustment_id", selectedValue.value.id)
  formData.append("reason", "coba")

  await adjustmentModel
    .cancelAdjustment(formData)
    .then(() => {
      tFeedbackRef.value.show = false
      hideModalCancel()
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

function showConfirmFeedback() {
  formRef.value
    ?.validate()
    .then(() => {
      tFeedbackRef.value.type = "confirm"
      tFeedbackRef.value.hideIcon = true
      tFeedbackRef.value.title = "Konfirmasi Cancel"
      tFeedbackRef.value.subtitle = `Apakah Anda yakin untuk membatalkan kode ${selectedValue.value.code} ?`
      tFeedbackRef.value.show = true
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}
function hideSuccessFeedback() {
  getData()
  tFeedbackRef.value.show = false
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Anda berhasil membatalkan adjustment"
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Penyesuaian (Adjustment)</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Penyesuaian (Adjustment)</n-breadcrumb-item>
    </n-breadcrumb>

    <n-card style="border-radius: 10px; margin-top: 18px">
      <n-button
        type="primary"
        class="button-tnt"
        @click.prevent="showModalImport"
      >
        <n-icon :component="Add" />
        Upload Adjustment
      </n-button>
    </n-card>

    <div class="card-tnt">
      <n-row gutter="16">
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
      <div class="table-tnt">
        <template v-if="isLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <n-scrollbar x-scrollable>
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Adjust</th>
                  <th>Tanggal Adjust</th>
                  <!-- <th>Kode Produk</th> -->
                  <!-- <th>Nama Produk</th> -->
                  <!-- <th>Batch</th> -->
                  <th>Qty</th>
                  <!-- <th>Wh Building</th> -->
                  <!-- <th>Wh Room</th> -->
                  <th style="text-align: center">Status</th>
                  <th style="text-align: center; width: 3rem">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dataRes.list.length > 0">
                  <tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <td data-label="No">
                      {{ params.limit * (params.page - 1) + (i + 1) }}
                    </td>
                    <td data-label="Kode Adjust">
                      {{ list.adjustment_code }}
                    </td>
                    <td data-label="Tanggal Adjust">
                      {{ moment(list.created_at).format("yyyy-MM-DD") }}
                    </td>
                    <!-- <td>{{ list.product?.item_code ? list.product?.item_code : '?' }}</td> -->
                    <!-- <td>{{ list.product?.short_name ? list.product?.short_name : '?' }}</td> -->
                    <!-- <td>{{ list.batch ? list.batch : '?' }}</td> -->
                    <td data-label="Qty">
                      {{ list.total_qty }}
                    </td>
                    <!-- <td>{{ '?' }}</td> -->
                    <!-- <td>{{ '?' }}</td> -->
                    <td
                      data-label="Status"
                      style="text-align: center"
                    >
                      <n-tag
                        round
                        :bordered="false"
                        :type="
                          list.status === 'cancel'
                            ? 'error'
                            : list.status === 'pending'
                            ? 'warning'
                            : 'success'
                        "
                      >
                        {{ list.status }}
                      </n-tag>
                    </td>
                    <td
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        show-arrow
                        placement="bottom-end"
                        :options="
                          list.status === 'pending'
                            ? actionPendingOptions
                            : actionOptions
                        "
                        @select="
                          handleSelectDropdown(
                            $event,
                            list.id,
                            list.adjustment_code
                          )
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
                      colspan="6"
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
            :page-count="dataRes.total_page"
            :page-slot="7"
            :show-size-picker="dataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getData"
            @update:page-size="updatePageSize"
          />
        </div>
      </div>
    </div>
  </div>

  <modal-import-excel
    :is-show-modal="modalImport.show"
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
    :align="tFeedbackRef.align"
  >
    <n-space
      justify="center"
      style="width: 100%"
    >
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click.prevent="hideSuccessFeedback"
        >
          Tutup
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
        >
          Batalkan
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#EB5757"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="cancelAdjustment"
        >
          Yakin
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <n-modal
    :mask-closable="false"
    :show="modalCancel.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 470px; max-width: 100%; border-radius: 8px"
    header-style="padding-bottom: 10px"
    @update:show="modalCancel.show = false"
  >
    <n-space vertical>
      <n-h3 style="margin-bottom: 0">Konfirmasi Cancel</n-h3>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        :show-require-mark="false"
        class="form-tnt"
        style="width: 100%"
      >
        <n-form-item
          path="reason"
          label="Alasan"
        >
          <n-input
            v-model:value="formValue.reason"
            placeholder="Masukkan alasan"
          />
        </n-form-item>
      </n-form>
      <n-space justify="center">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="hideModalCancel"
        >
          Batalkan
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#EB5757"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="showConfirmFeedback"
        >
          Konfirmasi
        </n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

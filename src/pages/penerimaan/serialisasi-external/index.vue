<!-- eslint-disable no-fallthrough -->
<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { NIcon, useMessage } from "naive-ui"
import type { Component } from "vue"
import {
  Add,
  CheckmarkCircleOutline,
  CloseOutline,
  EllipsisVertical,
  SearchOutline,
} from "@vicons/ionicons5"
import moment from "moment"
import { serialisasiExternalModel } from "@/models/penerimaan/serialisasi-external"
import ModalImportExcel from "./modal/modal-import-excel.vue"
import constants from "@/helpers/constant"

const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  status: "",
  sort: "desc",
  dir: "created_at",
  page: 1,
  limit: 10,
})
const modalImport = ref<any>({
  show: false,
  importProduct: false,
  data: {},
})
const modalCancel = ref<any>({
  show: false,
})
const selectedValue = ref<any>({
  id: "",
  data: {},
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

function actionOptions(data: any) {
  let options: any = []
  if (data.is_upload_serialization) {
    options = []
    options.push({
      label: "Detail",
      key: "detail",
      icon: renderIcon(SearchOutline),
    })
    options.push({
      label: "Cancel",
      key: "cancel",
      icon: renderIcon(CloseOutline),
      disabled: data.status === "complete",
    })
  } else {
    options = []
    options.push({
      label: "Upload Serialisasi",
      key: "upload",
      icon: renderIcon(Add),
    })
    options.push({
      label: "Cancel",
      key: "cancel",
      icon: renderIcon(CloseOutline),
    })
  }

  if (data.is_cancel) {
    options = []
    options.push({
      label: "Detail",
      key: "detail",
      icon: renderIcon(SearchOutline),
    })
  }
  return options
}

function handleSelectDropdown(key: string | number, id: string, data: any) {
  switch (key) {
    case "detail":
      router.push({
        name: "penerimaan-serialisasi-external-id",
        params: { id: id },
      })
      break
    case "upload":
      modalImport.value.importProduct = true
      modalImport.value.show = true
      modalImport.value.data.id = id
      break
    case "cancel":
      selectedValue.value.id = id
      selectedValue.value.data = data
      showModalCancel()

    default:
      break
  }
}

onMounted(() => {
  if (!filters.checkPermission(constants.accessReceive.penerimaanSerialisasiExternal + ".list")) {
    return router.push('/')
  }
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await serialisasiExternalModel
    .getSerialize(params.value)
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
  modalImport.value.importProduct = false
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

async function cancelSerialie() {
  isBtnLoading.value = true
  const params = {
    import_serialization_id: selectedValue.value.id,
  }
  await serialisasiExternalModel
    .cancelSerialie(params)
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

function hideSuccessFeedback() {
  getData()
  tFeedbackRef.value.show = false
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Anda berhasil membatalkan serialisasi external"
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Serialisasi External</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Serialisasi External</n-breadcrumb-item>
    </n-breadcrumb>

    <n-card style="border-radius: 10px; margin-top: 18px">
      <n-button
        color="#219653"
        class="button-tnt"
        @click.prevent="showModalImport"
      >
        <n-icon :component="Add" />
        Upload DO External
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
            placeholder="Cari Kode DO Vendor"
          />
        </n-col>
      </n-row>
      <div class="table-tnt">
        <template v-if="isLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <div
            v-if="dataRes.list.length > 0"
            class="card-tnt"
            style="padding: 1rem; background-color: #eeeeee; margin-top: 10px"
            v-for="(list, i) in dataRes.list"
            :key="i"
          >
            <n-space justify="space-between">
              <n-text
                strong
                style="font-size: 14px"
                >No PO: {{ list?.code }}</n-text
              >
              <n-tag
                round
                :bordered="false"
                :type="
                  list.status === 'pending'
                    ? 'warning'
                    : list.status === 'sukses'
                    ? 'success'
                    : list.status === 'cancel'
                    ? 'error'
                    : list.status === 'complete'
                    ? 'success'
                    : 'default'
                "
              >
                {{ $filters.toStatus(list?.status) }}
              </n-tag>
            </n-space>
            <n-row gutter="12">
              <n-col :span="8">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text>No DO : {{ list?.vendor_do }}</n-text>
                  <n-text>No Vendor : {{ list?.vendor_no }}</n-text>
                  <n-text
                    >Tgl DO :
                    {{ moment(list?.created_at).format("yyyy-MM-DD") }}</n-text
                  >
                  <n-text
                    >Kode Produk :
                    <span
                      v-for="(product, iProduct) in list.product"
                      :key="iProduct"
                      >{{ product.code }},
                    </span>
                  </n-text>
                  <n-text
                    >Kode Batch :
                    <span
                      v-for="(product, iProduct) in list.product"
                      :key="iProduct"
                      >{{ product.batch }},
                    </span>
                  </n-text>
                </n-space>
              </n-col>
              <n-col
                :span="8"
                align="center"
              >
                <n-text>Qty : {{ list?.total_qty }}</n-text>
              </n-col>
              <n-col
                :span="8"
                align="center"
              >
                <n-space
                  justify="end"
                  style="margin-top: 22px"
                >
                  <!-- :options="list?.is_upload_serialization ? actionOptions : actionPendingOptions" -->
                  <n-dropdown
                    placement="bottom-end"
                    :options="actionOptions(list)"
                    @select="handleSelectDropdown($event, list.id, list)"
                  >
                    <n-button tertiary>
                      <template #icon>
                        <n-icon><ellipsis-vertical /></n-icon>
                      </template>
                    </n-button>
                  </n-dropdown>
                </n-space>
              </n-col>
            </n-row>
          </div>
          <div
            v-else
            class="card-tnt"
            style="
              text-align: center;
              padding: 1rem;
              background-color: #eeeeee;
              margin-top: 10px;
            "
          >
            <n-text>Belum ada data tersedia</n-text>
          </div>
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
    :is-import-product="modalImport.importProduct"
    :data="modalImport.data"
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
    header-style="padding-bottom: 10px;"
    title="Konfirmasi Cancel"
    @update:show="modalCancel.show = false"
  >
    <n-space vertical>
      <n-form
        v-if="false"
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
      <div style="text-align: center; padding-top: 1rem; padding-bottom: 1rem">
        <n-space
          vertical
          :size="0"
        >
          <n-text>Apakah Anda yakin untuk membatalkan DO Vendor</n-text>
          <n-text>{{ selectedValue.data.vendor_no }}?</n-text>
        </n-space>
      </div>
      <n-space justify="center">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="hideModalCancel"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#EB5757"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="cancelSerialie"
        >
          Konfirmasi
        </n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import {
  AddOutline,
  CloseOutline,
  EllipsisVertical,
  GitMergeOutline,
  ListOutline,
  LocationOutline,
} from "@vicons/ionicons5"
import type { FormInst, UploadFileInfo } from "naive-ui"
import { useMessage } from "naive-ui"
import { renderIcon } from "@/helpers/render-icon"
import moment from "moment"
import { agregasiModel } from "@/models/pengiriman/agregasi"
import { hideFeedback, tFeedbackRef } from "@/helpers/feedback"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import constants from "@/helpers/constant"
import { masterCustomerModel } from "@/models/setting/master-customer"

const params = ref<any>({
  dir: "desc",
  sort: "created_at",
  page: 1,
  limit: 10,
  status: "",
  do_type: "",
  code: "",
  destination: "",
})
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const isExportLoading = ref(false)
const dataRes = ref<any>({})
const typeAgregasi = ref("")
const router = useRouter()
const optionsDestionations = ref<any>([])
const route = useRoute()
const showModalAddDO = ref(false)
const fileListLengthRef = ref(0)
const excelValue = ref<any>({})
const formRef = ref<FormInst | null>(null)
const setIdDo = ref("")

const optionsStatus = ref([
  {
    label: "Perlu Agregasi",
    value: "perlu_agregasi",
  },
  {
    label: "Ready to Delivery",
    value: "ready_to_delivery",
  },
  {
    label: "On Delivery",
    value: "on_delivery",
  },
  {
    label: "Finish",
    value: "finish",
  },
  {
    label: "Cancel",
    value: "cancel",
  },
])

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "detail":
      router.push({
        name: "pengiriman-agregasi-type-id",
        params: { id },
      })
      break
    case "tambah":
      router.push({
        name: "pengiriman-agregasi-type-id-add",
        params: { id },
      })
      break
    case "lacak":
      router.push({
        name: "lacak-do-id",
        params: { id },
      })
      break
    case "cancel":
      setIdDo.value = id
      showCancelFeedback()
      break
    case "list":
      router.push({
        name: "pengiriman-id-list-manifest",
        params: { id },
      })
      break
    default:
      break
  }
}

const isCustomer = computed(() => route.params.type === 'customer')
const isCrossdocking = computed(() => route.params.type === 'crossdocking')

onMounted(() => {
  params.value.page = parseInt(route.query.p as string) || 1
  const crossdocking = "crossdocking"
  const customer = "customer"
  if (isCrossdocking.value) {
    typeAgregasi.value = crossdocking
    params.value.do_type = crossdocking
    if (!filters.checkPermission(constants.accessDelivery.pengirimanCabang + ".list")) {
      return router.push('/')
    }
  } else if (isCustomer.value) {
    typeAgregasi.value = customer
    params.value.do_type = customer
    if (!filters.checkPermission(constants.accessDelivery.pengirimanCustomer + ".list")) {
      return router.push('/')
    }
  } else {
    console.log('wtf')
    router.push("/")
  }
  getData()
  getDataWarehouse()
})

function updatePageSize(pageSize: number) {
  params.value.limit = pageSize
  getData()
}

function updatePage(p: number) {
  router.push({ query: { ...route.query, p } })
}

const total_data = ref(0)
const total_page = ref(0)

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await agregasiModel
    .getDO(params.value)
    .then((res: any) => {
      total_page.value = res.data.total_page
      total_data.value = res.data.total_data
      dataRes.value = res.data.list.map((item: any) => ({
        ...item,
        watch_product: false,
      }))
      
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      if (err.response) {
        const data = err.response.data
        tMessage.error(data.message)
      }
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function getActionOptions(status: string) {
  const options = [
    {
      label: "Lihat Agregasi",
      key: "tambah",
      icon: renderIcon(GitMergeOutline),
    },
    // { label: "Detail", key: "detail", icon: renderIcon(SearchOutline) },
    {
      label: "List Manifest",
      key: "list",
      icon: renderIcon(ListOutline),
    },
    {
      label: "Batalkan",
      key: "cancel",
      icon: renderIcon(CloseOutline),
    },
    {
      label: "Lacak DO",
      key: "lacak",
      icon: renderIcon(LocationOutline),
    },
  ]

  if (status == "cancel" || status === "finish") {
    return options.filter((opt) => opt.key === "tambah" || opt.key === "lacak")
  } else {
    return options
  }
}

function showCancelFeedback() {
  tFeedbackRef.value.type = "cencel"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.iconColor = "#219653"
  // tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.title = "Batalkan"
  tFeedbackRef.value.subtitle = "Apakah Anda yakin untuk membatalkan DO?"
  tFeedbackRef.value.show = true
}

async function handleCencelDO(id: string) {
  await agregasiModel
    .cencelDO(id)
    .then(() => {
      isLoading.value = false
      isBtnLoading.value = false
      getData()
      hideFeedback()
      tFeedbackRef.value.show = false
      tMessage.success("Berhasil membatalkan DO")
    })
    .catch(() => {
      isLoading.value = false
      isBtnLoading.value = false
      tFeedbackRef.value.show = false
    })
}

async function handleChangeUploadDO(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]
  if (allowedTypes.indexOf(String(data.file.file?.type)) === -1) {
    tMessage.error("File yang diupload bukan excel, silakan upload ulang")
  } else {
    excelValue.value.name = data.file.name
    excelValue.value.file = data.file.file
    fileListLengthRef.value = data.fileList.length
  }
}

async function handleSubmit() {
  isBtnLoading.value = true
  await formRef.value
    ?.validate()
    .then(() => {
      const formData = new FormData()
      formData.append("type", typeAgregasi.value)
      formData.append("file", excelValue.value.file)
      agregasiModel
        .importDO(formData)
        .then(() => {
          getData()
          showModalAddDO.value = false
          isBtnLoading.value = true
          tMessage.success(`Berhasil import ${ isCrossdocking ? 'DO' : 'Invoice' }`)
        })
        .catch((err: any) => {
          if (err.response) {
            const data = err.response.data
            tMessage.error(data.message)
          }
          isBtnLoading.value = false
          showModalAddDO.value = false
        })
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

async function getDataWarehouse() {
  isLoading.value = true
  if (isCrossdocking.value) {
  await masterWarehouseModel
    .getWarehouse({
      limit: 1000,
      sort: "desc",
    })
    .then((res: any) => {
      isLoading.value = false
      optionsDestionations.value = res.data?.list.map((v: any) => ({
        label: v.name,
        value: v.id,
      }))
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      console.log(data)
    })
  } else {
    await masterCustomerModel
      .getCustomer({
        limit: 1000,
        sort: "desc",
      })
      .then((res: any) => {
        console.log(res)
        isLoading.value = false
        optionsDestionations.value = res.data?.data?.list.map((v: any) => ({
          label: v.name,
          value: v.id,
        }))
      })
      .catch((err: any) => {
        isLoading.value = false
        const data = err.response.data
        console.log(data)
      })
  }
}

function getProductName(product: any) {
  const data = product.map((item: any) => {
    return item.name
  })
  return data.join(",")
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

function handleUpdateTargetDelivery(value: any) {
  params.value.date = value ? value : null
  getData()
}

function handleUpdateDestionations(value: any) {
  params.value.destination = value ? value : null
  getData()
}

function handleUpdateStatus(value: any) {
  params.value.status = value ? value : null
  getData()
}

const exportData = () => {
  isExportLoading.value = true
  agregasiModel.exportDO(isCrossdocking.value ? 'crossdocking' : 'customer').finally(() => {
    isExportLoading.value = false
  })
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">{{ isCrossdocking ? 'DO' : 'Invoice' }}</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Agregasi</n-breadcrumb-item>
      <n-breadcrumb-item>{{ isCrossdocking ? 'Plant/Cabang' : 'Customer' }}</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space justify="space-between">
        <n-button
          color="#219653"
          class="button-tnt"
          @click="showModalAddDO = true"
        >
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          Upload {{ isCrossdocking ? 'DO' : 'Invoice' }}
        </n-button>
        <n-button
          v-if="isCustomer"
          type="primary"
          class="button-tnt"
          :loading="isExportLoading"
          @click="exportData"
        >
          Export Data
        </n-button>
      </n-space>
      <n-grid
        cols="6"
        x-gap="12"
        style="margin-top: 1rem"
      >
        <n-gi>
          <n-input
            v-model:value="params.code"
            @update:value="searchData"
            clearable
            :placeholder="`Cari Kode ${ isCrossdocking ? 'DO' : 'Invoice' }`"
          />
        </n-gi>
        <n-gi>
          <n-input
            v-model:value="params.product_code"
            @update:value="searchData"
            clearable
            placeholder="Cari Kode Product"
          />
        </n-gi>
        <n-gi>
          <n-input
            v-model:value="params.erp_code"
            @update:value="searchData"
            clearable
            placeholder="Cari Kode Tujuan"
          />
        </n-gi>
        <n-gi>
          <n-date-picker
            value-format="yyyy-MM-dd"
            clearable
            @update-formatted-value="handleUpdateTargetDelivery"
            :placeholder="`Tanggal ${ isCrossdocking ? 'DO' : 'Invoice' }`"
            type="date"
          />
        </n-gi>
        <n-gi>
          <n-select
            :options="optionsDestionations"
            @update:value="handleUpdateDestionations"
            clearable
            filterable
            placeholder="Pilih Tujuan"
          />
        </n-gi>
        <n-gi>
          <n-select
            :options="optionsStatus"
            @update:value="handleUpdateStatus"
            clearable
            filterable
            placeholder="Pilih Status"
          />
        </n-gi>
      </n-grid>
      <n-space
        vertical
        :size="10"
        style="margin-top: 24px"
      >
        <template v-if="isLoading">
          <t-loading></t-loading>
        </template>
        <template v-else>
          <template v-if="dataRes.length > 0">
            <div
              class="card-tnt card-box-tnt"
              style="
                padding: 1rem;
                margin-top: 0;
                border-radius: 12px;
                background: #eee;
              "
              v-for="(list, i) in dataRes"
              :key="i"
            >
              <n-space justify="space-between">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-space>
                    <n-text strong>Kode {{ isCrossdocking ? 'DO' : 'Invoice' }} :</n-text>
                    <n-text>{{ list.code }}</n-text>
                  </n-space>
                  <n-space>
                    <n-text strong>Tujuan :</n-text>
                    <n-text>{{ list.customer?.name }}</n-text>
                    <n-text>({{ list.customer?.erp_code }})</n-text>
                  </n-space>
                  <n-space>
                    <n-text strong>Tanggal {{ isCrossdocking ? 'DO' : 'Invoice' }}</n-text>
                    <n-text
                      >{{ moment(list?.do_date).format("yyyy-MM-DD") }}
                    </n-text>
                  </n-space>
                  <n-space v-if="false">
                    <n-space align="center">
                      <n-text
                        strong
                        style="margin: 0"
                        v-if="list.products?.length"
                      >
                        Produk :
                      </n-text>
                      <n-text>
                        {{
                          list.watch_product
                            ? getProductName(list.products)
                            : getProductName(list.products).split(",")[0]
                        }}
                      </n-text>
                      <n-button
                        v-if="list.products.length > 1"
                        text
                        type="primary"
                        @click="list.watch_product = !list.watch_product"
                        >{{
                          list.watch_product ? "Lebih Sedikit" : "Lebih Banyak"
                        }}
                      </n-button>
                    </n-space>
                  </n-space>
                </n-space>
                <n-tag
                  round
                  :type="
                    list.status === 'cancel'
                      ? 'error'
                      : list.status === 'finish'
                      ? 'success'
                      : 'info'
                  "
                  >{{ $filters.toStatus(list.status) }}
                </n-tag>
              </n-space>
              <n-row gutter="10">
                <n-col
                  :span="22"
                  style="margin-top: 10px"
                >
                  <n-row gutter="10">
                    <n-col :span="4">
                      <n-space
                        vertical
                        align="start"
                        :size="0"
                      >
                        <n-text strong>No PO</n-text>
                        <n-text>{{ list.po_number }}</n-text>
                      </n-space>
                    </n-col>
                    <n-col :span="4">
                      <n-space
                        vertical
                        align="start"
                        :size="0"
                      >
                        <n-text strong>Nama Building</n-text>
                        <n-text
                          >{{ list.origin.warehouse_building.name }}
                        </n-text>
                      </n-space>
                    </n-col>
                    <n-col :span="4">
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-text strong>No {{ isCrossdocking ? 'Invoice' : 'Quotation' }}</n-text>
                        <n-text>{{ $filters.isEmpty(list.no_invoice) }}</n-text>
                      </n-space>
                    </n-col>
                    <n-col :span="4">
                      <n-space
                        vertical
                        align="center"
                        :size="0"
                      >
                        <n-text strong>Pesan / Qty Packing</n-text>
                        <n-text
                          >{{
                            `${list.total?.qty_request} / ${list.total?.qty_packed}`
                          }}
                        </n-text>
                      </n-space>
                    </n-col>
                    <n-col :span="4">
                      <n-space
                        vertical
                        align="center"
                        :size="0"
                      >
                        <n-text strong>Belum dipack</n-text>
                        <n-text>{{ list.total?.qty_remaining }}</n-text>
                      </n-space>
                    </n-col>
                    <n-col :span="4">
                      <n-space
                        vertical
                        align="center"
                        :size="0"
                      >
                        <n-text strong>Qty Manifest</n-text>
                        <n-text
                          >{{ $filters.toNumber(list.total?.manifest) }}
                        </n-text>
                      </n-space>
                    </n-col>
                  </n-row>
                </n-col>
                <n-col
                  :span="2"
                  :align="'end'"
                  style="margin-top: 10px"
                >
                  <n-dropdown
                    placement="bottom-end"
                    show-arrow
                    :options="getActionOptions(list.status)"
                    @select="handleSelectDropdown($event, list.id)"
                  >
                    <n-button tertiary>
                      <template #icon>
                        <n-icon>
                          <ellipsis-vertical />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-dropdown>
                </n-col>
              </n-row>
            </div>
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
        </template>
        <n-space justify="center">
          <n-pagination
            v-model:page="params.page"
            :page-count="total_page"
            :page-slot="10"
            :show-size-picker="total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="updatePage"
            @update:page-size="updatePageSize"
          />
        </n-space>
      </n-space>
    </div>
  </div>

  <t-feedback
    :title="
      typeAgregasi === 'crossdocking'
        ? `Tambah ${ isCrossdocking ? 'DO' : 'Invoice' } Tipe Crossdocking`
        : `Tambah ${ isCrossdocking ? 'DO' : 'Invoice' } Tipe Customer`
    "
    v-model:show="showModalAddDO"
    hideIcon
  >
    <n-form
      class="form-tnt"
      ref="formRef"
    >
      <n-form-item
        label="Upload File"
        :show-feedback="false"
      >
        <n-upload
          directory-dnd
          @change="handleChangeUploadDO"
        >
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon
                size="48"
                style="opacity: 0.6"
                :depth="3"
              >
                <add-outline />
              </n-icon>
            </div>
            <n-text style="font-size: 16px; opacity: 0.7">
              klik atau tarik file ke area upload ini
            </n-text>
          </n-upload-dragger>
        </n-upload>
      </n-form-item>
      <n-form-item
        label=""
        :show-feedback="true"
        :show-label="false"
      >
        <a
          :href="
            typeAgregasi === 'crossdocking' ? '/assets/xlsx/sample_crossdocking.xlsx' : '/assets/xlsx/sample_customer.xlsx'
          "
          class="text_link"
          >download contoh file</a
        >
      </n-form-item>
    </n-form>
    <n-space>
      <n-button
        :loading="isBtnLoading"
        @click="showModalAddDO = false"
        type="tertiary"
        class="button-tnt"
        >Batalkan
      </n-button>
      <n-button
        :disabled="fileListLengthRef === 0"
        :loading="isBtnLoading"
        type="primary"
        @click="handleSubmit"
        class="button-tnt"
        >Tambahkan
      </n-button>
    </n-space>
  </t-feedback>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'cencel'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          secondary
          strong
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          type="primary"
          secondary
          strong
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click="handleCencelDO(setIdDo)"
        >
          Yakin
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

<style>
.body-card-tnt p {
  font-size: 0.8rem;
}

.body-card-tnt p,
.body-card-tnt span {
  color: #000;
  opacity: 0.6;
}
</style>
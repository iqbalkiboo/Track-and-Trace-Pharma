<script setup lang="ts">
import { useMessage } from "naive-ui"
import {
  Add,
  CloseOutline,
  EllipsisVertical,
  LocationOutline,
  PrintOutline,
  SearchOutline,
  TrashOutline
} from "@vicons/ionicons5"
import { renderIcon } from "@/helpers/render-icon"
import { auth } from "@/models/auth"
import { serializeModel } from "@/models/produksi/serialisasi"
import moment from "moment"
import ModalImportExcel from "./modal/modal-import-excel.vue"
import ModalSyncSap from "./modal/modal-sync-sap.vue"
import ModalCancelSerialize from "./modal/modal-cancel-serialize.vue"
import constants from "@/helpers/constant"
import ModalSoftDeleteSerialize from "@/pages/produksi/serialisasi/modal/modal-soft-delete-serialize.vue"


const router = useRouter()
const tMessage = useMessage()
const authData = auth.getAuth()

const cariIDPKTimeout = ref<any>(null)
const idPk = ref("")
const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const actionOptions = ref<any>([])
const params = ref({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
})
const selectedValue = ref<any>({
  id: "",
  name: "",
  type: "",
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
const isShowModalImport = ref(false)
const isShowModalSync = ref(false)
const idSerialize = ref("")
const isShowModalCancel = ref(false)
const isShowModalSoftDelete = ref(false)

onMounted(() => {
  if (authData.xxtype !== "5up3r4dm1n") {
    setIsGranted()
  } else {
    getData()
  }
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true

  await serializeModel
    .getSerialize(params.value)
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

function setIsGranted() {
    isLoading.value = true
    if (filters.checkPermission(constants.accessProduksi.serialisasi + ".list")) {
      getData()
      isLoading.value = false
    } else {
      return router.push('/')
    }

    if (filters.checkPermission(constants.accessProduksi.serialisasi + ".detail")) {
      actionOptions.value.push({
        label: "Detail Serialisasi",
        key: "detail",
        icon: renderIcon(SearchOutline),
      })
    }
    // if (filters.checkPermission(constants.accessProduksi.serialisasi + ".create")) {
    //   actionOptions.value.push({
    //     label: "Tambah Serialisasi",
    //     key: "create",
    //     icon: renderIcon(Add),
    //   })
    // }
    if (filters.isGranted(constants.accessProduksi.serialisasi + ".upload")) {
      actionOptions.value.push({
        label: "Upload Serialisasi",
        key: "upload",
      })
    }
    if (filters.isGranted(constants.accessProduksi.serialisasi + ".delete")) {
      actionOptions.value.unshift({
        label: "Batalkan Serialisasi",
        key: "cancel",
      })
    }
    if (filters.isGranted(constants.accessProduksi.serialisasi + ".destroy")) {
      actionOptions.value.unshift({
        label: "Hapus Serialisasi",
        key: "soft-delete",
      })
    }
  
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

function getActionOptions(status: string) {
  const options = [
    {
      label: "Detail Serialisasi",
      key: "detail",
      icon: renderIcon(SearchOutline),
    },
    {
      label: "Cetak Serialisasi",
      key: "print",
      icon: renderIcon(PrintOutline),
    },
    // { label: "Tambah Serialisasi", key: "create", icon: renderIcon(Add) },
    {
      label: "Batalkan Serialisasi",
      key: "cancel",
      icon: renderIcon(CloseOutline),
    },
    {
      label: "Hapus Serialisasi",
      key: "soft-delete",
      icon: renderIcon(TrashOutline),
    },
    { label: "Lacak PK", key: "lacak", icon: renderIcon(LocationOutline) },
  ]
  // ------ use conditions for operator cetak ------
  if (authData.xxtype !== "5up3r4dm1n" && authData.users.role?.slug === "operator-cetak") {
    if (['draft', 'pending', 'ready_to_pack', 'on_checking', 'rejected', 'released', 'canceled'].includes(status)) {
      return options.filter((opt) => opt.key === "detail" || opt.key === "lacak")
    } else if (status === "ready_to_print") {
      return options.filter(
        (opt) =>
          opt.key === "detail" || opt.key === "lacak" || opt.key === "print"
      )
    }
  } else {
    // ------ normal case ------
    if (status === "canceled" || status === "rejected" || status === "released") {
      return options.filter((opt) => opt.key === "detail" || opt.key === "lacak")
    } else if (status === "draft") {
      return options.filter(
        (opt) =>
          opt.key === "detail" || opt.key === "lacak" || opt.key === "soft-delete"
      )
    } else {
      return options.filter(
        (opt) =>
          opt.key === "detail" || opt.key === "print" || opt.key === "cancel" || opt.key === "lacak"
      )
    } 
  }
  // else {
  //   return options
  // }
}

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "detail":
      router.push({
        path: `/produksi/serialisasi/${id}`,
      })
      break
    case "print":
      router.push({
        path: `/produksi/serialisasi/${id}/print`,
      })
      break
    case "create":
      selectedValue.value.id = id
      showModalImport("bon")
      break
    case "cancel":
        showModalCancel(id)
      break
    case "soft-delete":
        showModalSoftDelete(id)
      break
    case "lacak":
      router.push({
        path: `/lacak/pk/${id}`,
      })
      break
    default:
      break
  }
}

function showModalImport(type: string) {
  if (type === "bon") {
    selectedValue.value.type = "bon"
  } else {
    selectedValue.value.type = ""
  }
  isShowModalImport.value = true
}

function hideModalImport() {
  isShowModalImport.value = false
}

function showModalSync() {
  isShowModalSync.value = true
}

function hideModalSync() {
  isShowModalSync.value = false
}

function showModalCancel(id: string) {
  idSerialize.value = id
  isShowModalCancel.value = true
}

function showModalSoftDelete(id: string) {
  idSerialize.value = id
  isShowModalSoftDelete.value = true
}

function hideModalCancel() {
  isShowModalCancel.value = false
}

function hideModalSoftDelete() {
  isShowModalSoftDelete.value = false
}

function handleCariIDPK() {
  //reset param page
  params.value.page = 1
  clearTimeout(cariIDPKTimeout.value)
  cariIDPKTimeout.value = setTimeout(() => {
    params.value.search = idPk.value
    getData()
  }, 3e2)
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Serialisasi</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Serialisasi</n-breadcrumb-item>
    </n-breadcrumb>
    <div v-if="$filters.checkPermission(constants.accessProduksi.serialisasi + '.list') || (authData.xxtype === `5up3r4dm1n`)" class="card-tnt">
      <n-space>
        <n-button
          v-if="$filters.checkPermission(constants.accessProduksi.serialisasi + '.create') || (authData.xxtype === `5up3r4dm1n`)"
          color="#219653"
          class="button-tnt"
          @click.prevent="showModalImport('')"
        >
          <template #icon>
            <n-icon>
              <add />
            </n-icon>
          </template>
          Tambah PK
        </n-button>
<!--        
        <n-button
          v-if="$filters.checkPermission(constants.accessProduksi.serialisasi + '.upload') || (authData.xxtype === `5up3r4dm1n`)"
          type="primary"
          class="button-tnt"
          @click.prevent="showModalSync"
        >
          <template #icon>
            <n-icon>
              <CloudUploadOutline />
            </n-icon>
          </template>
          Sync With ERP
        </n-button>
        -->
      </n-space>
      <n-row
        gutter="16"
        style="margin-top: 24px"
      >
        <n-col :span="6">
          <n-input
            placeholder="Cari ID PK"
            v-model:value="idPk"
            @keyup="handleCariIDPK"
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
                  <th>No PK</th>
                  <th>Tanggal</th>
                  <th>Kode Produk</th>
                  <th>Nama Produk</th>
                  <th>No. Batch</th>
                  <th>Expired Duration</th>
                  <th>Toll In</th>
                  <th>Qty</th>
                  <th>Generated</th>
                  <th>Released</th>
                  <th>Void</th>
                  <th style="text-align: center">Tipe Serialisasi</th>
                  <th style="text-align: center">Status</th>
                  <th v-if="$filters.checkPermission(constants.accessProduksi.serialisasi + '.detail') || (authData.xxtype === `5up3r4dm1n`)" style="text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dataRes.list?.length > 0">
                  <tr
                    v-for="(list, i) in dataRes.list"
                    :key="i"
                  >
                    <td
                      style="text-align: center"
                      data-label="No"
                    >
                      {{ params.limit * (params.page - 1) + (i + 1) }}
                    </td>
                    <td data-label="No Pk">
                      {{ list.pk_id }}
                    </td>
                    <td data-label="Tanggal Produk">
                      {{ moment(list.date.pk_date).format("yyyy-MM-DD") }}
                    </td>
                    <td data-label="Kode Produk">
                      {{ list.product.item_code }}
                    </td>
                    <td data-label="Nama Produk">
                      {{ list.product.short_name }}
                    </td>
                    <td data-label="No. Batch">
                      {{ list.batch_number }}
                    </td>
                    <td data-label="Expired Duration">
                      {{ list.product.expired_date_duration }}
                      tahun
                    </td>
                    <td 
                      data-label="Toll In"
                      style="text-align: center"
                    >
                      <n-tag
                        :bordered="false"
                        :type="'info'"
                        round
                      >
                        {{ list.product.is_toll_in ? 'Ya' : 'Tidak' }}
                      </n-tag>
                    </td>
                    <td data-label="Qty">
                      {{
                        list.serialize.length > 0 ? list.serialize[0].qty : 0
                      }}
                    </td>
                    <td data-label="Generated">
                      {{
                        list.serialize.length > 0 ? (list.serialize[0].generated ? list.serialize[0].generated : '-') : 0
                      }}
                    </td>
                    <td data-label="Released">
                      {{
                        list.serialize.length > 0 ? (list.serialize[0].total_release ? list.serialize[0].total_release : '-') : 0
                      }}
                    </td>
                    <td data-label="Total Void">
                      {{
                        list.serialize.length > 0 ? (list.serialize[0].total_void ? list.serialize[0].total_void : '-') : 0
                      }}
                    </td>
                    <td
                      data-label="Tipe Serialisasi"
                      style="text-align: center"
                    >
                      <n-tag
                        :bordered="false"
                        :type="'primary'"
                        >{{
                          list.product?.serialize_type == "authentication_bpom"
                            ? "Authentication BPOM"
                            : list.product?.serialize_type ==
                              "authentication_gtin"
                            ? "Authentication GTIN"
                            : list.product?.serialize_type ==
                              "identification_bpom"
                            ? "Identifikasi BPOM"
                            : list.product?.serialize_type ==
                              "without_serialization"
                            ? "Tanpa Serialisasi"
                            : "-"
                        }}</n-tag
                      >
                    </td>
                    <td
                      data-label="Status"
                      style="text-align: center"
                    >
                      <n-tag
                        :bordered="false"
                        :type="
                          list.status.global?.value === 'canceled'
                            ? 'error'
                            : list.status.global?.value === 'rejected'
                            ? 'error'
                            : list.status.global?.value === 'draft'
                            ? 'warning'
                            : 'success'
                        "
                        round
                      >
                        {{ $filters.toStatus(list.status?.global?.value) }}
                      </n-tag>
                    </td>
                    <td
                      v-if="$filters.checkPermission(constants.accessProduksi.serialisasi + '.detail') || (authData.xxtype === `5up3r4dm1n`)"
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        placement="bottom-end"
                        :options="getActionOptions(list.status.global?.value)"
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
                      colspan="11"
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
            :page-slot="7"
            :show-size-picker="dataRes.total_data > 10"
            :page-sizes="[10, 20, 30, 40, 50]"
            @update:page="getData"
            @update:page-size="updatePageSize"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <t-not-granted></t-not-granted>
    </div>
  </div>

  <modal-import-excel
    :is-show-modal="isShowModalImport"
    :type="selectedValue.type"
    :id="selectedValue.id"
    @hide-modal="hideModalImport"
    @get-data="getData"
  />

  <modal-sync-sap
    :is-show-modal="isShowModalSync"
    @hide-modal="hideModalSync"
    @get-data="getData"
  />

  <modal-cancel-serialize
    :is-show-modal="isShowModalCancel"
    :id-serialize="idSerialize"
    @hide-modal="hideModalCancel"
    @get-data="getData"
  />

  <modal-soft-delete-serialize
    :is-show-modal="isShowModalSoftDelete"
    :id-serialize="idSerialize"
    @hide-modal="hideModalSoftDelete"
    @get-data="getData"
  />
</template>

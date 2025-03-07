<script setup lang="ts">
import {
  DocumentTextOutline,
  EllipsisVertical,
  LocationOutline,
  Alert,
  Folder,
} from "@vicons/ionicons5"
import { useMessage } from "naive-ui"
import moment from "moment"
import { serializeModel } from "@/models/produksi/serialisasi"
import { renderIcon } from "@/helpers/render-icon"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"

const router = useRouter()
const tMessage = useMessage()
const authData = auth.getAuth()

const cariIDPKTimeout = ref<any>(null)
// const actionOptions = ref<any>([])
const idPk = ref("")
const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
  status: "ready_to_pack,process_packing,released",
  with_bundling: 1,
  is_not_full_released: 1,
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

onMounted(() => {
  if (authData.xxtype !== "5up3r4dm1n") {
    setIsGranted()
  }
  getData()
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

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

function setIsGranted() {
  isLoading.value = true
  if (filters.checkPermission(constants.accessProduksi.pengemasan + ".list")) {
    getData()
    isLoading.value = false
  } else {
    router.push("/")
  }

  // if (filters.checkPermission(constants.accessProduksi.pengemasan + ".detail")) {
  //   actionOptions.value.push({
  //     label: "Detail Serialisasi",
  //     key: "detail",
  //     icon: renderIcon(DocumentTextOutline),
  //   }),
  //   actionOptions.value.push({
  //     label: "Lacak PK",
  //     key: "lacak",
  //     icon: renderIcon(LocationOutline),
  //   })
  // }
  // if (filters.checkPermission(constants.accessProduksi.pengemasan + ".lacak")) {
  //   actionOptions.value.push({
  //     label: "Lacak PK",
  //     key: "lacak",
  //     icon: renderIcon(LocationOutline),
  //   })
  // }
}

const actionOptions = [
  {
    label: "Detail Data",
    key: "detail",
    icon: renderIcon(DocumentTextOutline),
  },
  {
    label: "Lacak PK",
    key: "lacak",
    icon: renderIcon(LocationOutline),
  },
  // { label: 'Packing', key: 'packing', icon: renderIcon(CubeOutline) },
]

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "detail":
      router.push({
        path: `/produksi/pengemasan/${id}`,
      })
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

function handleCariIDPK() {
  //reset page
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
    <n-h2 style="margin-bottom: 4px">Pengemasan</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Pengemasan</n-breadcrumb-item>
    </n-breadcrumb>
    <div v-if="$filters.checkPermission(constants.accessProduksi.pengemasan + '.list') || (authData.xxtype === `5up3r4dm1n`)" class="card-tnt">
      <n-row gutter="16">
        <n-col :span="18"> </n-col>

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
                  <th>Qty</th>
                  <th>Generated</th>
                  <th>Packed</th>
                  <th>Released</th>
                  <th style="text-align: center">Status</th>
                  <th v-if="$filters.checkPermission(constants.accessProduksi.pengemasan + '.detail') || (authData.xxtype === `5up3r4dm1n`)" style="text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="dataRes.list?.length > 0">
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
                    <td data-label="No PK">
                      {{ list.pk_id }}
                      <n-tag
                        v-if="list.status?.global?.value == 'released' && list.serialize[0].generated != list.serialize[0].packaging?.total_qty_packed"
                        :bordered="false"
                        type="warning"
                        round
                      >
                        <n-tooltip trigger="hover" :show-arrow="false">
                          <template #trigger>
                            <n-icon><alert /></n-icon>
                          </template>
                          Belum Rilis Sepenuhnya
                        </n-tooltip>
                      </n-tag>
                      <n-tag
                        v-if="list.is_bundling"
                        :bordered="false"
                        type="primary"
                        round
                      >
                        <n-tooltip trigger="hover" :show-arrow="false">
                          <template #trigger>
                            <n-icon><folder /></n-icon>
                          </template>
                          PK Bundling
                        </n-tooltip>
                      </n-tag>
                    </td>
                    <td data-label="Tanggal">
                      {{ moment(list.created_at).format("yyyy-MM-DD") }}
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
                      data-label="Qty"
                      style="text-align: center"
                    >
                      {{ list.serialize?.length ? list.serialize[0].qty : 0 }}
                    </td>
                    <td 
                      data-label="Generated"
                      style="text-align: center"
                    >
                      {{
                        list.serialize?.length ? (list.serialize[0].generated ? list.serialize[0].generated : '-') : 0
                      }}
                    </td>
                    <td
                      data-label="Packed"
                      style="text-align: center"
                    >
                      {{
                        list.serialize?.length
                          ? list.serialize[0].packaging?.total_qty_packed
                          : 0
                      }}
                    </td>
                    <td
                      data-label="Packed"
                      style="text-align: center"
                    >
                      {{
                        list.serialize?.length
                          ? list.serialize[0].total_release
                          : 0
                      }}
                    </td>
                    <td
                      style="text-align: center"
                      data-label="Status"
                    >
                      <n-tag
                        :bordered="false"
                        type="success"
                        round
                      >
                        {{ $filters.toStatus(list.status?.global?.value) }}
                      </n-tag>
                    </td>
                    <td
                      v-if="$filters.checkPermission(constants.accessProduksi.pengemasan + '.detail') || (authData.xxtype === `5up3r4dm1n`)"
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
</template>

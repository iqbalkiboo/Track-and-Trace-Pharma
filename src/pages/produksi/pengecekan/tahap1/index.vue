<script setup lang="ts">
import { useMessage } from "naive-ui"
import {
  EllipsisVertical,
  SearchOutline,
  LocationOutline,
  Folder
} from "@vicons/ionicons5"
import moment from "moment"
import { checkingModel } from "@/models/produksi/pengecekan"
import { renderIcon } from "@/helpers/render-icon"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"

const router = useRouter()
const tMessage = useMessage()
const authData = auth.getAuth()
// const actionOptions = ref<any>([])
const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  status: "ready_to_check,on_checking,pending",
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 10,
  with_bundling: 1
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
  await checkingModel
    .getChecking(params.value)
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

function setIsGranted() {
  isLoading.value = true
  if (filters.checkPermission(constants.accessProduksi.inspeksiAkhir + ".list")) {
    getData()
    isLoading.value = false
  } else {
    router.push("/")
  }

  // if (filters.checkPermission(constants.accessProduksi.inspeksiAkhir + ".detail")) {
  //   actionOptions.value.push({
  //     label: "Detail Serialisasi",
  //     key: "detail",
  //   })
  // }
}

const actionOptions = [
  { label: "Lihat Detail", key: "detail", icon: renderIcon(SearchOutline) },
  {
    label: "Lacak PK",
    key: "lacak",
    icon: renderIcon(LocationOutline),
  },
]

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "detail":
      router.push({
        name: "produksi-pengecekan-tahap1-id",
        params: { id },
      })
      break
    case "lacak":
      router.push({
        name: "lacak-pk-id",
        params: { id },
      })
      break
    default:
      break
  }
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Inspeksi Akhir</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Inspeksi Akhir</n-breadcrumb-item>
    </n-breadcrumb>

    <div v-if="$filters.checkPermission(constants.accessProduksi.inspeksiAkhir + '.list') || (authData.xxtype === `5up3r4dm1n`)" class="card-tnt">
      <n-row gutter="16">
        <n-col :span="6">
          <n-input
            v-model:value="params.search"
            @update:value="searchData"
            clearable
            type="text"
            placeholder="Cari No PK"
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
                  <th>Qty</th>
                  <th>Generated</th>
                  <th>Packed</th>
                  <th>Checking</th>
                  <th style="text-align: center">Status</th>
                  <th v-if="$filters.checkPermission(constants.accessProduksi.inspeksiAkhir + '.detail') || (authData.xxtype === `5up3r4dm1n`)" style="text-align: center">Aksi</th>
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
                    <td
                      data-label="Qty Level Terendah"
                      style="text-align: center"
                    >
                      {{ list.serialize ? list.serialize[0].qty : 0 }}
                    </td>
                    <td 
                      data-label="Generated"
                      style="text-align: center">
                      {{
                        list.serialize.length > 0 ? (list.serialize[0].generated) : 0
                      }}
                    </td>
                    <td 
                      data-label="Packed"
                      style="text-align: center">
                      {{
                        list.serialize.length > 0 ? (list.serialize[0].packaging?.total_qty_packed) : 0
                      }}
                    </td>
                    <td 
                      data-label="Packed"
                      style="text-align: center">
                      {{
                        list.serialize.length > 0 ? (list.serialize[0].packaging?.total_qty_packed - list.serialize[0].total_release) : 0
                      }}
                    </td>
                    <td
                      data-label="Status"
                      style="text-align: center"
                    >
                      <n-tag
                        type="success"
                        :bordered="false"
                        round
                      >
                        {{ $filters.toStatus(list.status?.global?.value) }}
                      </n-tag>
                    </td>
                    <td
                      v-if="$filters.checkPermission(constants.accessProduksi.inspeksiAkhir + '.detail') || (authData.xxtype === `5up3r4dm1n`)"
                      data-label="Aksi"
                      style="text-align: center"
                    >
                      <n-dropdown
                        placement="bottom-end"
                        show-arrow
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

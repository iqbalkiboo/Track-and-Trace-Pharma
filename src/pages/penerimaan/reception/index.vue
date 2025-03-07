<script setup lang="ts">
import type { Component } from "vue"
import { h, ref } from "vue"
import { NIcon, useMessage } from "naive-ui"
import {
  AddOutline,
  EllipsisVertical,
  LocationOutline,
  SearchOutline,
} from "@vicons/ionicons5"
import {
  getReception,
  scanReception,
  setReceptionLocation,
  startReception,
} from "@/models/penerimaan/reception"
import constants from "@/helpers/constant"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isShowModalImport = ref(false)
const isShowModalManifest = ref(false)
const code = ref("")
const loadingPage = ref(false)
const loadingScan = ref(false)
const loadingStart = ref(false)
const data = ref<any>(null)
const detail = ref<any>(null)
const params = ref<any>({
  page: 1,
  limit: 10,
  sort: "created_at",
  dir: "desc",
})

onMounted(() => {
  if (!filters.checkPermission(constants.accessReceive.penerimaan + ".list")) {
    return router.push('/')
  }
  if (!route.query.page) router.replace({ query: { page: 1 } })
  params.value.page = parseInt(route.query.page as string)
  getData()
})

async function getData() {
  loadingPage.value = true
  const res = await getReception(params.value).finally(() => {
    loadingPage.value = false
  })
  data.value = res.data
}

function handlePageChanged(page: number) {
  router.push({ query: { ...route.query, page } })
}

async function handleScanned(manifest_code: string) {
  code.value = ""
  loadingScan.value = true
  const res = await scanReception({ manifest_code, company_id: "" })
    .finally(() => {
      loadingScan.value = false
      isShowModalManifest.value = true
      isShowModalScan.value = false
    })
    .catch(() => {
      isShowModalManifest.value = false
      isShowModalScan.value = true
    })
  detail.value = res.data
  isShowModalManifest.value = true
  isShowModalScan.value = false
  tMessage.success("Data manifest ditemukan.")
}

async function handleSubmit(data: {
  warehouse_building_id: string
  is_set_location: boolean
}) {
  loadingStart.value = true
  await startReception({
    reception_id: detail.value?.id,
    company_id: "",
  }).finally(() => {
    loadingStart.value = false
  })
  loadingStart.value = true
  if (!data.is_set_location) {
    await setReceptionLocation({
      reception_id: detail.value?.id,
      warehouse_building_id: data.warehouse_building_id,
      company_id: "",
    }).finally(() => {
      loadingStart.value = false
    })
  }
  router.push({
    name: "penerimaan-reception-id",
    params: { id: detail.value?.id },
  })
}

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const options = [
  { label: "Detail Data", key: "detail", icon: renderIcon(SearchOutline) },
  { label: "Form Penerimaan", key: "form", icon: renderIcon(AddOutline) },
  {
    label: "Lacak Manifest",
    key: "lacak",
    icon: renderIcon(LocationOutline),
  },
]

function handleSelectDropdown(
  key: string | number,
  id: string,
  manifestId: string
) {
  switch (key) {
    case "detail":
      router.push({
        name: "penerimaan-reception-id",
        params: { id },
      })
      break
    case "form":
      router.push({
        name: "penerimaan-reception-id-form",
        params: { id },
      })
      break
    case "lacak":
      router.push({
        path: `/lacak/manifest/${manifestId}`,
      })
      break

    default:
      break
  }
}

function showModalImport(e: MouseEvent) {
  e.preventDefault()
  isShowModalImport.value = true
}
function hideModalImport() {
  isShowModalImport.value = false
}

const isShowModalScan = ref(false)
function showModalScan() {
  isShowModalScan.value = true
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Penerimaan</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Penerimaan</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space
        align="center"
        justify="space-between"
      >
        <n-space align="center">
          <n-input
            placeholder="Cari DO/Nama Product"
            style="width: 400px; max-width: 100%"
          />
          <n-button
            v-if="false"
            class="button-tnt"
            type="primary"
            @click.prevent="showModalImport"
          >
            <template #icon>
              <n-icon>
                <add />
              </n-icon>
            </template>
            Tambah GR
          </n-button>
        </n-space>
        <n-button
          @click.prevent="showModalScan"
          class="button-tnt"
          type="primary"
          >Scan Manifest</n-button
        >
      </n-space>

      <t-loading v-if="loadingPage" />

      <div
        v-else
        class="table-tnt"
      >
        <n-scrollbar x-scrollable>
          <n-table :single-line="false">
            <thead>
              <tr>
                <th style="text-align: center">No</th>
                <th>ID Manifest</th>
                <th>NO GR</th>
                <th>NO PO</th>
                <th>ID DO</th>
                <th>Produk</th>
                <th>Qty Packing</th>
                <th>Qty Pesan</th>
                <th>Tujuan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="data?.list?.length > 0">
                <tr
                  v-for="(item, index) in data?.list"
                  :key="item.id"
                >
                  <td
                    data-label="No"
                    style="text-align: center"
                  >
                    {{ (params.page - 1) * params.limit + index + 1 }}
                  </td>
                  <td data-label="ID Manifest">
                    {{ item.manifest?.code }}
                  </td>
                  <td data-label="NO GR">
                    {{ item.finish_info?.gr_number }}
                  </td>
                  <td data-label="NO PO">
                    {{ item.do?.po_number }}
                  </td>
                  <td data-label="ID DO">{{ item.do.code }}</td>
                  <td data-label="Produk">
                    <ul>
                      <li
                        v-for="product in item.products"
                        :key="product.id"
                      >
                        {{ product.code }} -
                        {{ product.name }}
                      </li>
                    </ul>
                  </td>
                  <td data-label="Qty Packing">
                    {{ item.total.packing }}
                  </td>
                  <td data-label="Qty Pesan">
                    {{ item.total.qty }}
                  </td>
                  <td data-label="Tujuan">
                    {{ item.do.destination.name }}
                  </td>
                  <td data-label="Tujuan">
                    <n-tag
                      :bordered="false"
                      type="success"
                      >{{ item.status }}</n-tag
                    >
                  </td>
                  <td data-label="Aksi">
                    <n-dropdown
                      placement="bottom-end"
                      :options="options"
                      @select="
                        handleSelectDropdown($event, item.id, item.manifest.id)
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
                    colspan="20"
                    style="text-align: center"
                  >
                    Belum ada data tersedia
                  </td>
                </tr>
              </template>
            </tbody>
          </n-table>
        </n-scrollbar>
        <div class="table-footer">
          <n-pagination
            v-model:page="params.page"
            :page-count="data?.total_page ?? 1"
            :page-slot="5"
            @update:page="handlePageChanged($event)"
          />
        </div>
      </div>
    </div>
  </div>

  <modal-import-excel
    :is-show-modal="isShowModalImport"
    @hide-modal="hideModalImport"
  >
  </modal-import-excel>

  <t-scan-modal
    v-model:code="code"
    v-model:show="isShowModalScan"
    :loading="loadingScan"
    title="Scan Manifest"
    @scanned="handleScanned"
  />

  <t-manifest-modal
    :loading="loadingStart"
    v-model:show="isShowModalManifest"
    :data="detail"
    @click:submit="handleSubmit"
  ></t-manifest-modal>

  <!-- <modal-scan :show="isShowModalScan" @click:close="handleModalScanClose"></modal-scan> -->
</template>

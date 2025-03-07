<script setup lang="ts">
import { EllipsisVertical } from "@vicons/ionicons5"
import { ref, onBeforeMount } from "vue"
import {
  detailReception,
  getPackingList,
  getPackingSerializeList,
  getSerializePacking,
  setProductLocation,
  type PackingListParams,
} from "@/models/penerimaan/reception"
import { useMessage } from "naive-ui"
interface PropsContentsTableData {
  id: number
  active: boolean
}
interface PropsContents {
  id: number
  active: boolean
  table: PropsContentsTableData[]
}
const contents = ref(
  Array(10)
    .fill(0)
    .map((_, i) => {
      return {
        id: i,
      }
    })
)

const contentsTableData = ref(
  Array(2)
    .fill(0)
    .map((_, i) => {
      return {
        id: i,
      }
    })
)

const optionsDropdown = ref([
  {
    label: "Delete",
    key: "delete",
    disabled: false,
  },
])

const tMessage = useMessage()
const route = useRoute()
const router = useRouter()

const loadingScan = ref(false)
const loadingPage = ref(false)
const detail = ref<any>(null)
const serialize = ref<any>(null)
const packing = ref<any>(null)
const pck = ref<any>(null)
const product = ref<any>(null)
const packingParams = ref<PackingListParams>()
const showLocationModal = ref(false)
const openModalScan = ref(false)
const isResult = ref(false)
const detailSerialize = ref<any>(null)

function handleSelect(key: string) {
  console.log(key)
}

const contentsResault = ref<PropsContents[]>([])

onMounted(() => {
  getData()
})

async function getData() {
  loadingPage.value = true
  await getSerialize()
  await getDetail()
  if (detail.value) await getPacking()
  loadingPage.value = false
}

async function getDetail() {
  const res = await detailReception(route.params.id as string)
  detail.value = res.data
  packingParams.value = {
    page: 1,
    limit: 10,
    reception_id: detail.value.id,
    company_id: '',
  }
}

async function getSerialize() {
  const res = await getSerializePacking(route.params.code as string)
  serialize.value = res.data
  if (serialize.value.level == 2)
    router.replace({ name: "penerimaan-id-code-packing" })
}

async function getPacking() {
  if (packingParams.value) {
    const res = await getPackingList(packingParams.value)
    packing.value = res.data
  }
}

async function handleShowDetailItem(item: any) {
  item.active = !item.active
}

async function handleShowDetailProduct(product: any) {
  product.active = !product.active
  if (product.active) {
    product.loading = true
    await handlePageChanged(1, product)
    product.loading = false
  }
}

async function handlePageChanged(page: number, product: any) {
  const res = await getPackingSerializeList({
    parent_code: route.params.code as string,
    page: product.page ?? 1,
    limit: 10,
    product_code: product.code,
    reception_code: detail?.value.code as string,
  })
  product.serialize = res.data.list
  product.page = res.data.page
  product.total_page = res.data.total_page
  // console.log(item, page)
}

function handleEditProductLocation(p1: any, p2: any) {
  pck.value = p1
  product.value = p2
  showLocationModal.value = true
}

async function handleSubmitProductLocation(id: string) {
  if (product.value) {
    await setProductLocation({
      warehouse_building_id: id,
      reception_id: route.params.id as string,
      packing_code: pck.value.packing.code,
      product_code: product.value.code,
      company_id: '',
    })
    await getPacking()
    tMessage.success("Lokasi produk berhasil diperbarui.")
    showLocationModal.value = false
  } else {
    tMessage.error("Tidak ada produk yang dipilih!")
  }
}

async function handleScanSerialize(code: string) {
  loadingScan.value = true
  const res = await getSerializePacking(code).finally(() => {
    loadingScan.value = false
  })
  isResult.value = true
  detailSerialize.value = res.data
}

async function handleContinueSerialize() {
  if (detailSerialize.value)
    return router.push({
      name: "penerimaan-id-code",
      params: { code: detailSerialize.value.code },
    })
  return tMessage.error("Data serialize tidak tersedia.")
}

onBeforeMount(() => {
  const resault = contents.value.map((item) => ({
    ...item,
    active: false,
  }))
  const tableData = resault.map((item) => ({
    ...item,
    table: contentsTableData.value.map((item) => ({
      ...item,
      active: false,
    })),
  }))
  contentsResault.value = tableData
})
</script>

<template>
  <n-space
    style="padding: 1rem"
    vertical
  >
    <n-space
      :size="0"
      vertical
    >
      <n-h1 style="margin-bottom: 0"> Daftar Packing </n-h1>
      <n-h3 style="margin-bottom: 0">
        ID Level {{ serialize?.level }}: {{ serialize?.code }}
      </n-h3>
      <n-p>ID Manifest: {{ serialize?.manifest.code }}</n-p>
      <n-p>ID DO: {{ serialize?.do.code }}</n-p>
      <n-p>Produk: {{ serialize?.product.name }}</n-p>
      <n-p>
        Location: {{ serialize?.warehouse_building.code }} -
        {{ serialize?.warehouse_building.name }}
      </n-p>
    </n-space>
    <t-loading v-if="loadingPage" />
    <template v-else>
      <div v-if="detail?.status != 'received'">
        <n-space
          justify="space-between"
          style="padding: 1rem"
        >
          <n-input placeholder="ID Kemasan/Product" />
          <n-space>
            <n-button type="error">Bulk Aksi</n-button>
            <n-button
              type="warning"
              @click="openModalScan = true"
              >ScanQR</n-button
            >
          </n-space>
        </n-space>
      </div>
      <div style="margin-top: 18px">
        <n-grid
          cols="3"
          item-responsive
          responsive="screen"
          x-gap="26"
          y-gap="16"
        >
          <n-grid-item span="3 s:2 m:1">
            <n-button
              block
              color="#219653"
              class="button-tnt"
            >
              Approved ({{ detail?.total.approved ?? 0 }})
            </n-button>
          </n-grid-item>
          <n-grid-item span="3 s:2 m:1">
            <n-button
              block
              type="warning"
              class="button-tnt"
            >
              Broken ({{ detail?.total.broken ?? 0 }})
            </n-button>
          </n-grid-item>
          <n-grid-item span="3 s:2 m:1">
            <n-button
              block
              type="error"
              class="button-tnt"
            >
              Missing ({{ detail?.total.missing ?? 0 }})
            </n-button>
          </n-grid-item>
        </n-grid>
      </div>
      <n-card>
        <n-space vertical>
          <n-card
            v-for="item in packing?.list ?? []"
            :key="item.id"
            :content-style="{ background: '#eee' }"
          >
            <n-space justify="space-between">
              <div>
                <n-h3 style="margin: 0">
                  Packing Code: {{ item.packing.code }}
                </n-h3>
                <n-p style="margin: 0"
                  >Jenis Product: {{ item.total.product }}</n-p
                >
                <n-p style="margin: 0">Qty Product: {{ item.total.qty }}</n-p>
              </div>
              <n-space align="center">
                <n-p style="font-size: 0.8rem"
                  >{{ (item.total.approved / item.total.qty) * 100 }}%
                  Approved</n-p
                >
                <div @click="handleShowDetailItem(item)">
                  <div
                    style="
                      font-size: 0.8rem;
                      color: #0b8f9d;
                      cursor: pointer;
                      text-decoration: underline;
                    "
                  >
                    {{
                      item.active
                        ? "Tampilkan Lebih Sedikit"
                        : "Tampilkan Detail"
                    }}
                  </div>
                </div>
              </n-space>
            </n-space>

            <n-collapse-transition :show="!!item.active">
              <n-space
                v-for="product in item.products"
                :key="product.id"
                vertical
                style="padding: 1rem"
              >
                <n-space justify="space-between">
                  <n-5>
                    {{ product.name }}
                    ({{ product.approved }}/{{ product.qty }})
                  </n-5>
                  <div
                    @click="handleShowDetailProduct(product)"
                    style="
                      font-size: 0.8rem;
                      color: #0b8f9d;
                      cursor: pointer;
                      text-decoration: underline;
                    "
                  >
                    {{
                      product.active
                        ? "Tampilkan Lebih Sedikit"
                        : "Tampilkan Detail"
                    }}
                  </div>
                </n-space>
                <n-space
                  justify="space-between"
                  style="margin-top: 0.5rem"
                >
                  <n-5>
                    Location:
                    {{ product.warehouse_building.code }} -
                    {{ product.warehouse_building.name }}
                    <a
                      href="#"
                      @click="handleEditProductLocation(item, product)"
                    >
                      Edit
                    </a>
                  </n-5>
                  <n-grid
                    cols="3"
                    item-responsive
                    responsive="screen"
                    x-gap="26"
                    y-gap="16"
                  >
                    <n-grid-item>
                      <n-button
                        block
                        color="#219653"
                        class="button-tnt"
                      >
                        Approved ({{ product.approved }})
                      </n-button>
                    </n-grid-item>
                    <n-grid-item>
                      <n-button
                        block
                        type="warning"
                        class="button-tnt"
                      >
                        Broken ({{ product.broken }})
                      </n-button>
                    </n-grid-item>
                    <n-grid-item>
                      <n-button
                        block
                        type="error"
                        class="button-tnt"
                      >
                        Missing ({{ product.missing }})
                      </n-button>
                    </n-grid-item>
                  </n-grid>
                </n-space>
                <n-collapse-transition :show="!!product.active">
                  <n-space vertical>
                    <t-loading v-if="product.loading" />
                    <template v-else>
                      <n-table
                        :bottom-bordered="false"
                        :bordered="false"
                        :single-line="true"
                      >
                        <n-thead>
                          <n-tr style="border-radius: 20px">
                            <n-th
                              style="background-color: #f2994a; color: white"
                              >Code</n-th
                            >
                            <n-th
                              style="background-color: #f2994a; color: white"
                              >Level</n-th
                            >
                            <n-th
                              style="background-color: #f2994a; color: white"
                              >Status</n-th
                            >
                            <n-th
                              style="background-color: #f2994a; color: white"
                              >Aksi</n-th
                            >
                          </n-tr>
                        </n-thead>
                        <n-tbody>
                          <n-tr
                            v-for="serialize in product.serialize ?? []"
                            :key="serialize.id"
                          >
                            <n-td>
                              {{ serialize.code }}
                            </n-td>
                            <n-td>
                              {{ serialize.name }}
                            </n-td>
                            <n-td>
                              {{ serialize.status }}
                            </n-td>
                            <n-td>
                              <n-dropdown
                                trigger="click"
                                :options="optionsDropdown"
                                :show-arrow="true"
                                @select="handleSelect"
                              >
                                <n-icon
                                  :component="EllipsisVertical"
                                  style="cursor: pointer"
                                ></n-icon>
                              </n-dropdown>
                            </n-td>
                          </n-tr>
                        </n-tbody>
                      </n-table>

                      <n-space justify="center">
                        <n-pagination
                          v-model:page="product.page"
                          :page-count="product.total_page ?? 0"
                          :page-slot="5"
                          @update:page="handlePageChanged($event, product)"
                        />
                      </n-space>
                    </template>
                  </n-space>
                </n-collapse-transition>
              </n-space>
            </n-collapse-transition>
          </n-card>
        </n-space>
      </n-card>
    </template>
    <t-product-location-modal
      v-model:show="showLocationModal"
      :name="product?.name"
      @click:submit="handleSubmitProductLocation"
    />
    <t-modal-scan-serialisasi
      v-model:show="openModalScan"
      :result="isResult"
      :data="detailSerialize"
      @click:submit="handleScanSerialize"
      @click:continue="handleContinueSerialize"
    ></t-modal-scan-serialisasi>
  </n-space>
</template>

<style></style>

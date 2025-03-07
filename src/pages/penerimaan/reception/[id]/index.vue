<script setup lang="ts">
import { ref } from "vue"
import { useMessage } from "naive-ui"
import {
  detailReception,
  getPackingList,
  getPackingSerializeList,
  getSerialize,
  getSerializePacking,
  markSerializePacking,
  type PackingListParams,
  setProductLocation,
} from "@/models/penerimaan/reception"

const tMessage = useMessage()
const route = useRoute()
const router = useRouter()

const loadingScan = ref(false)
const loadingPage = ref(false)
const detail = ref<any>({})
const packing = ref<any>({})
const pck = ref<any>({})
const product = ref<any>(null)
const packingParams = ref<PackingListParams>()
const dataResSerialize = ref<any>([])
const showLocationModal = ref(false)
const openModalScan = ref(false)

async function getData() {
  loadingPage.value = true
  await getDetail()
  await getPacking()
  loadingPage.value = false
}

async function getDetail() {
  const res = await detailReception(route.params.id as string)
  detail.value = res.data
  packingParams.value = {
    page: 1,
    limit: 10,
    reception_id: detail.value.id,
    company_id: "",
  }
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
    page: product.page ?? 1,
    limit: 10,
    product_code: product.code,
    reception_code: detail?.value.code as string,
  })
  product.serialize = res.data.list
  product.page = res.data.page
  product.total_page = res.data.total_page
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
      company_id: getCompanyId,
    })
    await getPacking()
    tMessage.success("Lokasi produk berhasil diperbarui.")
    showLocationModal.value = false
  } else {
    tMessage.error("Tidak ada produk yang dipilih!")
  }
}

const isResult = ref(false)
const detailSerialize = ref<any>(null)
async function handleScanSerialize(code: string) {
  loadingScan.value = true
  const res = await getSerializePacking(code).finally(() => {
    loadingScan.value = false
  })
  isResult.value = true
  detailSerialize.value = res.data
}
async function getDataSerialize(paramsSerialize: any) {
  loadingScan.value = true
  try {
    const res = await getSerialize(paramsSerialize)
    dataResSerialize.value = res.data
    loadingScan.value = false
  } catch (e: any) {
    if (e.response) {
      const data = e.response.data.message
      tMessage.error(data)
    }
    loadingScan.value = false
  }
}

async function handleApproveSerialize(code: string) {
  await markSerializePacking({
    codes: [code],
    status: "approved",
  })
  tMessage.success("Serialize berhasil diupdate.")
}

async function handleBrokenSerialize(code: string) {
  await markSerializePacking({
    codes: [code],
    status: "broken",
  })
  tMessage.success("Serialize berhasil diupdate.")
}

async function handleContinueSerialize() {
  if (detailSerialize.value)
    return router.push({
      name: "penerimaan-id-code",
      params: { code: detailSerialize.value.code },
    })
  return tMessage.error("Data serialize tidak tersedia.")
}
async function handleCloseModalScanSerialize() {
  isResult.value = false
  openModalScan.value = false
}
const totalItem = computed(() =>
  detail.value?.products?.reduce((a: any, b: any) => a + b.qty, 0)
)
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="body-tnt">
    <n-space justify="space-between">
      <n-space
        vertical
        :size="0"
      >
        <n-space>
          <n-text>ID Manifest : </n-text>
          <n-text strong>{{ detail.manifest?.code }}</n-text>
        </n-space>
        <n-space>
          <n-text>ID DO : </n-text>
          <n-text strong>{{ detail.do?.code }}</n-text>
        </n-space>
        <n-space>
          <n-text>Total Item : </n-text>
          <n-text strong>{{ totalItem }}</n-text>
        </n-space>
      </n-space>
      <n-space>
        <n-text>Tujuan : </n-text>
        <n-text strong>{{ detail.do?.destination?.name || "-" }}</n-text>
      </n-space>
      <div />
    </n-space>

    <t-loading v-if="loadingPage" />

    <template v-else>
      <div style="margin-top: 18px">
        <n-grid
          cols="4"
          item-responsive
          responsive="screen"
          x-gap="26"
          y-gap="16"
        >
          <n-grid-item span="4 m:1">
            <div
              class="card-tnt"
              style="
                border: 1px solid #e5e5e5;
                margin-top: 0;
                padding: 8px;
                text-align: center;
              "
            >
              <n-text style="font-size: 13px; margin-bottom: 0"
                >Aproved ({{ detail.total?.approved || 0 }})</n-text
              >
            </div>
          </n-grid-item>
          <n-grid-item span="4 m:1">
            <div
              class="card-tnt"
              style="
                border: 1px solid #e5e5e5;
                margin-top: 0;
                padding: 8px;
                text-align: center;
              "
            >
              <n-text style="font-size: 13px; margin-bottom: 0"
                >Broken ({{ detail.total?.broken || 0 }})</n-text
              >
            </div>
          </n-grid-item>
          <n-grid-item span="4 m:1">
            <div
              class="card-tnt"
              style="
                border: 1px solid #e5e5e5;
                margin-top: 0;
                padding: 8px;
                text-align: center;
              "
            >
              <n-text style="font-size: 13px; margin-bottom: 0"
                >Missing ({{ detail.total?.missing || 0 }})</n-text
              >
            </div>
          </n-grid-item>
          <n-grid-item span="4 m:1">
            <div
              class="card-tnt"
              style="
                border: 1px solid #e5e5e5;
                margin-top: 0;
                padding: 8px;
                text-align: center;
              "
            >
              <n-text style="font-size: 13px; margin-bottom: 0"
                >Pending ({{ packing.pending || 0 }})</n-text
              >
            </div>
          </n-grid-item>
        </n-grid>
      </div>
      <div class="card-tnt">
        <n-space
          justify="space-between"
          align="center"
        >
          <n-space vertical>
            <n-h4 style="margin-bottom: 0"> Daftar Packing </n-h4>
            <n-input placeholder="ID Kemasan/Product" />
          </n-space>
          <n-space v-if="detail.status != 'received'">
            <router-link :to="{ name: 'penerimaan-reception-id-bulk' }">
              <n-button
                type="error"
                strong
                secondary
                class="button-tnt"
                >Bulk Aksi</n-button
              >
            </router-link>
            <n-button
              type="warning"
              @click="openModalScan = true"
              strong
              secondary
              class="button-tnt"
              >ScanQR</n-button
            >
          </n-space>
        </n-space>
        <n-space
          vertical
          :size="16"
          style="margin-top: 1rem"
        >
          <div
            class="card-tnt"
            v-for="item in packing?.list ?? []"
            :key="item.id"
            style="
              padding: 1.2rem;
              margin-top: 0;
              border-radius: 12px;
              background-color: #eee;
            "
          >
            <n-space
              :wrap="false"
              justify="space-between"
              align="center"
              style="position: relative"
            >
              <n-space
                vertical
                :size="0"
              >
                <n-space :size="3">
                  <n-text>Packing Code : </n-text>
                  <n-text strong>
                    {{ item.packing.code }}
                  </n-text>
                </n-space>
                <n-space :size="3">
                  <n-text> Jenis Product : </n-text>
                  <n-text strong> {{ item.total?.product }}</n-text>
                </n-space>
                <n-space :size="3">
                  <n-text>Qty Product :</n-text>
                  <n-text strong> {{ item.total?.qty }}</n-text>
                </n-space>
                <n-space :size="3">
                  <n-text>Qty Batch :</n-text>
                  <n-text strong> {{ item.products[0]?.qty }}</n-text>
                </n-space>
              </n-space>
              <n-space align="center">
                <n-text style="font-size: 0.8rem"
                  >{{
                    ((item.total?.approved / item.total?.qty) * 100).toFixed(2)
                  }}% Approved</n-text
                >
                <div @click="handleShowDetailItem(item)">
                  <n-button
                    text
                    type="primary"
                  >
                    {{
                      item.active
                        ? "Tampilkan Lebih Sedikit"
                        : "Tampilkan Detail"
                    }}
                  </n-button>
                </div>
              </n-space>
            </n-space>
            <n-collapse-transition :show="!!item.active">
              <n-scrollbar x-scrollable>
                <n-space
                  v-for="product in item.products"
                  :key="product.id"
                  vertical
                  style="padding: 1rem"
                >
                  <n-space justify="space-between">
                    <n-space
                      align="center"
                      justify="space-between"
                    >
                      <n-space
                        vertical
                        :size="0"
                      >
                        <n-space
                          :size="4"
                          align="center"
                        >
                          <n-space>
                            <n-text>Product : </n-text>
                            <n-text
                              strong
                              style="margin-bottom: 0"
                            >
                              {{ product.name }}
                              ({{ product.approved }}/{{ product.qty }})
                            </n-text>
                          </n-space>
                        </n-space>
                        <n-space
                          :size="4"
                          align="center"
                        >
                          <n-space>
                            <n-text>Location : </n-text>
                            <n-text strong>
                              {{ product.warehouse_building.code }}
                              -
                              {{ product.warehouse_building.name }}</n-text
                            >
                          </n-space>
                          <div
                            class="text_link"
                            @click="handleEditProductLocation(item, product)"
                            v-if="detail.status != 'received'"
                          >
                            edit
                          </div>
                        </n-space>
                      </n-space>
                    </n-space>
                    <n-space
                      justify="space-between"
                      style="margin-top: 0.5rem"
                    >
                      <n-grid
                        cols="3"
                        item-responsive
                        responsive="screen"
                        x-gap="26"
                        y-gap="16"
                      >
                        <n-grid-item span="3 m:1">
                          <n-button
                            style="padding: 10px 24px; font-size: 13px"
                            type="primary"
                            strong
                            secondary
                          >
                            Aproved ({{ product.approved || 0 }})
                          </n-button>
                        </n-grid-item>
                        <n-grid-item span="3 m:1">
                          <n-button
                            style="padding: 10px 24px; font-size: 13px"
                            type="warning"
                            strong
                            secondary
                          >
                            Broken ({{ product.broken || 0 }})
                          </n-button>
                        </n-grid-item>
                        <n-grid-item span="3 m:1">
                          <n-button
                            style="padding: 10px 24px; font-size: 13px"
                            type="error"
                            strong
                            secondary
                          >
                            Missing ({{ product.missing || 0 }})
                          </n-button>
                        </n-grid-item>
                      </n-grid>
                      <n-button
                        @click="handleShowDetailProduct(product)"
                        text
                        type="primary"
                      >
                        {{
                          product.active
                            ? "Tampilkan Lebih Sedikit"
                            : "Tampilkan Detail"
                        }}
                      </n-button>
                    </n-space>
                  </n-space>
                  <n-collapse-transition :show="!!product.active">
                    <n-space vertical>
                      <t-loading v-if="product.loading" />
                      <template v-else>
                        <t-table-packing-penerimaan
                          :product="product"
                          :reception_code="detail.code"
                          :packing_code="item.packing?.code"
                          :data-res="dataResSerialize"
                          @get:data="getDataSerialize"
                        />
                      </template>
                    </n-space>
                  </n-collapse-transition>
                </n-space>
              </n-scrollbar>
            </n-collapse-transition>
          </div>
        </n-space>
      </div>
    </template>
  </div>

  <t-product-location-modal
    v-model:show="showLocationModal"
    :name="product?.name"
    :code="product?.code"
    :warehouse_id="detail?.do?.destination?.id"
    @click:submit="handleSubmitProductLocation"
  />

  <t-modal-scan-serialisasi
    v-model:show="openModalScan"
    :result="isResult"
    :data="detailSerialize"
    @click:submit="handleScanSerialize"
    @click:continue="handleContinueSerialize"
    @click:broken="handleBrokenSerialize"
    @click:approve="handleApproveSerialize"
    @click:close="handleCloseModalScanSerialize"
    @click:get="getData"
  ></t-modal-scan-serialisasi>
</template>

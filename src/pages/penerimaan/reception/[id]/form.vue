<script setup lang="ts">
import {
  detailReception,
  getPackingList,
  getPackingSerializeList,
  type PackingListParams,
  setDoneReception,
  setProductLocation,
} from "@/models/penerimaan/reception"
import { useMessage } from "naive-ui"
import { storageModel } from "@/models/storage"
import { hideFeedback, tFeedbackRef } from "@/helpers/feedback"
import moment from "moment"

const tMessage = useMessage()
const route = useRoute()
const router = useRouter()

const loadingPage = ref(false)
const detail = ref<any>({})
const modalSignatureRef = ref()
const showModalSignature = ref(false)
const showLocationModal = ref(false)
const product = ref<any>(null)
const dataResSerialize = ref<any>([])
const pck = ref<any>(null)
const isBtnLoading = ref(false)
const packing = ref<any>(null)
const packingParams = ref<PackingListParams>()
const formValue = ref<any>({
  images: [],
  signature: {},
})

const isMultiple = ref(false)
const inputFile = ref<null | HTMLInputElement>(null)

onMounted(() => {
  getData()
})

async function getData() {
  loadingPage.value = true
  await getDetail()
  await getPacking()
  loadingPage.value = false
}
async function setFormValue(data: any) {
  return (formValue.value = {
    desc: data.description,
    gr: data.gr_number,
    images: data.images || [],
    signature: data.signature || {},
  })
}

async function getDetail() {
  const res = await detailReception(route.params.id as string)
  detail.value = res.data
  await setFormValue(res.data.finish_info)
  packingParams.value = {
    page: 1,
    limit: 10,
    reception_id: detail.value.id,
    company_id: "",
  }
}
function showFeedbackKonfirmasi() {
  tFeedbackRef.value.type = "konfirmasi"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk mengkonfirmasi form data?"
  tFeedbackRef.value.show = true
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
      company_id: "",
    })
    await getPacking()
    tMessage.success("Lokasi produk berhasil diperbarui.")
    showLocationModal.value = false
  } else {
    tMessage.error("Tidak ada produk yang dipilih!")
  }
}

async function handleShowDetailProduct(product: any) {
  product.active = !product.active
  if (product.active) {
    product.loading = true
    await handlePageChanged(product)
    product.loading = false
  }
}

async function handlePageChanged(product: any) {
  const res = await getPackingSerializeList({
    page: product.page ?? 1,
    limit: 10,
    product_code: product.code,
    reception_code: detail?.value.code as string,
  })
  dataResSerialize.value = res.data
  product.serialize = res.data.list
  product.page = res.data.page
  product.total_page = res.data.total_page
}

async function handleInputFileChanged(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files

  console.log(files)
  if (files == null) return
  const res: any = []
  for (const file of files) {
    const formData = new FormData()
    formData.append("file", file as File, file.name)
    formData.append("source", "upload")
    formData.append("title", file.name)
    formData.append("caption", file.name)
    formData.append("alt", file.name)

    const { data: s } = await storageModel.uploadStorage(formData)
    res.push({
      id: s.data.id,
      type: "image",
      url: s.data.public_url,
    })
  }

  if (isMultiple.value) {
    res.map((item: any) => {
      formValue.value.images.push(item)
    })
  } else {
    formValue.value.signature = res[0]
  }
}

function selectProoveImage() {
  isMultiple.value = true
  setTimeout(() => {
    inputFile.value?.click()
  }, 1e2)
}

function selectSignatureImage() {
  isMultiple.value = false
  setTimeout(() => {
    inputFile.value?.click()
  }, 1e2)
}

const loadingConfirm = ref(false)
async function handleConfirm() {
  loadingConfirm.value = false
  isBtnLoading.value = true
  const dt = new Date()
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1).toString().padStart(2, "0")
  const d = dt.getDate().toString().padStart(2, "0")
  const date = `${y}-${m}-${d}`
  try {
    await setDoneReception({
      reception_id: detail.value.id,
      finished_date: date,
      description: formValue.value.desc,
      images: formValue.value.images.map((i: any) => i.id),
      signature: formValue.value.signature?.id,
      gr_number: formValue.value.gr,
      company_id: "",
    })
    router.push({ name: "penerimaan-reception" })
    isBtnLoading.value = false
  } catch (e: any) {
    tMessage.error(e)
    isBtnLoading.value = false
  }
}
const totalItem = computed(() =>
  detail.value?.products?.reduce((a: any, b: any) => a + b.qty, 0)
)
function handleCloseModalSignature() {
  showModalSignature.value = false
}
async function handleSetImageSignature(value: any) {
  const formData = new FormData()
  formData.append("file", value)
  formData.append("source", "upload")
  formData.append("title", value.name)
  formData.append("caption", value.name)
  formData.append("alt", value.name)

  const { data: s } = await storageModel.uploadStorage(formData)
  formValue.value.signature = {
    id: s.data.id,
    type: "image",
    url: s.data.public_url,
  }
}
function removeSignature() {
  modalSignatureRef.value.clearSign()
  formValue.value.signature = {}
}
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
    <n-h3 style="margin-bottom: 4px"> Daftar Packing </n-h3>
    <t-loading v-if="loadingPage" />
    <template v-else>
      <!-- <n-space justify="space-between" style="padding: 1rem"> -->
      <!--     <n-input placeholder="ID Kemasan/Product" /> -->
      <!-- </n-space> -->
      <div style="margin-top: 18px">
        <n-grid
          cols="3"
          item-responsive
          responsive="screen"
          x-gap="26"
          y-gap="16"
        >
          <n-grid-item span="3 m:1">
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
          <n-grid-item span="3 m:1">
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
          <n-grid-item span="3 m:1">
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
        </n-grid>
      </div>
      <div class="card-tnt">
        <n-space
          vertical
          :size="16"
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
                <n-space>
                  <n-text>Packing Code : </n-text>
                  <n-text strong>
                    {{ item.packing.code }}
                  </n-text>
                </n-space>
                <n-space>
                  <n-text> Jenis Product : </n-text>
                  <n-text strong> {{ item.total?.product }}</n-text>
                </n-space>
                <n-space>
                  <n-space>
                    <n-text>Qty Product :</n-text>
                    <n-text strong> {{ item.total?.qty }}</n-text>
                  </n-space>
                </n-space>
              </n-space>
              <n-space align="center">
                <n-text style="font-size: 0.8rem"
                  >{{
                    ((item.total?.approved / item.total?.qty) * 100).toFixed(2)
                  }}% Approved</n-text
                >
                <div @click="handleShowDetailItem(item)">
                  <div class="text_link">
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
                            style="
                              border-radius: 1rem;
                              padding: 10px 24px;
                              font-size: 13px;
                            "
                            type="primary"
                            strong
                            secondary
                          >
                            Aproved ({{ product.approved || 0 }})
                          </n-button>
                        </n-grid-item>
                        <n-grid-item span="3 m:1">
                          <n-button
                            style="
                              border-radius: 1rem;
                              padding: 10px 24px;
                              font-size: 13px;
                            "
                            type="warning"
                            strong
                            secondary
                          >
                            Broken ({{ product.broken || 0 }})
                          </n-button>
                        </n-grid-item>
                        <n-grid-item span="3 m:1">
                          <n-button
                            style="
                              border-radius: 1rem;
                              padding: 10px 24px;
                              font-size: 13px;
                            "
                            type="error"
                            strong
                            secondary
                          >
                            Missing ({{ product.missing || 0 }})
                          </n-button>
                        </n-grid-item>
                      </n-grid>
                      <div
                        @click="handleShowDetailProduct(product)"
                        class="text_link"
                      >
                        {{
                          product.active
                            ? "Tampilkan Lebih Sedikit"
                            : "Tampilkan Detail"
                        }}
                      </div>
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
                        />
                      </template>
                    </n-space>
                  </n-collapse-transition>
                </n-space>
              </n-scrollbar>
            </n-collapse-transition>
          </div>
        </n-space>
        <n-space
          vertical
          :size="16"
        >
          <input
            ref="inputFile"
            type="file"
            style="display: none"
            :multiple="isMultiple"
            accept="image/*"
            @change="handleInputFileChanged"
          />

          <n-grid
            cols="2"
            :x-gap="16"
            :y-gap="16"
          >
            <n-grid-item>
              <n-space>
                <n-text style="margin: 0">Nama Penerima :</n-text>
                <n-text
                  style="margin: 0"
                  strong
                  >{{
                    detail.created_by?.is_superadmin
                      ? detail.created_by?.superadmin?.name
                      : detail?.created_by?.user?.name
                  }}</n-text
                >
              </n-space>
            </n-grid-item>
            <n-grid-item>
              <n-space>
                <n-text style="margin: 0">Tanggal Diterima :</n-text>
                <n-text
                  style="margin: 0"
                  strong
                  >{{
                    detail.finish_info?.finished_date
                      ? moment(detail.finish_info?.finished_date).format(
                          "YYYY-MM-DD"
                        )
                      : "-"
                  }}</n-text
                >
              </n-space>
            </n-grid-item>
            <n-gi span="2">
              <n-text style="margin: 0">Alasan</n-text>
              <n-input
                v-model:value="formValue.desc"
                placeholder="Input Alasan"
              ></n-input>
            </n-gi>
            <n-gi span="2">
              <n-space
                vertical
                :size="0"
              >
                <n-text style="margin: 0">Bukti</n-text>
                <n-button
                  type="primary"
                  strong
                  secondary
                  round
                  @click="selectProoveImage"
                  >Upload foto</n-button
                >
                <n-text style="font-size: 9px"
                  >Menggunakan file dengan format JPG, JPEG, PNG ukuran maksimal
                  file tidak boleh lebih dari 2MB</n-text
                >
              </n-space>
              <n-space
                v-if="formValue.images.length"
                :size="8"
                wrap-item
                style="margin-top: 1rem"
              >
                <n-space
                  vertical
                  :size="4"
                  v-for="(image, i) in formValue.images"
                  :key="image.id"
                >
                  <n-image
                    :src="image.url"
                    :height="200"
                    :width="200"
                    object-fit="cover"
                  >
                  </n-image>
                  <n-button
                    size="small"
                    quaternary
                    round
                    type="primary"
                    @click="formValue.images.splice(i, 1)"
                    >Hapus</n-button
                  >
                </n-space>
              </n-space>
            </n-gi>
            <n-gi span="2">
              <n-space
                vertical
                :size="0"
              >
                <n-text style="margin: 0">Tanda Tangan Digital</n-text>
                <n-button
                  strong
                  secondary
                  type="primary"
                  round
                  @click="showModalSignature = true"
                  >Upload foto</n-button
                >
              </n-space>
              <n-space
                vertical
                v-if="formValue.signature?.url"
                style="margin-top: 1rem"
                :size="0"
              >
                <n-image
                  :src="formValue.signature?.url"
                  :height="180"
                  :width="400"
                  object-fit="cover"
                ></n-image>
                <n-button
                  size="small"
                  quaternary
                  round
                  type="primary"
                  @click="removeSignature"
                  >Hapus</n-button
                >
              </n-space>
            </n-gi>
            <n-gi span="2">
              <n-text style="margin: 0">No GR</n-text>
              <n-input
                placeholder="Input Nomor GR"
                v-model:value="formValue.gr"
              />
            </n-gi>
          </n-grid>
        </n-space>
      </div>
    </template>
    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'penerimaan-reception' }"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            >Kembali</n-button
          >
        </router-link>
        <n-button
          v-if="detail.status !== 'received'"
          type="primary"
          class="button-tnt"
          @click="showFeedbackKonfirmasi"
          >Konfirmasi</n-button
        >
      </div>
    </div>
  </div>

  <t-product-location-modal
    v-model:show="showLocationModal"
    :name="product?.name"
    :warehouse_id="detail.do?.destination?.id"
    @click:submit="handleSubmitProductLocation"
  />

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'konfirmasi'">
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
          @click="handleConfirm"
        >
          Yakin
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-modal-signature
    ref="modalSignatureRef"
    :show="showModalSignature"
    @click:close="handleCloseModalSignature"
    :formValue="formValue"
    @handleSetImageSignature="handleSetImageSignature"
  />
</template>

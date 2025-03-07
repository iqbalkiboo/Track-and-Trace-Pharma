<script setup lang="ts">
import { useMessage } from "naive-ui"
import type { FormInst } from "naive-ui"
import {
  Add,
  CheckmarkCircleOutline,
  AlertCircleOutline,
} from "@vicons/ionicons5"
import moment from "moment"
import { serializeModel, serializeStore } from "@/models/produksi/serialisasi"
// import ModalAddSerialize from "../modal/modal-add-serialize.vue"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()
const store = serializeStore()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const isTableLoading = ref(false)
const detailDataRes = ref<any>({})
const detailProductDataRes = ref<any>({})
const serializeLevelDataRes = ref<any>({})
const filterValue = ref(null)
const indexSerializeLevel = ref(0)
const checkAll = ref(false)
const arrIdSerialize = ref<any>([])
const isPrintedOptions = computed(() => {
  return [
    {
      label: "Semua Data",
      value: "",
    },
    {
      label: "Belum Tercetak",
      value: 0,
    },
    {
      label: "Sudah Tercetak",
      value: 1,
    },
  ]
})
const selectedValue = ref<any>({
  qty: 0,
  status: "",
})
const levelParams = ref({
  is_printed: 0,
  status: "",
  level: 1,
  page: 1,
  limit: 10,
  reception_id: route.params.id,
})
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})
const modelAdd = ref<any>({})
const isShowModalAdd = ref(false)

onMounted(() => {
  getData()
})

async function getData() {
  getDetailSerializeProduct()
  await getDetailSerialize("")
}

async function getDetailSerialize(type: any) {
  isLoading.value = true
  const id = route.params.id as string
  await serializeModel
    .getDetailSerialize(id)
    .then((res) => {
      detailDataRes.value = res.data
      if (type === 'after_add_qty') {
        getSerializeLevel(levelParams.value.level)
      }else {
        getSerializeLevel(detailDataRes.value?.serialize[0].level)
      }
      setFormValue(res.data)
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function getDetailSerializeProduct() {
  const id = route.params.id as string
  serializeModel
    .getDetailSerializeProduct(id)
    .then((res) => {
      detailProductDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getSerializeLevel(level: number) {
  isTableLoading.value = true
  isBtnLoading.value = true
  levelParams.value.level = level

  if (filterValue.value === "void") {
    levelParams.value.status = "void"
  } else {
    levelParams.value.status = ""
  }

  return await serializeModel
    .getSerializeLevel(levelParams.value)
    .then((res) => {
      serializeLevelDataRes.value = res.data
      serializeLevelDataRes.value.list.forEach((el: any) => {
        return (el.checked = false)
      })
      isLoading.value = false
      isTableLoading.value = false
      isBtnLoading.value = false
      // reset data
      checkAll.value = false
      arrIdSerialize.value = []
      return res.data
    })
    .catch((err: any) => {
      isLoading.value = false
      isTableLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function updatePageSizeSerializeLevel(pageSize: number) {
  levelParams.value.page = 1
  levelParams.value.limit = pageSize
  getSerializeLevel(levelParams.value.level)
}

const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})

const printFormValue = ref<any>({})

const printStatusOptions = [
  {
    label: "Telah Dicetak",
    value: "yes",
  },
  {
    label: "Belum Dicetak",
    value: "no",
  },
]

function setFormValue(data: any) {
  data.serialize.forEach((el: any) => {
    if (el.qty === null) {
      return (el.qty = 0)
    }
  })
  if (data.date.manufacture_date !== null) {
    formValue.value.manufacture_date = moment(
      data.date.manufacture_date
    ).format("yyyy-MM-DD")
  }
  if (data.date.expired_date !== null) {
    formValue.value.expired_date = moment(data.date.expired_date).format(
      "yyyy-MM-DD"
    )
  }
  if (data.date.package_start_date !== null) {
    formValue.value.package_start_date = moment(
      data.date.package_start_date
    ).format("yyyy-MM-DD")
  }
  if (data.date.package_end_date !== null) {
    formValue.value.package_end_date = moment(
      data.date.package_end_date
    ).format("yyyy-MM-DD")
  }
  formValue.value.highest_retail_price = Math.round(
    data.product?.highest_retail_price
  )
  formValue.value.serialize = data.serialize
}

function handleClickLevel(index: number, level: number) {
  indexSerializeLevel.value = index
  levelParams.value.page = 1
  getSerializeLevel(level)
}

function showModalAdd() {
  modelAdd.value.id = route.params.id
  modelAdd.value.qty = 0
  modelAdd.value.level = levelParams.value.level
  isShowModalAdd.value = true
}

function addSerializeQty() {
  isBtnLoading.value = true

  const formAdd = new FormData()
  formAdd.append("reception_id", modelAdd.value.id)
  formAdd.append("level", String(levelParams.value.level))
  formAdd.append("qty", modelAdd.value.qty)

  serializeModel
    .addSerializeQty(formAdd)
    .then(() => {
      isBtnLoading.value = false
      getDetailSerialize("after_add_qty")
      isShowModalAdd.value = false
      indexSerializeLevel.value = 0
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    })
    .catch((err: any) => {
      const data = err.response.data
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showFailedFeedback(data)
      }, 300)
    })
}

function checkSerializeAll() {
  if (checkAll.value) {
    arrIdSerialize.value = []
    serializeLevelDataRes.value.list.forEach((el: any) => {
      arrIdSerialize.value.push(el.id)
      return (el.checked = true)
    })
  } else {
    serializeLevelDataRes.value.list.forEach((el: any) => {
      arrIdSerialize.value = []
      return (el.checked = false)
    })
  }
}

function checkSerialize(data: any, id: any) {
  if (data.checked == true) {
    arrIdSerialize.value.push(id)
  } else {
    arrIdSerialize.value = arrIdSerialize.value.filter(function (item: any) {
      return item !== id
    })
  }
}

function setSelectedValue(status: string) {
  selectedValue.value.qty = arrIdSerialize.value.length
  selectedValue.value.status = status
  showConfirmFeedback()
}

async function handleSubmit() {
  isBtnLoading.value = true
  const id = String(route.params.id)

  if (selectedValue.value.status == "print") {
    const formData = new FormData()
    formData.append("reception_id", id)
    arrIdSerialize.value.forEach((el: any) => {
      formData.append("ids[]", el)
    })

    serializeModel
      .printSerialize(formData)
      .then(() => {
        isBtnLoading.value = false
        localStorage.setItem("is_label_open", "0")
        localStorage.setItem(
          "labels",
          JSON.stringify(
            (store.labels = (serializeLevelDataRes.value?.list ?? []).filter(
              (label: any) => {
                return arrIdSerialize.value.includes(label.id)
              }
            ))
          )
        )
        if (levelParams.value.level != 1) {
          localStorage.setItem(
            "config",
            JSON.stringify(detailProductDataRes.value?.serialize)
          )
          localStorage.setItem(
            "data",
            JSON.stringify(detailProductDataRes.value)
          )
          localStorage.setItem(
            "detail",
            JSON.stringify(detailDataRes.value)
          )

          const a = document.createElement("a")
          a.target = "_blank"
          a.href = router.resolve({ name: "print-labels" }).href
          a.click()
          a.remove()
        }
        hideFeedback()
        setTimeout(() => {
          getDetailSerialize("")
          getSerializeLevel(levelParams.value.level)
          showSuccessFeedback()
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showFailedFeedback(data)
        }, 300)
      })
  } else {
    const formData = new FormData()

    if (selectedValue.value.status == "void") {
      formData.append("kind", "1")
    } else {
      formData.append("kind", "0")
    }
    arrIdSerialize.value.forEach((el: any) => {
      formData.append("ids[]", el)
    })

    serializeModel
      .voidSerialize(formData)
      .then(() => {
        isBtnLoading.value = false
        getSerializeLevel(levelParams.value.level)
        hideFeedback()
        setTimeout(() => {
          showSuccessFeedback()
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showFailedFeedback(data)
        }, 300)
      })
  }
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  if (selectedValue.value.status == "print") {
    tFeedbackRef.value.title = "Konfirmasi Cetak"
    tFeedbackRef.value.subtitle = `Anda akan mencetak ${selectedValue.value.qty} id`
  } else if (selectedValue.value.status == "void") {
    tFeedbackRef.value.title = "Konfirmasi Void"
    tFeedbackRef.value.subtitle = `Anda akan melakukan void ${selectedValue.value.qty} id`
  } else {
    tFeedbackRef.value.title = "Konfirmasi Batal Void"
    tFeedbackRef.value.subtitle = `Anda akan membatalkan void ${selectedValue.value.qty} id`
  }
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  if (selectedValue.value.status == "print") {
    tFeedbackRef.value.title = "Berhasil Cetak"
    tFeedbackRef.value.subtitle = "Proses cetak telah selesai dilakukan"
  } else if (selectedValue.value.status == "void") {
    tFeedbackRef.value.title = "Berhasil Void"
    tFeedbackRef.value.subtitle = "Proses void telah selesai dilakukan"
  } else if (selectedValue.value.status == "cancel-void") {
    tFeedbackRef.value.title = "Berhasil Batal Void"
    tFeedbackRef.value.subtitle = "Proses batal void telah selesai dilakukan"
  } else {
    tFeedbackRef.value.title = "Generate Serialisasi Berhasil"
    tFeedbackRef.value.subtitle = `${modelAdd.value.qty} kemasan level ${levelParams.value.level} berhasil tergenerate`
  }
  tFeedbackRef.value.show = true
}

function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = "failed"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#EB5757"),
    (tFeedbackRef.value.icon = AlertCircleOutline)
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-space justify="space-between">
        <n-h2 style="margin-bottom: 16px">{{
          detailDataRes.product?.short_name
        }}</n-h2>
        <router-link
          :to="{ name: 'produksi-serialisasi-id-barcode' }"
          class="text-decoration-none"
        >
          <n-button type="warning" class="button-tnt"
            >Cetak Serialisasi</n-button
          >
        </router-link>
      </n-space>
      <n-grid
        cols="3"
        item-responsive
        responsive="screen"
        x-gap="16"
        y-gap="16"
      >
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Perintah Kemas : </span>
                <span style="font-weight: 500">{{ detailDataRes.pk_id }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Kode Produk : </span>
                <span style="font-weight: 500">{{
                  detailDataRes.product?.item_code
                }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>UOM : </span>
                <span style="font-weight: 500">{{
                  detailProductDataRes.uom?.name
                }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Batch Produksi : </span>
                <span style="font-weight: 500">{{
                  detailDataRes.batch_number
                }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Qty : </span>
                <span style="font-weight: 500">{{
                  detailDataRes.serialize ? detailDataRes.serialize[0].qty : 0
                }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
      </n-grid>
      <div class="card-tnt">
        <n-space vertical :size="24">
          <n-space vertical :size="0">
            <n-form
              ref="formRef"
              class="form-tnt"
              :show-require-mark="false"
              :label-width="80"
              :model="formValue"
            >
              <n-grid
                cols="4"
                item-responsive
                responsive="screen"
                x-gap="26"
                y-gap="16"
              >
                <n-grid-item span="4 m:1">
                  <n-form-item label="Tanggal Manufaktur">
                    <n-date-picker
                      disabled
                      v-model:formatted-value="formValue.manufacture_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-form-item label="Expired Date">
                    <n-date-picker
                      disabled
                      v-model:formatted-value="formValue.expired_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
              <n-grid
                cols="4"
                item-responsive
                responsive="screen"
                x-gap="26"
                y-gap="16"
              >
                <n-grid-item span="4 m:1">
                  <n-form-item label="Tanggal Mulai Pengemasan">
                    <n-date-picker
                      disabled
                      v-model:formatted-value="formValue.package_start_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-form-item label="Tanggal Selesai Pengemasan">
                    <n-date-picker
                      disabled
                      v-model:formatted-value="formValue.package_end_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
            </n-form>
          </n-space>
        </n-space>
      </div>
      <div style="margin-top: 18px">
        <n-grid
          cols="6"
          item-responsive
          responsive="screen"
          x-gap="26"
          y-gap="16"
        >
          <n-grid-item
            span="3 s:2 m:1"
            v-for="(serialize, i) in detailDataRes.serialize"
            :key="i"
          >
            <n-button
              :loading="isBtnLoading"
              block
              color="#219653"
              :ghost="levelParams.level !== (serialize as any).level"
              class="button-tnt"
              @click="handleClickLevel(i, (serialize as any).level)"
            >
              {{ (serialize as any).name }} ({{ levelParams.is_printed === 1 ? (serialize as any).total_printed : levelParams.is_printed === 0 ? (serialize as any).generated - (serialize as any).total_printed : (serialize as any).generated }})
            </n-button>
          </n-grid-item>
        </n-grid>
      </div>
      <div class="card-tnt">
        <n-space vertical :size="10">
          <n-space vertical :size="0" v-if="false">
            <n-grid
              cols="4"
              item-responsive
              responsive="screen"
              x-gap="26"
              y-gap="16"
            >
              <n-grid-item span="4 s:2 m:1">
                <n-select
                  v-model:value="printFormValue.printStatus"
                  :options="printStatusOptions"
                  filterable
                  placeholder="Status Cetak"
                />
              </n-grid-item>
              <n-grid-item span="4 s:2 m:1">
                <n-input
                  v-model:value="printFormValue.secondaryTotal"
                  placeholder="Masukkan Jumlah Sekunder"
                />
              </n-grid-item>
              <n-grid-item span="4 s:2 m:1">
                <n-button block color="#219653" class="button-tnt">
                  <template #icon>
                    <n-icon><add /></n-icon>
                  </template>
                  Tambah Sekunder
                </n-button>
              </n-grid-item>
              <n-grid-item span="4 s:2 m:1">
                <router-link
                  to="/penerimaan/1/print"
                  class="text-decoration-none"
                >
                  <n-button
                    block
                    color="#F2C94C"
                    text-color="#1E1E1E"
                    class="button-tnt"
                  >
                    Cetak Serialisasi
                  </n-button>
                </router-link>
              </n-grid-item>
            </n-grid>
          </n-space>
          <n-space vertical :size="14">
            <n-space>
              <n-select
                v-model:value="levelParams.is_printed"
                :disabled="isBtnLoading"
                :options="isPrintedOptions"
                style="width: 250px"
                @update:value="getSerializeLevel(levelParams.level)"
                ></n-select>
              <n-button
                v-if="indexSerializeLevel !== 0"
                :loading="isBtnLoading"
                color="#219653"
                ghost
                class="button-tnt"
                @click.prevent="showModalAdd"
              >
                Tambah Serialisasi
              </n-button>
            </n-space>
            <n-space v-if="arrIdSerialize.length > 0" justify="end">
              <!-- <template v-if="filterValue == 'void'"> -->
              <n-button
                type="error"
                ghost
                class="button-tnt"
                @click="setSelectedValue('cancel-void')"
              >
                Batalkan Void
              </n-button>
              <!-- </template>
              <template v-else> -->
              <n-button
                type="error"
                ghost
                class="button-tnt"
                @click="setSelectedValue('void')"
              >
                Void
              </n-button>
              <n-button
                type="primary"
                ghost
                class="button-tnt"
                @click="setSelectedValue('print')"
              >
                Cetak
              </n-button>
              <!-- </template> -->
            </n-space>

            <div class="table-tnt" style="margin-top: 0">
              <template v-if="isTableLoading">
                <t-loading></t-loading>
              </template>
              <template v-else>
                <n-scrollbar x-scrollable>
                  <n-table :single-line="false">
                    <thead>
                      <tr>
                        <th style="text-align: center">No</th>
                        <th>ID Serialisasi</th>
                        <th>Status Cetak</th>
                        <th
                          v-if="levelParams.level != 1"
                          style="text-align: center"
                        >
                          Jumlah Tercetak
                        </th>
                        <th>
                          <div style="display: flex; justify-content: center">
                            <div style="padding-right: 10px">Pilih Semua</div>
                            <n-checkbox
                              size="large"
                              label=""
                              v-model:checked="checkAll"
                              @click="checkSerializeAll"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="serializeLevelDataRes.list?.length > 0">
                        <tr
                          v-for="(list, i) in serializeLevelDataRes.list"
                          :key="i"
                          :class="list.status === 'print_void' ? 'bg-print-void' : ''"
                        >
                          <td style="text-align: center">
                            {{
                              levelParams.limit * (levelParams.page - 1) +
                              (i + 1)
                            }}
                          </td>
                          <td>{{ (list as any).code }}</td>
                          <td>
                            <template v-if="filterValue == 'void'">
                              <n-tag :bordered="false" type="error">
                                Void
                              </n-tag>
                            </template>
                            <template v-else>
                              <n-tag
                                :bordered="false"
                                :type="
                                  (list as any).print?.is_printed ? 'success' : 'primary'
                                "
                              >
                                {{
                                  (list as any).print?.is_printed
                                    ? "Telah Dicetak"
                                    : "Belum Dicetak"
                                }}

                                {{  (list as any).status == 'released' ? ' - released' : null  }}
                              </n-tag>
                            </template>
                          </td>
                          <td
                            v-if="levelParams.level != 1"
                            style="text-align: center"
                          >
                            {{ (list as any).print?.logs?.value ?? 0 }}
                          </td>
                          <td style="text-align: center">
                            <n-checkbox
                              v-if="(list as any).status != 'released'"
                              size="large"
                              label=""
                              v-model:checked="(list as any).checked"
                              @click="checkSerialize(list, (list as any).id)"
                            />
                          </td>
                        </tr>
                      </template>
                      <template v-else>
                        <td colspan="4" style="text-align: center">
                          Belum ada data tersedia
                        </td>
                      </template>
                    </tbody>
                  </n-table>
                </n-scrollbar>
              </template>
              <div class="table-footer">
                <n-pagination
                  v-model:page="levelParams.page"
                  :page-count="serializeLevelDataRes.total_page"
                  :page-slot="7"
                  :show-size-picker="serializeLevelDataRes.total_data > 10"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  @update:page="getSerializeLevel(levelParams.level)"
                  @update:page-size="updatePageSizeSerializeLevel"
                />
              </div>
            </div>
          </n-space>
        </n-space>
      </div>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link to="/produksi/bundling" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt"> Kembali </n-button>
        </router-link>
      </div>
    </div>
  </div>

  <modal-add-serialize
    v-model:is-show="isShowModalAdd"
    v-model:value="modelAdd"
    v-model:loading="isBtnLoading"
    @click:submit="addSerializeQty"
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
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#219653"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="handleSubmit"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>

<style lang="scss">
.bg-print-void {
  td {
    background-color: #d030502e;
    color: #d03050ed;
  }
}
</style>
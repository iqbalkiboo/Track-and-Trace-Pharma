<script setup lang="ts">
import type { Component } from "vue"
import { NIcon, useMessage } from "naive-ui"
import {
  CheckmarkCircleOutline,
  EllipsisVertical,
  SearchOutline,
} from "@vicons/ionicons5"
import moment from "moment"
import { returnModel } from "@/models/penerimaan/return"
import TModalInputReason from "@/components/t-modal-input-reason.vue"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const productDataRes = ref<any>({})
const detailCustomerDataRes = ref<any>({})
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: "Alasan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}
const modalInputReason = ref<any>({
  show: false,
  data: {},
  form: {},
  loading: isBtnLoading,
})
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

onMounted(() => {
  localStorage.removeItem("rr-product-data")
  getData()
})

async function getData() {
  isLoading.value = true
  await getDetailReturn()
  await getListDetailReturn()
  isLoading.value = false
}

async function getDetailReturn() {
  const id = route.query.return_id as string
  await returnModel
    .getDetailReturn(id)
    .then((res) => {
      getDetailCustomer(res.data.do_type, res.data.customer?.id)
      detailDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getListDetailReturn() {
  const id = route.query.return_id as string
  await returnModel
    .getListDetailReturn(id)
    .then((res) => {
      productDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDetailCustomer(doType: string, id: string) {
  if (doType === "customer") {
    await returnModel
      .getDetailCustomer(id)
      .then((res) => {
        detailCustomerDataRes.value = res.data
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else if (doType === "crossdocking") {
    await returnModel
      .getDetailPlant(id)
      .then((res) => {
        detailCustomerDataRes.value = res.data
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  }
}

const actionOptions = [
  { label: "Scan", key: "scan", icon: renderIcon(SearchOutline) },
]

function handleSelectDropdown(key: string | number, data: any) {
  switch (key) {
    case "scan":
      router.push({
        name: "penerimaan-return-code-scan",
        query: { return_id: data.rr_id, product_id: data.id },
      })
      break

    default:
      break
  }
}

function handleShowConfirm() {
  showConfirmFeedback()
  // if (detailDataRes?.value.total_current_qty < detailDataRes?.value.total_qty) {
  // } else {
  //   handleShowInputBuilding()
  // }
}

function handleShowInputBuilding() {
  modalInputReason.value.show = true
  modalInputReason.value.data = detailDataRes
  hideFeedback()
}

function handleCloseInputReason() {
  modalInputReason.value.show = false
}

function handleConfirmInputReason() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("rr_id", route.query.return_id as string)
  formData.append("reason", modalInputReason.value.form.reason)

  returnModel
    .postFinish(formData)
    .then(() => {
      isBtnLoading.value = false
      handleCloseInputReason()
      getData()
      modalInputReason.value.form = {}
      setTimeout(() => {
        tFeedbackRef.value.title = "Berhasil"
        tFeedbackRef.value.subtitle = "Berhasil terima return"
        showSuccessFeedback()
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk melakukan terima return?"
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  tFeedbackRef.value.show = true
}

function hideFeedback() {
  tFeedbackRef.value.show = false
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
      <n-h2 style="margin-bottom: 4px"
        >DO Return : {{ detailDataRes.code }}
      </n-h2>
      <n-row gutter="16">
        <n-col :span="8">
          <n-space
            vertical
            :size="0"
          >
            <n-text
              >Tanggal DO Return :
              {{ moment(detailDataRes.date).format("yyyy-MM-DD") }}
            </n-text>
            <n-text
              >Customer :
              {{ detailDataRes.customer.name }}
            </n-text>
            <n-text
              >Alamat :
              {{
                $filters.setAddress(detailDataRes.customer?.address?.address)
              }}
            </n-text>
          </n-space>
        </n-col>
        <n-col :span="8">
          <n-space
            vertical
            :size="0"
          >
            <n-text
              >DO Origin :
              {{ detailDataRes.do_origin_code }}
            </n-text>
            <!--            <n-text-->
            <!--              >Wh Tujuan :-->
            <!--              {{ detailDataRes.warehouse_to?.warehouse?.name }}-->
            <!--            </n-text>-->
          </n-space>
        </n-col>
        <n-col :span="8">
          <n-space
            vertical
            :size="15"
            align="end"
          >
            <n-tag
              round
              :bordered="false"
              strong
              :type="
                detailDataRes.status === 'cancel'
                  ? 'error'
                  : detailDataRes.status === 'pending'
                  ? 'warning'
                  : detailDataRes.status === 'complete'
                  ? 'primary'
                  : 'success'
              "
              size="large"
            >
              {{ $filters.toStatus(detailDataRes.status) }}
            </n-tag>
            <n-card
              style="
                width: 250px;
                text-align: center;
                border-radius: 15px;
                background: #eee;
              "
            >
              <n-p style="font-size: 14px">Qty Konfirmasi/Qyt Return</n-p>
              <n-h4 style="margin-top: 0; margin-bottom: 0">
                {{
                  `${detailDataRes.qty.receive}/${detailDataRes.qty.request}`
                }}
              </n-h4>
            </n-card>
          </n-space>
        </n-col>
      </n-row>

      <div class="card-tnt">
        <div
          class="table-tnt"
          style="margin-top: 0"
        >
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>Batch</th>
                    <th>Exp Date</th>
                    <th style="text-align: center">Qty Konfirmasi</th>
                    <th style="text-align: center">Qty Return</th>
                    <th style="text-align: center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="productDataRes.list.length > 0">
                    <tr
                      v-for="(list, i) in productDataRes.list"
                      :key="i"
                    >
                      <td data-label="No">
                        {{ i + 1 }}
                      </td>
                      <td data-label="Kode Produk">
                        {{ list.product.item_code }}
                      </td>
                      <td data-label="Nama Produk">
                        {{ list.product.short_name }}
                      </td>
                      <td data-label="Batch">
                        {{ list.batch }}
                      </td>
                      <td data-label="Exp Date">
                        {{ moment(list.created_at).format("yyyy-MM-DD") }}
                      </td>
                      <td
                        data-label="Qty Konfirmasi"
                        style="text-align: center"
                      >
                        {{ $filters.toNumber(list.current_qty) }}
                      </td>
                      <td
                        data-label="Qty Return"
                        style="text-align: center"
                      >
                        {{ $filters.toNumber(list.qty) }}
                      </td>
                      <td
                        data-label="Aksi"
                        style="text-align: center"
                      >
                        <n-dropdown
                          placement="bottom-end"
                          :options="actionOptions"
                          @select="handleSelectDropdown($event, list)"
                        >
                          <n-button tertiary>
                            <template #icon>
                              <n-icon>
                                <ellipsis-vertical />
                              </n-icon>
                            </template>
                          </n-button>
                        </n-dropdown>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td
                        colspan="9"
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
        </div>
      </div>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'penerimaan-return' }"
          class="text-decoration-none"
        >
          <n-button
            :loading="isBtnLoading"
            color="#828282"
            class="button-tnt"
            style="width: 120px"
            >Kembali
          </n-button>
        </router-link>
        <n-button
          v-if="
            detailDataRes.status !== 'cancel' &&
            detailDataRes.status !== 'complete'
          "
          :loading="isBtnLoading"
          type="primary"
          class="button-tnt"
          style="width: 120px"
          @click="handleShowConfirm"
        >
          Terima Return
        </n-button>
      </div>
    </div>
  </div>

  <t-modal-input-reason
    :show="modalInputReason.show"
    :data="modalInputReason.data"
    :value="modalInputReason.form"
    :loading="isBtnLoading"
    @click:close="handleCloseInputReason"
    @click:confirm="handleConfirmInputReason"
  ></t-modal-input-reason>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
    :align="tFeedbackRef.align"
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
          type="primary"
          class="button-tnt"
          @click="handleShowInputBuilding"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>
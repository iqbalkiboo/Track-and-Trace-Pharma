<script setup lang="ts">
import { NIcon, NInput, useMessage } from "naive-ui"
import { CheckmarkCircleOutline, EllipsisVertical } from "@vicons/ionicons5"
import { auth } from "@/models/auth"
import { returnModel } from "@/models/penerimaan/return"
import moment from "moment"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const detailReturnDataRes = ref<any>({})
const arrDetailDataRes = ref<any>([])
const productDataRes = JSON.parse(
  localStorage.getItem("rr-product-data") as string
)
const listDetailDataRes = ref<any>({})
const scanDataRes = ref<any>([])
const qty = ref({
  current_qty: 0,
  qty: 0,
})
const codeScan = ref("")
const rules = ref()
rules.value = {
  reason: {
    required: true,
    message: "Alasan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}
const input = ref<typeof NInput | null>(null)

onMounted(() => {
  authData.value = auth.getAuth()
  getData()
})

async function getData() {
  isLoading.value = true
  getDetailProduct()
  getDetailReturn()
  await getListDetailProduct()
  isLoading.value = false
}

async function getDetailProduct() {
  const id = route.query.product_id as string
  const params = {}
  await returnModel
    .getDetailProduct(id, params)
    .then((res) => {
      const data = res.data
      qty.value = {
        current_qty: data.current_qty,
        qty: data.qty,
      }
      detailDataRes.value = data
      arrDetailDataRes.value = data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDetailReturn() {
  const id = route.query.return_id as string
  await returnModel
    .getDetailReturn(id)
    .then((res) => {
      detailReturnDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getListDetailProduct() {
  const id = route.query.product_id as string
  const params = {}
  await returnModel
    .getListDetailProduct(id, params)
    .then(async (res) => {
      listDetailDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function handleClickScan() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("code", codeScan.value)
  formData.append("rr_product_id", route.query.product_id as string)

  await returnModel
    .getSerializeScan(formData)
    .then((res) => {
      const data = res.data
      const error = ref(false)
      if (qty.value.current_qty >= qty.value.qty) {
        error.value = true
        tMessage.error("Maaf, tidak boleh melebihin qty return")
      }
      scanDataRes.value.forEach((v: any) => {
        if (data.code === v.code) {
          error.value = true
          tMessage.error("Maaf, tidak boleh scan code yang sama")
        }
      })
      if (!error.value) {
        scanDataRes.value.push(data)
        qty.value.current_qty = scanDataRes.value.reduce(
          (a: any, b: any) => a + b.serialize.first_level_qty,
          0
        )
      }
      input.value?.focus()
      codeScan.value = ""
      isBtnLoading.value = false
      error.value = false
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function handleShowConfirm() {
  showConfirmFeedback()
}

function handleClickConfirm() {
  const id = route.query.product_id as string
  isBtnLoading.value = true

  const formData = new FormData()

  for (let i = 0; i < scanDataRes.value.length; i++) {
    formData.append(`codes[${i}]`, scanDataRes.value[i].code)
  }
  returnModel
    .scanConfirmation(id, formData)
    .then(() => {
      isBtnLoading.value = false
      setTimeout(() => {
        tFeedbackRef.value.title = "Berhasil Konfirmasi Scan"
        tFeedbackRef.value.subtitle = `kode serialisai berhasil dikonfirmasi`
        showSuccessFeedback()
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function handleDeleteDetailItem(code: any) {
  const id = route.query.product_id as string
  const formData = new FormData()
  formData.set("codes[0]", code)
  await returnModel
    .deleteDetailItem(id, formData)
    .then(() => {
      getData()
    })
    .catch((err: any) => {
      if (err.response) {
        const data = err.response.data
        tMessage.error(data.message)
      }
    })
}

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

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function hideSuccessFeedback() {
  scanDataRes.value = []
  getData()
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk melakukan konfirmasi scan?"
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  tFeedbackRef.value.show = true
}

async function handleSelectDropdown(
  key: string | number,
  data: any,
  from: any
) {
  switch (key) {
    case "delete":
      if (from === "temporary") {
        const index = scanDataRes.value.findIndex(
          (item: any) => item.id === data.id
        )
        scanDataRes.value.splice(index, 1)
      } else {
        await handleDeleteDetailItem(data.serialize?.code)
      }
      break

    default:
      break
  }
}

const actionOptions = computed(() => {
  return [
    {
      label: "Hapus",
      key: "delete",
      disabled: detailReturnDataRes.value?.status === "complete",
    },
  ]
})
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-space
        vertical
        :size="14"
      >
        <n-space justify="space-between">
          <n-space align="center">
            <n-h1 style="font-weight: 600; font-size: 18px; margin: auto">
              DO Return : {{ detailReturnDataRes.code }}
            </n-h1>
          </n-space>
        </n-space>
        <n-row
          :cols="12"
          :gutter="10"
        >
          <n-col :span="6">
            <n-space vertical>
              <n-text
                >Tanggal Return:
                {{ moment(detailDataRes.created_at).format("yyyy-MM-DD") }}
              </n-text>
              <n-text
                >Kode Produk : {{ detailDataRes.product?.item_code }}
              </n-text>
              <n-text>Produk : {{ detailDataRes.product?.short_name }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical>
              <n-text>Batch : {{ detailDataRes.batch }}</n-text>
            </n-space>
            <n-space vertical>
              <n-text
                >Plant/Cabang Asal :
                {{ $filters.isEmpty(detailDataRes.from?.warehouse?.name) }}
              </n-text>
              <n-text
                >Building Asal :
                {{ $filters.isEmpty(detailDataRes.from?.building?.name) }}
              </n-text>
              <n-text
                >Room Asal :
                {{ $filters.isEmpty(detailDataRes.from?.room?.name) }}
              </n-text>
              <n-text
                >Rack Asal :
                {{ $filters.isEmpty(detailDataRes.from?.rack_pallete?.name) }}
              </n-text>
              <n-text
                >Bin Asal :
                {{ $filters.isEmpty(detailDataRes.from?.bin?.name) }}
              </n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical>
              <n-text
                >Plant/Cabang Tujuan :
                {{ $filters.isEmpty(detailDataRes.to?.warehouse?.name) }}
              </n-text>
              <n-text
                >Building Tujuan :
                {{ $filters.isEmpty(detailDataRes.to?.building?.name) }}
              </n-text>
              <n-text
                >Room Tujuan :
                {{ $filters.isEmpty(detailDataRes.to?.room?.name) }}
              </n-text>
              <n-text
                >Rack Tujuan :
                {{ $filters.isEmpty(detailDataRes.to?.rack_pallete?.name) }}
              </n-text>
              <n-text
                >Bin Tujuan :
                {{ $filters.isEmpty(detailDataRes.to?.bin?.name) }}
              </n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
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
                  detailReturnDataRes.status === 'cancel'
                    ? 'error'
                    : detailReturnDataRes.status === 'pending'
                    ? 'warning'
                    : detailReturnDataRes.status === 'complete'
                    ? 'primary'
                    : 'success'
                "
                size="large"
              >
                {{ $filters.toStatus(detailReturnDataRes.status) }}
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
                <n-h4 style="margin-top: 0px">
                  {{ `${qty.current_qty}/${qty.qty}` }}
                </n-h4>
              </n-card>
            </n-space>
          </n-col>
        </n-row>

        <div
          class="card-tnt"
          style="background-color: #eeeeee"
        >
          <n-space
            vertical
            align="center"
          >
            <n-text>Silakan masukkan Kode Serialisasi</n-text>
            <n-space>
              <n-input
                ref="input"
                v-model:value="codeScan"
                placeholder=""
                clearable
                @keyup.enter="handleClickScan"
                style="width: 35rem"
              ></n-input>
              <n-button
                :loading="isBtnLoading"
                :disabled="codeScan == ''"
                strong
                secondary
                type="primary"
                class="button-tnt"
                @click="handleClickScan"
                >Cari
              </n-button>
            </n-space>
          </n-space>
        </div>

        <div
          v-if="scanDataRes.length > 0"
          class="card-tnt"
          style="margin-top: 0"
        >
          <n-text>Serialisasi Terscan</n-text>
          <div
            class="table-tnt"
            style="margin-top: 10px"
          >
            <n-table
              :single-line="false"
              :bottom-bordered="false"
              :bordered="false"
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th>Expired Date</th>
                  <th style="text-align: center">Batch</th>
                  <th style="text-align: center">Level</th>
                  <th style="text-align: center">Qty</th>
                  <th style="text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(list, i) in scanDataRes"
                  :key="i"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ (list as any).code }}</td>
                  <td>
                    {{
                      moment((list as any).product?.expired_date).format(
                        "yyyy-MM-DD"
                      )
                    }}
                  </td>
                  <td style="text-align: center">{{ (list as any).batch }}</td>
                  <td style="text-align: center">
                    {{ (list as any).serialize?.level }}
                  </td>
                  <td style="text-align: center">
                    {{
                      $filters.toNumber(
                        (list as any).serialize?.first_level_qty
                      )
                    }}
                  </td>
                  <td style="text-align: center">
                    <n-dropdown
                      placement="bottom-end"
                      :options="actionOptions"
                      :show-arrow="true"
                      @select="handleSelectDropdown($event, list, 'temporary')"
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
              </tbody>
            </n-table>
          </div>
        </div>

        <div
          v-if="listDetailDataRes.list?.length > 0"
          class="card-tnt"
          style="margin-top: 0"
        >
          <n-text>Serialisasi Terkonfirmasi</n-text>
          <div
            class="table-tnt"
            style="margin-top: 10px"
          >
            <n-table
              :single-line="false"
              :bottom-bordered="false"
              :bordered="false"
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode Serialisasi</th>
                  <th>Expired Date</th>
                  <th style="text-align: center">Batch</th>
                  <th style="text-align: center">Level</th>
                  <th style="text-align: center">Qty</th>
                  <th style="text-align: center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(list, i) in listDetailDataRes.list"
                  :key="i"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ (list as any).serialize.code }}</td>
                  <td>
                    {{
                      moment((list as any).expired_date).format("yyyy-MM-DD")
                    }}
                  </td>
                  <td style="text-align: center">
                    {{ (list as any).serialize.batch }}
                  </td>
                  <td style="text-align: center">
                    {{ (list as any).serialize?.level }}
                  </td>
                  <td style="text-align: center">
                    {{
                      $filters.toNumber(
                        (list as any).serialize?.first_level_qty
                      )
                    }}
                  </td>
                  <td style="text-align: center">
                    <n-dropdown
                      placement="bottom-end"
                      :options="actionOptions"
                      :show-arrow="true"
                      @select="handleSelectDropdown($event, list, 'list')"
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
              </tbody>
            </n-table>
          </div>
        </div>
      </n-space>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{
            name: 'penerimaan-return-code',
            query: { return_id: $route.query.return_id },
          }"
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
        <!-- <template v-if="detailDataRes.status === 'pending'"> -->
        <n-button
          :loading="isBtnLoading"
          :disabled="scanDataRes.length === 0"
          type="primary"
          class="button-tnt"
          style="width: 120px"
          @click="handleShowConfirm"
        >
          Konfirmasi
        </n-button>
        <!-- </template> -->
      </div>
    </div>
  </div>

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
          @click="handleClickConfirm"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideSuccessFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>
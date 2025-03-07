<script setup lang="ts">
import { AddOutline, EllipsisVertical, TrashOutline } from "@vicons/ionicons5"
import { agregasiModel } from "@/models/pengiriman/agregasi"
import { useMessage } from "naive-ui"
import { renderIcon } from "@/helpers/render-icon"
import moment from "moment"

const route = useRoute()
const router = useRouter()
const params = ref({
  q: "",
  page: 1,
  limit: 10,
  sort: "desc",
  do_id: route.params.id,
})
const tMessage = useMessage()
const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const dataResManifest = ref<any>({})
const isLoadingManifest = ref(false)
const delivery = ref<any>({
  delivery_date: null,
  target_delivery_date: null,
})
const typeDisabled = computed(() => dataRes.value.is_done)

const isCrossdocking = computed(() => route.params.type === 'crossdocking')
const isCustomer = computed(() => route.params.type === 'customer')

function getFormData(data: any) {
  const sla = parseInt(data.customer?.standart_sla)
  const addDay = moment(data.do_date).add(sla, "d")
  delivery.value = {
    delivery_date:
      data.set_delivery_date || moment(data.do_date).format("yyyy-MM-DD"),
    target_delivery_date:
      data.set_delivered_date || moment(addDay).format("yyyy-MM-DD"),
  }
}

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await agregasiModel
    .getDetailDO(route.params.id)
    .then((res: any) => {
      dataRes.value = res.data
      getFormData(dataRes.value)
      // if (dataRes?.value?.total?.manifest <= 0) {
      //   handlePostManifest()
      // } else {
        getDataManifest()
      // }
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDataManifest() {
  isLoadingManifest.value = true
  isBtnLoading.value = true
  await agregasiModel
    .getManifest(params.value)
    .then((res: any) => {
      dataResManifest.value = res.data
      isLoadingManifest.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoadingManifest.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
    .finally(() => {
      isLoading.value = false
    })
}

async function handlePostManifest() {
  isLoadingManifest.value = true
  isBtnLoading.value = true
  await agregasiModel
    .postManifest({ do_id: route.params.id })
    .then(() => {
      isBtnLoading.value = false
      getDataManifest()
    })
    .catch((err: any) => {
      isLoadingManifest.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function handleUpdateManifestDate() {
  if (dataResManifest.value.total_data > 0) {
    const deliveryPayload = await delivery.value
    const payload = {
      delivery_date: deliveryPayload.delivery_date,
      target_delivery_date: deliveryPayload.target_delivery_date,
    }
    await agregasiModel
      .updateManifestDate(payload, route.params.id as string)
      .then(() => {
        // tMessage.success("Berhasil")
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else {
    delivery.value = {
      target_delivery_date: null,
      delivery_date: null,
    }
    tMessage.error("Anda Harus Menambahkan Manifest")
  }
}

async function handleClickDone() {
  if (dataRes.value.set_delivery_date === "" || dataRes.value.set_delivered_date === "") {
    await handleUpdateManifestDate()
    proccessClickDone()
  } else {
    proccessClickDone()
  }
}

async function proccessClickDone() {
  const checkPacking = await dataResManifest.value.list.some((item: any) => {
    if (item.total.packing === 0) {
      tMessage.error(
        `Anda Harus Menambahkan Packing Di Manifest ${item.code}`
      )
    }
    return item.total.packing === 0
  })
  const checkProduk = await dataResManifest.value.list.some((item: any) => {
    if (item.total.qty === 0) {
      tMessage.error(`Anda Harus Menambahkan Produk Di Manifest ${item.code}`)
    }
    return item.total.qty === 0
  })

  if (!checkPacking && !checkProduk) {
    try {
      await agregasiModel.decreaseStock(route.params.id as string)
      router.push({
        name: "pengiriman-id-list-manifest",
        params: {
          id: route.params.id,
        },
      })
    } catch (e: any) {
      if (e.response) {
        const data = e.response.data.message
        tMessage.error(data)
      }
    }
  }
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getDataManifest()
}

const actionOptions = (disabled: boolean) => [
  {
    label: "Delete",
    key: "delete",
    icon: renderIcon(TrashOutline),
    disabled,
  },
]

async function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "delete":
      await agregasiModel
        .deleteManifest(id)
        .then(() => {
          getData()
        })
        .catch((err: any) => {
          if (err.response) {
            const data = err.response.data.message
            tMessage.error(data)
          }
        })
      break
    default:
      break
  }
}

function handleClickBack() {
  router.go(-1)
}

// watchEffect(async () => {
//   if (dataRes.value.total.manifest <= 0) {
//     await handlePostManifest().then(() => getData())
//   }
// })

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <t-loading></t-loading>
    </template>
    <template v-else>
      <n-grid
        cols="3"
        item-responsive
        responsive="screen"
        x-gap="16"
        y-gap="16"
      >
        <n-grid-item span="3 m:1">
          <n-h2 style="margin-bottom: 16px">Kode {{ isCrossdocking ? 'DO' : 'Invoice' }}: {{ dataRes?.code }}</n-h2>
          <n-space
            vertical
            :size="15"
          >
            <n-space align="center">
              <n-text> Created BY : </n-text>
              <n-text>{{
                dataRes?.created_by?.is_superadmin
                  ? dataRes.created_by?.superadmin?.name
                  : dataRes.created_by?.user?.name
              }}</n-text>
            </n-space>
            <n-space align="center">
              <n-text> Tanggal {{ isCrossdocking ? 'DO' : 'Invoice' }} : </n-text>
              <n-text>{{ moment(dataRes?.do_date).format("yyyy-MM-DD") }}</n-text>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-grid cols="2">
                <n-gi>
                  <n-space vertical>
                    <n-text style="margin-bottom: 0">
                      <span>Estimasi Pengiriman : </span>
                    </n-text>
                    <n-text style="margin-bottom: 0">
                      <span>Estimasi Sampai : </span>
                    </n-text>
                  </n-space>
                </n-gi>
                <n-gi>
                  <n-space>
                    <n-date-picker
                      clearable
                      v-model:formatted-value="delivery.delivery_date"
                      @update:value="handleUpdateManifestDate"
                      value-format="yyyy-MM-dd"
                      type="date"
                    />
                    <n-date-picker
                      clearable
                      v-model:formatted-value="delivery.target_delivery_date"
                      @update:value="handleUpdateManifestDate"
                      type="date"
                    />
                  </n-space>
                </n-gi>
              </n-grid>
            </n-space>
            <n-space align="center">
              <n-text> Total Qty Pesan : </n-text>
              <n-text>{{ dataRes.total?.qty_request }}</n-text>
            </n-space>
            <n-space align="center">
              <n-text> Berat : </n-text>
              <n-text>{{ dataRes.weight }}</n-text>
            </n-space>
            <n-space align="center">
              <n-text> Volume : </n-text>
              <n-text>{{ dataRes.volume }} cm3</n-text>
            </n-space>
          </n-space>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <n-h2 style="margin-bottom: 16px"
            >Tujuan: {{ dataRes.customer?.name }}</n-h2
          >
          ID Customer: <n-text>{{ dataRes.customer?.erp_code }}</n-text>
          <n-space
            vertical
            :size="15"
          >
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">{{
                $filters.setAddress(dataRes.destination?.address)
              }}</n-text>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <span>Status : </span>
                <n-tag
                  type="info"
                  round
                  >{{ dataRes.status }}</n-tag
                >
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
      </n-grid>
      <div class="card-tnt">
        <div class="table-tnt">
          <n-scrollbar x-scrollable>
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th style="text-align: center">NO</th>
                  <th>Kode Produk</th>
                  <th>Nama Produk</th>
                  <th>Serialisasi</th>
                  <th>Building</th>
                  <th>Batch</th>
                  <th>Exp Date</th>
                  <th>Qty Pesan</th>
                  <th>Qty Packing</th>
                  <th>UOM</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(list, i) in dataRes.products"
                  :key="i"
                >
                  <td
                    data-label="No"
                    style="text-align: center"
                  >
                    {{ i + 1 }}
                  </td>
                  <td data-label="Kode Produk">
                    {{ list.code }}
                  </td>
                  <td data-label="Nama Produk">
                    {{ list.name }}
                  </td>
                  <td data-label="Serialisasi">
                    <n-tag
                      :type="list.is_serializable ? 'success' : 'warning'"
                      round>
                      {{ list.is_serializable ? 'Serialisasi' : 'Tanpa Serialisasi' }}
                    </n-tag>
                  </td>
                  <td data-label="Building">
                    {{ list.warehouse_building.erp_code }}
                  </td>
                  <td data-label="Batch">{{ list.batch }}</td>
                  <td data-label="Exp Date">
                    {{
                      list.expired_date
                        ? moment(list.expired_date).format("yyyy-MM-DD")
                        : "-"
                    }}
                  </td>
                  <td data-label="Qty Pesan">
                    {{ list.qty_request }}
                  </td>
                  <td data-label="Qty Packing">
                    {{ list.qty_packed }}
                  </td>
                  <td data-label="UOM">
                    {{ list.uom.name }}
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </div>
      </div>
      <div
        class="card-tnt"
      >
        <n-space
          v-if="dataResManifest.total_data === 0"
          justify="center"
        >
          <n-button
            class="button-tnt"
            type="primary"
            :loading="isBtnLoading"
            @click="handlePostManifest"
            :disabled="typeDisabled"
          >
            <template #icon>
              <n-icon><add-outline></add-outline></n-icon> </template
            >Tambah Manifest
          </n-button>
        </n-space>
        <template v-else>
          <n-space vertical>
            <template v-if="isLoading">
              <t-loading></t-loading>
            </template>
            <template v-else>
              <TransitionGroup
                name="list"
                tag="div"
              >
                <n-card
                  v-for="(list, i) in dataResManifest.list"
                  :key="i"
                  style="border-radius: 12px; margin-bottom: 1rem"
                >
                  <n-space vertical>
                    <n-space vertical>
                      <n-space
                        align="center"
                        justify="space-between"
                      >
                        <n-text>ID Manifest : {{ list.code }}</n-text>
                        <n-dropdown
                          :options="actionOptions(list.is_done)"
                          @select="handleSelectDropdown($event, list.id)"
                        >
                          <n-button
                            tertiary
                            style="padding: 0"
                          >
                            <template #icon>
                              <n-icon><ellipsis-vertical /></n-icon>
                            </template>
                          </n-button>
                        </n-dropdown>
                      </n-space>
                    </n-space>
                    <t-agregasi-list-packing
                      :id_manifest="list.id"
                      :total="dataRes.total"
                      :totalPacking="list.total?.packing"
                      :typeDisabled="list.is_done"
                      :detailDO="dataRes"
                      @getDo="getData"
                      @getDataManifest="getDataManifest"
                    />
                  </n-space>
                </n-card>
              </TransitionGroup>
              <n-button
                @click="handlePostManifest"
                quaternary
                class="button-tnt"
                type="primary"
                v-if="dataResManifest.total_data > 0"
                :disabled="typeDisabled"
              >
                <template #icon>
                  <n-icon><add-outline></add-outline></n-icon> </template
                >Tambah Manifest
              </n-button>
            </template>
          </n-space>
          <n-space justify="center">
            <n-pagination
              v-model:page="params.page"
              :page-count="dataResManifest.total_page"
              :page-slot="7"
              :show-size-picker="dataResManifest.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getDataManifest"
              @update:page-size="updatePageSize"
            />
          </n-space>
        </template>
      </div>

      <div v-if="dataRes.status !== 'finish'" class="bottom-action-button">
        <div class="action-item">
          <n-button
            @click="handleClickBack"
            class="button-tnt"
            style="width: 120px"
            color="#828282"
            >Kembali</n-button
          >
          <n-button
            type="primary"
            @click="handleClickDone()"
            class="button-tnt"
            style="width: 120px"
            v-if="dataRes.weight > 0 && dataRes.total_data !== 0"
            >Selesai</n-button
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { AddOutline, EllipsisVertical, TrashOutline } from "@vicons/ionicons5"
import { agregasiModel } from "@/models/pengiriman/agregasi"
// import { useMessage } from "naive-ui"

const props = defineProps<{
  packing_id: string
  manifest_id: string
  typeDisabled: any
  packing_code: string
  detailDO?: any
}>()

const params = ref({
  q: "",
  status: "",
  page: 1,
  sort: "created_at",
  dir: "desc",
  limit: 5,
  manifest_packing_id: props.packing_id,
})

const emits = defineEmits<{
  (e: "getDo"): any
}>()

function getDo() {
  emits("getDo")
}

const showModalFeedback = ref(false)
const showModalBarcodeFeedback = ref(false)
const dataResPackingSerialization = ref<any>({})
const isLoading = ref(true)
const isBtnLoading = ref(false)
const lastProdukId = ref("")
async function getDataPackingSerialization() {
  isLoading.value = true
  isBtnLoading.value = true
  await agregasiModel
    .getPackingSerialization(params.value)
    .then(async (res: any) => {
      dataResPackingSerialization.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
      lastProdukId.value = await res.data.list[0].id
    })
    .catch(() => {
      isLoading.value = false
      isBtnLoading.value = false
    })
}

const actionOptions = [
  {
    label: "Hapus",
    key: "delete",
    icon: renderIcon(TrashOutline),
    disabled: props.typeDisabled,
  },
]

async function handleDeleteProduk(id: string) {
  agregasiModel
    .deleteProduk(id)
    .then(() => {
      isLoading.value = false
      isBtnLoading.value = false
      getDataPackingSerialization()
    })
    .catch(() => {
      isLoading.value = false
      isBtnLoading.value = false
    })
}

async function handleCloseModal() {
  showModalFeedback.value = false
  emits("getDo")
}

async function handleCloseBarCodeModal() {
  showModalBarcodeFeedback.value = false
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getDataPackingSerialization()
}

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "delete":
      handleDeleteProduk(id)
      break
    default:
      break
  }
}

onMounted(() => {
  getDataPackingSerialization()
})
</script>

<template>
  <div
    class="card-tnt"
    style="border-radius: 12px; background: #fafafa"
  >
    <div
      v-if="dataResPackingSerialization.total_data !== 0"
      class="card-tnt"
      style="border-radius: 12px"
    >
      <div class="table-tnt">
        <t-loading v-if="isLoading" />
        <template v-else>
          <n-scrollbar x-scrollable>
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th>ID Serialization</th>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(list, i) in dataResPackingSerialization.list"
                  :key="i"
                >
                  <td>{{ list.serializations.code }}</td>
                  <td>
                    {{ list.serializations.name }}
                  </td>
                  <td>
                    {{ list.serializations.product_name }}
                  </td>
                  <td>{{ list.serializations?.qty }}</td>
                  <td>
                    <n-dropdown
                      placement="bottom-end"
                      :options="actionOptions"
                      @select="handleSelectDropdown($event, list.id)"
                      show-arrow
                    >
                      <n-button tertiary>
                        <template #icon>
                          <n-icon><ellipsis-vertical /></n-icon>
                        </template>
                      </n-button>
                    </n-dropdown>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </template>
        <div class="table-footer">
          <n-pagination
            v-model:page="params.page"
            :page-count="dataResPackingSerialization.total_page"
            :page-slot="7"
            :show-size-picker="dataResPackingSerialization.total_data > 5"
            :page-sizes="[5, 10, 20, 40, 50]"
            @update:page="getDataPackingSerialization"
            @update:page-size="updatePageSize"
          />
        </div>
      </div>
      <n-space
        v-if="dataResPackingSerialization.total_data !== 0"
        style="margin-top: 1rem"
        justify="center"
      >
        <n-button
          quaternary
          type="primary"
          @click="showModalFeedback = true"
          :disabled="typeDisabled"
        >
          <template #icon>
            <n-icon><add-outline></add-outline></n-icon>
          </template>
          Tambah Item</n-button
        >
        <n-button
          quaternary
          type="primary"
          @click="showModalBarcodeFeedback = true"
        >
          <template #icon>
            <n-icon><add-outline></add-outline></n-icon>
          </template>
          Cetak Label Packing</n-button
        >
      </n-space>
    </div>
    <n-space
      v-if="dataResPackingSerialization.total_data === 0"
      justify="center"
      align="center"
    >
      <n-button
        @click="showModalFeedback = true"
        type="primary"
        :loading="false"
      >
        <template #icon>
          <n-icon>
            <add-outline></add-outline>
          </n-icon> </template
        >Tambah Produk
      </n-button>
    </n-space>
  </div>

  <t-agregasi-add-produk-modal
    :packing_id="props.packing_id"
    :manifest_id="props.manifest_id"
    :produk_id="lastProdukId"
    :packing_code="packing_code"
    :show="showModalFeedback"
    @getData="getDataPackingSerialization()"
    :data="dataResPackingSerialization"
    @click:close="handleCloseModal"
    @click:delete="handleDeleteProduk"
    @getDo="getDo"
  />

  <t-agregasi-barcode-produk-modal
    :show="showModalBarcodeFeedback"
    :packing_id="props.packing_id"
    :detailDO="props.detailDO"
    @click:close="handleCloseBarCodeModal"
  />

</template>
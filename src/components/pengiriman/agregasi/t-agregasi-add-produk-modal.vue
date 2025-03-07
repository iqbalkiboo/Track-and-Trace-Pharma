<script setup lang="ts">
import { NInput } from "naive-ui"
import { agregasiModel } from "@/models/pengiriman/agregasi"
import { EllipsisVertical } from "@vicons/ionicons5"
import { useMessage } from "naive-ui"

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    packing_id?: string
    packing_code?: string
    produk_id?: string
    data?: any
    manifest_id?: string
  }>(),
  {
    show: false,
  }
)

const codeScan = ref("")
const tMessage = useMessage()
const route = useRoute()
const arrProduct = ref<any>([])
const dataResDO = ref<any>({})
const isLoading = ref(false)
const isBtnLoading = ref(false)
const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
  (e: "getData"): any
  (e: "getDo"): any
  (e: "click:delete", value: any): any
}>()

onUpdated(() => {
  input.value?.focus()
})

const input = ref<typeof NInput | null>(null)

const actionOptions = [{ label: "Hapus", key: "delete" }]

async function handleSubmit() {
  isLoading.value = true
  isBtnLoading.value = true
  input.value?.focus()
  try {
    const res = await agregasiModel.postProduk({
      packing_code: props.packing_code,
      code: codeScan.value,
    })
    arrProduct.value.push(res.data)
    isLoading.value = false
    isBtnLoading.value = false
    emit("getData")
    getDataDetaiDO()
    tMessage.success("berhasil")
    codeScan.value = ''
  } catch (e: any) {
    isLoading.value = false
    isBtnLoading.value = false
    const data = e.response.data
    tMessage.error(data.message)
    codeScan.value = ''
  }
}

function handleClickSave() {
  emit("click:close", false)
  arrProduct.value = []
  emit("getDo")
}
async function getDataDetaiDO() {
  isLoading.value = true
  await agregasiModel
    .getDetailDO(route.params.id)
    .then((res: any) => {
      dataResDO.value = res.data
      isLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "delete": {
      const updateArrPorduk = arrProduct.value.filter((item: any) => {
        return item.id !== id
      })
      arrProduct.value = updateArrPorduk
      handleDeleteProduk(id)
      break
    }
    default:
      break
  }
}

async function handleDeleteProduk(id: string) {
  await agregasiModel
    .deleteProduk(id)
    .then(() => {
      isLoading.value = false
      emit("getData")
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}
onMounted(() => {
  getDataDetaiDO()
  arrProduct.value = []
})
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    preset="card"
    auto-focus
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 900px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space justify="space-between">
      <n-space
        vertical
        :size="0"
      >
        <n-h3 style="margin: 0">Tambah Ke Packing </n-h3>
        <n-text style="margin: 0"
          >ID DO : <span>{{ dataResDO.code }}</span></n-text
        >
      </n-space>
      <n-space
        vertical
        :size="0"
      >
        <n-text>Total Qty Pesan :</n-text>
        <span style="font-weight: 700"
          >{{ dataResDO.total.qty_packed }} /
          {{ dataResDO.total.qty_request }}</span
        >
      </n-space>
    </n-space>
    <n-space
      vertical
      align="center"
      justify="center"
      :size="14"
    >
      <n-h3
        v-if="title"
        style="margin-bottom: 0"
        >{{ title }}</n-h3
      >

      <n-space
        vertical
        align="center"
      >
        <n-text>Silakan masukkan Kode</n-text>
        <n-space>
          <n-input
            ref="input"
            v-model:value="codeScan"
            placeholder="Tambah Serialisasi"
            style="width: 600px; max-width: 100%"
            @keyup.enter="handleSubmit"
          ></n-input>
          <n-button
            v-if="false"
            strong
            secondary
            :disabled="codeScan === ''"
            type="primary"
            class="button-tnt"
            @click="handleSubmit"
            :loading="isBtnLoading"
            >Submit</n-button
          >
        </n-space>
      </n-space>
      <n-p style="font-size: 0.8rem">Atau Scan Kode</n-p>

      <n-button
        type="primary"
        class="button-tnt"
        @click="handleSubmit"
        :disabled="codeScan === ''"
        :loading="isBtnLoading"
        >Scan Kode</n-button
      >
    </n-space>
    <div
      class="table-tnt"
      v-if="arrProduct.length > 0"
      style="margin-top: 1rem"
    >
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
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
                v-for="(list, i) in arrProduct"
                :key="i"
              >
                <td>{{ list.serializations.code }}</td>
                <td>
                  {{ list.serializations.name }}
                </td>
                <td>
                  {{ list.serializations.product_name }}
                </td>
                <td>{{ list.serializations.qty }}</td>
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
          <div class="table-footer">
            <n-button
              type="primary"
              class="button-tnt"
              @click="handleClickSave"
              :loading="isBtnLoading"
              >Simpan</n-button
            >
          </div>
        </n-scrollbar>
      </template>
    </div>
  </n-modal>
</template>
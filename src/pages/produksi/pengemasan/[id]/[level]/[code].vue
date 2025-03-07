<route lang="yaml">
meta:
  layout: auth
  title: Detail Pengemasan Level 2
  requireAuth: auth
</route>

<script setup lang="ts">
import { Add, EllipsisVertical } from "@vicons/ionicons5"
import type { THeader } from "~/components/components"
import type { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface"
import { packingModel } from "@/models/produksi/pengemasan"
import { NInput, useMessage } from "naive-ui"
import Buzz from "@/assets/sound/beep.wav"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const headers = computed<THeader[]>(() => {
  return [
    { label: "No" },
    { label: "ID Level " + (parseInt(detail.value?.serialize?.level) - 1) },
    { label: "Produk" },
    { label: "Batch" },
    { label: "Aksi", style: { width: "3rem" } },
  ]
})

const headersError = computed<THeader[]>(() => {
  return [
    { label: "No" },
    { label: "ID Level " + (parseInt(detail.value?.serialize?.level) - 1) },
    { label: "Produk" },
    { label: "Alasan" },
  ]
})

const actionOptions = computed<DropdownMixedOption[]>(() => [
  { label: "Hapus", key: "delete" },
])
const input = ref<typeof NInput | null>(null)
const isLoading = ref(false)
const isBtnLoading = ref(false)
const detail = ref<any>()
const show = ref(false)
const showFeedback = ref(false)
const selected = ref<any[]>([])
const selectedFail = ref<any[]>([])
const code = ref("")
const failCode = ref<any[]>([])
const lastPacked = ref<any[]>([])

const items = computed(() => {
  return [...lastPacked.value, ...selected.value]
})

const failItems = computed(() => {
  return [ ...failCode.value, ...selectedFail.value]
})

onMounted(async () => {
  isLoading.value = true
  await getDetailKemasan()
  await getListKemasan()
  isLoading.value = false
})

onUpdated(() => {
  input.value?.focus()
})

async function getDetailKemasan() {
  const { data } = await packingModel.detailKemasan({
    code: route.params.code as string,
    level: route.params.level as string,
    reception_id: route.params.id as string,
  })
  detail.value = data
}

async function getListKemasan() {
  const { data } = await packingModel.listItemKemas(detail.value.id, {
    limit: detail.value?.serialize?.maximum ?? 10,
  })
  lastPacked.value = data.list

  if (items.value.length < detail.value?.serialize?.maximum ) {
    show.value = false
  }
}

async function handleScanned(_code: string) {
  if (!_code) {
    playSound()
    tMessage.error("Kode packing tidak boleh kosong")
    return
  }

  isBtnLoading.value = true
  const { data } = await getDetailItem(_code)
  isBtnLoading.value = false

  if (["void"].includes(data.status)) {
    playSound()
    tMessage.error("Status serialisasi void tidak dapat ditambahkan")
    return
  }

  if (route.params.level == "2" && data.serialize?.level != 1) {
    playSound()
    tMessage.error("Item tidak ditemukan.")
    return
  }

  if (detail.value?.serialize?.maximum <= items.value.length) {
    playSound()
    tMessage.error("Kemasan penuh")
    show.value = false
    return
  }

  if (!data.print?.is_printed) {
    playSound()
    tMessage.error("Label item belum tercetak")
    return
  }

  if (data.is_packed) {
    playSound()
    const reason = "Item sudah dikemas (items packed)"
    tMessage.error(reason)
    data.message = reason
    selectedFail.value.push(data)
    return
  }
  
  if (selected.value.findIndex((v: any) => v.id == data.id) == -1) {
    if (route.query.is_bundling === 'true') {
      const productIds = selected.value.map(val => val.reception.product?.long_name)
      if (data.serialize?.level == 1 && productIds.includes(data.reception.product.long_name)) {
        const reason = `Item dengan produk ${data.reception.product.long_name} sudah ditambahkan sebelumnya`
        playSound()
        tMessage.warning(reason)
        data.message = reason
        selectedFail.value.push(data)
      } else {
        tMessage.success("Item berhasil ditambahkan")
        selected.value.push(data)
        if (detail.value?.serialize?.maximum == items.value.length) {
          handleSave()
          show.value = false
        }

      }
    } else {
      tMessage.success("Item berhasil ditambahkan")
      selected.value.push(data)
      if (detail.value?.serialize?.maximum == items.value.length) {
        handleSave()
        show.value = false
      }
    }
  } else {
    const reason = "Item sudah ditambahkan sebelumnya"
    playSound()
    tMessage.warning(reason)
    data.message = reason
    selectedFail.value.push(data)
  }
}

async function getDetailItem(_code: string) {
  if (detail.value.serialize?.level > 2) {
    return await packingModel
      .detailKemasan({
        code: _code,
        level: detail.value.serialize?.level - 1 + "",
        reception_id: route.params.id as string,
      })
      .catch((e) => {
        isBtnLoading.value = false
        let msg = e.message
        if (e.response.data) msg = e.response.data.message
        tMessage.error(msg)
        failCode.value = [ ...failCode.value, _code ]
        throw e
      })
      .finally(() => {
        isBtnLoading.value = false
        code.value = ""
      })
  } else {
    return await packingModel
      .detailItem({
        code: _code,
        reception_detail_id: detail.value.id,
      })
      .catch((e) => {
        isBtnLoading.value = false
        let msg = e.message
        if (e.response.data) msg = e.response.data.message
        tMessage.error(msg)
        playSound()
        failCode.value = [ ...failCode.value, {code: _code , message: msg} ]
        throw e
      })
      .finally(() => {
        isBtnLoading.value = false
        code.value = ""
      })
  }
}

async function handleSelect(key: string | number, index: number) {
  if (index > lastPacked.value.length)
    selected.value.splice(index - lastPacked.value.length, 1)
  else {
    const item = items.value[index]
    await packingModel.batalKemasItem({
      id_kemasan: detail.value.id,
      id_item: item.id,
    })
    getListKemasan()
  }
  tMessage.success("Item berhasil dihapus")
}

async function handleSave() {
  if (selected.value.length > 0) {
    isLoading.value = true
    // const { data } =
    await packingModel
      .kemasItem({
        reception_detail_id: detail.value.id,
        ids: selected.value.map((v: any) => v.id),
      })
      .catch((e) => {
        let msg = e.message
        if (e.response.data) msg = e.response.data.message
        tMessage.error(msg)
      })
      .finally(() => {
        isLoading.value = false
      })
  }
  tMessage.success("Item berhasil dikemas")
  router.push({
    name: "produksi-pengemasan-id"
  })
  // showFeedback.value = true
}

function handleConfirm() {
  router.push({
    name: "produksi-pengemasan-id"
  })
}

function playSound() {
  const data = { soundurl : Buzz} 
  const audio = new Audio(data.soundurl)
      audio.play()
}

//  testing

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:code", value: string): void
  (e: "scanned", value: string): void
  (e: "click:close", value: boolean): void
}>()

function handleEnter(value : any) {
  if (!value) {
    tMessage.error('Kode tidak boleh kosong')
  } else {
    // emit("scanned", value)
    emit("scanned", value)
    const data = value.split("\n")
    const code = data[data.length - 2]
    handleScanned(code)
    input.value?.focus()
  }
}

</script>

<template>
  <div class="body-tnt">
    <t-loading v-if="isLoading"></t-loading>
    <n-space v-else vertical :size="24">
      <n-space vertical :size="0">
        <n-h2 style="margin-bottom: 0">
          Packing Level {{ detail?.serialize?.level }}
        </n-h2>
        <n-breadcrumb>
          <n-breadcrumb-item @click="$router.push('/pengemasan')"
            >Pengemasan</n-breadcrumb-item
          >
          <n-breadcrumb-item
            @click="
              $router.push({
                name: 'produksi-pengemasan-id',
                params: { id: $route.params.id },
              })
            "
            >Detail Pengemasan</n-breadcrumb-item
          >
          <n-breadcrumb-item
            >Packing Level {{ detail?.serialize?.level }}</n-breadcrumb-item
          >
        </n-breadcrumb>
      </n-space>

      <n-grid
        cols="2"
        item-responsive
        responsive="screen"
        :x-gap="16"
        :y-gap="16"
      >
        <n-gi span="2 s:1">
          <n-space vertical :size="0">
            <n-h6 style="margin-bottom: 5px;">
              Kode Level {{ detail?.serialize?.level }} :
              {{ detail?.code }}
            </n-h6>
            <n-h6 style="margin-bottom: 0">
              Kode PK : {{ detail?.reception?.pk_id }}
            </n-h6>
            <n-text style="margin-bottom: 0">{{
              detail?.reception?.product?.long_name
            }}</n-text>
            <n-text v-if="false" style="margin-bottom: 0">
              <n-text strong>Packer : </n-text> Syihab
            </n-text>
          </n-space>
        </n-gi>
        <n-gi span="2 s:1">
          <n-space justify="end">
            <n-button
              type="warning"
              class="button-tnt"
              style="width: 120px;"
              @click="show = true"
            >
              <n-icon :component="Add" />
              Scan ID
            </n-button>
          </n-space>
        </n-gi>
        <n-gi span="2 s:1">
          <n-tag
            style="border-radius: 8px; width: 100%; padding: 1rem; justify-content: center"
            strong
          >
            <n-text style="text-align: center">
              Qty: {{ items.length }}/{{ detail?.serialize?.maximum }}
            </n-text>
          </n-tag>
        </n-gi>
      </n-grid>

      <n-grid x-gap="12" :cols="2">
        <n-gi>
          <n-input 
            ref="input"
            type="textarea" 
            style="width: 100%; 
            height: 100%;"
            placeholder=""
            @keyup.enter="handleEnter(($event.target as HTMLInputElement).value)"
          />
        </n-gi>
        <n-gi>
          <div class="table-tnt" style="margin-top: 0;">
            <t-table :headers="headers">
              <n-tr v-for="(item, index) in items" :key="item.id">
                <n-td>{{ index + 1 }}</n-td>
                <n-td>{{ item.code }}</n-td>
                <n-td>{{ item?.reception?.product?.long_name }}</n-td>
                <n-td>{{ item?.reception?.batch_number }}</n-td>
                <n-td>
                  <n-dropdown
                    trigger="click"
                    :options="actionOptions"
                    @select="handleSelect($event, index)"
                  >
                    <n-button :bordered="false" circle>
                      <n-icon :component="EllipsisVertical" />
                    </n-button>
                  </n-dropdown>
                </n-td>
              </n-tr>
            </t-table>
          </div>
        </n-gi>
      </n-grid>
      <div class="table-tnt" style="margin-top: 0;">
        <t-table :headers="headersError">
          <n-tr v-for="(item, index) in failItems" :key="item.id">
            <n-td>{{ index + 1 }}</n-td>
            <n-td>{{ item.code }}</n-td>
            <n-td>{{ item.reception?.product?.long_name }}</n-td>
            <n-td>{{ item.message }}</n-td>
          </n-tr>
        </t-table>
      </div>

      <n-space justify="center">
        <n-button
          :loading="isLoading"
          type="primary"
          class="button-tnt"
          style="width: 120px;"
          @click="handleSave"
        >
          Simpan
        </n-button>
      </n-space>
    </n-space>
  </div>

  <t-feedback
    v-model:show="showFeedback"
    title="Selamat"
    :subtitle="`${items.length} Item telah terkemas`"
  >
    <n-space justify="center">
      <n-button type="primary" @click="handleConfirm">Selesai</n-button>
    </n-space>
  </t-feedback>

  <t-feedback
    v-if="false"
    v-model:show="showFeedback"
    title="Konfirmasi Pengemasan"
    :subtitle="` tidak terisi penuh, lanjutkan pengemasan?`"
  >
    <n-space justify="center">
      <n-button type="primary" color="gray">Simpan</n-button>
      <n-button type="primary" @click="handleConfirm">Lanjutkan</n-button>
    </n-space>
  </t-feedback>

  <t-scan-modal
    v-model:show="show"
    v-model:code="code"
    :title="`Packing Level ${detail?.serialize?.level - 1}`"
    :total_items="items.length"
    :qty_max="detail?.serialize?.maximum"
    :loading="isBtnLoading"
    @scanned="handleScanned"
  ></t-scan-modal>
</template>

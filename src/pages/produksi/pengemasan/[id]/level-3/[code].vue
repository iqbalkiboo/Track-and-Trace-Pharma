<route lang="yaml">
meta:
  layout: auth
  title: Detail Pengemasan Tersier
  requireAuth: auth
</route>

<script setup lang="ts">
import { Add, EllipsisVertical } from "@vicons/ionicons5"
import type { THeader } from "~/components/components"
import type { DropdownMixedOption } from "naive-ui/es/dropdown/src/interface"
import { packingModel } from "@/models/produksi/pengemasan"
import { useMessage } from "naive-ui"
import Buzz from "@/assets/sound/beep.wav"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()

const headers = ref<THeader[]>([
  { label: "No" },
  { label: "ID Level 2" },
  { label: "Batch" },
  { label: "Aksi", style: { width: "3rem" } },
])

const actionOptions = computed<DropdownMixedOption[]>(() => [
  // { label: 'Detail', key: 'detail' },
  // { label: 'Edit', key: 'edit' },
  { label: "Hapus", key: "delete" },
])
const isLoading = ref(false)
// const page = ref(1)
const detail = ref<any>()
const show = ref(false)
const code = ref("")
const selected = ref<any[]>([])
const showFeedback = ref(false)

onMounted(async () => {
  await getDetailKemasan()
  getListKemasan()
})

async function getDetailKemasan() {
  const { data } = await packingModel.detailKemasan({
    code: route.params.code as string,
    level: "2",
    reception_id: route.params.id as string,
  })
  detail.value = data
}

async function getListKemasan() {
  const { data } = await packingModel.listItemKemas(detail.value.id, {
    limit: detail.value?.serialize?.maximum ?? 10,
  })
  selected.value = data.list
}

async function handleScanned(_code: string) {
  if (!_code) {
    playSound()
    tMessage.error("Kode packing tidak boleh kosong")
    return
  }
  const { data } = await packingModel
    .detailKemasan({
      code: _code,
      level: "2",
      reception_id: route.params.id as string,
    })
    .catch((e) => {
      let msg = e.message
      if (e.response.data) msg = e.response.data.message
      tMessage.error(msg)
      throw e
    })
    .finally(() => {
      code.value = ""
    })
  if (detail.value?.serialize?.maximum <= selected.value.length) {
    playSound()
    tMessage.error("Kemasan penuh")
    show.value = false
    return
  }
  if (data.status != "printed") {
    playSound()
    tMessage.error("Label item belum tercetak")
    return
  }
  if (data.is_packed) {
    playSound()
    tMessage.error("Item sudah dikemas (items packed)")
    return
  }
  if (selected.value.findIndex((v: any) => v.id == data.id) == -1) {
    tMessage.success("Item berhasil ditambahkan")
    selected.value.push(data)
    if (detail.value?.serialize?.maximum == selected.value.length)
      show.value = false
  } else {
    playSound()
    tMessage.warning("Item sudah ditambahkan sebelumnya")
  }
}

function handleSelect(key: string | number, index: number) {
  selected.value.splice(index, 1)
}

async function handleSave() {
  isLoading.value = true
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

  tMessage.success("Item berhasil dikemas")
  router.push({ name: "produksi-pengemasan-id" })
  showFeedback.value = true
}

function handleConfirm() {
  router.push({ name: "produksi-pengemasan-id" })
}

function playSound() {
  const data = { soundurl : Buzz}
  const audio = new Audio(data.soundurl)
  audio.play()
}
</script>

<template>
  <n-space vertical :size="24" style="padding: 1rem">
    <n-space vertical :size="0">
      <n-h1 style="margin-bottom: 0"> Packing Level 3</n-h1>
      <n-breadcrumb>
        <n-breadcrumb-item @click="$router.push('/pengemasan')"
          >Pengemasan</n-breadcrumb-item
        >
        <n-breadcrumb-item
          @click="
            $router.push({
              name: 'produksi-pengemasan-id',
            })
          "
          >Detail Pengemasan</n-breadcrumb-item
        >
        <n-breadcrumb-item>Packing Tersier</n-breadcrumb-item>
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
          <n-h1 style="margin-bottom: 0"> ID Level 3: {{ detail?.code }} </n-h1>
          <n-h4 style="margin-bottom: 0">
            Kode PK: {{ detail?.reception?.pk_id }}
          </n-h4>
          <n-p style="margin-bottom: 0">
            {{ detail?.reception?.product?.long_name }}</n-p
          >
          <n-p style="margin-bottom: 0">
            <n-text strong>Packer: </n-text> Syihab
          </n-p>
        </n-space>
      </n-gi>
      <n-gi span="2 s:1">
        <n-space justify="end">
          <n-button type="warning" @click="show = true">
            <n-icon :component="Add" />
            Scan ID
          </n-button>
        </n-space>
      </n-gi>
      <n-gi span="2 s:1">
        <n-tag
          style="width: 100%; padding: 1rem; justify-content: center"
          strong
        >
          <n-p style="text-align: center">
            Qty: {{ selected.length }}/{{ detail?.serialize?.maximum }}
          </n-p>
        </n-tag>
      </n-gi>
    </n-grid>

    <t-table :headers="headers">
      <n-tr v-for="(item, index) in selected" :key="item.id">
        <n-td>{{ index + 1 }}</n-td>
        <n-td>{{ item.code }}</n-td>
        <n-td>{{ item.reception.batch_number }}</n-td>
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

    <n-space justify="center">
      <n-button :loading="isLoading" type="primary" @click="handleSave"
        >Simpan</n-button
      >
    </n-space>
  </n-space>

  <t-feedback
    v-model:show="showFeedback"
    title="Selamat"
    :subtitle="`${selected.length} Item telah terkemas`"
  >
    <n-space justify="center">
      <n-button type="primary" @click="handleConfirm">Selesai</n-button>
    </n-space>
  </t-feedback>

  <t-scan-modal
    v-model:show="show"
    v-model:code="code"
    @scanned="handleScanned"
    title="Packing Level 2"
  ></t-scan-modal>
</template>

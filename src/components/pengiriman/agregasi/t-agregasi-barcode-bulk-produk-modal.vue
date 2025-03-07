<script setup lang="ts">
import type { NInput } from "naive-ui"
import { agregasiModel } from "@/models/pengiriman/agregasi"
import { useMessage } from "naive-ui"
import { onMounted } from "vue"

const props = withDefaults(
  defineProps<{
    show: boolean
    title?: string
    manifest_id?: string
    detailDO?: any
  }>(),
  {
    show: false,
  }
)
const params = ref({
  q: "",
  dir: "desc",
  page: 1,
  limit: 10,
  manifest_id: props.manifest_id,
})

const isLoading = ref(false)
const isBtnLoading = ref(false)
const router = useRouter()
const route = useRoute()
const tMessage = useMessage()
const dataRes = ref<any>({})
const input = ref<typeof NInput | null>(null)

// const emits = defineEmits<{
//   (e: "update:show", value: boolean): void
//   (e: "click:close", value: boolean): Promise<void>
// }>()

async function getData() {
  if (props.manifest_id) {
    isLoading.value = true
    isBtnLoading.value = true
    await agregasiModel
      .getPacking(params.value)
      .then(async (res: any) => {
        dataRes.value = await res.data
        isLoading.value = false
        isBtnLoading.value = false
      })
      .catch((e) => {
        isLoading.value = false
        isBtnLoading.value = false
        tMessage.error(e)
      })
  }
}

onUpdated(() => {
  input.value?.focus()
})

onMounted(() => {
  getData()
})

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

async function handlePrintLabel() {
  localStorage.setItem("is_label_open", "0")
  params.value.limit = 1000
  params.value.page = 1
  getData().then(() => {
    localStorage.setItem("labels", JSON.stringify(dataRes.value))
    localStorage.setItem("label-do", JSON.stringify(props.detailDO))
    localStorage.setItem("label-type", route.params.type.toString())
    const a = document.createElement("a")
    a.target = "_blank"
    a.href = router.resolve({ name: "print-labels-agregasi" }).href
    a.click()
    a.remove()
  })
  const payload = {
    is_printed: true,
  }
  try {
    await agregasiModel.printManyLabel(payload, props.manifest_id as string)
  } catch (e: any) {
    if (e.response) {
      const data = e.response.data.message()
      tMessage.error(data)
    }
  }
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    auto-focus
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 850px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space
      vertical
      :size="14"
    >
      <n-space
        align="center"
        justify="space-between"
      >
        <div style="font-size: 16px; font-weight: 500">Pratinjau</div>
        <n-button
          type="primary"
          @click="handlePrintLabel"
          >Cetak Label</n-button
        >
      </n-space>
      <n-space>
        <div
          v-for="(list, i) in dataRes.list"
          :key="i"
          class="label-wrapper"
        >
          <div class="label">
            <div class="label-content">
              <div class="label-info">
                <div class="qr-box">
                  <div style="width: 100%; margin: auto">
                    <div class="qr-label">
                      <p
                        style="width: 50%; display: flex; justify-content: space-between;"
                        class="qr-text"
                      >
                        <div>Kode {{ route.params.type === 'crossdocking' ? 'DO' : 'Invoice' }}</div>
                        <div>:</div>
                      </p>
                      <p
                        style="width: 60%"
                        class="qr-text"
                      >
                        {{ list.do?.code }}
                      </p>
                    </div>
                    <div class="qr-label">
                      <p
                        style="width: 50%; display: flex; justify-content: space-between;"
                        class="qr-text"
                      >
                        <div>ID Packing</div>
                        <div>:</div>
                      </p>
                      <p
                        style="width: 60%"
                        class="qr-text"
                      >
                        {{ list.code }}
                      </p>
                    </div>
                    <div class="qr-label">
                      <p
                        style="width: 50%; display: flex; justify-content: space-between;"
                        class="qr-text"
                      >
                        <div>Tujuan</div>
                        <div>:</div>
                      </p>
                      <p
                        style="width: 60%"
                        class="qr-text"
                      >
                        {{ $props.detailDO?.customer?.name }}
                      </p>
                    </div>
                    <div class="qr-label">
                      <p
                        style="width: 50%; display: flex; justify-content: space-between;"
                        class="qr-text"
                      >
                        <div>Alamat</div>
                        <div>:</div>
                      </p>
                      <p
                        style="width: 60%"
                        class="qr-text"
                      >
                        {{ $filters.isEmpty($props.detailDO?.destination?.address?.province?.name) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="label-qr">
                <vue-qrcode
                  :options="{ width: 70, margin: 0 }"
                  :value="list.code"
                />
              </div>
            </div>
          </div>
        </div>
      </n-space>
      <n-space justify="center">
        <n-pagination
          v-model:page="params.page"
          :page-count="dataRes.total_page"
          :page-slot="7"
          :show-size-picker="dataRes.total_data > 10"
          :page-sizes="[10, 20, 30, 40, 50]"
          @update:page="getData"
          @update:page-size="updatePageSize"
        />
      </n-space>
    </n-space>
  </n-modal>
</template>

<style lang="scss">
.break-page {
  page-break-after: always;
}

.label-wrapper {
  padding: 0;
}

.label {
  width: 6cm;
  height: 3cm;
  border-radius: 2mm;
  box-shadow: 0 0 1px 1px #000;
  padding: 2mm;
  display: flex;
  align-items: center;
}

.label-content {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
}

.label-info {
  width: 100%;
}

.label-qr {
  margin-left: 2mm;
  flex: none;
}

.qr-text {
  font-size: 8px;
  word-wrap: anywhere;
}

.qr-box {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.qr-label {
  display: flex;
  width: 100%;
  margin: auto;
  gap: 5px;

  .qr-text {
    display: block;
    font-size: 10px;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>

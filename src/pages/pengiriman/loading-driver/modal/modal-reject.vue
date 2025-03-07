<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { loadingModel } from "@/models/pengiriman/loading"

const props = withDefaults(
  defineProps<{
    show: boolean
    data?: any
    isBtnLoading: boolean
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "click:confirm", value: boolean): void
  (e: "click:close", value: boolean): void
}>()

const tMessage = useMessage()

const isLoading = ref(true)
const dataRes = ref<any>({})

watch(() => props.show, (value) => {
  if (value) {
    getData()
  }
})

function getData() {
  detailReject()
}

function detailReject() {
  isLoading.value = true
  const params = {
    manifest_code: props.data.code
  }
  loadingModel.detailReject(params).then((res) => {
    dataRes.value = res.data
    isLoading.value = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function handleConfirmClick() {
  emit('click:confirm', true)
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 500px; max-width: 100%; border-radius: 10px"
    :title="'Konfirmasi'"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical style="padding-left: 10px; padding-right: 10px;">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-space vertical :size="0">
          <n-text strong>Alasan</n-text>
          <n-text>{{ dataRes.reason }}</n-text>
        </n-space>
        <n-space vertical :size="0">
          <n-text strong>Foto Bukti</n-text>
          <n-space v-if="dataRes.images?.length > 0" style="margin-top: 10px;">
            <n-image-group>
              <n-space>
                <n-image
                  v-for="image in dataRes.images"
                  :width="100"
                  :src="image.public_url"
                />
              </n-space>
            </n-image-group>
          </n-space>
          <n-text v-else>Tidak ada foto bukti</n-text>
        </n-space>
        <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
          <n-text>Apakah Anda akan menerima Reject Manifest <span style="font-weight: 500;">{{ props.data.code }}</span> ?</n-text>
        </div>
      </template>
      <n-space justify="center">
        <n-button
          :loading="props.isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="$emit('click:close', true)"
        >
          Batalkan
        </n-button>
        <n-button
          :disabled="isLoading"
          :loading="props.isBtnLoading"
          color="#EB5757"
          class="button-tnt"
          @click.prevent="handleConfirmClick"
        >
          Terima Reject
        </n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

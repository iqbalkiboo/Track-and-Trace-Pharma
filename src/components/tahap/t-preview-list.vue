<script setup lang="ts">
import { useMessage } from 'naive-ui'

const props = withDefaults(
  defineProps<{
    scanData: any
    detailData: any
    value: any
    params: any
  }>(),
  {
    scanData: () => ({}),
    detailData: () => ({}),
    value: () => ({}),
    params: () => ({}),
  }
)

const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const levelParams = ref<any>({})
const checkGroupValue = ref<any>([])

const modalListVoid = ref<any>({
  show: false,
  id: '',
  code: '',
  level: '',
})

const emit = defineEmits<{
  (e: "click:bulk"): void
  (e: "click:close"): void
  (e: 'click:getCheckingLevel', value: any): void
  (e: 'click:getDetailByCode', value: any): void
  (e: 'update:params', value: any): void
}>()

watch(levelParams, (value) => emit('update:params', value), { deep: true })

onMounted(() => {
  dataRes.value = props.value
  levelParams.value = props.params
})

onUpdated(async () => {
  dataRes.value = await props.value
  levelParams.value = await props.params
  isLoading.value = false
})

function handleCopyCode(index: number) {
  const copyText = document.getElementById("copyCode" + index) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Text tersalin")
}

function getCheckingLevel(level: any) {
  isLoading.value = true
  dataRes.value = {}
  emit('click:getCheckingLevel', level)
}

function updatePageSizeCheckingLevel(pageSize: number) {
  levelParams.value.page = 1
  levelParams.value.limit = pageSize
  getCheckingLevel(levelParams.value.level)
}

function handleShowListVoid(id: string, code: string) {
  modalListVoid.value.id = id
  modalListVoid.value.code = code
  modalListVoid.value.level = levelParams.value.level
  modalListVoid.value.show = true
}
function handleCloseListVoid() {
  modalListVoid.value.show = false
}

async function handleClickDetail(code: string) {
  emit('click:getDetailByCode', code)
}
</script>

<template>
  <n-space vertical :size="16">

    <n-checkbox-group
      v-model:value="checkGroupValue"
    >
      <n-scrollbar x-scrollable>
        <n-space vertical :size="10" :wrap="false">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <div
              v-for="parent, iParent in dataRes.list"
              :key="parent.id"
              class="card-tnt"
              style="margin-top: 0; border-radius: 12px"
              :style="parent?.status === 'void' ? 'background-color: #d030502e;' : parent?.status === 'pass' ? 'background-color: #18a0581f;' : 'background-color: #eee;'"
            >
              <n-space
                :wrap="false"
                justify="space-between"
                align="center"
                style="position: relative"
              >
                <n-space :wrap="false" :size="0">
                  <n-text style="margin-right: 10px;">
                    {{ levelParams.limit * (levelParams.page - 1) + (iParent + 1) }}
                  </n-text>
                  <n-text style="margin-left: 10px">
                    {{ "Kode Level " + levelParams?.level + ' : ' }}
                    <span
                      style="font-weight: 500; cursor: pointer"
                      @click.prevent="handleCopyCode(iParent)"
                    >{{ parent.code }}
                    </span>
                  </n-text>
                  <div v-show="false">
                    <input v-show="false" type="text" :value="parent.code" :id="'copyCode' + iParent">
                  </div>
                </n-space>
                <n-space
                  v-if="props.detailData.serialize ? props.detailData.serialize[0].level !== levelParams?.level : false"
                  align="center"
                  :size="14"
                  :wrap="false"
                >
                  <n-button
                    secondary
                    strong
                    type="primary"
                    class="button-tnt"
                    style="padding: 1rem 3rem; cursor: default;"
                    >{{ parent.serialize.total_pass }} Pass
                  </n-button>
                  <n-button
                    secondary
                    strong
                    type="error"
                    class="button-tnt"
                    style="padding: 1rem 3rem;"
                    @click.prevent="handleShowListVoid(parent.id, parent.code)"
                  >
                    {{ parent.serialize.total_check_void || 0 }} Void
                  </n-button>
                  <n-button
                    :loading="isBtnLoading"
                    text
                    type="primary"
                    @click.prevent="handleClickDetail(parent.code)"
                  >
                    Detail
                  </n-button>
                </n-space>
              </n-space>
            </div>
          </template>

          <n-space justify="center" style="margin-top: 14px">
            <n-pagination
              v-model:page="levelParams.page"
              v-model:page-size="levelParams.limit"
              :page-count="dataRes.total_page"
              :page-slot="7"
              :show-size-picker="dataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getCheckingLevel(levelParams.level)"
              @update:page-size="updatePageSizeCheckingLevel"
            />
          </n-space>
        </n-space>
      </n-scrollbar>
    </n-checkbox-group>
  </n-space>

  <t-list-void-modal
    :show="modalListVoid.show"
    :id="modalListVoid.id"
    :code="modalListVoid.code"
    :level="modalListVoid.level"
    @click:close="handleCloseListVoid"
  ></t-list-void-modal>

</template>

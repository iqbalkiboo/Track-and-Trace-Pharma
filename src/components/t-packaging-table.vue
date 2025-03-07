<script setup lang="ts">
import { useMessage } from 'naive-ui'
import constants from "@/helpers/constant"

const props = withDefaults(
  defineProps<{
    type: string
    loading?: boolean
    detailData?: any
    content: any
    levels?: any
    showScan?: boolean
    page: number
    limit: number
  }>(),
  {
    type: "Level 1",
    content: () => ({}),
    page: 1,
    showScan: false,
  }
)

const tMessage = useMessage()

const emit = defineEmits<{
  (e: "scanned", value: string): void
  (e: "click:void", value: string[]): void
  (e: "click:scan"): void
  (e: "click:close"): void
  (e: "update:showScan", value: boolean): void
  (e: "update:page", value: number): void
}>()

const route = useRoute()

const rows = computed(() => props.content?.list ?? [])
const citiesRef = ref<(string | number)[] | null>([])
const checkedRef = ref(false)

function handleCheckedChange(checked: boolean) {
  if (checked) {
    rows.value.map((item: any) => {
      if (item.status !== 'void') {
        citiesRef.value?.push(item.id)
      }
    })
    console.log(citiesRef.value)
  } else {
    citiesRef.value = []
  }
}

function handleUpdateValue(value: (string | number)[]) {
  citiesRef.value = value
}

function handleVoid() {
  emit(
    "click:void",
    (citiesRef.value ?? []).map((v) => `${v}`)
  )
}

function handleCopyCode(index: number) {
  const copyText = document.getElementById("copyCode" + index) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode tersalin")
}

function getBackground(item: any) {
  if (item.status == 'void') return "#f6dade"
  if (item.status == 'released') return "#d1efec"

  if (props.levels[0].level == route.query.level) {
    if (item.is_packed) return "#d1efec"
    if (item.status == "void") return "#f6dade"
    if (item.status == "print_void") return "#f6dade"
    if (!item.is_packed) return "#eee"
  } else {
    if (item.status == "void") return "#f6dade"
    if (item.status == "print_void") return "#f6dade"
    if (item.status == "on_packing") return "#fae6d8"
    if (item.status == "process_packing") return "#fae6d8"
    if (!item.serialize.is_full && item.status != "ready_to_pack") return "#fae6d8"
    if (item.serialize.is_full) return "#d1efec"
    return "#eee"
  }
}
</script>

<template>
  <t-loading v-if="loading"></t-loading>
  <template v-else>
    <n-card style="border-radius: 12px; margin-top: 2rem">
      <n-space vertical :size="16">
        <div style="display: flex; width: 100%; align-items: center">
          <n-space style="width: 250px; max-width: 100%">
            <n-p style="margin-bottom: 0">
              <n-checkbox
                label="Pilih Semua"
                v-model:checked="checkedRef"
                @update:checked="handleCheckedChange"
              ></n-checkbox>
            </n-p>
            <n-p style="margin-bottom: 0">
              <n-button
                type="error"
                class="button-tnt"
                :disabled="!citiesRef?.length"
                @click="handleVoid"
              >
                Void
              </n-button>
            </n-p>
          </n-space>
          <n-space align="center" justify="end" style="width: 100%">
            <slot name="filter"></slot>
          </n-space>
        </div>
        <n-checkbox-group
          v-model:value="citiesRef"
          @update:value="handleUpdateValue"
        >
          <n-space vertical :size="5">
            <n-card
              v-for="item, i in rows"
              :key="(item as any).id"
              style="border-radius: 10px;"
              :content-style="{
                borderRadius: '10px',
                backgroundColor: getBackground(item),
              }"
            >
              <n-space justify="space-between">
                <n-space :size="4" inline>
                  <n-text style="margin-right: 10px;">
                    {{ props.limit * (props.page - 1) + (i + 1) }}
                  </n-text>
                  <n-checkbox
                    v-if="props.detailData?.status?.global?.value === constants.productionStatus.readyToPack || props.detailData?.status?.global?.value === constants.productionStatus.processPacking && item.status !== 'void'"
                    :value="(item as any).id"
                  ></n-checkbox>
                  <n-text
                    @click.prevent="handleCopyCode(i)"
                  >
                    <span v-if="detailData.is_bundling && (item as any).serialize.level === 1" class="text-warning">
                      Produk {{ (item as any).reception.product.long_name }} - 
                    </span>
                    Kode Level {{ (item as any).serialize.level }} : 
                    <span style="font-weight: 500; cursor: pointer">
                      {{ (item as any).code }}
                    </span>
                  </n-text>
                  <div v-show="false">
                    <input v-show="false" type="text" :value="(item as any).code" :id="'copyCode' + i">
                  </div>
                </n-space>
                <n-space>
                  <template v-if="(item as any)?.is_packed || (item as any)?.status == 'void'">
                    <div
                      v-if="item.status == 'released'"
                      style="border-radius: 1rem; padding: 2px 10px; font-size: 13px; color: #ffffff;"
                      :style="'background-color: #18a058;'"
                    >
                      Released
                    </div>
                    <div
                      v-else-if="(item as any)?.status === 'void'"
                      style="border-radius: 1rem; padding: 2px 10px; font-size: 13px; color: #ffffff;"
                      :style="'background-color: #d03050;'"
                    >
                      void
                    </div>
                    <div
                      v-else-if="props.levels[props.levels?.length - 1].level !== (item as any).serialize.level"
                      style="border-radius: 1rem; padding: 2px 10px; font-size: 13px; color: #ffffff;"
                      :style="'background-color: #18a058;'"
                    >
                      Terpacking
                    </div>
                  </template>
                  <n-p
                    v-if="props.levels[0].level != $route.query.level"
                    style="font-size: 0.8rem"
                  >
                    {{ (item as any).serialize?.current }}/{{ (item as any).serialize?.maximum }}
                  </n-p>
                </n-space>
                <div
                  v-if="false"
                  :style="{
                    fontSize: '0.8rem',
                    color: '#0b8f9d',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    textAlign: 'right',
                    width: '150px',
                  }"
                  @click="(item as any).expanded = !(item as any).expanded"
                >
                  {{ (item as any).expanded ? "Tampilkan lebih sedikit" : "Detail" }}
                </div>
              </n-space>

              <n-collapse-transition :show="(item as any).expanded">
                <div style="padding-top: 1rem" v-if="(item as any).expanded">
                  <n-space justify="space-between">
                    <div style="font-size: 0.8rem">Lokasi Level 2:SK0001</div>
                    <div style="font-size: 0.8rem">Lokasi Level 3:SK0001</div>
                    <div></div>
                  </n-space>
                </div>
              </n-collapse-transition>
            </n-card>
          </n-space>
        </n-checkbox-group>
      </n-space>
    </n-card>
    <div class="table-footer" style="margin-top: 14px; display: flex; justify-content: center">
      <n-pagination
        :page="props.page"
        v-model:page-size="props.limit"
        :page-count="content.total_page ?? 1"
        :page-slot="5"
        @update:page="$emit('update:page', $event)"
      />
    </div>
  </template>
</template>

<style scoped>
.t-p-table {
  border-spacing: 0 8px !important;
}

.t-p-table tr td {
  background-color: #eee;
  padding: 1.3rem;
}

.t-p-table tr td:last-child {
  text-align: right;
}
</style>

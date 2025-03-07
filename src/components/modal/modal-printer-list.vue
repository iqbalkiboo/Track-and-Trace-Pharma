<script setup lang="ts">
import { PrintOutline } from "@vicons/ionicons5"
import { useMessage } from "naive-ui"
import TLoading from "@/components/t-loading.vue"

const props = withDefaults(
  defineProps<{
    show: boolean
    data: any
    isLoading: boolean
  }>(),
  { show: false, isLoading: false }
)

const params = ref({
  page: 1,
  limit: 10,
})
const tMessage = useMessage()

const emits = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close"): void
  (e: "click:select-printer"): void
}>()

const handleClickSelectPrinter = (key: any) => {
  localStorage.setItem("select-printer", key)
  emits("click:select-printer")
}
</script>

<template>
  <n-modal
    :show="props.show"
    :bordered="false"
    title="List Printer"
    preset="card"
    role="dialog"
    size="huge"
    style="width: 580px; --n-border-radius: 10px"
    header-style="padding: 28px 28px;"
    content-style="padding: 10px 28px 28px 28px;"
    @update:show="$emit('update:show', $event)"
  >
    <template v-if="isLoading">
      <t-loading />
    </template>
    <template v-else>
      <n-space
        vertical
        :size="24"
      >
        <n-space justify="center">
          <n-card
            v-for="(v, k) in data"
            :key="k"
            type="primary"
            content-style="padding: 15px 15px 15px 15px;"
            style="
              width: 10rem;
              border-radius: 10px;
              cursor: pointer;
              background-color: #0b8f9d;
              color: #ffffff;
            "
            @click.prevent="handleClickSelectPrinter(k as any)"
          >
            <n-space
              vertical
              justify="center"
              :align="'center'"
              style="text-align: center"
            >
              <n-icon size="60"><PrintOutline /></n-icon>
              <n-text style="color: #ffffff">Print {{ k + 1 }}</n-text>
            </n-space>
          </n-card>
        </n-space>
      </n-space>
    </template>
  </n-modal>
</template>

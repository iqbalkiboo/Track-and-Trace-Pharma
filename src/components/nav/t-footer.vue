<script setup lang="ts">
import { auth } from "@/models/auth"

defineExpose({ setFooterValue })

const authData = ref<any>()
const footerData = ref<any>({})

onMounted(() => {
  setFooterValue()
})

function setFooterValue() {
  authData.value = auth.getAuth()
  if (("xx-usertype-access" in authData.value)) {
    footerData.value.superholding_name = authData.value["xx-usertype-access"].superholding_name
    footerData.value.holding_name = authData.value["xx-usertype-access"].holding_name
    footerData.value.company_name = authData.value["xx-usertype-access"].company_name
  }
}
</script>

<template>
  <n-layout-footer
    bordered
    position="absolute"
    style="background-color: #0b8f9d; height: 34px; padding: 5px"
  >
    <n-space justify="end" :size="4">
      <n-text
        v-if="footerData?.superholding_name"
        style="font-size: 11px; color: #FFFFFF"
      >
        {{ footerData?.superholding_name }} (Superholding)
      </n-text>
      <n-text
        v-if="footerData?.holding_name"
        style="font-size: 11px; color: #FFFFFF"
      >
        - {{ footerData?.holding_name }} (Holding)
      </n-text>
      <n-text
        v-if="footerData?.company_name"
        style="font-size: 11px; color: #FFFFFF"
      >
        - {{ footerData?.company_name }} (Company)
      </n-text>
    </n-space>
  </n-layout-footer>
</template>
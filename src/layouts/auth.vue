<script setup lang="ts">
import { theme, themeOverrides } from "@/styles/config"
import { useBreakpoints } from "@/helpers/breakpoints"

import "@/styles/index.css"
import "@/styles/custom.scss"

const { type } = useBreakpoints()

// watch(idledFor, (idledForValue) => {
//   if (idle.value) {
//     auth.logout()
//     router.push({ name: "login" })
//   }
// })
</script>

<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-message-provider>
      <t-bar-menu v-if="type === 'desktop'" />
      <t-bar-small-menu v-if="type === 'tablet'" />
    </n-message-provider>
  </n-config-provider>
</template>

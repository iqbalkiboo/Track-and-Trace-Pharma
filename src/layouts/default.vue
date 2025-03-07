<script setup lang="ts">
import { theme, themeOverrides } from "@/styles/config"

import "@/styles/index.css"
import "@/styles/custom.scss"
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-layout style="min-height: 100vh">
        <n-layout-content>
          <router-view :key="$route.fullPath" />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

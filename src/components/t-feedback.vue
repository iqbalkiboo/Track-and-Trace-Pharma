<script setup lang="ts">
import type { Component } from "vue"
import { CheckmarkCircleOutline } from "@vicons/ionicons5"

withDefaults(
  defineProps<{
    show: boolean
    icon?: Component
    iconColor?: string
    hideIcon?: boolean
    title?: string
    subtitle?: string
    align?: any
    width?: number
  }>(),
  {
    show: false,
    icon: () => CheckmarkCircleOutline,
    iconColor: "#18a058",
    align: "center",
    width: 470,
  }
)

defineEmits<{
  (e: "update:show", value: boolean): void
}>()
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    @update:show="$emit('update:show', $event)"
  >
    <n-card
      style="--n-border-radius: 10px; max-width: 100%"
      :style="`width:${width}px;`"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical :align="align">
        <n-icon
          v-if="!hideIcon"
          :size="64"
          :color="iconColor"
          :component="icon"
        />
        <n-h3 v-if="title" style="text-align: center; margin-bottom: 0">
          {{ title }}
        </n-h3>
        <p
          v-if="subtitle"
          style="text-align: center; margin-top: 0; font-size: 14px"
        >
          {{ subtitle }}
        </p>
        <slot />
      </n-space>
    </n-card>
  </n-modal>
</template>

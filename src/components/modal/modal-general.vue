<script setup lang="ts">
  import type { Component } from 'vue'

  withDefaults(
    defineProps<{
      show: boolean
      icon?: Component
      iconColor?: string
      title?: string
      message?: string
      cancelButton?: string
      confirmButton?: string
      cancelColor?: string
      confirmColor?: string
    }>(),
    { show: false }
  )

  const emits = defineEmits<{
    (e: 'update:show', value: boolean): void
    (e: 'cancelClick'): void
    (e: 'confirmClick'): void
  }>()

  const cancelClick = () => {
    setTimeout(() => {
      emits('cancelClick')
    }, 100)
  }
  const confirmClick = () => {
    setTimeout(() => {
      emits('confirmClick')
    }, 100)
  }
</script>

<template>
  <n-modal :show="show" @update-show="$emit('update:show', $event)">
    <n-card
      style="width: 470px; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical align="center">
        <n-icon v-if="icon" :size="64" :color="iconColor" :component="icon" />
        <n-h3 v-if="title" style="text-align: center; margin-bottom: 0">{{
          title
        }}</n-h3>
        <p
          v-if="message"
          style="text-align: center; font-weight: 500; margin-top: 0"
        >
          {{ message }}
        </p>

        <n-space justify="center">
          <n-button
            v-if="cancelButton"
            :color="cancelColor"
            class="button-tnt"
            @click.prevent="cancelClick"
            >{{ cancelButton }}</n-button
          >
          <n-button
            v-if="confirmButton"
            :color="confirmColor"
            class="button-tnt"
            @click.prevent="confirmClick"
            >{{ confirmButton }}</n-button
          >
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>

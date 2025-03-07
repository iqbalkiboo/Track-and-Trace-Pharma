<script setup lang="ts">
import { useAuthStore } from "@/models/auth"

const authStore = useAuthStore()

onMounted(() => {
  authStore.resetTimeout()
  authStore.isTimeout()
  window.addEventListener('mousemove', authStore.resetTimeout)
  window.addEventListener('touchmove', authStore.resetTimeout)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', authStore.resetTimeout)
  window.removeEventListener('touchmove', authStore.resetTimeout)
})
</script>

<template>
    <router-view />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Epilogue:wght@300;400;600;700&&display=swap");

body {
    font-family: "Poppins", sans-serif;
    background-color: #fafafa;
}
</style>
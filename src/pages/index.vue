<route lang="yaml">
meta:
  title: Beranda
  requireAuth: true
  layout: auth
</route>

<script setup lang="ts">
const router = useRouter()
router.push('/dashboard')
</script>

<template>
  <router-view/>
</template>

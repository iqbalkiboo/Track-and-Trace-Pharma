<script setup lang="ts">
import { useBreakpoints } from "@/helpers/breakpoints"
const { type } = useBreakpoints()
const route = useRoute()

function isMenuActive(path: string) {
  return route.path.indexOf(path) == 0 ? "active" : ""
}
</script>

<template>
  <div class="wrappers-heading">
    <n-space
      :wrap="false"
      :size="0"
      align="center"
      style="background-color: white; overflow: auto"
      v-if="type === 'desktop'"
    >
      <router-link
        to="/lacak-do/batch"
        class="submenu-item"
        :class="isMenuActive('/lacak-do/batch')"
        ><span>By Batch</span></router-link
      >
      <router-link
        to="/lacak-do/serialisasi"
        class="submenu-item"
        :class="isMenuActive('/lacak-do/serialisasi')"
        ><span>By Serialisasi</span></router-link
      >
    </n-space>
  </div>
</template>

<style scoped>
.submenu-item {
  height: 48px;
  padding: 0.5rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  text-decoration: none;
}
.submenu-item span {
  color: #c9c9c9;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: block;
  white-space: nowrap;
}
.submenu-item span:hover,
.submenu-item.active span {
  color: black;
  background-color: #f3c615;
}
</style>

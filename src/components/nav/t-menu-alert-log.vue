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
        to="/alert-log/alert"
        class="submenu-item"
        :class="isMenuActive('/alert-log/alert')"
        ><span>Alert</span></router-link
      >
      <router-link
        to="/alert-log/log"
        class="submenu-item"
        :class="isMenuActive('/alert-log/log')"
        ><span>Log</span></router-link
      >
      <router-link
        to="/alert-log/user-log"
        class="submenu-item"
        :class="isMenuActive('/alert-log/user-log')"
        ><span>User Log</span></router-link
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

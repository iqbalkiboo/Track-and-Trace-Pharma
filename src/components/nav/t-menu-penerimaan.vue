<script setup lang="ts">
import { useBreakpoints } from "@/helpers/breakpoints"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
const { type } = useBreakpoints()
const route = useRoute()
const authData = auth.getAuth()

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
        v-if="$filters.checkPermission(constants.accessReceive.penerimaan + '.list', true)"
        to="/penerimaan/reception"
        class="submenu-item"
        :class="isMenuActive('/penerimaan/reception')"
        ><span>Penerimaan</span></router-link
      >
      <router-link
        v-if="$filters.checkPermission(constants.accessReceive.penerimaanReturn + '.list', true)"
        to="/penerimaan/return"
        class="submenu-item"
        :class="isMenuActive('/penerimaan/return')"
        ><span>Return</span></router-link
      >
      <router-link
        v-if="$filters.checkPermission(constants.accessReceive.penerimaanSerialisasiExternal + '.list', true)"
        to="/penerimaan/serialisasi-external"
        class="submenu-item"
        :class="isMenuActive('/penerimaan/serialisasi-external')"
        ><span>Serialisasi External</span></router-link
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

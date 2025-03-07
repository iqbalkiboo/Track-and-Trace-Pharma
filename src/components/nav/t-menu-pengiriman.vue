<script setup lang="ts">
import { CaretDown } from "@vicons/ionicons5"
import { useBreakpoints } from "@/helpers/breakpoints"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
const { type } = useBreakpoints()
const route = useRoute()
const authData = auth.getAuth()

const showAgregasi = ref(false)

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
        v-if="false"
        to="/pengiriman/agregasi"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/agregasi')"
        @mouseenter="showAgregasi = true"
        @mouseleave="showAgregasi = false"
        ><span
          >Agregasi
          <n-icon
            :component="CaretDown"
            style="vertical-align: middle"
          ></n-icon>
        </span>
        <t-sub-menu-pengiriman-agregasi
          v-if="showAgregasi"
          style="
            position: fixed;
            width: 100vw;
            z-index: 10;
            left: 0;
            right: 0;
            top: 128px;
          "
        />
      </router-link>

      <router-link
      v-if="$filters.checkPermission(constants.accessDelivery.pengirimanCabang + '.list', true)"
        to="/pengiriman/agregasi/crossdocking"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/agregasi/crossdocking')"
        ><span>Cabang/Plant</span></router-link
      >
      <router-link
      v-if="$filters.checkPermission(constants.accessDelivery.pengirimanCabang + '.list', true)"
        to="/pengiriman/agregasi/customer"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/agregasi/customer')"
        ><span>Customer</span></router-link
      >
      <router-link
      v-if="$filters.checkPermission(constants.accessDelivery.pengirimanAssignDriver + '.list', true)"
        to="/pengiriman/assign-driver"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/assign-driver')"
        ><span>Assign Driver</span></router-link
      >
      <router-link
      v-if="$filters.checkPermission(constants.accessDelivery.pengirimanAssignPorter + '.list', true)"
        to="/pengiriman/assign-porter"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/assign-porter')"
        ><span>Assign Porter</span></router-link
      >
      <router-link
        v-if="$filters.checkPermission(constants.accessDelivery.pengirimanLoadingDriver + '.list', true)"
        to="/pengiriman/loading-driver"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/loading-driver')"
        ><span>Loading Driver</span></router-link
      >
      <router-link
        v-if="false"
        to="/pengiriman/loading-porter"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/loading-porter')"
        ><span>Loading Porter</span></router-link
      >
      <router-link
      v-if="$filters.checkPermission(constants.accessDelivery.pengirimanMonitorDelivery + '.list', true)"
        to="/pengiriman/monitoring"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/monitoring')"
        ><span>Monitoring Delivery</span></router-link
      >
      <router-link
      v-if="$filters.checkPermission(constants.accessDelivery.pengirimanRequest3pl + '.list', true)"
        to="/pengiriman/request-3pl"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/request-3pl')"
        ><span>Request 3PL</span></router-link
      >
      <router-link
      v-if="$filters.checkPermission(constants.accessDelivery.pengirimanFakturKembali + '.list', true)"
        to="/pengiriman/faktur-kembali"
        class="submenu-item"
        :class="isMenuActive('/pengiriman/faktur-kembali')"
        ><span>Faktur Kembali</span></router-link
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

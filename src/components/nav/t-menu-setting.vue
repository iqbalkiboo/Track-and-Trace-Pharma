<script setup lang="ts">
import { useBreakpoints } from "@/helpers/breakpoints"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
const { type } = useBreakpoints()
const route = useRoute()
const authData = auth.getAuth()

const showMasterProdukMenu = ref(false)

function isMenuActive(path: string) {
  // return route.path === path ? "active" : ""
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
      v-if="$filters.checkPermission(constants.accessSettings.settingProduk + '.list', true)"
      to="/setting/master-produk"
      class="submenu-item"
      :class="isMenuActive('/setting/master-produk')"
      @mouseenter="showMasterProdukMenu = true"
      @mouseleave="showMasterProdukMenu = false"
    >
      <span> Produk </span>
    </router-link>
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingPrincipal + '.list', true)"
      to="/setting/master-principal"
      class="submenu-item"
      :class="isMenuActive('/setting/master-principal')"
    >
      <span> Principal </span>
    </router-link>
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingTipeProduk + '.list', true)"
      to="/setting/master-tipe-produk"
      class="submenu-item"
      :class="isMenuActive('/setting/master-tipe-produk')"
    >
      <span>Tipe Produk</span>
    </router-link>
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingUOM + '.list', true)"
      to="/setting/master-uom"
      class="submenu-item"
      :class="isMenuActive('/setting/master-uom')"
    >
      <span>UOM</span>
    </router-link>
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingMappingProduk + '.list', true)"
      to="/setting/master-mapping-produk"
      class="submenu-item"
      :class="isMenuActive('/setting/master-mapping-produk')"
    >
      <span>Mapping Produk</span>
    </router-link>
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingVendor + '.list', true)"
      to="/setting/master-vendor"
      class="submenu-item"
      :class="isMenuActive('/setting/master-vendor')"
    >
      <span>Vendor</span>
    </router-link>
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingWarehouse + '.list', true)"
      to="/setting/master-warehouse"
      class="submenu-item"
      :class="isMenuActive('/setting/master-warehouse')"
      ><span>Warehouse</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingKemasanKolektif + '.list', true)"
      to="/setting/kategori-kemasan"
      class="submenu-item"
      :class="isMenuActive('/setting/kategori-kemasan')"
      ><span>Kemasan Kolektif</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingUser + '.list', true)"
      to="/setting/master-user"
      class="submenu-item"
      :class="isMenuActive('/setting/master-user')"
      ><span>User</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingDriver + '.list', true)"
      to="/setting/master-driver"
      class="submenu-item"
      :class="isMenuActive('/setting/master-driver')"
      ><span>Driver</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingPorter + '.list', true)"
      to="/setting/master-porter"
      class="submenu-item"
      :class="isMenuActive('/setting/master-porter')"
      ><span>Porter</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingCustomer + '.list', true)"
      to="/setting/master-customer"
      class="submenu-item"
      :class="isMenuActive('/setting/master-customer')"
      ><span>Customer</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingKendaraan + '.list', true)"
      to="/setting/master-kendaraan"
      class="submenu-item"
      :class="isMenuActive('/setting/master-kendaraan')"
      ><span>Kendaraan</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.setting3pl + '.list', true)"
      to="/setting/master-threepl"
      class="submenu-item"
      :class="isMenuActive('/setting/master-threepl')"
      ><span>3PL</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingHakAkses + '.list', true)"
      to="/setting/hak-akses"
      class="submenu-item"
      :class="isMenuActive('/setting/hak-akses')"
      ><span>Hak Akses</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingCabangPlan + '.list', true)"
      to="/setting/master-perusahaan"
      class="submenu-item"
      :class="isMenuActive('/setting/master-perusahaan')"
      ><span>Cabang/Plant</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingPerusahaan + '.list', true)"
      to="/setting/master-company"
      class="submenu-item"
      :class="isMenuActive('/setting/master-company')"
      ><span>Perusahaan</span></router-link
    >
    <router-link
      v-if="$filters.checkPermission(constants.accessSettings.settingHolding + '.list', true)"
      to="/setting/master-holding"
      class="submenu-item"
      :class="isMenuActive('/setting/master-holding')"
      ><span>Holding</span></router-link
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
<script setup lang="ts">
import { useBreakpoints } from "@/helpers/breakpoints"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
const { type } = useBreakpoints()
const route = useRoute()
const authData = auth.getAuth()

function isMenuActive(path: string) {
  return route.path.indexOf(path) === 0 ? "active" : ""
}
</script>

<template>
  <div class="wrappers-heading">
    <n-space
      :wrap="false"
      :size="30"
      align="center"
      style="background-color: white; overflow: auto;"
      v-if="type === 'desktop'"
    >
      
      <router-link
        v-if="$filters.checkPermission(constants.accessProduksi.serialisasi + '.list', true)"
        to="/produksi/serialisasi"
        class="submenu-item"
        :class="isMenuActive('/produksi/serialisasi')"
        >
        <div>
          <span>Serialisasi</span>
        </div>
        
      </router-link>
      <router-link
        v-if="$filters.checkPermission(constants.accessProduksi.serialisasiBundling + '.List', true)"
        to="/produksi/bundling"
        class="submenu-item"
        :class="isMenuActive('/produksi/bundling')"
        >
        <div>
          <span>Serialisasi Bundling</span>
        </div>
        
      </router-link>
      <router-link
        v-if="$filters.checkPermission(constants.accessProduksi.pengemasan + '.list', true)"
        to="/produksi/pengemasan"
        class="submenu-item"
        :class="isMenuActive('/produksi/pengemasan')"
      >
        <div>
          <span>Pengemasan</span>
        </div>
      </router-link>
      <router-link
        v-if="$filters.checkPermission(constants.accessProduksi.inspeksiAkhir + '.list', true)"
        to="/produksi/pengecekan/tahap1"
        class="submenu-item"
        :class="isMenuActive('/produksi/pengecekan/tahap1')"
      >
        <div>
          <span>Inspeksi Akhir</span>
        </div>
      </router-link>
      <router-link
        v-if="$filters.checkPermission(constants.accessProduksi.rilisProduct + '.list', true)"
        to="/produksi/pengecekan/tahap2"
        class="submenu-item"
        :class="isMenuActive('/produksi/pengecekan/tahap2')"
      >
        <div>
          <span>Rilis Produk</span>
        </div>
      </router-link>
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

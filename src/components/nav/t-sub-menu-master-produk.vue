<script setup lang="ts">
  const route = useRoute()

  function isMenuActive(path: string) {
    return route.path.indexOf(path) == 0 ? 'active' : ''
  }
</script>

<template>
  <n-space :size="0" style="padding: 0.5rem; background-color: #f1f3f3">
    <!-- <router-link
      to="/setting/master-produk/packaging"
      class="menu-item"
      :class="isMenuActive('/setting/master-produk/packaging')"
      ><span>Packaging</span></router-link
    > -->
    <router-link
      to="/setting/master-produk/principal"
      class="menu-item"
      :class="isMenuActive('/setting/master-produk/principal')"
      ><span>Principal</span></router-link
    >
    <router-link
      to="/setting/master-produk/tipe-produk"
      class="menu-item"
      :class="isMenuActive('/setting/master-produk/tipe-produk')"
      ><span>Tipe Produk</span></router-link
    >
    <router-link
      to="/setting/master-produk/uom"
      class="menu-item"
      :class="isMenuActive('/setting/master-produk/uom')"
      ><span>UOM</span></router-link
    >
  </n-space>
</template>

<style scoped>
  .menu-item {
    color: #c9c9c9;
    font-weight: 600;
    padding: 0.25rem 1rem;
    border-radius: 0.5rem;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    text-decoration: none;
  }
  .menu-item:hover,
  .menu-item.active {
    color: black;
  }
</style>

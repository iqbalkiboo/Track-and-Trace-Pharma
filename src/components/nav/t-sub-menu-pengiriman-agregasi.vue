<script setup lang="ts">
const route = useRoute()

function isMenuActive(path: string) {
    return route.path.indexOf(path) == 0 ? "active" : ""
}
</script>

<template>
    <n-space :size="0" style="padding: 0.5rem; background-color: #f1f3f3">
        <router-link
            to="/pengiriman/agregasi/crossdocking"
            class="menu-item"
            :class="isMenuActive('/pengiriman/agregasi/crossdocking')"
            ><span>Crossdocking</span></router-link
        >
        <router-link
            to="/pengiriman/agregasi/customer"
            class="menu-item"
            :class="isMenuActive('/pengiriman/agregasi/customer')"
            ><span>Customer</span></router-link
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

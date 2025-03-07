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
                v-if="$filters.checkPermission(constants.accessStorage.penyimpananStok + '.list', true)"
                to="/penyimpanan/stok"
                class="submenu-item"
                :class="isMenuActive('/penyimpanan/stok')"
                ><span>Penyimpanan Stok</span></router-link
            >

            <router-link
                v-if="$filters.checkPermission(constants.accessStorage.penyimpananTransferOrder + '.list', true)"
                to="/penyimpanan/transfer"
                class="submenu-item"
                :class="isMenuActive('/penyimpanan/transfer')"
                ><span>Transfer Order</span></router-link
            >

            <router-link
                v-if="$filters.checkPermission(constants.accessStorage.penyimpananPenyesuaian + '.list', true)"
                to="/penyimpanan/penyesuaian"
                class="submenu-item"
                :class="isMenuActive('/penyimpanan/penyesuaian')"
                ><span>Penyesuaian (Adjust)</span></router-link
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


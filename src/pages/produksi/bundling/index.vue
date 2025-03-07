<script setup lang="ts">
import PkTurunan from "@/pages/produksi/bundling/pk-turunan/index.vue"
import PkBundling from "@/pages/produksi/bundling/pk-bundling/index.vue"
import constants from "@/helpers/constant"

const router = useRouter()
const selectedTab = ref("pk_turunan")

function handleTabChanged(val: string) {
  selectedTab.value = val
}

if (!filters.checkPermission(constants.accessProduksi.serialisasiBundling + ".list")) {
  router.push('/')
}
</script>

<template>
  <div class="body-tnt">
    <div class="display">
      <div>
        <n-h2 style="margin-bottom: 4px">Serialisasi Bundling</n-h2>
        <n-breadcrumb>
          <n-breadcrumb-item>Serialisasi Bundling</n-breadcrumb-item>
        </n-breadcrumb>
      </div>
      <div style="margin-right: 40px">
        <n-tabs
          class="card-tabs"
          type="bar"
          animated
          v-model:value="selectedTab"
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
          @update:value="handleTabChanged"
        >
          <n-tab-pane name="pk_turunan" tab="PK Turunan"></n-tab-pane>
          <n-tab-pane name="pk_bundling" tab="PK Bundling"></n-tab-pane>
        </n-tabs>
      </div>
    </div>
    <template v-if="selectedTab === 'pk_turunan'">
      <PkTurunan />
    </template>
    <template v-else>
      <PkBundling />
    </template>
  </div>
</template>
<style lang="scss">
.display {
  display: flex;
  justify-content: space-between;
}

.mtd-btn {
  background-color: #ffff;
}

.mtd-btn span:hover,
.mtd-btn.active input {
  background-color: #f3c615;
}

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
<script setup lang="ts">
import { CaretDown, CaretUp } from "@vicons/ionicons5"
import { auth } from "@/models/auth"
import constants from "@/helpers/constant"
import { onMounted } from "vue"
import { useMenuStore } from "@/models/menu"

defineProps<{
  isActive: boolean
}>()

const emits = defineEmits<{
  (e: "click:close"): void
}>()

const router = useRouter()
const route = useRoute()
const authData = auth.getAuth()
const profileData = auth.getProfileLocal()
const menu = useMenuStore()

onMounted(() => {
  if (authData.xxtype !== "5up3r4dm1n") {
    if (Object.keys(profileData).length > 0) {
      if (profileData.company?.kind === "distribution") {
        menuArr.value.splice(0, 1)
      }
    }
  }
})

const isLoading = ref(true)
const showMenu = ref(false)
const showProduksi = ref(true)
const accessProduksi = ref(true)
const accessStorage = ref(true)
const accessDelivery = ref(true)
const accessReceive = ref(true)
const accessTrack = ref(true)
const accessReport = ref(true)
const accessAlert = ref(true)
const accessSettings = ref(true)

function accessRoleMenu() {
  isLoading.value = true
  accessProduksi.value =
    filters.checkPermission(constants?.accessProduksi?.serialisasi + '.list', true) ||
    filters.checkPermission(constants?.accessProduksi?.serialisasiBundling + '.list', true) ||
    filters.checkPermission(constants?.accessProduksi?.pengemasan + '.list', true) ||
    filters.checkPermission(constants?.accessProduksi?.inspeksiAkhir + '.list', true) ||
    filters.checkPermission(constants?.accessProduksi?.rilisProduct + '.list', true)
  accessStorage.value =
    filters.checkPermission(constants.accessStorage.penyimpananStok + '.list', true) ||
    filters.checkPermission(constants.accessStorage.penyimpananTransferOrder + '.list', true) ||
    filters.checkPermission(constants.accessStorage.penyimpananPenyesuaian + '.list', true)
  accessDelivery.value =
    filters.checkPermission(constants.accessDelivery.pengirimanCabang + '.list', true) ||
    filters.checkPermission(constants.accessDelivery.pengirimanCustomer + '.list', true) ||
    filters.checkPermission(constants.accessDelivery.pengirimanAssignDriver + '.list', true) ||
    filters.checkPermission(constants.accessDelivery.pengirimanAssignPorter + '.list', true) ||
    filters.checkPermission(constants.accessDelivery.pengirimanLoadingDriver + '.list', true) ||
    filters.checkPermission(constants.accessDelivery.pengirimanMonitorDelivery + '.list', true) ||
    filters.checkPermission(constants.accessDelivery.pengirimanRequest3pl + '.list', true) ||
    filters.checkPermission(constants.accessDelivery.pengirimanFakturKembali + '.list', true)
  accessReceive.value =
    filters.checkPermission(constants.accessReceive.penerimaan + '.list', true) ||
    filters.checkPermission(constants.accessReceive.penerimaanReturn + '.list', true) ||
    filters.checkPermission(constants.accessReceive.penerimaanSerialisasiExternal + '.list', true)
  accessTrack.value =
    filters.checkPermission(constants.accessTrack.lacakByBatch + '.list', true) ||
    filters.checkPermission(constants.accessTrack.lacakBySerialisasi + '.list', true)
  accessReport.value =
    filters.checkPermission(constants.accessReport.reportMutasiBarang + '.list', true) ||
    filters.checkPermission(constants.accessReport.reportInventoryControlData + '.list', true)
  accessAlert.value =
    filters.checkPermission(constants.accessAlert.alertLog + '.list', true) ||
    filters.checkPermission(constants.accessAlert.alertLogLog + '.list', true)
  filters.checkPermission(constants.accessAlert.alertLogUserLog + '.list', true)
  accessSettings.value =
    filters.checkPermission(constants.accessSettings.settingProduk + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingPrincipal + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingTipeProduk + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingUOM + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingMappingProduk + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingVendor + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingWarehouse + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingKemasanKolektif + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingUser + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingDriver + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingPorter + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingCustomer + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingKendaraan + '.list', true) ||
    filters.checkPermission(constants.accessSettings.setting3pl + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingHakAkses + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingCabang + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingPerusahaan + '.list', true) ||
    filters.checkPermission(constants.accessSettings.settingHolding + '.list', true)
  
  menuItems.value = menuItems.value.filter((e: any) => {
    if (e.href === 'produksi') {
      const children = []
      if (filters.checkPermission(constants.accessProduksi.serialisasi + '.list', true))
        children.push(e.children[0])
      if (filters.checkPermission(constants.accessProduksi.serialisasiBundling + '.list', true))
        children.push(e.children[1])
      if (filters.checkPermission(constants.accessProduksi.pengemasan + '.list', true))
        children.push(e.children[2])
      if (filters.checkPermission(constants.accessProduksi.inspeksiAkhir + '.list', true))
        children.push(e.children[3])
      if (filters.checkPermission(constants.accessProduksi.rilisProduct + '.list', true))
        children.push(e.children[4])
      e.children = children
      return isSuperAdmin.value ? showProduksi.value : accessProduksi.value
    }
    if (e.href === 'penyimpanan') {
      const children = []
      if (filters.checkPermission(constants.accessStorage.penyimpananStok + '.list', true))
        children.push(e.children[0])
      if (filters.checkPermission(constants.accessStorage.penyimpananTransferOrder + '.list', true))
        children.push(e.children[1])
      if (filters.checkPermission(constants.accessStorage.penyimpananPenyesuaian + '.list', true))
        children.push(e.children[2])
      e.children = children
      return isSuperAdmin.value ? showProduksi.value : accessStorage.value
    }
    if (e.href === 'pengiriman') {
      const children = []
      if (filters.checkPermission(constants.accessDelivery.pengirimanCabang + '.list', true))
        children.push(e.children[0])
      if (filters.checkPermission(constants.accessDelivery.pengirimanCabang + '.list', true))
        children.push(e.children[1])
      if (filters.checkPermission(constants.accessDelivery.pengirimanAssignDriver + '.list', true))
        children.push(e.children[2])
      if (filters.checkPermission(constants.accessDelivery.pengirimanAssignPorter + '.list', true))
        children.push(e.children[3])
      if (filters.checkPermission(constants.accessDelivery.pengirimanLoadingDriver + '.list', true))
        children.push(e.children[4])
      if (filters.checkPermission(constants.accessDelivery.pengirimanMonitorDelivery + '.list', true))
        children.push(e.children[5])
      if (filters.checkPermission(constants.accessDelivery.pengirimanRequest3pl + '.list', true))
        children.push(e.children[6])
      if (filters.checkPermission(constants.accessDelivery.pengirimanFakturKembali + '.list', true))
        children.push(e.children[7])
      e.children = children
      return isSuperAdmin.value ? showProduksi.value : accessDelivery.value
    }
    if (e.href === 'penerimaan') {
      const children = []
      if (filters.checkPermission(constants.accessReceive.penerimaan + '.list', true))
        children.push(e.children[0])
      if (filters.checkPermission(constants.accessReceive.penerimaanReturn + '.list', true))
        children.push(e.children[1])
      if (filters.checkPermission(constants.accessReceive.penerimaanSerialisasiExternal + '.list', true))
        children.push(e.children[2])
      e.children = children
      return isSuperAdmin.value ? showProduksi.value : accessReceive.value
    }
    if (e.href === 'report') {
      const children = []
      if (filters.checkPermission(constants.accessReport.reportMutasiBarang + '.list', true))
        children.push(e.children[0])
      if (filters.checkPermission(constants.accessReport.reportInventoryControlData + '.list', true))
        children.push(e.children[1])
      e.children = children
      return isSuperAdmin.value ? showProduksi.value : accessReport.value
    }
    if (e.href === 'alert-log') return isSuperAdmin.value ? showProduksi.value : accessAlert.value
    if (e.href === 'setting') {
      const children = []
      if (filters.checkPermission(constants.accessSettings.settingProduk + '.list', true))
        children.push(e.children[0])
      if (filters.checkPermission(constants.accessSettings.settingPrincipal + '.list', true))
        children.push(e.children[1])
      if (filters.checkPermission(constants.accessSettings.settingTipeProduk + '.list', true))
        children.push(e.children[2])
      if (filters.checkPermission(constants.accessSettings.settingUOM + '.list', true))
        children.push(e.children[3])
      if (filters.checkPermission(constants.accessSettings.settingMappingProduk + '.list', true))
        children.push(e.children[4])
      if (filters.checkPermission(constants.accessSettings.settingVendor + '.list', true))
        children.push(e.children[5])
      if (filters.checkPermission(constants.accessSettings.settingWarehouse + '.list', true))
        children.push(e.children[6])
      if (filters.checkPermission(constants.accessSettings.settingKemasanKolektif + '.list', true))
        children.push(e.children[7])
      if (filters.checkPermission(constants.accessSettings.settingUser + '.list', true))
        children.push(e.children[8])
      if (filters.checkPermission(constants.accessSettings.settingDriver + '.list', true))
        children.push(e.children[9])
      if (filters.checkPermission(constants.accessSettings.settingPorter + '.list', true))
        children.push(e.children[10])
      if (filters.checkPermission(constants.accessSettings.settingCustomer + '.list', true))
        children.push(e.children[11])
      if (filters.checkPermission(constants.accessSettings.settingKendaraan + '.list', true))
        children.push(e.children[12])
      if (filters.checkPermission(constants.accessSettings.setting3pl + '.list', true))
        children.push(e.children[13])
      if (filters.checkPermission(constants.accessSettings.settingHakAkses + '.list', true))
        children.push(e.children[14])
      if (filters.checkPermission(constants.accessSettings.settingCabangPlan + '.list', true))
        children.push(e.children[15])
      if (filters.checkPermission(constants.accessSettings.settingPerusahaan + '.list', true))
        children.push(e.children[16])
      if (filters.checkPermission(constants.accessSettings.settingHolding + '.list', true))
        children.push(e.children[17])
      e.children = children
      return isSuperAdmin.value ? showProduksi.value : accessSettings.value
    }
    return true
  })
  
  isLoading.value = false

}

onMounted(async () => {
  await menu.getMenu()
  accessRoleMenu()
  if (authData.xxtype !== "5up3r4dm1n") {
    if (Object.keys(profileData).length > 0) {
      if (profileData.company?.kind === "distribution") {
        showProduksi.value = false
      }
      showMenu.value = true
    }
  }
})

function handleClickSidebarMenuItem(item: any) {
  item.active = !item.active
  if (item.href.charAt(0) === "/") {
    router.push(item.href)
    emits("click:close")
  }
}

function handleClickSubMenuItem(item: any) {
  item.active = !item.active
  if (item.href) {
    router.push(item.href)
    emits("click:close")
  }
}

function isMenuActive(path: string) {
  return route.path.split("/")[1] == path ? "menu-active" : ""
}

function isSubMenuActive(path: string) {
  return route.path == path ? "sub-menu-active" : ""
}

const menuArr = ref<any>([
  {
    text: "Produksi",
    href: "produksi",
    children: [
      {
        text: "Serialisasi",
        href: "/produksi/serialisasi",
        children: [],
      },
      {
        text: "Serialisasi Bundling",
        href: "/produksi/bundling",
        children: [],
      },
      {
        text: "Pengemasan",
        href: "/produksi/pengemasan",
        children: [],
      },
      {
        text: "Inspeksi Akhir",
        href: "/produksi/pengecekan/tahap1",
        children: [],
      },
      {
        text: "Rilis Produk",
        href: "/produksi/pengecekan/tahap2",
        children: [],
      },
    ],
  },
  {
    text: "Penyimpanan",
    href: "penyimpanan",
    children: [
      {
        text: "Penyimpanan Stok",
        href: "/penyimpanan/stok",
        children: [],
      },
      {
        text: "Transfer Order",
        href: "/penyimpanan/transfer",
        children: [],
      },
      {
        text: "Penyesuaian (Adjust)",
        href: "/penyimpanan/penyesuaian",
        children: [],
      },
    ],
  },
  {
    text: "Pengiriman",
    href: "pengiriman",
    children: [
      {
        text: "Cabang/Plant",
        href: "/pengiriman/agregasi/crossdocking",
        children: [],
      },
      {
        text: "Customer",
        href: "/pengiriman/agregasi/customer",
        children: [],
      },
      {
        text: "Assign Driver",
        href: "/pengiriman/assign-driver",
        children: [],
      },
      {
        text: "Assign Porter",
        href: "/pengiriman/assign-porter",
        children: [],
      },
      {
        text: "Loading Driver",
        href: "/pengiriman/loading-driver",
        children: [],
      },
      {
        text: "Monitoring Delivery",
        href: "/pengiriman/monitoring",
        children: [],
      },
      {
        text: "Request 3PL",
        href: "/pengiriman/request-3pl",
        children: [],
      },
      {
        text: "Faktur Kembali",
        href: "/pengiriman/faktur-kembali",
        children: [],
      },
    ],
  },
  {
    text: "Penerimaan",
    href: "penerimaan",
    children: [
      {
        text: "Penerimaan",
        href: "/penerimaan/reception",
        children: [],
      },
      {
        text: "Return",
        href: "/penerimaan/return",
        children: [],
      },
      {
        text: "Serialisasi Eksternal",
        href: "/penerimaan/serialisasi-external",
        children: [],
      },
    ],
  },
  {
    text: "Report",
    href: "report",
    children: [
      {
        text: "Mutasi Barang",
        href: "/report/mutasi-barang",
        children: [],
      },
      {
        text: "Inventory Control Data",
        href: "/report/inventory-control-data",
        children: [],
      },
    ],
  },
  {
    text: "Alert & Log",
    href: "alert-log",
    children: [
      {
        text: "Alet",
        href: "/alert-log/alert",
        children: [],
      },
      {
        text: "Log",
        href: "/alert-log/log",
        children: [],
      },
      {
        text: "User Log",
        href: "/alert-log/user-log",
        children: [],
      },
    ],
  },
  {
    text: "Setting",
    href: "setting",
    children: [
      {
        text: "Produk",
        href: "/setting/master-produk",
        children: [],
      },
      {
        text: "Principal",
        href: "/setting/master-produk/principal",
        children: [],
      },
      {
        text: "Tipe Produk",
        href: "/setting/master-produk/tipe-produk",
        children: [],
      },
      {
        text: "UOM",
        href: "/setting/master-produk/uom",
        children: [],
      },
      {
        text: "Mapping Produk",
        href: "/setting/master-mapping-produk",
        children: [],
      },
      {
        text: "Vendor",
        href: "/setting/master-vendor",
        children: [],
      },
      {
        text: "Warehouse",
        href: "/setting/master-warehouse",
        children: [],
      },
      {
        text: "Kemasan Kolektif",
        href: "/setting/kategori-kemasan",
        children: [],
      },
      {
        text: "User",
        href: "/setting/master-user",
        children: [],
      },
      {
        text: "Driver",
        href: "/setting/master-driver",
        children: [],
      },
      {
        text: "Porter",
        href: "/setting/master-porter",
        children: [],
      },
      {
        text: "Customer",
        href: "/setting/master-customer",
        children: [],
      },
      {
        text: "Kendaraan",
        href: "/setting/master-kendaraan",
        children: [],
      },
      {
        text: "3PL",
        href: "/setting/master-threepl",
        children: [],
      },
      {
        text: "Hak Akses",
        href: "/setting/hak-akses",
        children: [],
      },
      {
        text: "Perusahaan",
        href: "/setting/master-perusahaan",
        children: [],
      },
      {
        text: "Company",
        href: "/setting/master-company",
        children: [],
      },
      {
        text: "Holding",
        href: "/setting/master-holding",
        children: [],
      },
    ],
  },
])

function mapMenuItems(menuItems: any) {
  return menuItems.map((item: any) => ({
    text: item.text,
    href: item.href,
    active: false,
    children: item.children?.length > 0 ? mapMenuItems(item.children) : [],
  }))
}

const isSuperAdmin = computed(() => authData.xxtype === '5up3r4dm1n')

const menuItems = ref(mapMenuItems(menuArr.value))
</script>
<template>
  <div
    class="sidebar"
    :style="isActive ? 'left:0' : 'left:-200%'"
  >
    <ul>
      <li
        v-for="(item, i) in menuItems"
        :key="i"
      >
        <div
          class="text-header"
          @click="handleClickSidebarMenuItem(item)"
          :class="isMenuActive(item.href)"
        >
          <a>
            <span>{{ item.text }}</span>
          </a>
          <n-icon
            v-if="item.children.length && item.active"
            :component="CaretDown"
            :size="15"
            style="vertical-align: middle"
          ></n-icon>
          <n-icon
            v-if="item.children.length && !item.active"
            :component="CaretUp"
            :size="15"
            style="vertical-align: middle"
          ></n-icon>
        </div>
        <n-collapse-transition :show="item.active">
          <div
            v-for="(item1, i) in item.children"
            :key="i"
          >
            <div
              @click="handleClickSidebarMenuItem(item1)"
              class="sub-menu"
              :class="isSubMenuActive(item1.href)"
            >
              <span>{{ item1.text }}</span>
              <n-icon
                v-if="item1.children.length && item1.active"
                :component="CaretDown"
                :size="15"
                style="vertical-align: middle"
              ></n-icon>
              <n-icon
                v-if="item1.children.length && !item1.active"
                :component="CaretUp"
                :size="15"
                style="vertical-align: middle"
              ></n-icon>
            </div>
            <n-collapse-transition :show="item1.active">
              <div
                class="sub-menu secondary-sub-menu"
                v-for="(item2, i) in item1.children"
                :key="i"
                @click="handleClickSubMenuItem(item2)"
                :class="isSubMenuActive(item2.href)"
              >
                <span>{{ item2.text }}</span>
              </div>
            </n-collapse-transition>
          </div>
        </n-collapse-transition>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  background: #fff;
  height: calc(100vh - 100px);
  width: 500px;
  position: relative;
  left: 0px;
  top: 0px;
  max-width: 100%;
  z-index: 99;
  box-shadow: 1px 0 1px 0 rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  max-height: 100vh;
  overflow-x: auto;

  ul {
    display: flex;
    position: absolute;
    flex-direction: column;
    gap: 0.3rem;
    width: 100%;
    margin-top: 10px;

    li {
      .text-header {
        list-style: none;
        display: flex;
        height: 50px;
        margin-bottom: 0.5rem;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-weight: 500;
        padding: 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 0.5rem;
      }
    }
  }

  ul li .text-header:hover {
    background: #0b8f9d;
  }

  ul li .text-header:hover span,
  .text-header:hover i {
    color: #fff;
  }

  ul li .menu-active {
    span,
    i {
      color: #fff !important;
    }
  }

  ul li .text-header a {
    text-decoration: none;

    span,
    i {
      color: rgba(51, 54, 57, 0.8);
      font-size: 1rem;
    }
  }
}

.sub-menu {
  margin-left: 1rem;
  display: flex;
  height: 50px;
  margin-bottom: 0.2rem;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  padding: 0.2rem 0.4rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

  span,
  i {
    color: rgba(51, 54, 57, 0.8);
    font-weight: 500;
    font-size: 0.9rem;
  }
}

.sub-menu:hover {
  background: #f3c615;
}

.secondary-sub-menu {
  margin-left: 1.5rem;

  span,
  i {
    font-size: 0.8rem;
  }
}

.sidebar .menu-active {
  background: #0b8f9d;
}

.sub-menu-active {
  background: #f3c615;
}
</style>
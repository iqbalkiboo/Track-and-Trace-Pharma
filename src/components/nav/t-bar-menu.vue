<script setup lang="ts">
import type { Component } from "vue"
import { NIcon } from "naive-ui"
import { CaretDown, LogOutOutline, SettingsOutline, KeyOutline } from "@vicons/ionicons5"
import { auth } from "@/models/auth"
import constants from "@/helpers/constant"
import {generateToLink} from "@/helpers/menu"
import {
  subMenuProduction,
  subMenuPenyimpanan,
  subMenuPengiriman,
  subMenuPenerimaan,
  subMenuLacak,
  subMenuReport,
  subMenuAlertLog,
  subMenuSettings
} from "@/assets/dataSubMenu"
import { checkAPI } from "@/models"
import { useMenuStore } from "@/models/menu"


const route = useRoute()
const router = useRouter()
const menu = useMenuStore()
const authData = auth.getAuth()
const profileData = auth.getProfileLocal()

const isLoading = ref(true)
const showMenu = ref(false)
const showProduksi = ref(true)
const isMenu = ref("")
const accessProduksi = ref(true)
const accessStorage = ref(true)
const accessDelivery = ref(true)
const accessReceive = ref(true)
const accessTrack = ref(true)
const accessReport = ref(true)
const accessAlert = ref(true)
const accessSettings = ref(true)
const showSubProduksi = ref(false)
const showSubPenyimpanan = ref(false)
const showSubPenerimaan = ref(false)
const showSubLacak = ref(false)
const showSubReport = ref(false)
const showSubAlertLog = ref(false)
const showSubPengiriman = ref(false)
const showSubSetting = ref(false)
const modalSuperadminAccess = ref<any>({
  show: false,
})
const modalChangePassword = ref<any>({
  show: false,
  showCancelButton: true,
})
const footerRef = ref()

function isMenuActive(path: string) {
  isMenu.value = route.path
  return route.path.indexOf(path) == 0 ? "active" : ""
}

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const actionOptions = ref<any>([
  { label: "Logout", key: "logout", icon: renderIcon(LogOutOutline) },
])

onMounted(async () => {
  checkConnection()
  await menu.getMenu()
  accessRoleMenu()
  isLoading.value = true
  if (authData.xxtype === "5up3r4dm1n") {
    isLoading.value = false
    if (!("xx-usertype-access" in authData)) {
      modalSuperadminAccess.value.show = true
    } else {
      actionOptions.value.unshift({
        label: "Setting Akses",
        key: "setting-access",
        icon: renderIcon(SettingsOutline),
      })
    }
    showMenu.value = true
  } else {
    await auth.getProfile()
    const profile = auth.getProfileLocal()
    if (!profile.user.password_active) {
      modalChangePassword.value.show = true
      modalChangePassword.value.showCancelButton = false
    }
    actionOptions.value = [
      { label: "Ganti Password", key: "change-password", icon: renderIcon(KeyOutline) },
      ...actionOptions.value,
    ]
    isLoading.value = false
    if (Object.keys(profileData).length > 0) {
      if (profileData.company?.kind === "distribution") {
        showProduksi.value = false
      }
      showMenu.value = true
    }
  }
})

function handleCloseSuperadminAccess() {
  modalSuperadminAccess.value.show = false
  actionOptions.value = []
  actionOptions.value.push(
    {
      label: "Setting Akses",
      key: "setting-access",
      icon: renderIcon(SettingsOutline),
    },
    { label: "Logout", key: "logout", icon: renderIcon(LogOutOutline) }
  )
  footerRef.value.setFooterValue()
}

function handleCloseChangePassword() {
  modalChangePassword.value.show = false
  modalChangePassword.value.showCancelButton = true
}

async function handleSelectDropdown(key: string | number) {
  switch (key) {
    case "logout":
      await auth.logout()
      router.push({ name: "login" })
      break
    case "setting-access":
      modalSuperadminAccess.value.show = true
      break
    case "change-password":
      modalChangePassword.value.show = true
      break

    default:
      break
  }
}

function accessRoleMenu() {
  isLoading.value = true
  accessProduksi.value =
    filters.checkPermission(constants.accessProduksi.serialisasi + '.list', true) ||
    filters.checkPermission(constants.accessProduksi.serialisasiBundling + '.list', true) ||
    filters.checkPermission(constants.accessProduksi.pengemasan + '.list', true) ||
    filters.checkPermission(constants.accessProduksi.inspeksiAkhir + '.list', true) ||
    filters.checkPermission(constants.accessProduksi.rilisProduct + '.list', true)
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
  isLoading.value = false

}

const isOnline = ref(true)
const timeout = ref<any>()

const isForcedLogout = ref(false)

const checkConnection = async () => {
  const { connection, status } = await checkAPI()

  isOnline.value = connection === true

  if (!status) {
    isForcedLogout.value = true
    return
  }

  timeout.value = setTimeout(() => {
    checkConnection()
  }, 10000)
}

onUnmounted(() => {
  if (timeout.value)
    clearTimeout(timeout.value)
})

const BUILD_VERSION = import.meta.env.VITE_APP_BUILD || '0.1'
</script>

<template>
  <t-reconnecting v-model="isOnline"/>
  <t-modal-forced-logout v-model:show="isForcedLogout"/>

  <n-layout style="background-color: #fafafa; min-height: 100vh">
    <n-layout-header
      style="background-color: #0b8f9d; padding: 0 1rem; height: 64px"
    >
      <n-space
        align="center"
        justify="space-between"
        :size="10"
        style="height: 100%"
      >
        <n-space
          align="center"
          :wrap="false"
          :size="10"
          style="height: 100%"
        >
          <router-link to="/dashboard">
            <n-image
              preview-disabled
              src="/assets/images/logo.png"
              :height="22"
              style="margin-top: 5px"
            />
          </router-link>
          <n-space
            v-if="showMenu"
            :size="0"
            :wrap="false"
          >
            <template v-if="accessProduksi">
              <router-link
                :to="generateToLink('/produksi', authData.xxtype ,subMenuProduction)"
                class="menu-item"
                :class="isMenuActive('/produksi')"
                @mouseenter="showSubProduksi = false"
                @mouseleave="showSubProduksi = false"
              >
                <span>
                  Produksi
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>

                <t-menu-produksi
                  v-if="isMenu === '/produksi'"
                  style="
                    position: fixed;
                    width: 100vw;
                    z-index: 10;
                    height: max-content;
                    left: 0;
                    right: 0;
                    top: 64px;
                  "
                >
                </t-menu-produksi>
              </router-link>
            </template>
            <template v-if="accessStorage">
              <router-link
                :to="generateToLink('/penyimpanan', authData.xxtype, subMenuPenyimpanan)"
                class="menu-item"
                :class="isMenuActive('/penyimpanan')"
                @mouseenter="showSubPenyimpanan = true"
                @mouseleave="showSubPenyimpanan = false"
              >
                <span>
                  Penyimpanan
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>

                <t-menu-penyimpanan
                  v-if="isMenu === '/penyimpanan'"
                  style="
                    position: fixed;
                    width: 100vw;
                    z-index: 10;
                    left: 0;
                    height: max-content;
                    right: 0;
                    top: 64px;
                  "
                ></t-menu-penyimpanan>
              </router-link>
            </template>
            <template v-if="accessDelivery">
              <router-link
                :to="generateToLink('/pengiriman', authData.xxtype, subMenuPengiriman) "
                class="menu-item"
                :class="isMenuActive('/pengiriman')"
                @mouseenter="showSubPengiriman = true"
                @mouseleave="showSubPengiriman = false"
              >
                <span>
                  Pengiriman
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>

                <t-menu-pengiriman
                  v-if="isMenu === '/pengiriman'"
                  style="
                    position: fixed;
                    width: 100vw;
                    z-index: 10;
                    left: 0;
                    height: max-content;
                    right: 0;
                    top: 64px;
                  "
                />
              </router-link>
            </template>
            <template v-if="accessReceive">
              <router-link
                :to="generateToLink('/penerimaan', authData.xxtype, subMenuPenerimaan) "
                class="menu-item"
                :class="isMenuActive('/penerimaan')"
                @mouseenter="showSubPenerimaan = false"
                @mouseleave="showSubPenerimaan = false"
              >
                <span>
                  Penerimaan
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>
                <t-menu-penerimaan
                  v-if="isMenu === '/penerimaan'"
                  style="
                    position: fixed;
                    height: max-content;
                    width: 100vw;
                    z-index: 10;
                    left: 0;
                    right: 0;
                    top: 64px;
                  "
                />
              </router-link>
            </template>
            <template v-if="accessTrack">
              <router-link
                :to="generateToLink('/lacak-do', authData.xxtype, subMenuLacak) "
                class="menu-item"
                :class="isMenuActive('/lacak-do')"
                @mouseenter="showSubLacak = false"
                @mouseleave="showSubLacak = false"
              >
                <span>
                  Lacak
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>
                <t-menu-lacak
                  v-if="isMenu === '/lacak-do'"
                  style="
                    position: fixed;
                    height: max-content;
                    width: 100vw;
                    z-index: 10;
                    left: 0;
                    right: 0;
                    top: 64px;
                  "
                />
              </router-link>
            </template>
            <template v-if="accessReport">
              <router-link
                :to="generateToLink('/report', authData.xxtype, subMenuReport)  "
                class="menu-item"
                :class="isMenuActive('/report')"
                @mouseenter="showSubReport = false"
                @mouseleave="showSubReport = false"
              >
                <span>
                  Report
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>
                <t-menu-report
                  v-if="isMenu === '/report'"
                  style="
                    position: fixed;
                    height: max-content;
                    width: 100vw;
                    z-index: 10;
                    left: 0;
                    right: 0;
                    top: 64px;
                  "
                />
              </router-link>
            </template>
            <template v-if="accessAlert">
              <router-link
                :to="generateToLink('/alert-log', authData.xxtype, subMenuAlertLog)  "
                class="menu-item"
                :class="isMenuActive('/alert-log')"
                @mouseenter="showSubAlertLog = false"
                @mouseleave="showSubAlertLog = false"
              >
                <span>
                  Alert & Log
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>
                <t-menu-alert-log
                  v-if="isMenu === '/alert-log'"
                  style="
                    position: fixed;
                    height: max-content;
                    width: 100vw;
                    z-index: 10;
                    left: 0;
                    right: 0;
                    top: 64px;
                  "
                />
              </router-link>
            </template>
            <template v-if="accessSettings">
              <router-link
                :to="generateToLink('/setting', authData.xxtype, subMenuSettings) "
                class="menu-item"
                :class="isMenuActive('/setting')"
                @mouseenter="showSubSetting = false"
                @mouseleave="showSubSetting = false"
              >
                <span>
                  Setting
                  <n-icon
                    :component="CaretDown"
                    style="vertical-align: middle"
                  ></n-icon>
                </span>

                <t-menu-setting
                  v-if="isMenu === '/setting'"
                  style="
                    position: fixed;
                    width: 100vw;
                    z-index: 10;
                    height: max-content;
                    left: 0;
                    right: 0;
                    top: 64px;
                  "
                >
                </t-menu-setting>
              </router-link>
            </template>
          </n-space>
          <!-- submenu area -->
        </n-space>
        <n-space align="center">
          <p class="text-white text-[0.68rem] mr-2">Build Version: {{ BUILD_VERSION }}</p>
          <n-dropdown
            placement="bottom-end"
            :show-arrow="true"
            :options="actionOptions"
            @select="handleSelectDropdown"
          >
            <n-space
              align="center"
              style="cursor: pointer"
            >
              <n-space
                vertical
                :size="0"
                align="end"
              >
                <n-text
                  strong
                  style="font-size: 12px; color: white"
                >{{
                    authData.xxtype == "ju5tU53r"
                      ? authData.users.name
                      : authData.user.name
                  }}</n-text
                >
                <n-text
                  style="
                    font-size: 11px;
                    color: white;
                    margin-top: 0px;
                    display: block;
                  "
                >{{
                    authData.xxtype == "ju5tU53r"
                      ? authData.users.email
                      : authData.user.email
                  }}</n-text
                >
                <n-text
                  v-if="
                    authData.xxtype == 'ju5tU53r' &&
                    authData.users.user_type.kind == 'company'
                  "
                  style="
                    font-size: 10px;
                    color: white;
                    margin-top: 0px;
                    display: block;
                  "
                  >{{ profileData?.company?.name }}</n-text
                >
              </n-space>
              <n-avatar style="display: block"> A </n-avatar>
            </n-space>
          </n-dropdown>
        </n-space>
      </n-space>
    </n-layout-header>

    <n-layout-content
      style="background-color: #fafafa; height: calc(100vh - 100px)"
    >
      <router-view :key="$route.fullPath" />
    </n-layout-content>
  </n-layout>

  <t-footer ref="footerRef"></t-footer>

  <t-superadmin-access-modal
    :show="modalSuperadminAccess.show"
    @click:close="handleCloseSuperadminAccess"
  />

  <t-change-password-modal
    :show="modalChangePassword.show"
    :show-cancel-button="modalChangePassword.showCancelButton"
    @click:close="handleCloseChangePassword"
  />
</template>

<style scoped>
.menu-item {
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  margin: 0 0.1rem;
  height: 40px;
  transform: translateY(10px);
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  display: block;
  text-decoration: none;
  position: relative;
}

.menu-item span {
  white-space: nowrap;
}

.menu-item:hover,
.menu-item.active {
  color: black;
  background-color: white;
}

.menu-item:hover::before,
.menu-item.active::before {
  border-bottom-right-radius: 0.75rem;
  left: -0.75rem;
}

.menu-item:hover::after,
.menu-item.active::after {
  border-bottom-left-radius: 0.75rem;
  right: -0.75rem;
}

.menu-item:hover::before,
.menu-item:hover::after,
.menu-item.active::before,
.menu-item.active::after {
  content: "";
  position: absolute;
  background-color: transparent;
  bottom: 3px;
  height: 1.5rem;
  width: 0.75rem;
  box-shadow: 0 0.75rem 0px 0 white;
}
</style>

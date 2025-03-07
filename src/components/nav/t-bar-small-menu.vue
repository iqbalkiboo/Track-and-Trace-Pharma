<script setup lang="ts">
import { auth } from "@/models/auth"
import {LogOutOutline, SettingsOutline} from "@vicons/ionicons5"
import { checkAPI } from "@/models"
import type {Component} from "vue"
import {NIcon} from "naive-ui"
import constants from "@/helpers/constant"

const router = useRouter()
const authData = auth.getAuth()
const profileData = auth.getProfileLocal()

const isActive = ref(false)

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

const isLoading = ref(true)
const showMenu = ref(false)
const showProduksi = ref(true)
const modalSuperadminAccess = ref<any>({
  show: false,
})

onMounted(() => {
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

    default:
      break
  }
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
onMounted( () => {
  checkConnection()
})

onUnmounted(() => {
  if (timeout.value)
    clearTimeout(timeout.value)
})

function handleCloseSidebar() {
  isActive.value = false
}
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
        style="height: 100%"
      >
        <div
          class="hamburger-lines"
          :class="isActive && 'active'"
          @click="isActive = !isActive"
        >
          <span class="line line1"></span>
          <span class="line line2"></span>
          <span class="line line3"></span>
        </div>

        <n-space align="center">
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
                <n-text style="font-size: 11px; color: white; margin-top: 0px; display: block;">{{
                  authData.xxtype == "ju5tU53r"
                    ? authData.users.email
                    : authData.user.email
                }}</n-text>
                <n-text
                  v-if="authData.xxtype == 'ju5tU53r' && authData.users.user_type.kind == 'company'"
                  style="font-size: 10px; color: white; margin-top: 0px; display: block;">{{
                  profileData.company.name
                }}</n-text>
              </n-space>
              <n-avatar style="display: block"> A </n-avatar>
            </n-space>
          </n-dropdown>
        </n-space>
      </n-space>
      <t-sidebar-menu
        :isActive="isActive"
        @click:close="handleCloseSidebar"
      />
    </n-layout-header>
    <n-layout-content
      style="background-color: #fafafa; height: calc(100vh - 100px)"
    >
      <router-view :key="$route.fullPath" />
    </n-layout-content>
  </n-layout>
  <t-superadmin-access-modal
    :show="modalSuperadminAccess.show"
    @click:close="handleCloseSuperadminAccess"
  />
</template>
<style lang="scss" scoped>
.hamburger-lines {
  display: block;
  height: 26px;
  width: 32px;
  position: absolute;
  top: 17px;
  left: 20px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  .line {
    display: block;
    height: 4px;
    width: 100%;
    border-radius: 10px;
    background: #fff;
  }
  .line1 {
    transform-origin: 0% 0%;
    transition: transform 0.4s ease-in-out;
  }
  .line2 {
    transition: transform 0.2s ease-in-out;
  }
  .line3 {
    transform-origin: 0% 100%;
    transition: transform 0.4s ease-in-out;
  }
}
.active {
  .line1 {
    transform: rotate(45deg);
  }
  .line2 {
    transform: scaleY(0);
  }
  .line3 {
    transform: rotate(-45deg);
  }
}
</style>

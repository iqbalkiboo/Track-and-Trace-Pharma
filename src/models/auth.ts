import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import { defineStore } from "pinia"

api.interceptors.request.use(interceptors.noAuth)

const apiAuth = api
apiAuth.interceptors.request.use(interceptors.auth)

export const MAX_TIMEOUT_MINUTES = 120

const getLastActivity = () => {
  const lastActivity = localStorage.getItem('last-activity')
  return lastActivity ? parseFloat(lastActivity) : null
}

export const useAuthStore = defineStore("auth", {
  state: (): {
    afkTimeout?: ReturnType<typeof setTimeout>,
    lastActivity: ReturnType<typeof getLastActivity>
  } => ({
    afkTimeout: undefined,
    lastActivity: getLastActivity()
  }),
  actions: {
    resetTimeout() {
      if (this.afkTimeout) clearTimeout(this.afkTimeout)
      this.afkTimeout = setTimeout(() => {
        this.isTimeout(true)
      }, MAX_TIMEOUT_MINUTES * 60 * 1000)

      const lastActivity = new Date().getTime()
      this.lastActivity = lastActivity
      localStorage.setItem('last-activity', lastActivity.toString())
    },
    async isTimeout(forceLogout = false) {
      if (Object.keys(auth.getAuth()).length === 0)
        return

      if (this.lastActivity) {
        const expiredTime = new Date(this.lastActivity)
        expiredTime.setMinutes(expiredTime.getMinutes() + MAX_TIMEOUT_MINUTES)
        if (forceLogout || expiredTime.getTime() < new Date().getTime()) {
          await auth.logout()
          window.location.reload()
        }
      }
    },
  }
})


export const auth = {
  async login(params: any) {
    const res = await api.post("/user/v1/login", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    const data = res.data
    if (params.get('confirmLogin')) {
      this.setAuth(data.data)
      this.setLoginType("user")
    }
    return data
  },
  async loginSuperadmin(params: any) {
    const res = await api.post("/superadmin/v1/login", params)
    const data = res.data
    this.setAuth(data.data)
    this.setLoginType("superadmin")
    return data
  },
  setLoginType(type: string) {
    if (type === "user") {
      localStorage.setItem("xx-type", "ju5tU53r")
      this.getPermissionUser()
      this.getPermissionMenuAccess()
      this.getProfile()
    } else {
      localStorage.setItem("xx-type", "5up3r4dm1n")
    }
  },
  setAuth(data: any) {
    localStorage.setItem("xx-auth-tnt", JSON.stringify(data))
  },
  getAuth() {
    const auth = localStorage.getItem("xx-auth-tnt")
    const type = localStorage.getItem("xx-type")
    let data: Record<string, any>
    if (auth?.length && type?.length) {
      data = JSON.parse(auth)
      data.xxtype = type
    } else {
      data = {}
    }
    return data
  },
  async getPermissionUser() {
    const res = await apiAuth.get(`/user/v1/permission/get-permission`)
    const data = res.data.data
    localStorage.setItem("xx-permission-tnt", JSON.stringify(data))
    this.getPermissionMenu()
  },
  getPermissionMenu() {
    const permission = localStorage.getItem("xx-permission-tnt")
    let data: Record<string, any>
    if (permission?.length) {
      data = JSON.parse(permission)
    } else {
      data = {}
    }
    return data
  },
  getPermissionMenuAccess() {
    const permission = localStorage.getItem("authPermission")
    return permission ? JSON.parse(permission) : []
  },

  setSuperadminAccess(data: any) {
    let authData = this.getAuth()
    authData["xx-usertype-access"] = data
    localStorage.setItem("xx-auth-tnt", JSON.stringify(authData))
  },
  async getProfile() {
    const authData = this.getAuth()
    const params = {
      company_id: authData?.users?.user_type?.id,
    }
    const res = await apiAuth.get(`/user/v1/profile`, { params })
    const data = res.data.data
    localStorage.setItem("xx-profile-tnt", JSON.stringify(data))
  },
  getProfileLocal() {
    const profile = localStorage.getItem("xx-profile-tnt")
    let data: Record<string, any>
    if (profile?.length) {
      data = JSON.parse(profile)
    } else {
      data = {}
    }
    return data
  },
  async changePassword(payload: {
    old_password: string
    new_password: string
    confirm_password: string
  }) {
    const res = await apiAuth.put(`/user/v1/update-password`, payload)
    return res.data?.message === 'success'
  },
  async logout() {
    const authData = this.getAuth()
    let company_id = ''
    if (authData.xxtype === "5up3r4dm1n") {
      company_id = authData["xx-usertype-access"].company_id
    }
    await api.post('/user/v1/logout?company_id=' + company_id).then(() => {
      localStorage.clear()
    })
  },
  forceLogout() {
    localStorage.clear()
  }
}

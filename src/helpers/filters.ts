import { auth } from "@/models/auth"
import { useMenuStore } from "@/models/menu"

declare module "vue" {
  interface ComponentCustomProperties {
    $filters: typeof filters
  }
}

const authData = auth.getAuth()
const permissionMenu = auth.getPermissionMenu()

const allowedArr = ["superholding", "holding", "company"]

const filters = {
  toNumber(value: any) {
    if (Number.isNaN(parseFloat(value))) {
      return 0
    } else {
      return parseFloat(parseFloat(value).toFixed(4)).toLocaleString("id-ID", {
        useGrouping: true,
      })
    }
  },
  toOldNumber(value: any) {
    const formatter = new Intl.NumberFormat("id", {
      minimumFractionDigits: 0,
    })

    if (Number.isNaN(parseInt(value))) {
      return 0
    } else {
      return formatter.format(parseInt(value))
    }
  },
  toRupiah(value: any) {
    const formatter = new Intl.NumberFormat("id", {
      minimumFractionDigits: 0,
    })

    if (Number.isNaN(parseInt(value))) {
      return `Rp0`
    } else {
      return `Rp${formatter.format(parseInt(value))}`
    }
  },
  toStatus(value: string) {
    if (value === null || value === undefined || value === "") {
      return "-"
    } else {
      let status = value.split("_").join(" ")
      return status.charAt(0).toUpperCase() + status.slice(1)
    }
  },
  isEmpty(value: any) {
    if (value === null || value === undefined || value === "") {
      return "-"
    } else {
      return value
    }
  },
  isGranted(value: string) {
    if (authData.xxtype === "ju5tU53r") {
      return permissionMenu.includes(value)
    } else {
      return true
    }
  },

  checkPermission(value: string, withMenu = false) {
    if (withMenu) {
      const permissionName = value.split('.')[0]
      const menu = useMenuStore()
      const menuPermission = menu.menu.includes(permissionName)
      if (!menuPermission)
        return false
    }
    
    if (authData.xxtype === "ju5tU53r") {
      const permission = localStorage.getItem("authPermission")
      const permissions = permission ? JSON.parse(permission.toLowerCase()) : []
      return permissions.includes(value.toLowerCase())
    } else {
      return true
    }
  },

  async isAllowedIn(value: string) {
    await authData.xxtype
    if (authData.xxtype === "ju5tU53r") {
      return allowedArr.includes(value)
    } else {
      return true
    }
  },
  setAddress(value: any) {
    return [
      value?.detail,
      value?.urban_village?.name,
      value?.sub_district?.name,
      value?.district?.name,
      value?.province?.name,
      value?.urban_village?.zipcode,
    ]
      .filter(Boolean)
      .join(", ")
  },
}

export default filters

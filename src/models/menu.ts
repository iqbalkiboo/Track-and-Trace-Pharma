import { api } from "@/api"
import interceptors from "@/api/interceptors"
import { defineStore } from "pinia"

api.interceptors.request.use(interceptors.noAuth)
api.interceptors.request.use(interceptors.auth)

export const useMenuStore = defineStore("menu", {
  state: (): {
    menu: string[]
  } => ({
    menu: [],
  }),
  actions: {
    async getMenu() {
      try {
        const res = await api.get("/user/v1/config/menu")
        this.menu = res.data.data.value.map((e: any) => e.url)
        return this.menu
      }catch (e) {
        console.error('error get menu', e)
      }
    },
  }
})
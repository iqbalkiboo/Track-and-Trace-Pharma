import axios from "axios"
import type { AxiosInstance } from "axios"
import { useAuthStore, auth } from "@/models/auth"

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

const timeoutRequestData: any = {}

const resetTimeoutRequest = (name: string, success = false) => {
  if (name === '' || name === '/user/v1/status')
    return
  
  const authStore = useAuthStore()
  if (success) {
    if (timeoutRequestData[name]) {
      clearInterval(timeoutRequestData[name])
      delete timeoutRequestData[name]
    }
  } else {
    if (!timeoutRequestData[name]) {
      timeoutRequestData[name] = setInterval(() => {
        authStore.resetTimeout()
      }, 5 * 1000 * 60)
    }
  }
}

api.interceptors.request.use(
  (config) => {
    resetTimeoutRequest(config.url || '')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    resetTimeoutRequest(response.config?.url || '', true)
    return response
  },
  async (error) => {
    if (error?.response && error?.response.status === 401) {
      await auth.logout()
      window.location.reload()
      return Promise.reject(error)
    }

    resetTimeoutRequest(error.config?.url || '', true)
    return Promise.reject(error)
  }
)


export const apiPrinter: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_PRINTER_URL || "http://localhost:6001/v1",
  headers: {
    "x-kong-jwt-claim-superadmin_id" : "000000000000000000000000",
  }
})
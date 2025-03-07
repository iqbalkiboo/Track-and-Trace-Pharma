import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"
import getHoldingId from "@/helpers/getHoldingId"
import { useAuthStore } from "@/models/auth"

api.interceptors.request.use(interceptors.auth)
const authStore = useAuthStore()

export const checkingModel = {
  async getChecking(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list", {
      params,
    })
    return res.data
  },
  async getDetailChecking(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/detail/${id}`, {
      params,
    })
    return res.data
  },
  async getCheckingLevel(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list/serialize", {
      params,
    })
    return res.data
  },
  async getDetailCheckingProduct(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/product/${id}`, {
      params,
    })
    return res.data
  },
  async getCheckingItems(id: any, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/items/${id}`, {
      params,
    })
    return res.data
  },
  async getDetailByCode(code: string, reception_id: any, level: number) {
    const company_id: string = getCompanyId
    const res = await api.get(`/penerimaan/v1/detail-by-code/${code}`, {
      params: { reception_id, level, company_id },
    })
    return res.data
  },
  async getVoidItems(id: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/void-items/${id}`, {
      params,
    })
    return res.data
  },
  async getBonList(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/list`, {
      params,
    })
    return res.data
  },
  async passChecking(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/pass`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async voidChecking(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/packing/void`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async movetoChecking(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/move`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async receptionChecking(id: string, params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(
      `/penerimaan/v1/serialize/add-warehouse/${id}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          company_id: getCompanyId,
        },
        onUploadProgress: () => {
          authStore.resetTimeout()
        },
      }
    )
    return res.data
  },
  async rejectChecking(id: string, params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/penerimaan/v1/reject/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async pendingChecking(id: string, params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/penerimaan/v1/pending/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async receptionPKChecking(id: string, params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/penerimaan/v1/add-warehouse/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async releaseChecking(id: string, params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/penerimaan/v1/release/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async downloadChecking(id: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/export/${id}`, {
      params,
      responseType: "blob"
    })
    return res.data
  },
}
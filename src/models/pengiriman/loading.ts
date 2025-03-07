import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const loadingModel = {
  async getManifest(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/shipping/v1/manifest/list", {
      params,
    })
    return res.data
  },
  async getDetailManifest(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/shipping/v1/manifest/detail/${id}`, { params })
    return res.data
  },
  async getManifestPacking(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/shipping/v1/manifest-packing/list", {
      params,
    })
    return res.data
  },
  async getManifestLog(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/shipping/v1/manifest-log/list", {
      params,
    })
    return res.data
  },
  async getPrintLoading(id: any, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/shipping/v1/manifest/print/loading/${id}`, {
      params,
    })
    return res.data
  },
  async detailReject(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/reject/v1/manifest-reject/detail`, params, {
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async rejectAccept(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/reject/v1/manifest-reject/accept`, params, {
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
}
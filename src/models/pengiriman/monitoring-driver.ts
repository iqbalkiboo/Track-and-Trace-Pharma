import { api } from "@/api/index"
import interceptors from "@/api/interceptors"

api.interceptors.request.use(interceptors.auth)

export const monitoringDriverModel = {
  async getManifestLog(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/manifest-log/v1/list", {
      params,
    })
    return res.data
  },
  async getMonitoringDriver(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/shipping/v1/monitoring-delivery/list", {
      params,
    })
    return res.data
  },
  async getDetailMonitoringDriver(id: any) {
    const params = { company_id: getCompanyId }
    const res = await api.get(`/shipping/v1/monitoring-delivery/detail/${id}`, {
      params,
    })
    return res.data
  },
  async getManifest(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/manifest/v1/list", {
      params,
    })
    return res.data
  },
  async getManifestPacking(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/manifest-packings/v1/list", {
      params,
    })
    return res.data
  },
  async getManifestSerialization(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/packing-serializations/v1/list", {
      params,
    })
    return res.data
  },
}

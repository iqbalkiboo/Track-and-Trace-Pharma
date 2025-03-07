import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const alertModel = {
  async getAlert(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list", {
      params,
    })
    return res.data
  },
  async getAlertResponseApi(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/api-partial/v1/api-log/list", {
      params,
    })
    return res.data
  },
  async getAlertTracker(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/log/v1/vehicle/list", {
      params,
    })
    return res.data
  },
}

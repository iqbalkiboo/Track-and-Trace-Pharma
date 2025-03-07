import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const assignDriverModel = {
  async getmanifest(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("shipping/v1/manifest/list", {
      params,
    })
    return res.data
  },
  async getDetailManifest(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`shipping/v1/manifest/detail/${id}`, { params })
    return res.data
  },
  async deleteDriver(params: any) {
    params.company_id = getCompanyId
    const res = await api.delete(`/shipping/v1/manifest/driver/delete/`, {
      data: params,
    })
    return res.data
  },
  async postDriver(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`shipping/v1/manifest/assign-driver`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
}

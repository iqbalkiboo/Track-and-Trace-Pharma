import { api } from "@/api/index"
import interceptors from "@/api/interceptors"

api.interceptors.request.use(interceptors.auth)

export const assignPorterModel = {
  async getManifest(params: any) {
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
}

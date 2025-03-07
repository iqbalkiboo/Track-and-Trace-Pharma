import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const fakturKembaliModel = {
  async getDO(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/delivery_order/v1/list", {
      params,
    })
    return res.data
  },
  async getDetailDO(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/delivery_order/v1/detail/${id}`, { params })
    return res.data
  },
  async updateFakturKembali(id: any) {
    const res = await api.put(`/delivery_order/v1/faktur-kembali/${id}`, {}, {
      params: {
        company_id: getCompanyId,
      },
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
}
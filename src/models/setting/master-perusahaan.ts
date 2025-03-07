import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const masterCompanyModel = {
  async getDetailCompany(id: any) {
    const params: any = { company_id: getCompanyId, holding_id: getHoldingId }
    const res = await api.get(`/company/v1/my-data`, {
      params,
    })
    const data = res.data
    return data
  },
  async updateCompany(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/company/v1/update/${id}`, params, {
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    const data = res.data
    return data
  },
}

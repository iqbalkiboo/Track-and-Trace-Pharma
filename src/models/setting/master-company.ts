import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const masterCompanyModel = {
  async getCompany(params: any) {
    params.company_id = getCompanyId
    params.holding_id = getHoldingId
    const res = await api.get(`/company/v1/list`, {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailCompany(id: any) {
    const params = {
      company_id: getCompanyId,
      holding_id: getHoldingId,
    }
    const res = await api.get(`/company/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createCompany(params: any) {
    const res = await api.post(`/company/v1/create`, params, {
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    const data = res.data
    return data
  },
  async updateCompany(id: any, params: any) {
    const res = await api.put(`/company/v1/update/${id}`, params, {
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    const data = res.data
    return data
  },
  async deleteCompany(id: any) {
    const res = await api.delete(`/company/v1/soft-delete/${id}`, {
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    const data = res.data
    return data
  },
}

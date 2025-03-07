import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const principalModel = {
  async getPrincipal(params: any) {
    params.holding_id = getHoldingId
    params.company_id = getCompanyId
    const res = await api.get(`/product/v1/principal/list`, {
      params,
    })
    return res
  },
  async getDetailPrincipal(id: any) {
    const params: any = {
      holding_id: getHoldingId,
      company_id: getCompanyId,
    }
    const res = await api.get(`/product/v1/principal/detail/${id}`, { params })
    return res.data
  },
  async createPrincipal(params: any) {
    const res = await api.post(`/product/v1/principal/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async updatePrincipal(id: any, params: any) {
    params.holding_id = getHoldingId
    const res = await api.put(`/product/v1/principal/update/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async deletePrincipal(id: any) {
    const params: any = {
      company_id: getCompanyId,
      holding_id: getHoldingId,
    }
    const res = await api.delete(`/product/v1/principal/soft-delete/${id}`, {
      params,
    })
    return res
  },
  async importPrincipal(params: FormData) {
    const res = await api.post(`/product/v1/principal/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    const data = res.data
    return data
  },
}

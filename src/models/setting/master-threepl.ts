import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterThreeplModel = {
  async getThreepl(params: any) {
    params.company_id = getCompanyId
    params.holding_id = getHoldingId
    const res = await api.get("/3pl/v1/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailThreepl(id: any) {
    const params: any = { company_id: getCompanyId, holding_id: getHoldingId }
    const res = await api.get(`/3pl/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createThreepl(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post("/3pl/v1/create", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    const data = res.data
    return data
  },
  async updateThreepl(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/3pl/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    const data = res.data
    return data
  },
  async deleteThreepl(id: any) {
    const params: any = { company_id: getCompanyId, holding_id: getHoldingId }
    const res = await api.delete(`/3pl/v1/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async importThreepl(params: any) {
    const res = await api.post(`/3pl/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      }
    })
    return res.data
  },
}

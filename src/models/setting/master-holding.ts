import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getSuperholdingId from "@/helpers/getSuperholdingId"

api.interceptors.request.use(interceptors.auth)

export const masterHoldingModel = {
  async getHolding(params: any) {
    params.superholding_id = getSuperholdingId
    const res = await api.get(`/company/v1/holding/list`, {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailHolding(id: any) {
    const params = {
      superholding_id: getSuperholdingId,
    }
    const res = await api.get(`/company/v1/holding/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createHolding(params: any) {
    const res = await api.post(`/company/v1/holding/create`, params, {
      params: {
        superholding_id: getSuperholdingId,
      },
    })
    const data = res.data
    return data
  },
  async updateHolding(id: any, params: any) {
    const res = await api.put(`/company/v1/holding/update/${id}`, params, {
      params: {
        superholding_id: getSuperholdingId,
      },
    })
    const data = res.data
    return data
  },
  async deleteHolding(id: any) {
    const res = await api.delete(`/company/v1/holding/soft-delete/${id}`, {
      params: {
        superholding_id: getSuperholdingId,
      },
    })
    const data = res.data
    return data
  },
}

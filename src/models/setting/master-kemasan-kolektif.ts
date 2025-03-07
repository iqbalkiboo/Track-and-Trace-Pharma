import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getHoldingId from "@/helpers/getHoldingId"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterPackagingCollectifModel = {
  async getPackagingCollectif(params: any) {
    params.holding_id = getHoldingId
    const res = await api.get(`/selling-packaging/v1/list`, {
      params,
    })
    return res
  },

  async getDetailPackagingCollectif(id: any) {
    const params: any = { holding_id: getHoldingId }
    const res = await api.get(`/selling-packaging/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },

  async createPackagingCollectif(params: any) {
    // params.holding_id = getHoldingId
    const res = await api.post(`/selling-packaging/v1/create`, params, {
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

  async updatePackagingCollectif(id: any, params: any) {
    // params.holding_id = getHoldingId
    const res = await api.put(`/selling-packaging/v1/update/${id}`, params, {
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

  async deletePackagingCollectif(id: any) {
    const params: any = { holding_id: getHoldingId }
    const res = await api.delete(`/selling-packaging/v1/soft-delete/${id}`, {
      params,
    })
    return res
  },
}

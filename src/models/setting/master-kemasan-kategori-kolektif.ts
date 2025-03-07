import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getHoldingId from "@/helpers/getHoldingId"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterPackagingCategoryCollectifModel = {
  async getPackagingCategoryCollectif(params: any) {
    params.holding_id = getHoldingId
    const res = await api.get(`/selling-packaging/v1/category/list`, {
      params
    })
    return res
  },
  async getDetailPackagingCategoryCollectif(id: any) {
    const params: any = { holding_id: getHoldingId }
    const res = await api.get(`/selling-packaging/v1/category/detail/${id}`, {
      params,
    })
    return res.data
  },
  async createPackagingCategoryCollectif(params: any) {
    // params.holding_id = getHoldingId
    const res = await api.post(`/selling-packaging/v1/category/create`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        holding_id: getHoldingId,
      }
    })
    return res
  },
  async updatePackagingCategoryCollectif(id: any, params: any) {
    // params.holding_id = getHoldingId
    const res = await api.put(`/selling-packaging/v1/category/update/${id}`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        holding_id: getHoldingId,
      }
    })
    return res
  },
  async deletePackagingCategoryCollectif(id: any) {
    const params: any = { holding_id: getHoldingId }
    const res = await api.delete(`/selling-packaging/v1/category/soft-delete/${id}`, {
      params,
    })
    return res
  },
}
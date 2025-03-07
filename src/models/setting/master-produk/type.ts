import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const typeModel = {
  async getType(params: any) {
    params.holding_id = getHoldingId
    const res = await api.get(`/product/v1/product-type/list`, {
      params,
    })
    return res
  },
  async getDetailType(id: any) {
    const params: any = {
      holding_id: getHoldingId,
    }
    const res = await api.get(`/product/v1/product-type/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createType(params: any) {
    params.holding_id = getHoldingId
    const res = await api.post(`/product/v1/product-type/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async updateType(id: any, params: any) {
    params.holding_id = getHoldingId
    const res = await api.put(`/product/v1/product-type/update/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async deleteType(id: any) {
    const params: any = {
      holding_id: getHoldingId,
    }
    const res = await api.delete(`/product/v1/product-type/soft-delete/${id}`, {
      params,
    })
    return res
  },
  async importType(params: FormData) {
    const res = await api.post(`/product/v1/product-type/import`, params, {
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

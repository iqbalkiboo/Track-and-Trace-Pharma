import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const uomModel = {
  async getUom(params: any) {
    params.holding_id = getHoldingId
    const res = await api.get(`/product/v1/uom/list`, {
      params,
    })
    return res
  },
  async getDetailUom(id: any) {
    const params: any = {
      holding_id: getHoldingId,
    }
    const res = await api.get(`/product/v1/uom/detail/${id}`, { params })
    return res.data
  },
  async createUom(params: any) {
    params.holding_id = getHoldingId
    const res = await api.post(`/product/v1/uom/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async updateUom(id: any, params: any) {
    params.holding_id = getHoldingId
    const res = await api.put(`/product/v1/uom/update/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async deleteUom(id: any) {
    const params: any = {
      holding_id: getHoldingId,
    }
    const res = await api.delete(`/product/v1/uom/soft-delete/${id}`, {
      params,
    })
    return res
  },
  async importUom(params: FormData) {
    const res = await api.post(`/product/v1/uom/import`, params, {
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

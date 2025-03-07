import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const adjustmentModel = {
  async getAdjustment(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/adjustment/v1/list", {
      params,
    })
    const data = res.data
    return data
  },
  async importAdjustment(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/adjustment/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async getDetailAdjustment(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/adjustment/v1/detail/${id}`, {
      params
    })
    const data = res.data
    return data
  },
  async getListDetailProduct(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/adjustment/v1/list/product", {
      params,
    })
    const data = res.data
    return data
  },
  async getListDetailAdjustment(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/adjustment/v1/list/detail", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailByCodeAdjustment(code: string, adjustment_product_id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/adjustment/v1/detail-by-code/${code}`, {
      params: {  ...params, adjustment_product_id},
    })
    return res.data
  },
  async getDetailProduct(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/adjustment/v1/detail/product/${id}`, {
      params
    })
    const data = res.data
    return data
  },
  async getListMissingProduct(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/reception/v1/serialization/list", {
      params,
    })
    const data = res.data
    return data
  },
  async updateAdjustment(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/adjustment/v1/update`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async finishAdjustment(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/adjustment/v1/finish`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async cancelAdjustment(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/adjustment/v1/cancel`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
}

import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const transferOrderModel = {
  async getTO(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/transfer-order/v1/list", {
      params,
    })
    return res.data
  },
  async importTO(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/transfer-order/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async getDetailTO(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/transfer-order/v1/detail/${id}`,{
      params
    })
    return res.data
  },
  async getListDetailProduct(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/transfer-order/v1/product/list", {
      params,
    })
    return res.data
  },
  async getListDetailTO(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/transfer-order/v1/product-detail/list", {
      params,
    })
    return res.data
  },
  async getDetailByCodeTO(code: string, to_product_id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/transfer-order/v1/scan-by-code/${code}`, {
      params: {  ...params, to_product_id },
    })
    return res.data
  },
  async getDetailProduct(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/transfer-order/v1/product/detail/${id}`, {
      params,
    })
    return res.data
  },
  async updateTO(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/transfer-order/v1/update`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async finishTO(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/transfer-order/v1/finish`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async cancelTO(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/transfer-order/v1/cancel`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async deleteItem(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/transfer-order/v1/delete-item`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
}
import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const returnModel = {
  async getReturn(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/return-recall/v1/list", {
      params,
    })
    return res.data
  },
  async importReturn(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/return-recall/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async getDetailReturn(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/return-recall/v1/detail/${id}`, {
      params,
    })
    return res.data
  },
  async getListDetailReturn(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/return-recall/v1/product/list/${id}`, {
      params,
    })
    return res.data
  },
  async getDetailProduct(id: string, params?: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/return-recall/v1/product/detail/${id}`, {
      params,
    })
    return res.data
  },
  async getListDetailProduct(id: any, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/return-recall/v1/details/list/${id}`, {
      params,
    })
    return res.data
  },
  async getSerializeScan(body: FormData) {
    const res = await api.post(`/return-recall/v1/details/scan-by-code`, body, {
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async scanConfirmation(id: any, params: FormData) {
    const res = await api.put(
      `/return-recall/v1/details/update/${id}`,
      params,
      {
        params: {
          company_id: getCompanyId,
        },
      }
    )
    return res.data
  },
  async receiveReturn(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/return-recall/v1/received`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postFinish(params: any) {
    const res = await api.post(`/return-recall/v1/finish`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async cancelReturn(id: any, params: any) {
    const res = await api.put(`/return-recall/v1/cancel/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async getTrackReturn(id: any) {
    const res = await api.get(`/return-recall/v1/track/${id}`)
    return res.data
  },
  async getDetailCustomer(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`customer/v1/detail/${id}`, {
      params,
    })
    return res.data
  },
  async getDetailPlant(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`warehouse/v1/detail/${id}`, {
      params,
    })
    return res.data
  },
  async deleteDetailItem(id: any, params: any) {
    const res = await api.delete(
      `/return-recall/v1/details/delete-item/${id}`,
      {
        params: {
          company_id: getCompanyId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: params,
      }
    )
    return res.data
  },
}

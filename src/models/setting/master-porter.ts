import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterPorterModel = {
  async getPorter(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/porter/v1/list", {
      params
    })
    const data = res.data
    return data
  },
  async getDetailPorter(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/porter/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createPorter(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post("/porter/v1/create", params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async updatePorter(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/porter/v1/update/${id}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async deletePorter(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/porter/v1/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  }
}
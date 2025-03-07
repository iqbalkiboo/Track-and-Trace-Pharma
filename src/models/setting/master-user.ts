import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getSuperholdingId from "@/helpers/getSuperholdingId"
import getHoldingId from "@/helpers/getHoldingId"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterUserModel = {
  async getUser(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/user/v1/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailUser(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/user/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createUser(formData: FormData, params: any) {
    formData.append('app_url', window.location.origin)
    const res = await api.post("/user/v1/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params,
    })
    const data = res.data
    return data
  },
  async updateUser(id: string, formData: FormData, params: any) {
    formData.append('app_url', window.location.origin)
    const res = await api.put(`/user/v1/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params,
    })
    const data = res.data
    return data
  },
  async deleteUser(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/user/v1/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async resetPasswordUser(id: string, formData: FormData) {
    const params = {
      company_id: getCompanyId,
    }
    const res = await api.post(`/user/v1/reset-password/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params,
    })
    const data = res.data
    return data
  },
  async getCompany(params: any) {
    params.holding_id = getHoldingId
    const res = await api.get("/company/v1/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getHolding(params: any) {
    params.superholding_id = getSuperholdingId
    const res = await api.get("/company/v1/holding/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getSuperHolding(params: any) {
    const res = await api.get("/company/v1/super-holding/list", {
      params,
    })
    const data = res.data
    return data
  },
  async importUser(params: FormData) {
    const res = await api.post(`/user/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
}

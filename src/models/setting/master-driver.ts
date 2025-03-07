import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterDriverModel = {
  async getDriver(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/driver/v1/list", {
      params
    })
    const data = res.data
    return data
  },
  async getDetailDriver(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/driver/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createDriver(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post("/driver/v1/create", params, {
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async updateDriver(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/driver/v1/update/${id}`, params, {
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async deleteDriver(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/driver/v1/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  }
}
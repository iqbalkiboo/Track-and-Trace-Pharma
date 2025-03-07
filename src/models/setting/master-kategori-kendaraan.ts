import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterVehicleCategoryModel = {
  async getVehicleCategory(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/vehicle/v1/category/list`, {
      params
    })
    return res
  },

  async getDetailVehicleCategory(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/vehicle/v1/category/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },

  async createVehicleCategory(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/vehicle/v1/category/create`,params ,{
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },

  async updateVehicleCategory(params: any, id: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/vehicle/v1/category/update/${id}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },

  async deleteVehicleCategory(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.post(`/vehicle/v1/category/soft-delete/${id}`, {
      params,
    })
    return res
  }
}
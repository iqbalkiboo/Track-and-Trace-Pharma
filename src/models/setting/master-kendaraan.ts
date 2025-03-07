import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterVehicleModel = {
  async getVehicle(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/vehicle/v1/list`, {
      params
    })
    return res
  },
  async getDetailVehicle(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/vehicle/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createVehicle(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/vehicle/v1/create`,params ,{
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async updateVehicle(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/vehicle/v1/update/${id}`, params, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async deleteVehicle(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/vehicle/v1/soft-delete/${id}`, {
      params,
    })
    return res
  },
  async importVehicle(params: FormData) {
    const res = await api.post(`/vehicle/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    const data = res.data
    return data
  },
}
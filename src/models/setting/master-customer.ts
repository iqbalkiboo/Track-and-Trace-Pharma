import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterCustomerModel = {
  async getCustomer(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/customer/v1/list`, {
      params,
    })
    return res
  },
  async getDetailCustomer(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`customer/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async getCustomerCategory(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/customer/v1/category/list`, {
      params,
    })
    return res
  },
  async createCustomer(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/customer/v1/create`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async updateCustomer(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/customer/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async importCustomer(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/customer/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async deleteSoftCustomer(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/customer/v1/soft-delete/${id}`, {
      params,
    })
    return res
  },
  async deleteCustomer(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/customer/v1/delete/${id}`, {
      params,
    })
    return res
  },
}
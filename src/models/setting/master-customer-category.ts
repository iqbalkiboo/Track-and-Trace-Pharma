import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterCustomerCategoryModel = {

  async getCustomerCategory(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/customer/v1/category/list`, {
      params
    })
    return res
  },
  async getDetailCustomerCategory(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`customer/v1/category/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createCustomerCategory(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/customer/v1/category/create`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async updateCustomerCategory(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/customer/v1/category/update/${id}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async deleteSoftCustomerCategory(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.post(`/customer/v1/category/soft-delete/${id}`, {
      params,
    })
    return res
  },
  async deleteCustomerCategory(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.post(`/customer/v1/category/delete/${id}`, {
      params,
    })
    return res
  }
}
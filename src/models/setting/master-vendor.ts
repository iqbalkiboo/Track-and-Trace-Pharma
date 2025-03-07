import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterVendorModel = {
  async getVendorList(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/vendor/v1/list`, {
      params,
    })
    return res.data
  },
  async getDetailVendor(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`vendor/v1/detail/${id}`, {
      params,
    })
    return res.data
  },
  async createVendor(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/vendor/v1/create`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    return res
  },
  async updateVendor(id: any, params: any) {
    //params.company_id = getCompanyId
    const res = await api.put(`/vendor/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res
  },
  async importVendor(params: FormData) {
    const res = await api.post(`/vendor/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async deleteSoftVendor(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/vendor/v1/soft-delete/${id}`, {
      params,
    })
    return res
  },
  async deleteVendor(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/vendor/v1/delete/${id}`, {
      params,
    })
    return res
  },

  async getCompany(params: any) {
    params.company_id = getCompanyId
    params.holding_id = getHoldingId
    const res = await api.get("/company/v1/list", {
      params,
    })
    return res.data
  },
}

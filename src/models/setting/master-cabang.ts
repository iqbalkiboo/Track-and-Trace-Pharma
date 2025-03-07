import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterBranchModel = {
  async getBranch(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/branch/v1/list`, {
      params
    })
    return res
  },
  async getDetailBranch(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/branch/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createBranch(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`/branch/v1/create`,params ,{
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async updateBranch(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/branch/v1/update/${id}`, params, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res
  },
  async deleteBranch(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.post(`/branch/v1/soft-delete/${id}`, {
      params,
    })
    return res
  }
}
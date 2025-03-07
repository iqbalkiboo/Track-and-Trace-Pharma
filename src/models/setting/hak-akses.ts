import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const accessRightsModel = {
  async getRole(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/user/v1/role/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailRole(id: any) {
    const params = {
      company_id: getCompanyId,
    }
    const res = await api.get(`/user/v1/role/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createRole(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post("/user/v1/role/create", params, {
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
  async updateRole(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(`/user/v1/role/update/${id}`, params, {
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
  async deleteRole(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/user/v1/role/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async getRoleType(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/user/v1/role-type/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getPermission(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/user/v1/permission/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getPermissionGroup(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/user/v1/permission/list-by-group", {
      params,
    })
    const data = res.data
    return data
  },
  async getPermissionAction(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/user/v1/permission-action/list", {
      params,
    })
    const data = res.data
    return data
  },
}

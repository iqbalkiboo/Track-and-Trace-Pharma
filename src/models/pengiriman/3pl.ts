import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const deliveryModel = {
  async getmanifest(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("shipping/v1/manifest/list", {
      params,
    })
    return res.data
  },
  async getLogManifest(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("shipping/v1/manifest-log/list", {
      params,
    })
    return res.data
  },
  async get3pl(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("shipping/v1/3pl/requests", {
      params,
    })
    return res.data
  },
  async getDetailManifest(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`shipping/v1/manifest/detail/${id}`, { params })
    return res.data
  },
  async postTypeManifest(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`shipping/v1/manifest/set-shipping`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postRequests3pl(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`shipping/v1/3pl/requests/create`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async getDetailRequest3pl(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`shipping/v1/3pl/requests/detail/${id}`, {
      params,
    })
    return res.data
  },
  async postHandOver3pl(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`shipping/v1/3pl/requests/handover`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postVechileType(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(
      `shipping/v1/manifest/set-vehicle-type`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          company_id: getCompanyId,
        },
      }
    )
    return res.data
  },
  async postArrived(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(`shipping/v1/3pl/requests/arrived`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
}

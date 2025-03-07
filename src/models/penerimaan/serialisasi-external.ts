import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const serialisasiExternalModel = {
  async getSerialize(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/serialization-external/v1/import-serialization/list", {
      params,
    })
    return res.data
  },
  async importSerialize(params: FormData) {
    const res = await api.post(`/serialization-external/v1/import-serialization/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async getDetailSerialize(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/serialization-external/v1/import-serialization/detail/${id}`, {
      params
    })
    return res.data
  },
  async importSerializeProduct(params: any) {
    const res = await api.post(`/serialization-external/v1/import-serialization-product/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async getSerializeProduct(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/serialization-external/v1/import-serialization-product/list", {
      params,
    })
    return res.data
  },
  async getDetailSerializeProduct(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/serialization-external/v1/import-serialization-product/detail/${id}`, {
      params
    })
    return res.data
  },
  async scanSerializeExternal(params: any) {
    const res = await api.post(`/serialization-external/v1/import-serialization-product/scan`, params, {
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async getSerializeDetailList(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/serialization-external/v1/import-serialization-detail/list", {
      params,
    })
    return res.data
  },
  async confirmSerializeExternal(params: any) {
    const res = await api.post(`/serialization-external/v1/import-serialization-product/confirm`, params, {
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async approveSerializeExternal(params: any) {
    const res = await api.post(`/serialization-external/v1/import-serialization-product/approve`, params, {
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async cancelSerialie(params: any) {
    const res = await api.post(`/serialization-external/v1/import-serialization/cancel`, params, {
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async updateSerializeCode(id: string, params: any) {
    const res = await api.put(`/serialization-external/v1/import-serialization-detail/update-serialize-code/${id}`, params, {
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
}
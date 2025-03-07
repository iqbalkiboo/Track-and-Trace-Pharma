import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const storageModel = {
  async getStorage(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/storage/v1/list", {
      params,
    })
    const data = res.data
    return data
  },
  async uploadStorage(params: any) {
    const res = await api.post(`/storage/v1/upload`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res
  },
  async deleteStorage(id: any) {
    const res = await api.delete(`/storage/v1/soft-delete/${id}`)
    const data = res.data
    return data
  },
}

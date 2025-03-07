import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const stockModel = {
  async getListProduct(type: string, id: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(
      `/penerimaan/v1/allocation/list-product/${type}/${id}`,
      {
        params,
      }
    )
    const data = res.data
    return data
  },
  async getListSerialize(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/serialization/v1/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getPackingOn(code: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/serialization/v1/packing-on/${code}`, {
      params
    })
    const data = res.data
    return data
  },
}
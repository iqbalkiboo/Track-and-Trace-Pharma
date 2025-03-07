import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const lacakDOModel = {
  async getLacakDOBatch(batch: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/delivery_order/v1/list-batch/${batch}`, {
      params,
    })
    return res.data
  },
  async getLacakDOSerial(serial: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/delivery_order/v1/list-serial/${serial}`, {
      params,
    })
    return res.data
  },
  async getListPlantByBatch(batch: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`penerimaan/v1/list-plant-by-batch/${batch}`, {
      params,
    })
    return res.data
  },
  async getDetailPlantByBatch(batch: string, id: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`penerimaan/v1/list-detail-plant-by-batch/${batch}/${id}`, {
      params,
    })
    return res.data
  },
  async getListPlantBySerial(serial: string, params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`penerimaan/v1/list-plant-by-batch/${serial}`, {
      params,
    })
    return res.data
  },
}

import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const inventoryControlModel = {
  async inventoryControl(params: any) {
    params.holding_id = getHoldingId
    const res = await api.post(`/report/v1/inventory/control`, params, {
      params: {
        holding_id: getHoldingId,
      }
    })
    return res.data
  },
  async getWarehouse(params: any) {
    // params.company_id = getCompanyId
     const res = await api.get("/warehouse/v1/list", {
       params,
       
     })
     return res.data
   },
   async getBuilding(params: any) {
    // params.company_id = getCompanyId
     const res = await api.get("warehouse/v1/building/list", {
       params,
       
     })
     return res.data
   },
}
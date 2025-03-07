import { api } from "~/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const optionModel = {
  async getProvinces(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/province/v1/list", {
      params,
    })
    return res.data
  },
  async getDistricts(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/district/v1/list", {
      params,
    })
    return res.data
  },
  async getSubDistricts(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/sub-district/v1/list", {
      params,
    })
    return res.data
  },
  async getUrbanVillages(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/urban-village/v1/list", {
      params,
    })
    return res.data
  },
  async getSuperholding(params: any) {
    // params.holding_id = getHoldingId
    const res = await api.get("/company/v1/super-holding/list", {
      params,
    })
    return res.data
  },
  async getHolding(params: any) {
    // if (getSuperholdingId) {
    //   params.superholding_id = getSuperholdingId
    // }
    const res = await api.get("/company/v1/holding/list", {
      params,
    })
    return res.data
  },
  async getCompany(params: any) {
    // if (getHoldingId) {
    //   params.holding_id = getHoldingId
    // }
    const res = await api.get("/company/v1/list", {
      params,
    })
    return res.data
  },
  async getPrincipal(params: any) {
    if (getHoldingId) {
      params.holding_id = getHoldingId
    }
    const res = await api.get("/product/v1/principal/list", {
      params,
    })
    return res.data
  },
  async getWarehouse(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/warehouse/v1/list", {
      params,
    })
    return res.data
  },
}

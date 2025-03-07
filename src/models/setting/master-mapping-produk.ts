import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const mappingProdukModel = {
  async getMappingProductList(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(
      "/serialization-external/v1/vendor/product/list",
      {
        params,
      }
    )
    const data = res.data
    return data
  },
  async getMappingProductDetail(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(
      `/serialization-external/v1/vendor/product/detail/${id}`,
      {
        params,
      }
    )
    return res.data
  },
  async saveMappingProduk(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post(
      `/serialization-external/v1/vendor/product/save`,
      params,
      {
        params: {
          company_id: getCompanyId,
          holding_id: getHoldingId,
        },
      }
    )
    return res.data
  },
  async updateMappingProduk(id: string, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(
      `/serialization-external/v1/vendor/product/update/${id}`,
      params,
      {
        params: {
          company_id: getCompanyId,
        },
      }
    )
    return res.data
  },
  async deleteMappingProduk(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(
      `/serialization-external/v1/vendor/product/delete/${id}`,
      {
        params,
      }
    )
    return res.data
  },
  async getProductList(params: any) {
    params.company_id = getCompanyId
    params.holding_id = getHoldingId
    const res = await api.get("/product/v1/list", {
      params,
    })
    return res.data
  },
  async getProductDetail(id: string) {
    const params: any = { company_id: getCompanyId, holding_id: getHoldingId }
    const res = await api.get(`/product/v1/detail/${id}`, {
      params,
    })
    return res.data
  },
  async getVendorList(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/vendor/v1/list", {
      params,
    })
    return res.data
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

import { api } from "~/api/index"
import getCompanyId from "@/helpers/getCompanyId"

export const masterPlantModel = {
  async getPlant(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/pokemon?${params.limit}`)
    return res
  },
  async addPlant(params: any) {
    params.company_id = getCompanyId
    const res = await api.post(`/pokemon?${params}`)
    return res
  },
  async editPlant(params: any) {
    params.company_id = getCompanyId
    const res = await api.put(`/pokemon?${params}`)
    return res
  },
  async deletePlant(params: any) {
    params.company_id = getCompanyId
    const res = await api.post(`/pokemon?${params}`)
    return res
  }
}
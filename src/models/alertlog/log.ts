import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
// import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const logModel = {
  async getLog(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/log/v1/global/list", {
      params,
    })
    return res.data
  },
}

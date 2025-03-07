import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const userLogModel = {
  async getUserLog(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/user/v1/log/list", {
      params,
    })
    return res.data
  },
}

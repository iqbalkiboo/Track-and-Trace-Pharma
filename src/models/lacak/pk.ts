import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const pk = {
  async getLacalPk(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/reception-log/v1/list", {
      params,
    })
    return res.data
  },
}

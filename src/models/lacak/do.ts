import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
// import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const lacakDO = {
  async getLacakDO(params: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/manifest/v1/list`, {
      params,
    })
    return res.data
  },
}

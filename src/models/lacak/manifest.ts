import { api } from "@/api/index"
import interceptors from "@/api/interceptors"

api.interceptors.request.use(interceptors.auth)

export const lacakManifestModel = {
  async getLacakManifest(params: any) {
    // params.company_id = getCompanyId
    const res = await api.get("shipping/v1/manifest-log/list", {
      params,
    })
    return res.data
  },
}

import { api } from "@/api/index"
import interceptors from "@/api/interceptors"

api.interceptors.request.use(interceptors.auth)

export const dakotaModel = {
    async getHistoriyDakota(code: string) {
        const res = await api.get(`/shipping/v1/3pl/requests/dakota/${code}`)
        const data = res.data
        return data
    },
}

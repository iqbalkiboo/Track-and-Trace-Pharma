import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"
import getHoldingId from "@/helpers/getHoldingId"
import { useAuthStore } from "@/models/auth"

api.interceptors.request.use(interceptors.auth)
const authStore = useAuthStore()

export const packingModel = {
  async getPacking(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list", {
      params,
    })
    return res.data
  },
  async getDetailPacking(id: any) {
    let params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/detail/${id}`, {
      params
    })
    return res.data
  },
  async getPackingLevel(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list/serialize", {
      params,
    })
    return res.data
  },
  async getHigestLevel(id: any) {
    let params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/serialize/highest-level/${id}`, {
      params
    })
    return res.data
  },
  async updatePacking(id: any, params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/penerimaan/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async getGeneratePacking(id: any) {
    let params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/generate/${id}`, {
      params
    })
    return res.data
  },
  async voidPack(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/packing/void`, params, {
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },
  async detailKemasan({
    code,
    reception_id,
    level,
  }: {
    code: string
    reception_id: string
    level: string
  }) {
    const authStore = useAuthStore()
    const company_id: string = getCompanyId
    const holding_id: string = getHoldingId
    const res = await api.get(`/penerimaan/v1/detail-by-code/${code}`, {
      params: { reception_id, level, company_id, holding_id },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async detailItem({
    code,
    reception_detail_id,
  }: {
    code: string
    reception_detail_id: string
  }) {
    const company_id: string = getCompanyId
    const holding_id: string = getHoldingId
    const res = await api.get(`/penerimaan/v1/detail-by-code/${code}`, {
      params: { reception_detail_id, company_id, holding_id },
    })
    return res.data
  },
  async detailByCode(code: string, params: any) {
    params.company_id = getCompanyId
    params.holding_id = getHoldingId
    const res = await api.get(`/penerimaan/v1/detail-by-code/${code}`, {
      params,
    })
    return res.data
  },
  async kemasItem({
    reception_detail_id,
    ids,
  }: {
    reception_detail_id: string
    ids: string[]
  }) {
    const formData = new FormData()
    formData.append("reception_detail_id", reception_detail_id)
    ids.forEach((id) => formData.append("ids[]", id))
    // formData.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/packing/create`, formData, {
      params: {
        company_id: getCompanyId,
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async batalKemasItem({
    id_kemasan,
    id_item,
  }: {
    id_kemasan: string
    id_item: string
  }) {
    const formData = new FormData()
    formData.append("reception_detail_id", id_kemasan)
    formData.append("company_id", getCompanyId)
    const res = await api.delete(`/penerimaan/v1/packing/delete/${id_item}`, {
      data: formData,
    })
    return res.data
  },
  async listItemKemas(id_kemasan: string, params?: any) {
    params.company_id = getCompanyId
    const res = await api.get(`/penerimaan/v1/items/${id_kemasan}`, {
      params: params ?? {},
    })
    return res.data
  },
}

import { api, apiPrinter } from "@/api/index"
import interceptors from "@/api/interceptors"
import { defineStore } from "pinia"
import getCompanyId from "@/helpers/getCompanyId"
import getHoldingId from "@/helpers/getHoldingId"

api.interceptors.request.use(interceptors.auth)

export const serializeStore = defineStore("serialize", {
  state: () => ({
    labels: [],
    detail: {},
    config: {},
  }),
})

export const serializeModelBundling = {
  async getSerialize(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list", {
      params,
    })
    return res.data
  },
  async importSerialize(params: FormData) {
    // params.append("company_id", getCompanyId)
    // params.append("holding_id", getHoldingId)
    const res = await api.post(`/penerimaan/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
        // holding_id: getHoldingId,
      },
    })
    return res.data
  },
  async cancelSerialize(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/penerimaan/v1/cancel`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async putPartialCheck(id: string, params: any) {
    const res = await api.put(`/penerimaan/v1/partial-packing/${id}`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async getDetailSerialize(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/penerimaan/v1/detail/${id}`, {
      params,
    })
    return res.data
  },
  async getSerializeLevel(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list/serialize", {
      params,
    })
    return res.data
  },
  async updateSerialize(id: string, params: any) {
    params.append("company_id", getCompanyId)
    const res = await api.put(`/penerimaan/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async getGenerateSerialize(id: string, qty: number, lot: string) {
    const params: any = {
      company_id: getCompanyId,
      qty,
      lot
    }
    const res = await api.get(`/penerimaan/v1/generate/${id}`, {
      params,
    })
    return res.data
  },
  async printSerialize(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/print`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async getDetailSerializeProduct(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/penerimaan/v1/product/${id}`, {
      params,
    })
    return res.data
  },
  async voidSerialize(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/void`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async addSerializeQty(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/add-qty`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async syncWithSap(params: any) {
    // params.append("company_id", getCompanyId)
    // params.append("holding_id", getHoldingId)
    const res = await api.post(`/penerimaan/v1/create-pk-by-sap`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
        holding_id: getHoldingId,
      },
    })
    return res.data
  },
  async getSerializeAll(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/penerimaan/v1/list/serialize", {
      params,
    })
    return res.data
  },
  async getListDriverPrinter(params: any) {
    params.company_id = getCompanyId
    const res = await apiPrinter.get("/printers/list", {
      params,
    })
    return res.data
  },
  async getDriverPrinters(params: any) {
    const res = await apiPrinter.get("/printers", {
      params,
    })
    return res.data
  },

  async postDriverPrinters(params: any) {
    const res = await apiPrinter.post(`/printers/print`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
    })
    return res.data
  },

  async postPrintDriverPrinter(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await apiPrinter.post(`/printers/print`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postPauseDriverPrinter(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await apiPrinter.post(`/printers/pause`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postResetDriverPrinter(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await apiPrinter.post(`/printers/reset`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postResumeDriverPrinter(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/printers/resume`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postStatusDriverPrinter(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await apiPrinter.post(`/printers/status`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async postReportDriverPrinter(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await apiPrinter.post(`/printers/report`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },

  async postPkBundling(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post(`/penerimaan/v1/bundling`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  }
}

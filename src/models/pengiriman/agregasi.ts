import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"
import { useAuthStore } from "@/models/auth"
import fileDownload from "js-file-download"

api.interceptors.request.use(interceptors.auth)

export const agregasiModel = {
  async getDO(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/delivery_order/v1/list", {
      params,
    })
    return res.data
  },
  async getDetailDO(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/delivery_order/v1/detail/${id}`, { params })
    return res.data
  },
  async cencelDO(id: string) {
    const res = await api.put(`/delivery_order/v1/cancel/${id}`, {}, {
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async importDO(params: FormData) {
    const res = await api.post(`/delivery_order/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId
      },
    })
    return res.data
  },
  async exportDO(do_type = '') {
    await api.post("/shipping/v1/manifest/export/do", {}, {
      params: {
        company_id: getCompanyId,
        do_type,
      },
      responseType: 'blob',
    }).then((res) => {
      fileDownload(res.data, 'Data DO.xlsx')
    })
  },
  async getManifest(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/manifest/v1/list", {
      params,
    })
    return res.data
  },
  async deleteManifest(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/manifest/v1/delete/${id}`, { params })
    return res.data
  },
  async updateManifestDate(params: any, id: string) {
    const res = await api.put(`/manifest/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async getPacking(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/manifest-packings/v1/list", {
      params,
    })
    return res.data
  },
  async getDetailPacking(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/manifest-packings/v1/detail/${id}`, { params })
    return res.data
  },
  async getPackingSerialization(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/packing-serializations/v1/list", {
      params,
    })
    return res.data
  },
  async postManifest(params: any) {
    params.company_id = getCompanyId
    const res = await api.post(`/manifest/v1/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async postPacking(params: any) {
    params.company_id = getCompanyId
    const res = await api.post(`/manifest-packings/v1/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async postProduk(params: any) {
    const authStore = useAuthStore()
    params.company_id = getCompanyId
    const res = await api.post(`/packing-serializations/v1/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        company_id: getCompanyId
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async decreaseStock(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.put(`/delivery_order/v1/decrease-stock/${id}`, {}, {
      params: {
        company_id: getCompanyId
      }
    })
    return res.data
  },
  async getDetailProduk(id: any) {
    const params: any = { company_id: getCompanyId }
    const res = await api.get(`/packing-serializations/v1/detail/${id}`, { params })
    return res.data
  },
  async deleteProduk(id: string) {
    const params: any = { company_id: getCompanyId }
    const res = await api.delete(`/packing-serializations/v1/delete/${id}`, { params })
    return res.data
  },
  async updatedeliverytype(params: any, id: string) {
    const res = await api.put(
      `/shipping/v1/manifest/set-shipping${id}`,
      params,
      {
        headers: {
          "content-type": "application/json",
        },
        params: {
          company_id: getCompanyId
        }
      }
    )
    return res.data
  },
  async printLabel(params: any, id: string) {
    const authStore = useAuthStore()
    const res = await api.put(`manifest-packings/v1/update/${id}`, params, {
      headers: {
        "content-type": "application/json",
      },
      params: {
        company_id: getCompanyId
      },
      onUploadProgress: () => {
        authStore.resetTimeout()
      },
    })
    return res.data
  },
  async printManyLabel(params: any, id: string) {
    const authStore = useAuthStore()
    const res = await api.put(
      `manifest-packings/v1/update-many/${id}`,
      params,
      {
        headers: {
          "content-type": "application/json",
        },
        params: {
          company_id: getCompanyId
        },
        onUploadProgress: () => {
          authStore.resetTimeout()
        },
      }
    )
    return res.data
  },
}

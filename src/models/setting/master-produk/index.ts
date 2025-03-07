import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getHoldingId from "@/helpers/getHoldingId"
import fileDownload from 'js-file-download'

api.interceptors.request.use(interceptors.auth)

export const masterProdukModel = {
  async getProduct(params: any) {
    params.holding_id = getHoldingId
    const res = await api.get(`/product/v1/list`, {
      params,
    })
    return res
  },
  async getDetailProduct(id: any) {
    const params: any = {
      holding_id: getHoldingId,
    }
    const res = await api.get(`/product/v1/detail/${id}`, { params })
    const data = res.data
    return data
  },
  async createProduct(params: any) {
    params.holding_id = getHoldingId
    const res = await api.post(`/product/v1/create`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async updateProduct(id: any, params: any) {
    params.holding_id = getHoldingId
    const res = await api.put(`/product/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async updateAdditionalProduct(id: any, params: any) {
    // params.holding_id = getHoldingId
    const res = await api.put(`/product/v1/update-additional/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        holding_id: getHoldingId,
      },
    })
    return res
  },
  async importProduct(params: FormData) {
    return new Promise((resolve, reject) => {
      api.post(`/product/v1/import`, params, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          holding_id: getHoldingId,
        },
      }).then((res) => {
        if (res.headers["content-type"] === "text/csv") {
          fileDownload(res.data, 'result_product.csv')
        }
        resolve(res)
      }).catch((err:any) => {
        if (err.response.headers['content-type'] === "text/csv") {
          fileDownload(err.response.data, 'result_product.csv')
        }
        reject(err)
      })  
    })
  },
  async deleteProduct(id: any) {
    const params: any = {
      holding_id: getHoldingId,
    }
    const res = await api.delete(`/product/v1/soft-delete/${id}`, { params })
    return res
  },
}

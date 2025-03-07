import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)

export const masterWarehouseModel = {
  // Warehouse
  async getWarehouse(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/warehouse/v1/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailWarehouse(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/warehouse/v1/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createWarehouse(params: FormData) {
    // params.append("company_id", getCompanyId)
    const res = await api.post("/warehouse/v1/create", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async updateWarehouse(id: any, params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/warehouse/v1/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async deleteWarehouse(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.delete(`/warehouse/v1/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async importWarehouse(params: any) {
    const res = await api.post(`/warehouse/v1/import`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    return res.data
  },

  // Building
  async getBuilding(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/warehouse/v1/building/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailBuilding(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/warehouse/v1/building/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createBuilding(params: any) {
    // params.company_id = getCompanyId
    const res = await api.post("/warehouse/v1/building/create", params, {
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async importBuilding(params: FormData) {
    const res = await api.post("/warehouse/v1/building/import/bulk-update", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      },
    })
    return res.data
  },
  async createBuildingSingle(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post("/warehouse/v1/building/create-single", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async updateBuilding(id: any, params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/warehouse/v1/building/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async deleteBuilding(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.delete(`/warehouse/v1/building/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async updateBuildingDefault(id: any, params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(
      `/warehouse/v1/building/update-as-default/${id}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          company_id: getCompanyId,
        }
      }
    )
    const data = res.data
    return data
  },

  // Room
  async getRoom(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/warehouse/v1/room/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailRoom(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/warehouse/v1/room/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createRoom(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post("/warehouse/v1/room/create", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async updateRoom(id: any, params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/warehouse/v1/room/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async deleteRoom(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.delete(`/warehouse/v1/room/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async updateRoomDefault(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(
      `/warehouse/v1/room/update-as-default/${id}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          company_id: getCompanyId,
        }
      }
    )
    const data = res.data
    return data
  },

  // Rack / Pallete
  async getRackPallete(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/warehouse/v1/rack-pallete/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailRackPallete(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/warehouse/v1/rack-pallete/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createRackPallete(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post("/warehouse/v1/rack-pallete/create", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async updateRackPallete(id: any, params: any) {
    // params.company_id = getCompanyId
    const res = await api.put(
      `/warehouse/v1/rack-pallete/update/${id}`,
      params,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          company_id: getCompanyId,
        }
      }
    )
    const data = res.data
    return data
  },
  async deleteRackPallete(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.delete(`/warehouse/v1/rack-pallete/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },

  // Bin
  async getBin(params: any) {
    params.company_id = getCompanyId
    const res = await api.get("/warehouse/v1/bin/list", {
      params,
    })
    const data = res.data
    return data
  },
  async getDetailBin(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.get(`/warehouse/v1/bin/detail/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
  async createBin(params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.post("/warehouse/v1/bin/create", params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async updateBin(id: any, params: any) {
    // params.append("company_id", getCompanyId)
    const res = await api.put(`/warehouse/v1/bin/update/${id}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params: {
        company_id: getCompanyId,
      }
    })
    const data = res.data
    return data
  },
  async deleteBin(id: any) {
    const params: any = {}
    params.company_id = getCompanyId
    const res = await api.delete(`/warehouse/v1/bin/soft-delete/${id}`, {
      params,
    })
    const data = res.data
    return data
  },
}
import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import type { AxiosError } from "axios"
import { createDiscreteApi } from "naive-ui"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)
const { message } = createDiscreteApi(["message"])

export type CompanyIdParams = {
  company_id: string
}

export type ReceptionParams = CompanyIdParams & {
  page: number
  limit: number
  sort: "asc" | "desc"
  sort_field: string
}

export type ScanReceptionParams = CompanyIdParams & {
  manifest_code: string
}

export type StartReceptionParams = CompanyIdParams & {
  reception_id: string
}

export type SetReceptionLocationParams = StartReceptionParams & {
  warehouse_building_id: string
}

export type WarehouseBuildingParams = ReceptionParams & {
  search?: string
  warehouse_id?: string
}

export type PackingListParams = StartReceptionParams & {
  page: number
  limit: number
}

export type ProductLocationParams = SetReceptionLocationParams & {
  packing_code: string
  product_code: string
}

export type MarkSerializePacking = {
  codes: string[]
  status: "approved" | "missing" | "broken"
}

export type DoneReceptionParams = CompanyIdParams & {
  reception_id: string
  finished_date: string
  description: string
  images: string[]
  signature: string
  gr_number: string
}

function catchError(error: AxiosError) {
  let msg = error.message
  if (error.response?.data) {
    const res: any = error.response.data
    msg = res.message
  }
  message.error(msg)
}

export const getReception = async function (params: ReceptionParams) {
  params.company_id = getCompanyId
  const { data } = await api
    .get(`/reception/v1/reception/list`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const scanReception = async function (params: ScanReceptionParams) {
  // params.company_id = getCompanyId
  const { data } = await api
    .post(`/reception/v1/reception/scan`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const detailReception = async function (reception_id: string) {
  const params: any = { company_id: getCompanyId }
  const { data } = await api
    .get(`/reception/v1/reception/detail/${reception_id}`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const startReception = async function (params: StartReceptionParams) {
  // params.company_id = getCompanyId
  const { data } = await api
    .post(`/reception/v1/reception/start`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const setReceptionLocation = async function (
  params: SetReceptionLocationParams
) {
  // params.company_id = getCompanyId
  const { data } = await api
    .post(`/reception/v1/reception/set-location`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const getWarehouseBuilding = async function (
  params: WarehouseBuildingParams
) {
  params.company_id = getCompanyId
  const { data } = await api
    .get(`/warehouse/v1/building/list`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const getPackingList = async function (params: PackingListParams) {
  params.company_id = getCompanyId
  const { data } = await api
    .get(`/reception/v1/packing/list`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const getPackingSerializeList = async function (params: any) {
  params.company_id = getCompanyId
  const { data } = await api
    .get(`/reception/v1/serialization/list`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const setProductLocation = async function (
  params: ProductLocationParams
) {
  const { data } = await api
    .post(`/reception/v1/packing/set-location`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const getSerializePacking = async function (code: string) {
  const params: any = { company_id: getCompanyId }
  const { data } = await api
    .get(`/reception/v1/serialization/detail-by-code/${code}`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const getSerialize = async function (params: any) {
  params.company_id = getCompanyId
  const { data } = await api
    .get("/reception/v1/serialization/list", { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const markSerializePacking = async function (
  params: MarkSerializePacking
) {
  // params.company_id = getCompanyId
  const { data } = await api
    .post(
      `reception/v1/serialization/mark`,
      {
        codes: params.codes,
        status: params.status,
      },
      {
        params: {
          company_id: getCompanyId,
        },
      }
    )
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const setDoneReception = async function (params: DoneReceptionParams) {
  // params.company_id = getCompanyId
  const { data } = await api
    .post(`/reception/v1/reception/done`, params, {
      params: {
        company_id: getCompanyId,
      },
    })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

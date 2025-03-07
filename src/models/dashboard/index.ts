import { api } from "@/api/index"
import interceptors from "@/api/interceptors"
import type { AxiosError } from "axios"
import { createDiscreteApi } from "naive-ui"
import getCompanyId from "@/helpers/getCompanyId"

api.interceptors.request.use(interceptors.auth)
const { message } = createDiscreteApi(["message"])

export type ReceptionParams = {
  company_id?: string
  status?: string
  not_status?: string
  grouped_by_status?: boolean
  grouped_by_product?: boolean
  limit?: number
}

function catchError(error: AxiosError) {
  let msg = error.message
  if (error.response?.data) {
    const res: any = error.response.data
    msg = res.message
  }
  message.error(msg)
}

export const countReception = async function (params: ReceptionParams = {}) {
  params.company_id = getCompanyId
  const { data } = await api
    .get(`/penerimaan/v1/count`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const countReceptionDetail = async function (params: ReceptionParams = {}) {
  params.company_id = getCompanyId
  const { data } = await api
    .get(`/penerimaan/v1/count/detail`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

export const countReceptionByMonth = async function () {
  const params = {
    company_id: getCompanyId,
  }
  const { data } = await api
    .get(`/penerimaan/v1/count/group-by-month`, { params })
    .catch((e) => {
      catchError(e)
      throw e
    })
  return data
}

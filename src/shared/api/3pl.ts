export type ResponseWrapper<T> = {
  data: T
  message: string
  statusCode: number
}

type ThreePlData = ResponseWrapper<{ name: string; id: string }[]>

export function useThreePlApi() {
  return useHttp<ThreePlData>("/3pl/v1/list", {
    httpOptions: {
      params: {
        holding_id: getHoldingId,
      },
    },
  })
}

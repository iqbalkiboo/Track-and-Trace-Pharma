export type ResponseWrapper<T> = {
    data: T
    message: string
    statusCode: number
}

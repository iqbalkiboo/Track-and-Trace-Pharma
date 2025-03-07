import { auth } from '@/models/auth'
import { api } from "@/api"

const companyId: string = '00000000000000000'

const authData = ref<any>()
authData.value = auth.getAuth()

function getFunc(kind: string): any {
  if (kind === 'auth') {
    return auth
  }
}

export const requestAPI = async function (clss: string, method: string, params: any): Promise<any> {
  params.append('company_id', companyId)
  // params.company_id = companyId
  const func: any = getFunc(clss)
  console.log(params)
  return await func[method](params)
}

export const checkAPI = async (): Promise<any> => {
  const ms = 5000

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const timer = setTimeout(() => {
      return resolve({ 
        connection: false,
        status: true,
      })
    }, ms)

    if (authData.value.xxtype !== "5up3r4dm1n") {
      const res = await api.get("/user/v1/status")

      clearTimeout(timer)

      if (res.status === 200 && res.data.data.status)
        return resolve({
          connection: true,
          status: true,
        })
      return resolve({
        connection: true,
        status: false,
      })
    } else {
      return resolve({
        connection: true,
        status: true,
      })
    }
    
  })
}
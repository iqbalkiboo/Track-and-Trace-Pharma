import { auth } from '@/models/auth'

export default {
  noAuth(config: any) {
    return config
  },

  auth(config: any) {
    const authData = auth.getAuth()
    const token = authData.token
    config.headers.Authorization = `Bearer ${token}`

    return config
  },
}

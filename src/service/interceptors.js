import AsyncStorage from '@react-native-async-storage/async-storage'
import { dashDriverInstance } from './api'
import Token from './token.service'

export const dashDriverInterceptor = (setIsLoggedIn, user) => {
  dashDriverInstance.interceptors.request.use(
    (config) => {
      if (user?.token && Token.isValid(user.token)) {
        config.headers['Authorization'] = 'Bearer ' + user.token
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  dashDriverInstance.interceptors.response.use(
    (res) => {
      return res
    },
    (err) => {
      if (err?.response?.status == 401) {
        if (!Token.isValid(user.token)) {
          setIsLoggedIn(false)
        }
      }

      return Promise.reject(err)
    }
  )
}

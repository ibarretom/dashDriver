import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useEffect, useState } from 'react'

import auth from '../service/auth/auth.service'
import Token from '../service/token.service'

import { useLoading } from '../hooks/loading'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export const AuthContext = createContext({})

export function Auth({ children }) {
  const { setIsLoading } = useLoading()

  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  async function signUp({ name, email, password }) {
    try {
      await auth.SignUp({ name, email, password })
    } catch (err) {
      throw new Error(err)
    }
  }

  async function signIn({ email, password }) {
    try {
      const user = await auth.SignIn({ email, password })

      await AsyncStorage.setItem('user', JSON.stringify(user))

      setUser(user)
      setIsLoggedIn(true)
    } catch (err) {
      throw new Error(err)
    }
  }

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then((value) => {
        const user = JSON.parse(value)

        if (Token.isValid(user?.token)) {
          setIsLoggedIn(true)
        }

        SplashScreen.hideAsync()
        setIsLoading(false)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <AuthContext.Provider value={{ signUp, signIn, isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  )
}

import { useEffect, useMemo, useState } from 'react'

import { decodeToken } from '../utils/helpers.js'
import { AuthContext } from './auth-context.js'

const TOKEN_KEY = 'ev-station-token'

function readStoredToken() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(TOKEN_KEY) || ''
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken)
  const user = useMemo(() => decodeToken(token), [token])

  useEffect(() => {
    if (token && !user) {
      setToken('')
    }
  }, [token, user])

  useEffect(() => {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_KEY)
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(user),
      login: (nextToken) => setToken(nextToken),
      logout: () => setToken(''),
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

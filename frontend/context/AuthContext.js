import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../api/authApi'
import { getErrorMessage } from '../api/client'
import { STORAGE_KEY } from '../api/config'

const AuthContext = createContext(null)

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = async (credentials) => {
    setAuthBusy(true)
    setAuthError('')
    try {
      const { data } = await loginUser(credentials)
      setUser({
        id: data.id,
        username: data.username,
        displayName: data.displayName,
        createdAt: data.createdAt,
      })
      return data
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed')
      setAuthError(message)
      throw error
    } finally {
      setAuthBusy(false)
    }
  }

  const register = async (payload) => {
    setAuthBusy(true)
    setAuthError('')
    try {
      const { data } = await registerUser(payload)
      setUser({
        id: data.id,
        username: data.username,
        displayName: data.displayName,
        createdAt: data.createdAt,
      })
      return data
    } catch (error) {
      const message = getErrorMessage(error, 'Registration failed')
      setAuthError(message)
      throw error
    } finally {
      setAuthBusy(false)
    }
  }

  const logout = () => {
    setUser(null)
    setAuthError('')
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authError,
      authBusy,
      login,
      register,
      logout,
      clearAuthError: () => setAuthError(''),
    }),
    [user, authError, authBusy]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

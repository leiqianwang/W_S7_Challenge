import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthPanel() {
  const [mode, setMode] = useState('login')
  const { login, register, authBusy, authError, clearAuthError } = useAuth()
  const navigate = useNavigate()

  const switchMode = (next) => {
    clearAuthError()
    setMode(next)
  }

  const handleLogin = async (credentials) => {
    try {
      await login(credentials)
      navigate('/orders')
    } catch {
      // authError is set in AuthContext
    }
  }

  const handleRegister = async (payload) => {
    try {
      await register(payload)
      navigate('/orders')
    } catch {
      // authError is set in AuthContext
    }
  }

  return (
    <section className="auth-panel">
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'tab active' : 'tab'}
          onClick={() => switchMode('login')}
        >
          Log in
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'tab active' : 'tab'}
          onClick={() => switchMode('register')}
        >
          Register
        </button>
      </div>

      {mode === 'login' ? (
        <LoginForm onSubmit={handleLogin} busy={authBusy} error={authError} />
      ) : (
        <RegisterForm onSubmit={handleRegister} busy={authBusy} error={authError} />
      )}
    </section>
  )
}

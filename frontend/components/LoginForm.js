import React, { useState } from 'react'

export default function LoginForm({ onSubmit, busy, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({ username: username.trim(), password })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h3>Log in</h3>
      <p className="auth-hint">Demo account: demo / demo1234</p>
      {error && <div className="failure">{error}</div>}

      <div className="input-group">
        <label htmlFor="loginUsername">Username</label>
        <input
          id="loginUsername"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
      </div>

      <div className="input-group">
        <label htmlFor="loginPassword">Password</label>
        <input
          id="loginPassword"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={4}
        />
      </div>

      <input type="submit" value={busy ? 'Signing in…' : 'Sign in'} disabled={busy} />
    </form>
  )
}

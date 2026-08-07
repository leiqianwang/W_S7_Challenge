import React, { useState } from 'react'

export default function RegisterForm({ onSubmit, busy, error }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({
      username: username.trim(),
      password,
      displayName: displayName.trim(),
    })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h3>Create account</h3>
      {error && <div className="failure">{error}</div>}

      <div className="input-group">
        <label htmlFor="regDisplayName">Display name</label>
        <input
          id="regDisplayName"
          name="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          minLength={2}
          maxLength={40}
        />
      </div>

      <div className="input-group">
        <label htmlFor="regUsername">Username</label>
        <input
          id="regUsername"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          maxLength={40}
        />
      </div>

      <div className="input-group">
        <label htmlFor="regPassword">Password</label>
        <input
          id="regPassword"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={4}
          maxLength={64}
        />
      </div>

      <input type="submit" value={busy ? 'Creating…' : 'Register'} disabled={busy} />
    </form>
  )
}

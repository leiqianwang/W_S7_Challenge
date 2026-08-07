import api from './client'

export function registerUser({ username, password, displayName }) {
  return api.post('/api/auth/register', { username, password, displayName })
}

export function loginUser({ username, password }) {
  return api.post('/api/auth/login', { username, password })
}

export function fetchUser(id) {
  return api.get(`/api/users/${id}`)
}

export function fetchUserDashboard(id) {
  return api.get(`/api/users/${id}/orders`)
}

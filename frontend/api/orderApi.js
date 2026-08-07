import api from './client'

export function createOrder(payload) {
  return api.post('/api/order', payload)
}

export function listOrders({ userId, status } = {}) {
  return api.get('/api/order', { params: { userId, status } })
}

export function getOrder(id) {
  return api.get(`/api/order/${id}`)
}

export function updateOrder(id, payload) {
  return api.put(`/api/order/${id}`, payload)
}

export function cancelOrder(id) {
  return api.delete(`/api/order/${id}`)
}

export function completeOrder(id) {
  return api.post(`/api/order/${id}/complete`)
}

export function fetchActiveOrders(userId) {
  return api.get(`/api/users/${userId}/orders/active`)
}

export function fetchOrderHistory(userId) {
  return api.get(`/api/users/${userId}/orders/history`)
}

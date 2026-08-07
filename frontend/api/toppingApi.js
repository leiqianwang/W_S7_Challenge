import api from './client'

export function fetchToppings() {
  return api.get('/api/toppings')
}

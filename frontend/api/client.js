import axios from 'axios'
import { SPRING_API_URL } from './config'

const api = axios.create({
  baseURL: SPRING_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || error?.message || fallback
}

export default api

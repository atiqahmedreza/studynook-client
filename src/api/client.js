import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

export function errorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || fallback
}

export default api

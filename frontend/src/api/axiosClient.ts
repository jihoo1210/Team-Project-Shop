import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { ApiErrorResponse } from '@/types/api'

const API_BASE_URL = 'http://localhost:8080/api'
export const ACCESS_TOKEN_KEY = 'myshop_access_token'
export const AUTH_EVENTS = {
  UNAUTHORIZED: 'auth:unauthorized',
} as const

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      window.dispatchEvent(new Event(AUTH_EVENTS.UNAUTHORIZED))
    }

    const apiError = new Error(error.response?.data?.message ?? error.message) as Error & {
      status?: number
      data?: ApiErrorResponse
    }
    apiError.status = error.response?.status
    apiError.data = error.response?.data

    return Promise.reject(apiError)
  },
)

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export default axiosClient

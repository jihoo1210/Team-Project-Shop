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
    'Content-Type': 'application/json;charset=UTF-8',
  },
  withCredentials: true, // ( BE / FE Cookie인증 자동 전송)
  paramsSerializer: {
    // 배열 파라미터를 colors=RED&colors=BLUE 형태로 직렬화 (Spring Boot 호환)
    indexes: null,
  },
})

export const getAccessToken = () => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

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
      try {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      } catch {
        // localStorage 접근 실패 무시
      }
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
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  } catch {
    // localStorage 접근 실패 무시
  }
}

export const clearAccessToken = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    // localStorage 접근 실패 무시
  }
}

export default axiosClient

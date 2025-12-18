import axiosClient from './axiosClient'
import type { JoinRequest, LoginRequest, LoginResponse, UpdateUserRequest, UserProfile } from '@/types/api'

/* 사용자 API - 백엔드: /api/auth/* */
// 백엔드 응답 형식: { success: boolean, result: T, message?: string }

interface ApiResponse<T> {
  success: boolean
  result: T
  message?: string
}

// 로그인 - POST /api/auth/login
export const login = (data: LoginRequest) =>
  axiosClient.post<ApiResponse<LoginResponse>>('/auth/login', data).then((res) => res.data.result)

// 회원가입 - POST /api/auth/signup
export const join = (data: JoinRequest) =>
  axiosClient.post<ApiResponse<UserProfile>>('/auth/signup', data).then((res) => res.data.result)

// 현재 로그인 사용자 정보 조회 - GET /api/auth/me
export const fetchUser = () =>
  axiosClient.get<ApiResponse<UserProfile>>('/auth/me').then((res) => res.data.result)

// 사용자 정보 수정 - PUT /api/auth/me
export const updateUser = (data: UpdateUserRequest) =>
  axiosClient.put<ApiResponse<UserProfile>>('/auth/me', data).then((res) => res.data.result)

// 로그아웃 - POST /api/auth/logout
export const logout = () =>
  axiosClient.post<ApiResponse<string>>('/auth/logout').then((res) => res.data.result)

// 비밀번호 변경 - PUT /api/auth/password
export const updatePassword = (currentPassword: string, newPassword: string) =>
  axiosClient.put<ApiResponse<string>>('/auth/password', null, {
    params: { currentPassword, newPassword }
  }).then((res) => res.data.result)

// 이메일 중복 체크 - GET /api/auth/check-email
export const checkEmailDuplicate = (email: string) =>
  axiosClient.get<ApiResponse<boolean>>('/auth/check-email', { params: { email } }).then((res) => res.data.result)

// 회원 탈퇴 (백엔드에 없으면 추후 추가)
export const deleteUser = () =>
  axiosClient.delete<ApiResponse<void>>('/auth/me').then((res) => res.data.result)

// Google OAuth 로그인 URL 반환
export const getGoogleLoginUrl = () => {
  return `${axiosClient.defaults.baseURL}/oauth2/authorization/google`
}

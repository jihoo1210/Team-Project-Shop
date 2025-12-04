import axiosClient from './axiosClient'
import type { JoinRequest, LoginRequest, LoginResponse, UpdateUserRequest, UserProfile } from '@/types/api'

/* 사용자 API - SPEC: /api/user */

// 로그인 - POST /api/user/login
export const login = (data: LoginRequest) =>
  axiosClient.post<LoginResponse>('/api/user/login', data).then((res) => res.data)

// 회원가입 - POST /api/user/join
export const join = (data: JoinRequest) =>
  axiosClient.post<void>('/api/user/join', data).then((res) => res.data)

// 사용자 정보 조회 - GET /api/user
export const fetchUser = () => axiosClient.get<UserProfile>('/api/user').then((res) => res.data)

// 사용자 정보 수정 - PUT /api/user
export const updateUser = (data: UpdateUserRequest) =>
  axiosClient.put<void>('/api/user', data).then((res) => res.data)

// 회원 탈퇴 - DELETE /api/user
export const deleteUser = () => axiosClient.delete<void>('/api/user').then((res) => res.data)

// Google OAuth 로그인 URL 반환
export const getGoogleLoginUrl = () => {
  return `${axiosClient.defaults.baseURL}/api/oauth2/authorization/google`
}

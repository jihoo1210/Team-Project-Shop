import axiosClient from './axiosClient'
import type { JoinRequest, LoginRequest, LoginResponse, UpdateUserRequest, UserProfile } from '@/types/api'

export const login = (data: LoginRequest) =>
  axiosClient.post<LoginResponse>('/user/login', data).then((res) => res.data)

export const join = (data: JoinRequest) =>
  axiosClient.post<void>('/user/join', data).then((res) => res.data)

export const fetchUser = () => axiosClient.get<UserProfile>('/user').then((res) => res.data)

export const updateUser = (data: UpdateUserRequest) =>
  axiosClient.put<void>('/user', data).then((res) => res.data)

export const deleteUser = () => axiosClient.delete<void>('/user').then((res) => res.data)

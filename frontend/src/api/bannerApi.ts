import axiosClient from './axiosClient'

// 백엔드 API 응답 wrapper 타입
interface ApiResponse<T> {
  success: boolean
  result: T
  message?: string | null
}

// 배너 타입 정의
export interface Banner {
  id: number
  imageUrl: string
  title: string
  linkUrl: string
  displayOrder: number
  isActive: boolean
}

export interface BannerRequest {
  imageUrl?: string
  title: string
  linkUrl?: string
  displayOrder?: number
  isActive?: boolean
}

/* 공개 API */

// 활성화된 배너 목록 조회 - GET /api/banner
export const fetchActiveBanners = () =>
  axiosClient.get<ApiResponse<Banner[]>>('/banner').then((res) => res.data.result)

// 배너 상세 조회 - GET /api/banner/{id}
export const fetchBannerById = (id: number) =>
  axiosClient.get<ApiResponse<Banner>>(`/banner/${id}`).then((res) => res.data.result)

/* 관리자 API */

// 전체 배너 목록 조회 (관리자) - GET /api/banner/admin
export const fetchAllBanners = () =>
  axiosClient.get<ApiResponse<Banner[]>>('/banner/admin').then((res) => res.data.result)

// 배너 생성 (관리자) - POST /api/banner (multipart/form-data)
export const createBanner = (data: BannerRequest, image?: File) => {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  if (image) {
    formData.append('image', image)
  }
  return axiosClient
    .post<ApiResponse<Banner>>('/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data.result)
}

// 배너 수정 (관리자) - PUT /api/banner/{id} (multipart/form-data)
export const updateBanner = (id: number, data: BannerRequest, image?: File) => {
  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  if (image) {
    formData.append('image', image)
  }
  return axiosClient
    .put<ApiResponse<Banner>>(`/banner/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data.result)
}

// 배너 삭제 (관리자) - DELETE /api/banner/{id}
export const deleteBanner = (id: number) =>
  axiosClient.delete<ApiResponse<void>>(`/banner/${id}`).then((res) => res.data.result)

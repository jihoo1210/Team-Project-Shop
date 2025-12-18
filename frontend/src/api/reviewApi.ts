import axiosClient from './axiosClient'
import type {
  ReviewWriteRequest,
  ReviewListItem,
} from '@/types/api'

/* 리뷰 API - SPEC: /api/review */

// 상품별 리뷰 조회 - GET /api/review/{itemId}
export const fetchReviewsByItem = (itemId: string) =>
  axiosClient.get<ReviewListItem[]>(`/review/${itemId}`).then((res) => res.data)

// 리뷰 작성 - POST /api/review/{itemId}
export const createReview = (itemId: string, data: Omit<ReviewWriteRequest, 'item_id'>) =>
  axiosClient.post<void>(`/review/${itemId}`, data).then((res) => res.data)

// 리뷰 수정 - PUT /api/review/{reviewId}
export interface ReviewUpdateData {
  writer_id: string
  score: number
  content: string
  role: 'Admin' | 'User'
}
export const updateReview = (reviewId: string, data: ReviewUpdateData) =>
  axiosClient.put<void>(`/review/${reviewId}`, data).then((res) => res.data)

// 리뷰 삭제 - DELETE /api/review/{reviewId}
export const deleteReview = (reviewId: string) =>
  axiosClient.delete<void>(`/review/${reviewId}`).then((res) => res.data)

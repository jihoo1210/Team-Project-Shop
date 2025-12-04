import axiosClient from './axiosClient'
import type {
  ReviewWriteRequest,
  ReviewUpdateRequest,
  ReviewDeleteRequest,
  ReviewListItem,
} from '@/types/api'

/* 리뷰 API */

// 리뷰 작성
export const createReview = (data: ReviewWriteRequest) =>
  axiosClient.post<void>('/review', data).then((res) => res.data)

// 리뷰 수정
export const updateReview = (data: ReviewUpdateRequest) =>
  axiosClient.put<void>('/review', data).then((res) => res.data)

// 리뷰 삭제
export const deleteReview = (data: ReviewDeleteRequest) =>
  axiosClient.delete<void>('/review', { data }).then((res) => res.data)

// 상품별 리뷰 조회 (itemApi의 fetchItemDetail에서 reviewList로 제공)
export const fetchReviewsByItem = (itemId: string) =>
  axiosClient.get<ReviewListItem[]>(`/review/item/${itemId}`).then((res) => res.data)

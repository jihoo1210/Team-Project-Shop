/**
 * 공통 API 응답 및 유틸리티 타입 정의
 * SPEC 기준으로 작성된 공통 타입들
 */

export type SortDirection = 'ASC' | 'DESC'

/**
 * 페이지네이션 요청 기본 파라미터
 */
export interface PageableRequest {
  page?: number
  size?: number
  sort?: string
  direction?: SortDirection
}

/**
 * 페이지네이션 응답 공통 구조
 */
export interface PageableResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

/**
 * API 에러 응답 공통 구조
 */
export interface ApiErrorResponse {
  timestamp?: string
  status: number
  error?: string
  message?: string
  path?: string
  code?: string
  details?: Record<string, unknown>
}

/**
 * API 에러 객체 (확장된 Error 타입)
 */
export interface ApiError extends Error {
  status?: number
  data?: ApiErrorResponse
}

/**
 * API 성공 응답 공통 래퍼 (옵션)
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

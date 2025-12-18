import axiosClient from './axiosClient'
import type { OrderRequest, OrderListItem, OrderDetailResponse, PageableQuery, PaginatedResponse } from '@/types/api'

// 백엔드 API 응답 wrapper 타입
interface ApiResponse<T> {
  success: boolean
  result: T
  message?: string | null
}

/* 주문 API - SPEC: /api/order */

// 상품 구매 (주문 생성) - POST /api/order
export const createOrder = (data: OrderRequest) =>
  axiosClient.post<ApiResponse<{ order_id: string }>>('/order', data).then((res) => res.data.result)

// 구매 목록 조회 - GET /api/order
export const fetchOrders = (params?: PageableQuery) =>
  axiosClient.get<ApiResponse<PaginatedResponse<OrderListItem>>>('/order', { params }).then((res) => res.data.result)

// 구매 세부 조회 - GET /api/order/{orderId}
export const fetchOrderDetail = (orderId: string) =>
  axiosClient.get<ApiResponse<OrderDetailResponse>>(`/order/${orderId}`).then((res) => res.data.result)

import axiosClient from './axiosClient'
import type { OrderRequest, OrderListItem, OrderDetailResponse, PageableQuery, PaginatedResponse } from '@/types/api'

/* 주문 API - SPEC: /api/order */

// 상품 구매 (주문 생성) - POST /api/order
export const createOrder = (data: OrderRequest) =>
  axiosClient.post<{ order_id: string }>('/api/order', data).then((res) => res.data)

// 구매 목록 조회 - GET /api/order
export const fetchOrders = (params?: PageableQuery) =>
  axiosClient.get<PaginatedResponse<OrderListItem>>('/api/order', { params }).then((res) => res.data)

// 구매 세부 조회 - GET /api/order/{orderId}
export const fetchOrderDetail = (orderId: string) =>
  axiosClient.get<OrderDetailResponse>(`/api/order/${orderId}`).then((res) => res.data)

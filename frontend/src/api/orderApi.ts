import axiosClient from './axiosClient'
import type { OrderRequest, OrderListItem, OrderDetailResponse, PageableQuery } from '@/types/api'

/**
 * 주문 API
 * SPEC: /api/order
 */

// 상품 구매 (주문 생성)
export const createOrder = (data: OrderRequest) =>
  axiosClient.post<void>('/order', data).then((res) => res.data)

// 구매 목록 조회
export const fetchOrders = (params: PageableQuery) =>
  axiosClient.get<OrderListItem[]>('/order', { params }).then((res) => res.data)

// 구매 세부 조회
export const fetchOrderDetail = (orderId: string) =>
  axiosClient.get<OrderDetailResponse>(`/order/${orderId}`).then((res) => res.data)

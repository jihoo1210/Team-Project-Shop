import axiosClient from './axiosClient'
import type {
  CreateOrUpdateItemRequest,
  ItemDetail,
  ItemListQuery,
  ItemSummary,
  PageableQuery,
  PaginatedResponse,
} from '@/types/api'

/* 상품 API - SPEC: /api/item */

// 상품 목록 조회 - GET /api/item
export const fetchItems = (params: ItemListQuery) =>
  axiosClient.get<PaginatedResponse<ItemSummary>>('/api/item', { params }).then((res) => res.data)

// 상품 상세 조회 - GET /api/item/{itemId}
export const fetchItemDetail = (itemId: string) =>
  axiosClient.get<ItemDetail>(`/api/item/${itemId}`).then((res) => res.data)

/* 관리자 상품 API - SPEC: /api/admin/item */

// 상품 등록 - POST /api/admin/item
export const createItem = (data: CreateOrUpdateItemRequest) =>
  axiosClient.post<{ item_id: string }>('/api/admin/item', data).then((res) => res.data)

// 상품 수정 - PUT /api/admin/item/{itemId}
export const updateItem = (itemId: string, data: CreateOrUpdateItemRequest) =>
  axiosClient.put<void>(`/api/admin/item/${itemId}`, data).then((res) => res.data)

// 상품 삭제 - DELETE /api/admin/item/{itemId}
export const deleteItem = (itemId: string) =>
  axiosClient.delete<void>(`/api/admin/item/${itemId}`).then((res) => res.data)

/* 찜/장바구니 API - SPEC: /api/item */

// 찜 목록 조회 - GET /api/item/favorite
export const fetchFavoriteItems = (params?: PageableQuery) =>
  axiosClient.get<PaginatedResponse<ItemSummary>>('/api/item/favorite', { params }).then((res) => res.data)

// 찜 추가/삭제 - POST /api/item/favorite/{itemId}
export const toggleFavoriteItem = (itemId: string) =>
  axiosClient.post<void>(`/api/item/favorite/${itemId}`).then((res) => res.data)

// 장바구니 목록 조회 - GET /api/item/cart
export const fetchCartItems = (params?: PageableQuery) =>
  axiosClient.get<PaginatedResponse<ItemSummary>>('/api/item/cart', { params }).then((res) => res.data)

// 장바구니 추가/삭제 - POST /api/item/cart/{itemId}
export const toggleCartItem = (itemId: string) =>
  axiosClient.post<void>(`/api/item/cart/${itemId}`).then((res) => res.data)

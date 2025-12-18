import axiosClient from './axiosClient'
import type {
  CreateOrUpdateItemRequest,
  ItemDetail,
  ItemListQuery,
  ItemSummary,
  PageableQuery,
  PaginatedResponse,
} from '@/types/api'

// 백엔드 API 응답 wrapper 타입
interface ApiResponse<T> {
  success: boolean
  result: T
  message?: string | null
}

/* 상품 API - SPEC: /api/item */

// 상품 목록 조회 - GET /api/item
export const fetchItems = (params: ItemListQuery) =>
  axiosClient.get<ApiResponse<PaginatedResponse<ItemSummary>>>('/item', { params }).then((res) => res.data.result)

// 상품 상세 조회 - GET /api/item/{itemId}
export const fetchItemDetail = (itemId: string) =>
  axiosClient.get<ApiResponse<ItemDetail>>(`/item/${itemId}`).then((res) => res.data.result)

/* 관리자 상품 API - SPEC: /api/admin */

// 상품 등록 - POST /api/admin (multipart/form-data)
export const createItem = (data: CreateOrUpdateItemRequest) =>
  axiosClient.post<ApiResponse<{ item_id: string }>>('/admin', data).then((res) => res.data.result)

// 상품 수정 - PUT /api/admin/{itemId} (multipart/form-data)
export const updateItem = (itemId: string, data: CreateOrUpdateItemRequest) =>
  axiosClient.put<ApiResponse<void>>(`/admin/${itemId}`, data).then((res) => res.data.result)

// 상품 삭제 - DELETE /api/admin/{itemId}
export const deleteItem = (itemId: string) =>
  axiosClient.delete<ApiResponse<void>>(`/admin/${itemId}`).then((res) => res.data.result)

/* 찜/장바구니 API - SPEC: /api/item */

// 찜 목록 조회 - GET /api/item/favorite
export const fetchFavoriteItems = (params?: PageableQuery) =>
  axiosClient.get<ApiResponse<PaginatedResponse<ItemSummary>>>('/item/favorite', { params }).then((res) => res.data.result)

// 찜 추가/삭제 - POST /api/item/favorite/{itemId}
export const toggleFavoriteItem = (itemId: string) =>
  axiosClient.post<ApiResponse<void>>(`/item/favorite/${itemId}`).then((res) => res.data.result)

// 장바구니 목록 조회 - GET /api/item/cart
export const fetchCartItems = (params?: PageableQuery) =>
  axiosClient.get<ApiResponse<PaginatedResponse<ItemSummary>>>('/item/cart', { params }).then((res) => res.data.result)

// 장바구니 추가/삭제 - POST /api/item/cart/{itemId}
export const toggleCartItem = (itemId: string) =>
  axiosClient.post<ApiResponse<void>>(`/item/cart/${itemId}`).then((res) => res.data.result)

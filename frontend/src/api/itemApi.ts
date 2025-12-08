import axiosClient from './axiosClient'
import type {
  CreateOrUpdateItemRequest,
  ItemDetail,
  ItemListQuery,
  ItemSummary,
  PageableQuery,
} from '@/types/api'

export const fetchItems = (params: ItemListQuery) =>
  axiosClient.get<ItemSummary[]>('/item', { params }).then((res) => res.data)

export const fetchItemDetail = (itemId: string) =>
  axiosClient.get<ItemDetail>(`/item/${itemId}`).then((res) => res.data)

export const createItem = (data: CreateOrUpdateItemRequest) =>
  axiosClient.post<void>('/admin/item/', data).then((res) => res.data)

export const updateItem = (itemId: string, data: CreateOrUpdateItemRequest) =>
  axiosClient.put<void>(`/admin/item/${itemId}`, data).then((res) => res.data)

export const deleteItem = (itemId: string) =>
  axiosClient.delete<void>(`/admin/item/${itemId}`).then((res) => res.data)

export const fetchFavoriteItems = (params: PageableQuery) =>
  axiosClient.get<ItemSummary[]>('/item/favorite', { params }).then((res) => res.data)

export const toggleFavoriteItem = (itemId: string) =>
  axiosClient.post<void>(`/item/favorite/${itemId}`).then((res) => res.data)

export const fetchCartItems = (params: PageableQuery) =>
  axiosClient.get<ItemSummary[]>('/item/cart', { params }).then((res) => res.data)

export const toggleCartItem = (itemId: string) =>
  axiosClient.post<void>(`/item/cart/${itemId}`).then((res) => res.data)

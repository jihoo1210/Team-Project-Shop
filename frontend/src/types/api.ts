export type SortDirection = 'ASC' | 'DESC'

export interface PaginatedRequest {
  page?: number
  size?: number
  sort?: string
  direction?: SortDirection
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface ApiErrorResponse {
  timestamp?: string
  status: number
  error?: string
  message?: string
  path?: string
  code?: string
  details?: Record<string, unknown>
}

export interface ApiError extends Error {
  status: number
  data?: ApiErrorResponse
}

/* 회원 */
// 백엔드 API: /api/auth/*
export type LoginRequest = { email: string; password: string }
export type LoginResponse = { userId: number; email: string; username: string; role: string }
export type JoinRequest = {
  email: string
  password: string
  passwordConfirm: string
  username: string
  zipCode?: string
  addr?: string
  addrDetail?: string
  phone?: string
}
export interface UserProfile {
  userId: number
  email: string
  username: string
  zipCode?: string
  addr?: string
  addrDetail?: string
  phone?: string
  role: string
}
export type UpdateUserRequest = Partial<{
  email: string
  username: string
  zipCode: string
  addr: string
  addrDetail: string
  phone: string
  password: string
  passwordConfirm: string
}>

/* 상품 */
export type PageableQuery = {
  size?: number
  page?: number
  direction?: SortDirection
  sort?: string
}

export type ItemListQuery = PageableQuery & {
  searchField?: string
  searchTerm?: string
  keyword?: string
  category?: string
  majorCategory?: string
  middleCategory?: string
  subcategory?: string
  // 다수의 색상 필터링 지원 (예: ?colors=RED&colors=BLUE)
  colors?: string[]
  // 다수의 사이즈 필터링 지원 (예: ?itemSizes=S&itemSizes=M)
  // 'size'는 PageableQuery의 페이지 크기와 충돌하므로 'itemSizes' 사용
  itemSizes?: string[]
  minPrice?: number
  maxPrice?: number
  sort?: string
}

export type ReviewSummary = {
  content: string
  score: number
  created_at: string
  updated_at: string
}

export type ItemSummary = {
  id: number
  title: string
  brand: string
  price: number
  discountPercent: number
  realPrice: number
  mainImageUrl: string
  favorite: boolean
  cart: boolean
  stock: number
}

export type ItemDetail = {
  id: number
  title: string
  description: string
  brand: string
  price: number
  discountPercent: number
  realPrice: number
  sku: string
  stock: number
  mainImageUrl: string
  imageList: string[]
  colorList: string[]
  sizeList: string[]
  isFavorite: boolean
  isCart: boolean
  // Legacy fields (backward compatibility)
  discount_percent?: number
  savedInLikes?: boolean
  reviewList?: ReviewSummary[]
  created_at?: string
  updated_at?: string
}

export type CreateOrUpdateItemRequest = {
  title: string
  price: number
  discount_percent: number
  sku: string
  colorList: string[]
  sizeList: string[]
  imageList: string[]
  brand: string
  description: string
}

/* 주문 */
export type OrderRequest = {
  addr: string
  zipCode: string
  username: string
  orderDetail: string
  call: string
}
export type OrderListItem = { 
  order_id?: string
  main_img_url?: string
  totalPrice?: number
  title?: string
  created_at?: string
  status?: string
}
export type OrderDetailItem = { 
  item_id?: string
  item_name?: string
  main_img_url?: string
  totalPrice?: number
  title?: string
  number?: number
  size?: string
  color?: string
  price?: number
  quantity?: number
}
export type OrderDetailResponse = {
  order_id?: string
  items?: OrderDetailItem[]
  totalPrice?: number
  addr?: string
  address?: string
  zip_code?: string
  call?: string
  phone?: string
  username?: string
  payment?: string
  created_at?: string
  status?: string
}

/* 게시판/댓글 */
export type BoardWriteRequest = {
  writer_id: string
  title: string
  content: string
  board_category: string
  role: 'Admin' | 'User'
}
export type BoardUpdateRequest = {
  board_no: string
  writer_id: string
  title: string
  content: string
  board_category: string
  role: 'Admin' | 'User'
}
export type BoardDeleteRequest = { board_no: string; writer_id: string; role: 'Admin' | 'User' }
export type BoardListItem = { board_no: string; title: string; writer_id: string; view: number }

export type CommentWriteRequest = { board_no: string; writer_id: string; co_content: string }
export type CommentUpdateRequest = { co_no: string; writer_id: string; co_content: string }
export type CommentDeleteRequest = { co_no: string; writer_id: string; role: 'Admin' | 'User' }
export type CommentListItem = { co_no: string; title: string; writer_id: string; view: number }

/* 리뷰 */
export type ReviewWriteRequest = { 
  item_id: string
  writer_id: string
  score: number
  content: string 
}
export type ReviewUpdateRequest = { 
  review_no: string
  writer_id: string
  score: number
  content: string
  role: 'Admin' | 'User'
}
export type ReviewDeleteRequest = { 
  review_no: string
  writer_id: string
  role: 'Admin' | 'User'
}
export type ReviewListItem = {
  review_no: string
  writer_id: string
  score: number
  content: string
  created_at: string
  updated_at: string
}

// Legacy types (backward compatibility)
export type CreateReviewRequest = { itemId: string; content: string; score: number }
export type UpdateReviewRequest = { reviewId: string; content: string; score: number }

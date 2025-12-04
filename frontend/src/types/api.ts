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
export type LoginRequest = { user_id: string; user_pw: string }
export type LoginResponse = { user_no: number; user_name: string; role: string; token: string }
export type JoinRequest = {
  user_pw: string
  user_name: string
  user_email: string
  user_phone: string
  zipcode: string
  address: string
  addr_detail: string
}
export interface UserProfile {
  user_id: string
  email: string
  name?: string
  phone?: string
  address?: string
  role: string
  created_at?: string
}
export type UpdateUserRequest = Partial<{
  name: string
  phone: string
  address: string
  password: string
  currentPassword: string
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
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortDir?: string
}

export type ReviewSummary = {
  content: string
  score: number
  created_at: string
  updated_at: string
}

export type ItemSummary = {
  item_id: string
  item_name?: string
  status: string
  discount_percent?: number
  colorList?: string[]
  likeCount?: number
  like_count?: number
  savedInLikes?: boolean
  price: number
  scoreAverage?: number
  score_average?: number
  savedInCart?: boolean
  main_image_url?: string
  main_image?: string
  thumbnailUrl?: string
  brand?: string
  title?: string
  reviewCount?: number
  review_count?: number
  sku?: string
  sizeList?: string[]
  badges?: string[]
  quantity?: number
  stock?: number
}

export type ItemDetail = {
  title: string
  price: number
  discount_percent: number
  sku: string
  colorList: string[]
  sizeList: string[]
  imageList: string[]
  reviewList: ReviewSummary[]
  created_at: string
  updated_at: string
  description: string
  savedInLikes?: boolean
  brand: string
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
